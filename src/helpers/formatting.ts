import chalk from 'chalk'

type FormattingTypes = 'error' | 'sucess' | 'message' | 'title' | 'subtitle' | 'bg'

export const formatting: Record<FormattingTypes, ( text: string ) => string> = {
  error: ( text: string ): string => chalk.red( text ),
  sucess: ( text: string ): string => chalk.hex( '#03fcd7' )( text ),
  message: ( text: string ): string => chalk.blueBright.italic( text ),

  title: ( text: string ): string => chalk.bold.underline( text ),
  subtitle: ( text: string ): string => chalk.dim( text ),

  bg: ( text: string ): string => chalk.bgBlackBright( text ),
}
