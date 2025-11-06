import chokidar from "chokidar";
import path from "path";

export function setupHotReload(loadRoutes: () => void) {
  if (process.env.NODE_ENV !== "development") {
    console.log("[HMR] Hot reload disabled (production mode).");
    return;
  }

  const srcDir = path.join(process.cwd(), "src", "routes");

  const watcher = chokidar.watch(srcDir, {
    ignored: /(^|[\/\\])\./, // HACK: Ignore hidden files and directories
    persistent: true,
  });

  watcher.on("change", (filePath) => {
    console.log(`[HMR] Change detected in: ${filePath}`);

    // Fix the path for the .ts or .js file
    const relPath = path.relative(srcDir, filePath);
    const fullPath = path.resolve(process.cwd(), "src", "routes", relPath.replace(/\.ts$/, ".ts"));


    try {
      delete require.cache[require.resolve(fullPath)];
      console.log(`[HMR] Cache cleared for: ${fullPath}\n`);
    } catch {
      console.warn(`[HMR] Could not clear cache for: ${fullPath}`);
    }

    try {
      loadRoutes();
      console.log("[HMR] Routes reloaded successfully!");
    } catch (err) {
      console.error("[HMR] Error reloading routes:", err);
    }
  });

  console.log(`[HMR] Watching for changes in: ${srcDir}`);
}
