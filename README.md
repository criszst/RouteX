# RouteX

![Bun](https://img.shields.io/badge/bun-%3E=1.3.3-green)
![TypeScript](https://img.shields.io/badge/types-checked-blue)
![License](https://img.shields.io/github/license/criszst/RouteX)

A lightweight, Express-inspired HTTP framework focused on **clarity, performance, and minimalism** — built from scratch in TypeScript/Bun.

---

## Table of Contents

* [Checklist](#checklist)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Features](#features)
* [Usage](#usage)
* [Getting Started](#getting-started)

---

## Checklist

* [x] Basic app structure (`send`, `post`, `res`, `req`, `next`)
* [x] Reduced dependencies — core libs rebuilt from scratch
* [x] Strong TypeScript interfaces
* [x] Static file support (`sendFile`)
* [x] Route aliases for cleaner code
* [x] IP middleware for blocking & rate-limiting
* [x] Hot Module Reload for dev productivity
* [x] Custom 404 handler
* [x] Build-time route compilation
* [x] Trie-based runtime route matcher
* [x] Query string parsing
* [x] Dynamic route params (`:id`)
* [x] Middleware pipeline with `next()`
* [ ] Logger middleware
* [ ] Expanded test coverage

---

## Architecture

RouteX follows a **build-time route compilation** approach — routes are compiled into a data structure once at startup, and every incoming request is matched against that structure in O(k) time, where `k` is the number of path segments.

### Core concepts

#### 1. Layer — the unit of registration

Every `app.get()`, `app.post()`, or `app.use()` call creates a `Layer` and pushes it onto the router's internal **stack**:

```ts
{
  path:    '/users/:id',
  aliases: ['/users/:id', '/u/:id'],  // alternative paths
  methods: Set { 'GET' },
  handler: Function,
  type:    'route' | 'middleware'
}
```

#### 2. The Stack — ordered list of Layers

`router.stack` is an ordered array of `Layer` objects, accumulated at startup. The stack is never consulted at request time — it exists solely as input to the compiler.

```
router.stack
├── Layer { path: '/',        type: 'middleware', methods: ANY  }  ← init middleware
├── Layer { path: '/users',   type: 'route',      methods: GET  }
├── Layer { path: '/users/:id', type: 'route',    methods: GET  }
└── Layer { path: '/posts',   type: 'route',      methods: POST }
```

#### 3. The Trie Compiler — Stack → CompiledNode tree

`RouterCompiler.compile(stack)` walks every layer and builds a **prefix trie** (also called a radix-style route tree). Each path segment becomes a trie node:

```
Registered routes:
  GET  /users
  GET  /users/:id
  POST /users/:id

Compiled trie:
  root
  │  [ANY] → initMiddleware
  │
  └── "users"
        [GET] → getUsersHandler
        └── :id  (paramName = "id")
              [GET]  → getUserByIdHandler
              [POST] → updateUserHandler
```

Dynamic segments (`:param`) become a `paramChild` node with a `paramName` property. Static segments become entries in the `children` Map.

#### 4. The Matcher — O(k) trie traversal

`RouterMatcher.match(method, url)` traverses the compiled trie segment by segment:

1. Strip the query string from the URL
2. Split the path into segments (`/users/42` → `['users', '42']`)
3. Walk the trie — static match first, then `paramChild` fallback
4. On a match, collect `params` (e.g. `{ id: '42' }`) and `query` (parsed query string)
5. Look up the HTTP method handler on the final node

No file loading, no regex scanning, no linear search — just map lookups down a tree.

#### 5. Middleware pipeline — chained `next()`

Handlers stored on each trie node are executed as a **pipeline**. Each handler receives `(req, res, next)` and calls `next()` to pass control to the next handler in the chain:

```ts
// Conceptually, per matched node:
let index = 0;
const next = () => {
  const handler = handlers[index++];
  if (!handler) return;
  handler(req, res, next);
};
next();
```

`PipelineCompiler.compilePipeline()` provides the async version of this pattern.

#### 6. Hot Reload — dev only

In development mode, `RouteManager` uses **chokidar** to watch the routes directory. On any file change:

1. All `route`-type layers are removed from `router.stack` (middleware layers are preserved)
2. The changed route file is re-required (module cache is cleared first)
3. `router.rebuild()` recompiles the trie from the updated stack

```
[chokidar detects change]
        ↓
router.stack.filter(l => l.type !== 'route')   ← clear old routes
        ↓
delete require.cache[...] + require(file)       ← reload file
        ↓
router.rebuild()                                ← recompile trie
```

Hot reload does **not** run in production.

### Full request lifecycle

```
STARTUP
├── RouteManager.loadRoutes()
│   └── require() each route file → app.get/post/use() → stack.push(Layer)
├── app.listen()
│   └── router.compile()
│       └── RouterCompiler.compile(stack) → builds CompiledNode trie
└── http.createServer(app).listen(port)

─────────────────────────────────────────────

RUNTIME  (per request)
├── app(req, res)
│   └── prototype.handle()
│       ├── Response.send/json/redirect/... attached to res
│       └── router.handle(req, res)
│           ├── RouterMatcher.match(method, url)
│           │   ├── Parse query string
│           │   ├── Split path into segments
│           │   ├── Walk trie (static → param fallback)
│           │   └── Return { handler[], params, query } or null
│           │
│           ├── null → 404 response
│           └── match → req.params = params
│                        req.query  = query
│                        next() pipeline → handler(req, res, next)
```

---

## Project Structure

```
src/
├── api/
│   ├── index.ts              # Entry point — loads routes, starts server
│   └── routex.ts             # createApp() factory — merges prototype onto app
│
├── core/
│   ├── layer/
│   │   └── layer.ts          # Layer class — single route/middleware unit
│   ├── router/
│   │   ├── CompiledNode.ts   # Trie node (children map, paramChild, handlers map)
│   │   ├── RouterCompiler.ts # Compiles Layer stack → CompiledNode trie
│   │   ├── RouterMatcher.ts  # Traverses trie, parses params & query
│   │   ├── PipelineCompiler.ts # Builds async middleware chain
│   │   └── router.ts         # Router class — stack, compile(), rebuild(), handle()
│   └── types/
│       ├── IApp.ts           # App interface
│       ├── IRouteHandler.ts  # Handler function type
│       ├── IOptionsFile.ts   # sendFile options
│       ├── IDetails.ts       # Error detail shape
│       └── IProtoype.ts      # GetOptions type
│
├── http/
│   ├── errors/
│   │   └── details.ts        # Structured error factory
│   ├── middleware/
│   │   ├── init.ts           # Sets res prototype on each request
│   │   ├── ip.ts             # IP blocking / rate-limit middleware
│   │   └── prototype.ts      # App prototype — handle, get, post, use, listen, lazyrouter
│   ├── request/
│   │   ├── IServerRequest.ts # Extends IncomingMessage with params, query, body...
│   │   └── request.ts        # Request helper class
│   └── response/
│       ├── IServerResponse.ts # Extends ServerResponse with send, json, redirect...
│       └── response.ts        # Static methods that attach response helpers to res
│
├── middleware/
│   ├── logger/
│   │   └── LoggerMiddleware.ts
│   ├── RouteManager.ts       # Route file discovery, loading, hot reload
│   └── RouteMiddleware.ts    # RouteXMiddleware type (req, res, next)
│
├── utils/
│   ├── flatten.ts            # Array flattening helper
│   └── merge.ts              # Object property merging (used in createApp)
│
├── examples/
│   └── routes/               # Example route files (one export per file)
│       ├── main.ts
│       ├── params.ts
│       ├── json.ts
│       ├── redirect.ts
│       └── send.ts
│
├── __mocks__/
│   ├── mime.mock.ts
│   └── response.mock.ts
│
└── tests/
    ├── app.test.ts
    ├── prototype.test.ts
    └── response.test.ts
```

---

## Features

| Method | Description |
|---|---|
| `res.send(data)` | Sends plain text or serialized object |
| `res.json(data)` | Sends a JSON response with correct headers |
| `res.download(path)` | Forces a file download |
| `res.redirect(url)` | 302 redirect |
| `res.sendFile(path, options?)` | Serves a static file with optional headers and cache control |
| `req.params` | Dynamic route parameters (`/users/:id` → `{ id: '42' }`) |
| `req.query` | Parsed query string (`?a=1&b=2` → `{ a: '1', b: '2' }`) |
| Route aliases | Register the same handler under multiple paths |

---

## Usage

### Registering routes

```ts
import { app } from './api/routex';

// Simple route
app.get('/users', { aliases: '/u' }, (req, res) => {
  res.json({ users: [] });
});

// Dynamic param
app.get('/users/:id', {}, (req, res) => {
  res.json({ id: req.params.id });
});

// POST route
app.post('/users', {}, (req, res) => {
  res.json({ created: true });
});

// Custom 404
app.setCustom404((req, res) => {
  res.statusCode = 404;
  res.json({ error: 'Not found' });
});
```

### Response methods

```ts
res.send("Hello, world!");
res.json({ hello: "world" });
res.redirect("https://example.com");
res.download("./report.pdf");
res.sendFile("./index.html", { root: process.cwd() });
```

### Route files (convention)

Each file in `src/examples/routes/` exports a default function. RouteManager discovers and loads them automatically:

```ts
// src/examples/routes/users.ts
import { app } from '../../api/routex';

export default function usersRoutes() {
  app.get('/users', {}, (req, res) => {
    res.json({ users: [] });
  });
}
```

---

## Getting Started

```bash
git clone https://github.com/criszst/RouteX.git
cd RouteX
bun install

# Development (hot reload enabled)
bun dev

# Production build + start
bun start

# Tests
bun test
```

The server runs on **[http://localhost:3000](http://localhost:3000)** by default.

```bash
curl http://localhost:3000/
# {"hello":"world"}

curl http://localhost:3000/json
# {"json":"test for json method"}
