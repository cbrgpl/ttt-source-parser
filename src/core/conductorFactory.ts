import { DirParser } from './parsers/DirParser'
import { KeywordParser } from './parsers/KeywordParser'

import { KeywordBuffer } from './KeywordBuffer'
import { Conductor } from './Conductor'

import { type AKeywordManpulator } from '@core_types'
import { CI } from '@helpers/CI'
import { InternalError } from '@errors/InternalError'

// const { TranslateBackendCommunicator } = require( './../networking/TranslateBackendCommunicator.js' )


const collectSourceKeywords = async ( dirParser: DirParser, keywordParser: KeywordParser ) => {
  CI.step( 'Начинаю работу над получением обозначений из исходников;' )
  const files = await dirParser.collectFilePaths()
  const keywords = await keywordParser.parseKeywords( files )
  CI.step( 'Закончил парсить обозначения из исходного кода;' )

  return keywords
}

const requestDbKeywords = async ( manupulator: AKeywordManpulator<any> ) => {
  CI.step( 'Запрашиваю обозначения из манипулятора;' )
  const dbKeywords = await manupulator.get()
  CI.step( 'Обозначения успешно получены из манипулятора;' )
  return dbKeywords
}

export const conductorFactory = async <T extends object>( manupulator: AKeywordManpulator<T> ) => {
  CI.step( 'Фабрика Conductor\'ов начала работу!' )
  const dirParser = new DirParser()
  const keywordParser = new KeywordParser()

  const promises = [
    collectSourceKeywords( dirParser, keywordParser ),
    requestDbKeywords( manupulator ),
  ]

  const [ sourceKeywords, dbKeywords ] = ( await Promise.allSettled( promises ) )
    .map( result => {
      return  result.status === 'fulfilled' ? result.value : null
    } )

  if ( sourceKeywords === null || dbKeywords === null ) {
    throw new InternalError(
      `Что-то пошло не так при получении обозначений;\nsourceKeywords(length)=${ sourceKeywords?.length ?? null }\nbdKeywords(length)=${ dbKeywords?.length ?? null }`,
      new Error().stack,
    )
  }

  const buffer = new KeywordBuffer( dbKeywords, sourceKeywords )

  const conductor = new Conductor( manupulator, buffer )

  CI.step( 'Инициализация закончена!' )
  return conductor
}
