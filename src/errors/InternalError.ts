import { ALogableError } from './ALogableError.js'

export class InternalError extends ALogableError {
  constructor( message: string, stack?: string ) {
    super( message )
    this.stack = stack
  }

  logSelf( timestampLogger: ( text: string ) => void, logger: ( text?: string ) => void ): void {
    timestampLogger( this.formatting.error( this.formatting.title( 'Internal error!' ) ) )
    logger()
    logger( this.formatting.error( this.formatting.subtitle( this.message ) ) )
    logger()
    logger( this.formatting.error( this.formatting.subtitle( 'Call stack:' ) ) )

    if ( this.stack ) {
      const rectedStack = this.getRectContent( this.stack )
      logger( this.formatting.bg( rectedStack ) )
    }
  }
}
