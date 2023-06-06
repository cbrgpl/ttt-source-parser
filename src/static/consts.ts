export enum EDebugKeywordFileVariants {
  SOURCE = 1,
  DB = 2,
  NEW = 3,
  UNUSED = 4
}

export const EDebugFilePaths = {
  [ EDebugKeywordFileVariants.SOURCE ]: 'source_keywords.json',
  [ EDebugKeywordFileVariants.DB ]: 'db_keywords.json',
  [ EDebugKeywordFileVariants.NEW ]: 'new_keywords.json',
  [ EDebugKeywordFileVariants.UNUSED ]: 'unused_keywords.json',
}

export const DEFAULT_DEBUG_OUTPUT_PATH = '/debug_dist'
