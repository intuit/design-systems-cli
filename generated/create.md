# `create`

Scaffold a new `ds` component or system

## Commands

  - **component** - Scaffold a new `ds` component
  - **package** - Scaffold a new helper package for your components.
  - **system** - Scaffold a new `ds` system

## `component`

Scaffold a new `ds` component

### Options

| Flag | Type | Description |
| - | - | - |
| `--list-templates` | Boolean | List available templates |
| `--destination`, `-d` | String | Override the top level destination folder |
| `--name` | String | Name of the component to create. If provided this will skip the initialization prompt |
| `--template`, `-t` | js \| string | Override the template directory with a URL to a git repo. Repo must comply with template structure! |
| `--force`, `-f` | Boolean | Remove destination folder if it exits |

### Examples

```sh
ds create component --name dropdown
```

## `package`

Scaffold a new helper package for your components.

### Options

| Flag | Type | Description |
| - | - | - |
| `--list-templates` | Boolean | List available templates |
| `--destination`, `-d` | String | Override the top level destination folder |
| `--name` | String | Name of the package to create. If provided this will skip the initialization prompt |
| `--template`, `-t` | js \| string | Override the template directory with a URL to a git repo. Repo must comply with template structure! |
| `--force`, `-f` | Boolean | Remove destination folder if it exits |

### Examples

```sh
ds create package --name utils
```

## `system`

Scaffold a new `ds` system

### Options

| Flag | Type | Description |
| - | - | - |
| `--list-templates` | Boolean | List available templates |
| `--name` | String | Name of the system to create. If provided this will skip the initialization prompt |
| `--repo` | String | Repository url or owner/repo |
| `--template`, `-t` | js \| string | Override the template directory with a URL to a git repo. Repo must comply with template structure! |
| `--cwd` | Boolean | Create the system in the current working directory |
| `--force`, `-f` | Boolean | Remove destination folder if it exits |

### Examples

```sh
ds create system --name my-design-system
```

```sh
ds create system --name my-design-system --repo hipstersmoothie/material
```

## Custom Templates

You can create your own custom template for a design system, component, or template.  

1. Fork one of our templates (https://github.com/design-systems-templates)
2. Modify the template without removing the 'components' directory
3. Push your template to a git repo 

Now that you've created a custom template you can use it by passing the 
repo URL to the create command.

```
ds create system --template hipstersmoothie/ds-monorepo 
```


If you want to include a set of templates for your developers to choose from you can add them in your `ds.config.json`

```json
 {
   "create": {
     "package": {
       "templates": [
         {
           "name": "custom-js",
           "url": "https://github.com/me/my-template",
           "description": "A custom package template",
           "sha": "4b9c7b627307380fb31acae059f7c095d0c626b8"
         }
       ]
     }
   }
 }      
```

