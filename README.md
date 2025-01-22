# Web-UI

## Application Setup

```shell
npm install
```

### Compile and Hot-Reload for Development

```shell
npm run dev
```

### Type-Check, Compile and Minify for Production

```shell
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```shell
npm run lint
```

### Local development environment

```shell
docker run --rm -it -v $(pwd):/app/web-ui -p 8079:8079 node:23 /app/web-ui/run-dev.sh
```