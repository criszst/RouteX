import { app } from "./express";

import { setupHotReload } from "./hot_reload/hotReload";
import loadRoutes from "./hot_reload/loadRoutes";

const port = 3000;

loadRoutes();
setupHotReload(loadRoutes);

// main routes are located on /routes
// bc it's a convention to have routes in a separate file
// its not because i haven't the ability to implement a Hot Reload with routes in a single file fr

app.listen(port, () => {
  console.log(`[ENV] Running in ${process.env.NODE_ENV || "undefined"} mode`);
  console.log(`Server running on http://localhost:${port}`);
});
