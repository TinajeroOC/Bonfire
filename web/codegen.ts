import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql/',
  documents: 'src/graphql/operations/**/*.{gql,graphql}',
  generates: {
    'src/graphql/__generated__/types.d.ts': {
      plugins: [
        'typescript',
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
      ],
      config: {
        enumsAsTypes: true,
      },
    },
    'src/graphql/__generated__/operations.ts': {
      plugins: [
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        enumsAsTypes: true,
      },
    },
    'src/graphql/__generated__/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
}

export default config
