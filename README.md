# 🚀 MyExpress  

A lightweight Express-like framework that I built for fun. While I won’t be implementing all the features of Express, I’ll be adding the essential ones to keep the project clean and functional.  
<br/>

## ✅ Checklist  

- [x] Basic app with `send`, `post`, `res`, `req`, and `next` methods.  
- [x] Recreated some libraries to reduce dependencies (better for security).  
- [x] Interfaces to keep the code clean and maintainable.  
- [ ] Function to send an HTML file to the client.  
- [ ] More built-in middlewares.  
- [ ] Additional tests.  

<br/>

## ⚡ Features  

- **`send(data)`** → Sends an object or text directly to the client.  
- **`json(data)`** → Returns a JSON response.  
- **`download(filePath)`** → Sends a file to be downloaded by the client.  
- **`redirect(url)`** → Redirects the client to a specific URL (public domain or local project file).  
- **`sendFile(filePath)`** *(in development...)* → Sends the content of a file to the client (currently supports only `.txt` files).  

## 📌 Usage  

Some quick examples of how to use it:  

```ts
response.send("Hello, client!"); // Sends a text response  
response.json({ hello: "world" }); // Sends a JSON response  
response.download("./download.test.txt"); // Forces a file download  
response.redirect("https://example.com"); // Redirects the user  
response.sendFile("./index.html"); // (Coming soon!) Sends the content of a file  
```

**Note:** The `sendFile` method is still under development and currently only supports `.txt` files

<br/>

## 🔧 Installation  

First, clone the repository:  

```sh
git clone https://github.com/criszst/MyExpress.git
```

Navigate into the project directory:  

```sh
cd MyExpress
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

## 🌍 Running the Server  

The server runs on port `3000`. Once it's up, visit:  

[http://localhost:3000](http://localhost:3000)  

You should see the message:  
`Hello, world!`  
