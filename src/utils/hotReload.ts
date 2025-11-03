import chokidar from "chokidar";
import fs from "fs";
import path from "path";

export function setupHotReload(loadRoutes: () => void) {
  const isDev = fs.existsSync(path.join(process.cwd(), "src"));
  const baseDir = isDev ? path.join(process.cwd(), "src") : path.join(process.cwd(), "dist");

  const watchDirs = [
    path.join(baseDir, "routes"),
  ];

  const watcher = chokidar.watch(watchDirs, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
  });

  watcher.on("change", (filePath) => {
    console.log(`[HMR] Detected change in: ${filePath}`);

    let modulePath = path.resolve(filePath);

    // Is on development? If yes, convert to dist
    if (isDev) {
      const relPath = path.relative(path.join(baseDir, "routes"), filePath);
      modulePath = path.join(baseDir.replace("src", "dist"), "routes", relPath.replace(".ts", ".js"));
    }

    try {
      delete require.cache[require.resolve(modulePath)];
      console.log(`Clearing Cache of ${modulePath}...`);
    } catch (err) {
      console.warn(`❌ Não foi possível limpar cache: ${modulePath}`);
    }

    try {
      loadRoutes();
      console.log("[HMR] All routes reloaded successfully!");
    } catch (err) {
      console.error("[HMR] Error reloading routes:", err);
    }
  });
}
