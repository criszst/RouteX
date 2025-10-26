# RouteX

A lightweight Express-like framework that I built for fun. While I won’t be implementing all the features of Express, I’ll be adding the essential ones to keep the project clean and functional.  
<br/>

## Checklist  

- [x] **Basic app structure** → Includes core methods like `send`, `post`, `res`, `req`, and `next`.  
- [x] **Reduced dependencies** → Recreated essential libraries to improve security and minimize external code.  
- [x] **TypeScript interfaces** → Used to ensure clean and maintainable code.  
- [x] **HTML file sending** → Function to send an HTML file directly to the client. 
- [x] **Aliases to Router** -> Aliases to some routes pages, to increase readability and ease of use.
- [x] **IP Middleware** → Middleware with IP blocking and rate limiting features.  
- [ ] **More built-in middlewares** → Add useful built-in middleware options for developers.  
- [x] **404 Handler** → Provide a default or customizable response for unmatched routes.  
- [ ] **Simple Logger Middleware** → Log HTTP method, path, and timestamp for each request.  
- [ ] **Additional tests** → Improve test coverage for stability and reliability.

<br/>

## Features  

- **`send(data)`** → Sends an object or text directly to the client.  
- **`json(data)`** → Returns a JSON response.  
- **`download(filePath)`** → Sends a file to be downloaded by the client.  
- **`redirect(url)`** → Redirects the client to a specific URL (public domain or local project file).  
- **`sendFile(filePath)`** → Sends the content of a file to the client.  

</br>

## Usage  

Some quick examples of how to use it:  

```ts
response.send("Hello, client!"); // Sends a text response  
response.json({ hello: "world" }); // Sends a JSON response  
response.download("./download.test.txt"); // Forces a file download  
response.redirect("https://example.com"); // Redirects the user  
response.sendFile("./index.html"); // Sends the content of a file  
```

See more example of usage at <a href="src/index.ts">index.ts</a>

</br>

## Installation  

First, clone the repository:  

```sh
git clone https://github.com/criszst/RouteX.git
```

Navigate into the project directory:  

```sh
cd RouteX
```

Then, install dependencies:  

```sh
npm install
```

If you want to run tests (optional but recommended):  

```sh
npm run test
```

Since Node.js can't run TypeScript files directly, compile the project:  

```sh
npm run build
```

Finally, start the server:  

```sh
npm run start
```

<br/>

## Running the Server  

The server runs on port `3000`. Once it's up, visit:  

[http://localhost:3000](http://localhost:3000)  

You should see the message:  
`{"hello":"world"}`  
