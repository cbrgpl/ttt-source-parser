export const argsValidation = {
  type: 'object',
  required: [ 'sourceRoot', 'exts', 'regExp' ],
  properties: {
    sourceRoot: {
      type: 'string',
    },
    ignoreSubdirs: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    exts: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^[a-zA-Z]+$',
      },
    },
    regExp: {},
  },
}
