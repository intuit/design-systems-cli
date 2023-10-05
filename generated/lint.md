# `lint`

Lint the project using eslint + stylelint

## Options

| Flag | Type | Description |
| - | - | - |
| `--fix` | Boolean | Try to fix the errors. |
| `--no-cache` | Boolean | Do not use any cached results from previous runs. |
| `--annotate` | Boolean | Post lint results as annotations to PR. Only in CI. |
| `--files` | String | A list of files to lint. Omit to automatically scan the repo. |
| `--max-warnings` | Number | Number of warnings to trigger nonzero exit code. |

## Examples

```sh
ds lint
```

