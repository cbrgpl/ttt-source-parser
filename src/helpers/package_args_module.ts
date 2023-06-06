import { cli } from './cli'

import { validate } from './validate'
import { argsValidation } from '@/schemas/argsValidation'
import { isValidRegExp } from './isValidRegExp.js'
import { InternalError } from '@errors/InternalError.js'

const argsContainer: {
  sourceRoot: string | null;
  ignoreSubdirs: string[] | null;
  exts: string[] | null;
  regExp: string | null;
} = {
  sourceRoot: null,
  ignoreSubdirs: null,
  exts: null,
  regExp: null,
}

type UArgInputModes = 'env' | 'cli'

const setCliArgs = () => {
  const args = cli.getCliArgs()

  argsContainer.sourceRoot = args[ 'source-root' ]
  argsContainer.ignoreSubdirs = args[ 'ignore-subdirs' ]?.split( ',' ) ?? []
  argsContainer.exts = args[ 'exts' ].split( ',' )
  argsContainer.regExp = args[ 'regexp' ] ?? null
}

const setEnvArgs = () => {
  argsContainer.sourceRoot = process.env.SOURCE_ROOT ?? null
  argsContainer.ignoreSubdirs = process.env.IGNORE_SUBDIRS?.split( ',' ) ?? []
  argsContainer.exts = process.env.EXTS?.split( ',' ) ?? null
  argsContainer.regExp = process.env.REG_EXP ?? null
}

const validateArgs = () => {
  validate( 'Entry args validation', argsContainer, argsValidation )

  if ( !isValidRegExp( argsContainer.regExp! ) ) {
    throw new InternalError(
      'Passed regexp arg is not valid regular expression!',
      new Error().stack,
    )
  }
}

let argsSetted = false
export const _setArgsToModule = ( mode: UArgInputModes ) => {
  if ( argsSetted ) {
    return
  }

  switch ( mode ) {
    case 'env':
      setEnvArgs()
      break
    case 'cli':
      setCliArgs()
      break
  }

  validateArgs()
  argsSetted = true
}

export const getArg = <T extends keyof typeof argsContainer, R extends ( typeof argsContainer )[T] =  typeof argsContainer[T]>( arg: T ): NonNullable<R> => {
  return argsContainer[ arg ] as NonNullable<R>
}
