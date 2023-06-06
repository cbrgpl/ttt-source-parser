export const isValidRegExp = ( str: string ) => {
  if ( !str ) {
    return false
  }

  try {
    new RegExp( str )
    return true
  } catch ( e ) {
    return false
  }
}
