import fs from 'node:fs/promises'
import { IKeyword } from '@core_types'
import { getArg } from '@helpers/package_args_module'

export class KeywordParser {
  private _pattern: RegExp

  constructor() {
    this._pattern = new RegExp( getArg( 'regExp' ) as string, 'ig' )
  }

  async parseKeywords( filePaths: string[] ) {
    const uniqueKeywordList = [] as IKeyword[]

    // TODO Можно заменить на асинхроный парсинг, а не поочереди
    for ( const filePath of filePaths ) {
      const parsedKeywords = await this._getFileKeywords( filePath )

      parsedKeywords.forEach( keyword => {
        if ( !uniqueKeywordList.find( ( keywordWrapper ) => keywordWrapper.value === keyword ) ) {
          uniqueKeywordList.push( { value: keyword } )
        }
      } )
    }

    return uniqueKeywordList
  }

  async _getFileKeywords( filePath: string ) {
    const fileContent = await fs.readFile( filePath, { encoding: 'utf-8', flag: 'r' } )
    const iterator = fileContent.matchAll( this._pattern )

    return [ ...iterator ].map( iterItem => iterItem[ 0 ] )
  }
}
