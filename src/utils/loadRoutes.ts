import fs from "fs";
import path from "path";

function loadRoutes() {
  const isDev = fs.existsSync(path.join(process.cwd(), "src"));
  const baseDir = isDev ? path.join(process.cwd(), "src") : path.join(process.cwd(), "dist");

  const routesDir = path.join(baseDir, "index");
  const files = fs.readdirSync(routesDir);


  // TODO: implement hot reloading for other extension file like html and so on
  for (const file of files) {
    if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

    const routePath = path.join(routesDir, file);
    const modulePath = path.resolve(routePath);

    delete require.cache[require.resolve(modulePath)];

    // idk if this is the best way to handle hot reloading
    // bc the forced require to reload node cache
    // for god sake i hope that's correct
    const routeModule = require(modulePath);

    if (typeof routeModule.default === "function") {
      routeModule.default();
    }

  }
}

export default loadRoutes;
