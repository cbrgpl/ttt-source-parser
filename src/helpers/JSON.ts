import { ParseError } from '../errors/ParseError.js'
import { IJSONObject } from '../types/utils.js'

const parse = ( json: string ): IJSONObject => {
  try {
    return JSON.parse( json )
  } catch ( err ) {
    const error = err as Error
    throw new ParseError( json, 'JSON', error.message ?? '' )
  }
}

interface IJSON {
  stringify: JSON['stringify'];
  parse( json: string ): IJSONObject;
}

const customJSON: IJSON = {
  parse,
  stringify: JSON.stringify,
}

export {
  customJSON as JSON,
}
