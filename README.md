# Satisfactory Resolver

An attempt to automate recipe optimisation in [Satisfactory](https://www.satisfactorygame.com/).<br>
Made with [ReactJS](https://react.dev/) and [React Flow](https://reactflow.dev/).

## Setup

#### Install packages

```sh
npm --prefix packages/wikisync install
npm --prefix packages/app install
```

#### Sync resources from wiki

```sh
npm run sync
ls ./res     # 'items.json', 'recipes.json', 'icons.json' should be present
```

## Usage

#### Development mode

```sh
npm run --prefix packages/app dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

#### Build an archive

```sh
npm run --prefix packages/app build
```

Builds the app for production to the `dist` folder.
