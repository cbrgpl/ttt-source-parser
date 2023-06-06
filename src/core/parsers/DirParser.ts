import { resolve } from 'path'
import fs from 'node:fs/promises'

import { ALogableError } from '@errors/ALogableError'
import { getArg } from '@helpers/package_args_module'

export class DirParseError extends ALogableError {
  filePath: string

  constructor( filePath: string, ...args: any[] ) {
    super( ...args )
    this.filePath = filePath
  }

  logSelf( timestampLogger: ( text: string ) => void, logger: ( text?: string | undefined ) => void ): void {
    timestampLogger( this.formatting.error( this.formatting.title( 'Collect file paths error' ) ) )
    logger( this.formatting.error( this.formatting.subtitle( `Target path "${ this.filePath }"` ) ) )
  }
}

export class DirParser {
  private _sourceRoot: string
  private _ignoreSubdirs: string[]
  private _fileExtensions: string[]

  constructor() {
    this._sourceRoot = resolve( getArg( 'sourceRoot' ) )
    this._ignoreSubdirs = getArg( 'ignoreSubdirs' )
    this._fileExtensions = getArg( 'exts' )
  }

  async collectFilePaths( dir = this._sourceRoot, files = [] as string[] ) {
    const entities = await fs.readdir( dir, { withFileTypes: true } )

    for ( const entity of entities ) {
      const entityPath = resolve( dir, entity.name )

      if ( entity.isFile() ) {
        if ( this._isFileExtSearched( entityPath ) ) {
          files.push( entityPath )
        }
      } else if ( entity.isDirectory() ) {
        if ( !this._isDirectoryIgnores( entityPath ) ) {
          await this.collectFilePaths( entityPath, files )
        }
      }
    }

    return files
  }

  private _isDirectoryIgnores( dir: string ) {
    const relativeToRootPart = dir.replace( this._sourceRoot, '' )
    return this._ignoreSubdirs.some( ( subdir ) => relativeToRootPart.includes( subdir ) )
  }

  private _isFileExtSearched( file: string ) {
    const fileExt = this._getFileExt( file )
    return this._fileExtensions.includes( fileExt )
  }

  private _getFileExt( fileName: string ) {
    const fileExtRegExp = new RegExp( /(?<=\.)[a-z]+$/i )
    const match = fileName.match( fileExtRegExp )

    return match?.[ 0 ] ?? 'null'
  }

}
