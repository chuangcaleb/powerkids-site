import next from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'
import unicorn from 'eslint-plugin-unicorn'
import tseslint from 'typescript-eslint'

/**
 * Lint rules fall into two groups:
 *
 *   1. Correctness — Next's recommended set plus typed TypeScript rules.
 *   2. Convention — the AGENTS.md rules that are mechanically checkable.
 *
 * Group 2 exists because conventions that live only in prose get violated by
 * every new contributor, and catching them in review costs a round trip every
 * time. If a rule below feels wrong, change it here deliberately rather than
 * adding inline disables.
 */
export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '_reference/**',
      'next-env.d.ts',
      'src/app/(payload)/admin/importMap.js',
      'src/payload-types.ts',
      'src/migrations/**',
    ],
  },

  ...next,
  ...tseslint.configs.recommended,

  {
    plugins: { unicorn },
    rules: {
      // kebab-case filenames. Route-group and dynamic-segment directories are
      // Next's own syntax, so bracketed and parenthesised names are allowed.
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: [/^\[.*\]/, /^\(.*\)/, /^README\.md$/, /^AGENTS\.md$/, /^DESIGN\.md$/],
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  // Convention: no raw design values in application code.
  // Colours, spacing, and radii come from tokens. See docs/design/tokens.md.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#(?:[0-9a-fA-F]{3,4}){1,2}\\b/]',
          message:
            'No raw hex colours. Use a design token — see docs/design/tokens.md.',
        },
        {
          selector: 'Literal[value=/\\b(?:rgb|hsl)a?\\(/]',
          message:
            'No raw colour functions. Use a design token — see docs/design/tokens.md.',
        },
      ],
    },
  },

  // Convention: environment variables are read in exactly one place, so a
  // missing variable fails loudly at boot instead of silently at request time.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/env.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            'Read environment variables through src/lib/env.ts, not process.env directly.',
        },
      ],
    },
  },

  // Payload collection and block configs are data, not application logic.
  // They legitimately contain long literal strings and generated shapes.
  {
    files: ['src/collections/**', 'src/globals/**', 'src/blocks/**/config.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },

  // Must stay last: turns off everything that fights Prettier.
  prettier,
)
