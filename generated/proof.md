# `proof`

Run automation against a storybook

## Options

| Flag | Type | Description |
| - | - | - |
| `--config`, `-c` | String | The location of the config file to use. |
| `--concurrency` | Number | Number of tests to run at a time |
| `--retry-count` | Number | Number of times to retry a failing test before giving up. |
| `--test-match`, `-t` | String | The glob to use when searching for tests |
| `--port`, `-p` | Number | The local port that a storybook is running on. A shorthand for --url http://localhost:\<port\> |
| `--url`, `-u` | String | The url that storybook is running at.  |
| `--remote` | Boolean | Run the browser against a remote selenium server |
| `--headless` | Boolean | Run the browser headlessly |
| `--browser-name` | String | The name of the browser to use |
| `--browser-version` | String | The version of the browser to use |
| `--browser-platform` | String | The name of the platform to run the browser on |

## Examples

Run an axe scan on your local storybook

 ```sh
ds proof --local --local-grid --a11y
```

