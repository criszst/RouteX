import chokidar, { FSWatcher } from "chokidar";
import path from "path";

/**
 * Setup hot reload for routes. (only development mode)
 *
 * @param loadRoutes - The function to load routes.
 */

 // TODO: Join all in one class to encapsulate all hot reload logic
export function setupHotReload(loadRoutes: () => void): void {
  if (process.env.NODE_ENV !== "development") {
    console.log("[HMR] Hot reload disabled (production mode).");
    return;
  }

  const srcDir: string = path.join(process.cwd(), "src", "routes");

  const watcher: FSWatcher = chokidar.watch(srcDir, {
    ignored: /(^|[\/\\])\./, // HACK: Ignore hidden files and directories
    persistent: true,
  });

  watcher.on("change", (filePath: string) => {

    // Fix the path for the .ts or .js file
    const relPath: string = path.relative(srcDir, filePath);
    const fullPath: string = path.resolve(process.cwd(), "src", "routes", relPath);

    const formattedPath: string | undefined = fullPath.replace(/\\/g, '/').match(/(?<=src)\s*(.*)/)?.[0];
    console.log(`[HMR] Change detected in: ${formattedPath}`);


    try {
      delete require.cache[require.resolve(fullPath)];
      console.log(`[HMR] Cache cleared for: ${formattedPath}\n`);
    } catch {
      console.warn(`[HMR] Could not clear cache for: ${formattedPath}`);
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
