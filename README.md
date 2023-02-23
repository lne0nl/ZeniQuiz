[![Playwright](https://github.com/lne0nl/ZeniQuiz/actions/workflows/ci.yml/badge.svg)](https://github.com/lne0nl/ZeniQuiz/actions/workflows/ci.yml)

# **ZeniQuiz**
A simple tool to organize and manage any quiz you want.
Create a quiz, display the game screen, share the QRCode, and let's play !

## **Requirements**
- **pnpm**: v7.*
- **node**: v16.*

## **Stacks**
Front is in [**Vue.js 3**](https://vuejs.org/), back is in [**Node.js**](https://nodejs.org/) with [**Express**](https://expressjs.com/). The whole project is managed with [**pnpm**](https://pnpm.io/) and [**TurboRepo**](https://turbo.build/). 

Ent to end tests run with [**Playwright**](https://playwright.dev/)

## **Start project**
Clone the repo:
```shell
git clone git@github.com:lne0nl/ZeniQuiz.git
```
then
```shell
cd ZeniQuiz && pnpm i && pnpm build
```

## **Start developping**
```shell
pnpm dev
```

## **e2e tests with PlayWright**
```shell
pnpm --filter back ci:start
```
```shell
pnpm e2e:test
```


## **A quick look to the project**
The **ZeniQuiz** project is developped with the monorepo approached. It's divided in two major sections:
- apps (with the backend and the frontend code)
- packages (where you will find shared methods, types/interfaces, and tests).

Each sub section works as a workspace managed by pnpm and turbo repo.
Each workspace has its own commands in its package.json

turbo calls shared commands in its package.json so you can call build for example with a single command from the root of the project. 

e.g:
```shell
pnpm build
```
will run the `build` command on workspaces **back, front & functions** workspaces.
But you can also run a specifi command for a specifi workspace. 

e.g:
```shell
pnpm --filter back build
```

**Feel free to contribute or to open issues.**