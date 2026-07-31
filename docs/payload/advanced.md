# Beyond the basics

Escape hatches past collections/fields/blocks: custom endpoints, background jobs, admin UI overrides.

## Custom endpoints

Add routes beyond auto-generated CRUD. Not authenticated by default — check `req.user`.

```ts
import type { Endpoint } from 'payload'
import { APIError } from 'payload'

const featured: Endpoint = {
  path: '/featured', // mounted at /api/<collection-slug>/featured
  method: 'get', // 'get' | 'post' | 'put' | 'patch' | 'delete'
  handler: async (req) => {
    if (!req.user) throw new APIError('Unauthorized', 401)

    const posts = await req.payload.find({
      collection: 'posts',
      where: { featured: { equals: true } },
    })
    return Response.json(posts) // must return a Web API Response
  },
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  endpoints: [featured],
  fields: [/* ... */],
}
```

`req` (a `PayloadRequest`, superset of standard `Request`): `req.user` (`User | null`), `req.payload` (local API — use for access control + hooks), `req.routeParams` (path params), `req.json()`, `req.headers`.

Placement: root config `endpoints: [...]` (path is literal); collection/global `endpoints: [...]` (path prefixed by `/api/<slug>/`).

Errors: `throw new APIError(message, statusCode)` for consistent JSON errors. Otherwise return `Response.json(data, { status })` directly.

## Jobs queue

Background/deferred work via `payload.jobs`.

```ts
// payload.config.ts
jobs: {
  tasks: [{
    slug: 'sendWelcomeEmail',
    inputSchema: [{ name: 'userEmail', type: 'text', required: true }],
    handler: async ({ input }) => {
      await sendEmail(input.userEmail)
      return { output: {} }
    },
  }],
}

// anywhere with access to req.payload
await req.payload.jobs.queue({
  task: 'sendWelcomeEmail',
  input: { userEmail: 'a@b.com' },
})
```

Jobs run when a worker processes the queue (cron or `payload.jobs.run()`), not inline. `retries` on a task config retries on handler throw.

## Admin UI customization

Swap in custom React components at named slots via `admin.components` (top-level config) or a field's own `admin.components`.

```ts
// payload.config.ts
admin: {
  components: {
    beforeDashboard: ['/components/BeforeDashboard'],
    views: {
      custom: { Component: '/views/Custom', path: '/custom' },
    },
  },
}
```

```tsx
// field-level custom component
'use client'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const CustomField: TextFieldClientComponent = () => {
  const { value, setValue } = useField()
  return <input value={value || ''} onChange={(e) => setValue(e.target.value)} />
}
```

Component paths resolve relative to the config; server components are the default, client components need `'use client'`. Common slots: `beforeDashboard`, `afterDashboard`, `beforeLogin`, `afterLogin`, `views.custom`, per-field `admin.components.Field`.

This project's block/field catalogue: see [blocks.md](../architecture/blocks.md) and [content-model.md](../architecture/content-model.md).

## Not covered here

- Auth strategies, API keys, custom login flows — <https://payloadcms.com/docs/authentication/overview>
- Plugins (SEO, redirects, ecommerce, etc.) — <https://payloadcms.com/docs/plugins/overview>
- Localization — <https://payloadcms.com/docs/configuration/localization>
- Access control patterns — <https://payloadcms.com/docs/access-control/overview>
