import { IKeyword } from '@core_types'
import { type AKeywordManpulator } from '@core_types'

export class KeywordBuffer {
  private _db: IKeyword[]
  private _source: IKeyword[]

  private _new: IKeyword[]
  private _unused: IKeyword[]

  constructor( db: IKeyword[], source: IKeyword[]  ) {
    this._db = db
    this._source = source
  }

  computeUnusedAndNewKeywords( manipulator: AKeywordManpulator<any> ) {
    const difference = {
      new: [] as IKeyword[],
      unused: [] as IKeyword[],
    }

    const db = this.dbKeywords

    for ( let i = 0; i < this._source.length; ++i ) {
      const sourceKeyword = this._source[ i ]

      const isKeywordExists = ( () => {
        const isKeywordExistsFromManipultor = manipulator.isKeywordExist( sourceKeyword )

        if ( isKeywordExistsFromManipultor === null ) {
          const keywordDbIndex = db.findIndex( keyword => sourceKeyword.value === keyword.value )
          return keywordDbIndex !== -1
        }

        return isKeywordExistsFromManipultor
      } )()

      if ( !isKeywordExists ) {
        difference.new.push( sourceKeyword )
      }
    }

    difference.unused = db.filter( dbOne => !this._source.find( sourceOne => sourceOne.value === dbOne.value ) )

    this._new = difference.new
    this._unused = difference.unused
  }

  get dbKeywords() {
    return [ ...this._db ]
  }

  get sourceKeywords() {
    return [ ...this._source ]
  }

  get newKeywords() {
    return [ ...this._new ]
  }

  get unusedKeywords() {
    return [ ...this._unused ]
  }
}
