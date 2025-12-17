# RouteX


![Node](https://img.shields.io/badge/node-%3E=18-green)
![TypeScript](https://img.shields.io/badge/types-checked-blue)
![License](https://img.shields.io/github/license/criszst/RouteX)


A lightweight, Express-inspired framework focused on **clarity, performance, and minimalism**.

---

## Table of Contents

* [Checklist](#checklist)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Features](#features)
* [Usage Example](#usage-example)
* [Getting Started](#getting-started)
* [Running the Server](#running-the-server)

---

## Checklist

* [x] Basic app structure (`send`, `post`, `res`, `req`, `next`)
* [x] Reduced dependencies — core libs rebuilt from scratch
* [x] Strong TypeScript interfaces
* [x] Static file support (`sendFile`)
* [x] Route aliases for cleaner code
* [x] IP middleware for blocking & rate-limit
* [x] Hot Module Reload for dev productivity
* [x] 404 handler for unmatched routes
* [x] Build-time route compilation
* [x] Lightweight runtime route matcher
* [ ] Simple logger middleware
* [ ] Extra tests for better coverage

---

## Architecture

RouteX follows a **build-time route compilation** approach.

Instead of resolving and loading routes on every incoming request, all route files are:

1. Loaded at **build/startup time**
2. Compiled into an internal route table
3. Matched at runtime using a lightweight matcher

At runtime, RouteX **does not load files, parse routes, or perform dynamic imports** — it only decides which precompiled handler should execute.

### Why this matters

• Faster request handling  
• Predictable behavior  
• Clear separation between build phase and runtime  
• Easier debugging and testing  
• Closer to how modern frameworks (Next.js, Fastify internals) work

### Request lifecycle



## Project Structure

```
src/
├── api/ 
│   ├── index.ts              # Framework entry point
│   └── app.ts                # App bootstrap (optional, clean separation)
├── core/                 # Core framework primitives
│   ├── layer/
│       ├── layer.ts
│   ├── router/
│       ├── RouterCompiler.ts
│       ├── RouterMatcher.ts
│       ├── PipelineCompiler.ts
│       ├── CompiledNode.ts
│       └── router.ts
│   ├── types/
│       ├── IApp.ts
│       ├── IDetails.ts
│       ├── IOptionsFile.ts
│       ├── IPrototype.ts
│
├── middleware/           # Built-in middlewares
│   ├── ip.ts
│   ├── prototype.ts
│   ├── RouteManager.ts
│   └── RouteMiddleware.ts
│
├── http/
│   ├── errors/
│       ├── details.ts
│   ├── middleware/
│       ├── init.ts
│       ├── ip.ts
│       ├── prototype.ts
│   ├── server/               # HTTP abstraction layer
│       ├── request/
│           ├── IServerRequest.ts
│           └── request.ts
│       ├── response/
│           ├── IServerResponse.ts
│           └── response.ts
│
├── examples/               # User-defined routes
│    ├── routes/
│       ├── main.ts
│       ├── redirect.ts
│       └── send.ts
│
├── libs/                 # Internal helpers
│   ├── flatten.ts
│   └── merge.ts
│
├── __mocks__/             # Test mocks
│   └── mime.mock.ts
│    └──response.mock.ts
│


```

---

## Features

* `send(data)` → Sends plain text or objects
* `json(data)` → Returns JSON response
* `download(path)` → Forces file download
* `redirect(url)` → Redirects client
* `sendFile(path)` → Serves static files

---

## Usage Example

```ts
response.send("Hello, client!");
response.json({ hello: "world" });
response.download("./file.txt");
response.redirect("https://example.com");
response.sendFile("./index.html");
```

> 🔗 See more in [`src/index.ts`](src/index.ts)

---

## Getting Started

```bash
git clone https://github.com/criszst/RouteX.git
cd RouteX
npm install
npm run build
npm run start
```

Optional:

```bash
npm run test
```

---

## Running the Server

By default, the server runs on **port 3000**:
👉 [http://localhost:3000](http://localhost:3000)

Expected response:

```json
{"hello": "world"}
```
