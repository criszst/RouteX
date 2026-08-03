import { app } from "./routex";

import RouteManager from "../middleware/RouteManager";
import { log, colors } from "../utils/ConsoleColors";

const port = 3000;

const routeManager = new RouteManager(app);

routeManager.start();

// main routes are located on /routes
// bc it's a convention to have routes in a separate file
// its not because i haven't the ability to implement a Hot Reload with routes in a single file fr

app.listen(port, () => {
  log("env", `Running in ${process.env.NODE_ENV || "undefined"} mode`, colors.dim);
  log("server", `Server running on: http://localhost:${port}`, colors.bright);
});
