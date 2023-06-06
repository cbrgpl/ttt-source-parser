import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'path'
import { Buffer } from 'node:buffer'
import { IJSONObject, JSONArray } from '@types'

export const saveFile = async ( filePath: string, content: IJSONObject | JSONArray ) => {
  const contentBuffer = Buffer.from( JSON.stringify( content, null, 2 ) )
  await mkdir( dirname( filePath ), { recursive: true } )
  return writeFile( filePath, contentBuffer )
}
