Perfeito — a descrição **“Middleware to automatically reload the page when changes are made”** está **correta**, mas pode ser levemente aprimorada para soar mais técnica e natural em inglês. Por exemplo:

> **Hot Module Reload** → Middleware that automatically refreshes the client when changes are detected in the source code.

Agora segue o **README atualizado e aprimorado**, com uma linguagem mais fluida, profissional e humana — mas mantendo o tom leve e entusiástico do projeto 👇

---

# RouteX

A lightweight, Express-inspired framework I built just for fun — designed to stay clean, minimal, and fast.
While it doesn’t aim to replicate every Express feature, it includes the **core essentials** that make web development intuitive and enjoyable.

<br/>

## Checklist

* [x] **Basic app structure** → Includes core methods like `send`, `post`, `res`, `req`, and `next`.
* [x] **Reduced dependencies** → Recreated essential modules from scratch to improve security and reduce external code.
* [x] **TypeScript interfaces** → Ensures cleaner, more maintainable, and strongly-typed code.
* [x] **HTML file sending** → Easily serve static HTML files with `sendFile()`.
* [x] **Route aliases** → Define aliases for routes to improve readability and ease of use.
* [x] **IP Middleware** → Built-in middleware for IP blocking and simple rate limiting.
* [x] **Hot Module Reload** → Middleware that automatically refreshes the client when changes are detected in the source code.
* [x] **404 Handler** → Customizable default response for unmatched routes.
* [ ] **Simple Logger Middleware** → Log HTTP method, path, and timestamp for each request.
* [ ] **Additional tests** → Increase test coverage for improved stability and reliability.

<br/>

## Project Structure

Here’s how RouteX is organized:

```
RouteX/
├── src/
│   ├── routes/          # Define your routes here
│   ├── middlewares/     # Custom middlewares (IP blocker, HMR, etc.)
│   ├── core/            #  Core framework logic, like router and layer controller for each route
│   ├── interfaces/      # TypeScript interfaces for requests and responses
│   ├── libs/            # Reimplemented core utilities to reduce third-party dependencies
│   ├── errors/          # Centralized error handling and response helpers (not work corrected yet)
│   └── index.ts         # Entry point of the application
├── dist/                # Compiled JavaScript output
├── package.json
└── tsconfig.json
```

* Routes are located in **`/src/routes`** — that’s where you define your endpoints.
* Core logic (like `Router`, `Server`, and `Response` helpers) lives under **`/src/core`**.
* Middlewares like IP blocking can be found in **`/src/middlewares`**.

<br/>

## Features

* **`send(data)`** → Sends plain text or an object directly to the client.
* **`json(data)`** → Returns a JSON response.
* **`download(filePath)`** → Forces the client to download a file.
* **`redirect(url)`** → Redirects the user to another URL or local file.
* **`sendFile(filePath)`** → Serves a file’s contents directly to the client.

<br/>

## Usage Example

```ts
response.send("Hello, client!"); // Sends a text response
response.json({ hello: "world" }); // Sends a JSON response
response.download("./download.test.txt"); // Forces a file download
response.redirect("https://example.com"); // Redirects the client
response.sendFile("./index.html"); // Sends an HTML file to the client
```

➡️ Check out more examples in [`src/index.ts`](src/index.ts)

<br/>

## Getting Started

Clone the repository:

```bash
git clone https://github.com/criszst/RouteX.git
```

Move into the project directory:

```bash
cd RouteX
```

Install dependencies:

```bash
npm install
```

(Optional) Run the test suite:

```bash
npm run test
```

Since Node.js doesn’t run TypeScript directly, compile the project first:

```bash
npm run build
```

Then start the server:

```bash
npm run start
```

<br/>

## Running the Server

Once started, the server runs on port **`3000`** by default.
Open your browser and visit:

👉 [http://localhost:3000](http://localhost:3000)

You should see the response:

```json
{"hello": "world"}
```

<br/>

## 💡 Final Notes

RouteX isn’t meant to replace Express — it’s a playground to explore how web frameworks work under the hood.
It’s a simple, educational project that grows as I add new features and refine its core design.
