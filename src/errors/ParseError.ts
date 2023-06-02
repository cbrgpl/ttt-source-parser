import { ALogableError } from './ALogableError.js'
import { highlight } from 'cli-highlight'

export class ParseError extends ALogableError {
  private content: string
  private language: string
  private filename?: string

  constructor( content: string, language: string, message: string, filename?: string ) {
    super( message )

    this.content = content
    this.language = language
    this.filename = filename
    this.message = message
  }

  get title(): string {
    return `Parse error was captured due to handling ${ this.filename ? this.filename + ' ' : '' }content`
  }

  private get subtitle(): string {
    return 'Target content of process:'
  }

  logSelf( timestampLogger: ( text: string ) => void, logger: ( text?: string ) => void ): void {
    timestampLogger( this.formatting.error( this.formatting.title( this.title ) ) )
    logger( this.formatting.error( this.message ) )
    logger()
    logger( this.formatting.error( this.formatting.subtitle( this.subtitle ) ) )
    const squaredContent = this.getRectContent( this.content )
    logger( this.formatting.bg( highlight( squaredContent, { language: this.language } ) ) )
  }
}
