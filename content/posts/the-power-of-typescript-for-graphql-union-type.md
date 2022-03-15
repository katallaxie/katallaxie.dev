---
title: "The Power of TypeScript for GraphQL Union Type"
description:  "This is a gist to filter for union types in GraphQL"
date: "2021-03-15"
author: "Sebastian Doell"
layout: single-3-col
tags: ["graphql", "coodegen", "typescript"]
---

[GraphQL](https://graphql.org/) is great. Code generating types for [TypeScript](https://www.typescriptlang.org/) is easy. GraphQL supports [introspection](https://graphql.org/learn/introspection/). This means a GraphQL API provides information about the described schema.

Using the [GraphQL CLI](https://github.com/Urigo/graphql-cli) and the [GraphQL Code Generator](https://graphql-code-generator.com/) generating types for a [graphcms](https://graphcms.com/) is really handy.

```yaml
# GraphCMS API
schema: https://api-eu-central-1.graphcms.com/v2/xxxxx/master
overwrite: true
documents: ./src/graphql/**/*.graphql

# Format files

extensions:
  codegen:
    hooks:
      afterAllFileWrite:
        - eslint --fix
    generates:
      ./schema.graphql:
        plugins:
          - schema-ast
      src/generated-types.tsx:
        plugins:
          - typescript
          - typescript-operations
          - typescript-react-apollo
        config:
          withHOC: false
          withComponent: true
          withHooks: true

```

When you add to it the capability to create types for your queries, this is really powerful. A powerful feature of GraphQL are [union type](https://graphql.org/learn/schema/#union-types). A field can contain different types. For example a `Page` or `Post` can can be returned a reference for another page.

```graphql
query Layout($slug: String = "home") {
  page(where: {slug: $slug}, stage: PUBLISHED) {
    id
    title
    slug
    content
    refs {
      __typename
      ...on Page {
        createdAt
        publishedAt
        pageSlug: slug
        teaser
      }
      ... on Post {
        title
        excerpt
        createdAt
        publishedAt
      }
    }
  }
}
```

The generated code of the layout query looks like this.

```typescript
export type LayoutQuery = { __typename?: 'Query' } & {
  page?: Maybe<
    { __typename?: 'Page' } & Pick<
      Page,
      'id' | 'title' | 'slug' | 'content'
    > & {
        refs: Array<
          | ({ __typename: 'Page' } & Pick<
              Page,
              'createdAt' | 'publishedAt' | 'teaser'
            > & { pageSlug: Page['slug'] })
          | ({ __typename: 'Post' } & Pick<
              Post,
              'title' | 'excerpt' | 'createdAt' | 'publishedAt'
            >)
        >
      }
  >
}
```

Filtering for a `Page` or `Post` in the references is not sound, meaning that the TypeScript compiler can tell which type is filtered. A small helper function can provide the necessary information for the compiler so the filtered values are properly typed.

```typescript
const guardFactory = <T, K extends keyof T, V extends string & T[K]>(
  k: K,
  v: V
): ((o: T) => o is Extract<T, Record<K, V>>) => {
  return (o: T): o is Extract<T, Record<K, V>> => {
    return o[k] === v
  }
}
```

A filter on the values then returns a properly typed array of `Post`s or `Page`s.

```typescript
const pages = refs.filter(guardFactory('__typename', 'Page'))
```

This is a really small helper, but it allows to use the full power of TypeScript and GraphQL.
