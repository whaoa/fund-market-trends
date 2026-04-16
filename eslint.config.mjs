import antfu from '@antfu/eslint-config';

export default antfu(
  {
    typescript: true,
    jsx: true,
    regexp: true,
    imports: true,
    react: true,
    vue: false,
    test: false,
    toml: false,
    yaml: false,
    jsonc: false,
    markdown: false,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'style/arrow-parens': ['error', 'always'],
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          newlinesInside: 0,
          newlinesBetween: 1,
          internalPattern: ['^~/.+', '^@/.+', '^#/.+'],
          customGroups: [
            {
              groupName: 'react',
              elementNamePattern: ['^react$', '^react-dom$'],
            },
            {
              groupName: 'react-framework',
              elementNamePattern: ['^@tanstack/react-router(/.+)?$'],
            },
          ],
          groups: [
            'value-builtin',
            ['react', 'react-framework'],
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'ts-equals-import',
            'side-effect',
            'type-import',
            'unknown',
          ],
        },
      ],
      'react-refresh/only-export-components': [
        'error',
        { extraHOCs: ['createFileRoute'] },
      ],
    },
  },
);
