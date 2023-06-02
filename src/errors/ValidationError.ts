import { ALogableError } from './ALogableError.js'
import { highlight } from 'cli-highlight'
import { ErrorObject } from 'ajv'

export class ValidationError extends ALogableError {
  private target: string
  private validations: ErrorObject[]

  constructor( target: string, validation: ErrorObject[] ) {
    super()

    this.target = target
    this.validations = validation
  }

  logSelf( timestampLogger: ( text: string ) => void, logger: ( text?: string ) => void ) {
    timestampLogger( this.formatting.error( this.formatting.title( 'Validations were not passed' ) ) )
    logger( this.formatting.error( this.formatting.subtitle( `Target "${ this.target }"` ) ) )
    logger()
    logger( this.formatting.error( this.formatting.subtitle( 'Errors list:' ) ) )
    logger()

    let validationCounter = 0
    for ( const validation of this.validations ) {
      if ( this.validations.length !== 1 ) {
        logger( `Error ${ validationCounter++ }` )
      }

      const rected = this.getRectContent( JSON.stringify( validation, null, 2 ) )
      logger( this.formatting.bg( highlight( rected, { language: 'json' } ) ) )
      logger()
    }
  }
}
