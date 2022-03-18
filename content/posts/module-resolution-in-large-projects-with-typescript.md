---
title: "Module Resolution in Large Projects with TypeScript"
date: "2021-03-26"
draft: false
tags: ["typescript"]
---

This post explains how to use custom paths for efficient [Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html) in large [TypeScript](https://www.typescriptlang.org/) projects.

# A Primer of Modules

Looking at the [State of the Octoverse 2020](https://octoverse.github.com/) you see that [TypeScript](https://www.typescriptlang.org/) has surged in popularity. TypeScript adds an [unsound](https://blog.ambrosebs.com/2018/04/09/unsoundness-reply.html) type system and powerful compiler to the JavaScript ecosystem.

![Architectural overview.](https://raw.githubusercontent.com/wiki/Microsoft/TypeScript/images/architecture.png)

Modules are not exclusive to TypeScript. They have been introduced with [ECMAScript 2015](https://262.ecma-international.org/6.0/) and TypeScript shares this concept.

Modules contain code that is executed within their own scope, not in the global scope. That means all variables, functions, classes, etc. that are declared in a module are not visible outside of the module unless they are explicitly exported using one of the export mechanisms. To consume the exported variable, function, class, interface, etc. it has to be imported using one of the import mechanisms.

The common mechanism today is the [ES module: ECMAScript 2015, or ES6 module](https://weblogs.asp.net/dixin/understanding-all-javascript-module-formats-and-tools) using the `import/export` statements.

An example of a module is a [React] (<https://reactjs.org/docs/components-and-props.html>) component that is shared between different pages. Extracting code into modules does not only make it easier to maintain a large code base and test functionality, but also to optimize your code. ES2015 allows to eliminate *unused code* via [tree shaking](https://webpack.js.org/guides/tree-shaking/).

```language
# DefaultLayout.tsx
import React from 'react'

interface DefaultLayoutProps {
  children: React.ReactNode
}

export const DefaultLayout = ({ children }: DefaultLayoutProps): JSX.Element => (
  <div>{children}</div>
)

export default DefaultLayout
```

This component has a named export of `DefaultLayout` and a default export.

# Importing Modules

A typical folder structure for the React component 👆 in a [Next.js](https://nextjs.org/) looks like this.

```text
.
├── src
│   ├── components
│       └── layout
│           └── DefaultLayout.tsx
│   ├── graphql
│   ├── hocs
│   ├── hooks
│   ├── pages
│   ├── state
│   ├── theme
│   ├── types
│   └── utils
```

To import this `DefaultLayout` component in the `DefaultLayout.tsx` the compiler needs to know where the module is located. Usually this is done by specifying a relative path to the component `import DefaultLayout from '../../components/DefaultLayout`.

However, the TypeScript compiler can be instructed to use a different path to [resolve the location](https://www.typescriptlang.org/docs/handbook/module-resolution.html) of the module. This can be done via the `tsconfig.json` file.

```json
{
  "compilerOptions": {
   ...
    "paths": {
      "@components/*": [
        "./src/components/*"
      ],
      "@theme/*": [
        "./src/theme/*"
      ],
      "@utils/*": [
        "./src/utils/*"
      ],
      "@hooks/*": [
        "./src/hooks/*"
      ],
      "@state/*": [
        "./src/state/*"
      ],
      "@pages/*": [
        "./src/pages/*"
      ],
      "@hocs/*": [
        "./src/hocs/*"
      ],
      "@type/*": [
        "./src/types/*"
      ],
    }
  }
}
```

By adding these custom paths for the module resolution, modules the `DefaultLayout` component can be imported with `import DefaultLayout from '@components/layout/DefaultLayout'`.

```typescript
import React from 'react'
import DefaultLayout from '@components/layout/DefaultLayout

const App = (): JSX.Element => <DefaultLayout />
export default App
```

⚡️ A great resource for writing React apps with TypeScript are the [React TypeScript Cheatsheets](https://react-typescript-cheatsheet.netlify.app/)
