# `size`

Determine how the bundle size will be affected by your changes.

## Options

| Flag | Type | Description |
| - | - | - |
| `--analyze` | Boolean | Open 'webpack-bundle-analyzer' for each bundle |
| `--css` | Boolean | Show separate diffs for the JS and CSS |
| `--detailed` | Boolean | Show the cost of each of a package exports |
| `--persist` | Boolean | Move bundles to CWD with stats.json. |
| `--diff` | Boolean | Run a diff of the resulting directories and open it in a browser. Output will be persisted. Only run on single package |
| `--ci` | Boolean | Only output the result as markdown. |
| `--all` | Boolean | Ignore git changes and calculate sizes for all packages |
| `--ignore`, `-i` | String | Package names to ignore |
| `--registry` | String | The registry to install packages from. The plugin will use a local .npmrc file if available for authentication. |
| `--comment` | Boolean | Comment on the Pull request with the results. (Only from CI + must set env var GH_TOKEN. In jenkins OWNER and REPO must also be set. In enterprise you must also set GITHUB_URL) |
| `--failureThreshold` | Number | Failure Threshold for Size |
| `--merge-base` | String | Run the plugin against merge base. (Will be slower due to additional build process) |
| `--build-command` | String | Build command for --merge-base (defaults to "yarn build") |

## Examples

Determine the size changes for changed component or a single component

 ```sh
ds size
```

Show the size differences of both the CSS + JS and open a diff of the changes.

 ```sh
ds size --css --diff
```

Ignore the sizes of packages @foo/bar and @foo/baz

 ```sh
ds size --ignore @foo/bar @foo/baz
```

Show the size changes between current HEAD and prerelease branch

 ```sh
ds size --merge-base prerelease
```

