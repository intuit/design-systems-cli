# Deploying Your Project

`@design-systems/cli` can and should have it's [storybook](https://storybook.js.org/) and [playroom](https://github.com/seek-oss/playroom) deployed in some capacity.

## 1. Build

First you must build both tools.

```sh
yarn build:storybook && yarn build:playroom
```

Both of these command will output build assets to the `out` directory at the root of the project.

```txt
out/
  playroom/
    index.html <- The start page for your playroom
    ...
  index.html <- The start page for your storybook
  ...
```

## 2. Serve

After you have built your files you can push this folder to any static website serving solution. This could be anything like [netlify](https://www.netlify.com/), [heroku](https://www.heroku.com/), [AWS S3](https://aws.amazon.com/s3/), etc.

The simplest solution though is to just use [GitHub Pages](https://pages.github.com/).

The following script uses [push-dir](https://www.npmjs.com/package/push-dir) to deploy the built storybook + playroom to our project's `gh-pages` branch.

```json
{
  "scripts": {
    "deploy": "push-dir --cleanup --dir=out --branch=gh-pages"
  }
}
```

## 3. Consume

Once you have done all of the above your storybook will be deploy to the root of your URL and the playroom will be deployed under the `/playroom` path.

For example, if we were to deploy a project to `https://github.com/pages/design-systems/test-repo`:

- https://github.com/pages/design-systems/test-repo - serves the storybook
- https://github.com/pages/design-systems/test-repo/playroom - serves the playroom
