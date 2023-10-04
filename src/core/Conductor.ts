import { type KeywordBuffer } from './KeywordBuffer'
import {
  IKeyword,
  type AKeywordManpulator,
  EOperationStatus,
} from '@core_types'

import {
  EDebugKeywordFileVariants,
  EDebugFilePaths,
  DEFAULT_DEBUG_OUTPUT_PATH,
} from '@/static/consts'

import {
  InternalError,
} from '@/errors/InternalError.js'

import { saveFile } from '@/helpers/saveFile'
import { JSONArray } from '@types'
import { CI } from '../helpers/CI'

export class Conductor<T extends object> {
  private _manipulator: AKeywordManpulator<T>
  private _buffer: KeywordBuffer

  constructor( manipulator: AKeywordManpulator<T>, buffer: KeywordBuffer ) {
    this._buffer = buffer
    this._manipulator = manipulator
  }

  async debugCreateKeywordFile( variant: EDebugKeywordFileVariants ) {
    const filePath = this._getFilePath( variant )
    let keywords: string[]
    switch ( variant ) {
      case EDebugKeywordFileVariants.SOURCE:
        keywords = this._unwrapKeywords( this._buffer.sourceKeywords )
        await saveFile( filePath, keywords as JSONArray )
        break

      case EDebugKeywordFileVariants.DB:
        keywords = this._unwrapKeywords( this._buffer.dbKeywords )
        await saveFile( filePath, keywords as JSONArray )
        break

      case EDebugKeywordFileVariants.NEW:
        keywords = this._unwrapKeywords( this._buffer.newKeywords )
        await saveFile( filePath, keywords as JSONArray )
        break

      case EDebugKeywordFileVariants.UNUSED:
        keywords = this._unwrapKeywords( this._buffer.unusedKeywords )
        await saveFile( filePath, keywords as JSONArray )
        break

    }
  }

  private _unwrapKeywords( keywords: IKeyword[] ): string[] {
    return keywords.map( keyword => keyword.value )
  }

  private _getFilePath( debugFileVariant: EDebugKeywordFileVariants ) {
    return `${ process.cwd() }${ DEFAULT_DEBUG_OUTPUT_PATH }/${ EDebugFilePaths[ debugFileVariant ] }`
  }

  async createKeywords() {
    const newKeywords = this._buffer.newKeywords
    const requests = []
    let methodMustBeSilent = false

    for ( const keyword of newKeywords ) {
      requests.push( ( async () => {
        try {
          const result = await this._manipulator.create( keyword )

          if ( result === EOperationStatus.BE_SILENT ) {
            methodMustBeSilent = true
            return
          }

          CI.finish( `Создание ${ keyword.value }: успешно!;` )
        } catch ( err ) {
          CI.error( new InternalError(
            `Создание ${ keyword.value }: произошла ошибка при создании!\n${ ( err as Error )?.message ?? err }`,
          ) )
        }
      } )() )
    }


    const results = await Promise.allSettled( requests )

    if ( !methodMustBeSilent ) {
      const fulfilledResultLen = results.filter( result => result.status === 'fulfilled' ).length
      CI.finish( 'Процесс создания новых ключевых слов закончен.' )
      CI.step( `Статистика успешно/неуспешно вызовов метода создания манипулятора - ${ fulfilledResultLen }/${ results.length - fulfilledResultLen }` )
    }
  }

  async deleteUnusedKeywords() {
    const unusedKeywords = this._buffer.unusedKeywords
    const requests = []
    let methodMustBeSilent = false

    for ( const keyword of unusedKeywords ) {
      requests.push(
        ( async () => {
          try {
            const result = await this._manipulator.delete( keyword )

            if ( result === EOperationStatus.BE_SILENT ) {
              methodMustBeSilent = true
              return
            }

            CI.finish(
              `Удалие ${ keyword.value }: успешно!`,
            )
          } catch ( err ) {
            CI.error(
              new InternalError(
                `Удалие ${ keyword.value }: произошла ошибка!\n${ ( err as Error )?.message ?? err }`,
              ),
            )
          }
        } )(),
      )
    }

    await Promise.all( requests )

    const results = await Promise.allSettled( requests )

    if ( !methodMustBeSilent ) {
      const fulfilledResultLen = results.filter( result => result.status === 'fulfilled' ).length
      CI.finish( 'Процесс удаления новых ключевых слов закончен.' )
      CI.step( `Статистика успешно/неуспешно вызовов метода удаления манипулятора - ${ fulfilledResultLen }/${ results.length - fulfilledResultLen }` )
    }
  }

}
