# WebUI

The WebUI is the web frontend for the [DeMAF](https://github.com/UST-DeMAF) project.
It was developed to provide an intuitive and user-friendly interface.
It allows you to transform deployment models into an [EDMM Models](https://github.com/UST-EDMM) without using the [DeMAF-Shell](https://github.com/UST-DeMAF/demaf-shell) and visualize these models on the website in the topology editor of Eclipse Winery.
You can find the user guide for the WebUI [here](https://ust-demaf.github.io/web-ui/).

The web frontend only works (without customization) in the context of the entire DeMAF application using the [deployment-config](https://github.com/UST-DeMAF/deployment-config).
The documentation for locally setting up the entire DeMAF application can be found [here](https://github.com/UST-DeMAF/EnPro-Documentation).

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