# RouteX


![Node](https://img.shields.io/badge/node-%3E=18-green)
![TypeScript](https://img.shields.io/badge/types-checked-blue)
![License](https://img.shields.io/github/license/criszst/RouteX)


A lightweight, Express-inspired framework built for fun — clean, minimal, and fast.
It doesn’t aim to replicate every Express feature, only the **core essentials** that make web development intuitive.

---

## Table of Contents

* [Checklist](#checklist)
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
* [ ] Simple logger middleware
* [ ] Extra tests for better coverage

---

## Project Structure

```
RouteX/
├── src/
│   ├── routes/       # Define routes here
│   ├── middlewares/  # IP blocker, HMR, etc.
│   ├── core/         # Router, server, and layer controller
│   ├── interfaces/   # TypeScript types for requests/responses
│   ├── libs/         # Internal utilities (no external deps)
│   ├── errors/       # Centralized error handling (WIP)
│   └── index.ts      # Entry point
├── dist/             # Compiled output
├── package.json
└── tsconfig.json
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