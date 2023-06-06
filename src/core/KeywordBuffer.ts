import { IKeyword } from '@core_types'

export class KeywordBuffer {
  private _db: IKeyword[]
  private _source: IKeyword[]

  private _new: IKeyword[]
  private _unused: IKeyword[]

  constructor( db: IKeyword[], source: IKeyword[] ) {
    this._db = db
    this._source = source

    this._computeUnusedAndNewKeywords()
  }

  private _computeUnusedAndNewKeywords() {
    const difference = {
      new: [] as IKeyword[],
      unused: [] as IKeyword[],
    }

    const db = this.dbKeywords

    for ( let i = 0; i < this._source.length; ++i ) {
      const sourceKeyword = this._source[ i ]

      if ( !db.find( keyword => keyword.value === sourceKeyword.value ) ) {
        difference.new.push( sourceKeyword )
      }

      const keywordDbIndex = db.findIndex( keyword => sourceKeyword.value === keyword.value )
      const isKeywordUsed = keywordDbIndex !== -1

      if ( isKeywordUsed ) {
        db.splice( keywordDbIndex, 1 )
      }
    }

    difference.unused = db

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
