import { ValidationError } from '../errors/ValidationError'

import Ajv2020, { ErrorObject } from 'ajv/dist/2020.js'
const Ajv = Ajv2020 as unknown as typeof Ajv2020

const ajv = new Ajv()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = ( title: string, data: any, schema: any ): void => {
  const validateFn = ajv.compile( schema )
  const valid = validateFn( data )

  if ( !valid ) {
    throw new ValidationError( title, validateFn.errors as ErrorObject[] )
  }
}
