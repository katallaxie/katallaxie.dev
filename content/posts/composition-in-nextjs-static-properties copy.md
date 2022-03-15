---
title: "Composition in Next.js Static Properties"
date: "2021-03-24"
draft: false
tags: ["nextjs"]
---

Composition is a method to write re-usable segments of code. This is achieved by constructing objects of full behavior by using objects with particular behavior.

> It seems like “composition over inheritance” is the new motto. Everyone’s talking about it, and that’s not strange since composition gives you more flexibility by composing functionality to create a new object, while inheritance forces you to extend entities in an inheritance tree.

In the case of `getStaticProps` the full behavior is the complete object of `props` a page needs to be rendered. The particular object is the behavior that fetches a particular property in in the `props`.

```typescript
export async function getStaticProps(context) =>
({ ...(await getHeader(context), ...(await getData(context))})
```

To make this method easier to use, one can write simple helper function.

```typescript
export type TContext = GetStaticPropsContext
export type TComposeFunction<TProps> = (
  ctx: TContext
) => Promise<TStaticPropsResult<TProps>>
export type TStaticPropsResult<TProps> = GetStaticPropsResult<TProps>

export const compose = <TProps>(...funcs: TComposeFunction<TProps>[]) => {
  return async (ctx: TContext): Promise<TStaticPropsResult<TProps>> =>
    funcs.reduce<Promise<TStaticPropsResult<TProps>>>(
      async (result, fn) => ({ ...result, ...(await fn(ctx)) }),
      Promise.resolve(<TStaticPropsResult<TProps>>{ props: {} })
    )
}

export default compose
```

Which can use use like this.

```typescript
export const getStaticProps = compose(getCommonStaticProps, getSpecificStaticProps)
```

Using [Promise.all](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) one can also leverage concurrency in the static props.
