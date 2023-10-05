# `test`

Runs all tests found in `src/**/__tests__/**.test.js` through jest

## Options

| Flag | Type | Description |
| - | - | - |
| `--update`, `-u` | Boolean | Update snapshots |
| `--watch`, `-w` | Boolean | Watch for changes |
| `--annotate` | Boolean | Post test results as annotations to PR. Only in CI. |
| `--files` | String | Array of files or directories to find test |
| `--runInBand` | Boolean | Run all tests serially in the current process. |

## Examples

Run all the tests in watch mode

 ```sh
ds test -w
```

Run tests on specific files

 ```sh
ds test __tests__/basic __tests__/complex
```

