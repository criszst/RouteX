import App from "../core/types/IApp";

import IServerRequest from "../http/request/IServerRequest";
import IServerResponse from "../http/response/IServerResponse";

import chokidar, { FSWatcher } from "chokidar";
import path from "path";

import fs from 'fs';


class RouteManager {
  private watcher?: FSWatcher;
  private baseDir: string;

  constructor(private app: App, private env = process.env.NODE_ENV) {
    this.baseDir = path.join(process.cwd(), 'src', 'examples', 'routes');
  }

  public loadRoutes(): void {
    if (!fs.existsSync(this.baseDir)) {
      console.warn(`Routes cannot be loaded because base directory is not set.`);
      return;
    }

    const files: string[] = fs.readdirSync(this.baseDir)
      .filter(file => file.endsWith('.ts'))

    for (const file of files) {
      const resolvePath: string = path.resolve(this.baseDir, file)

      const routeModule = require(resolvePath);

      if (typeof routeModule.default === 'function') {
        routeModule.default(this.app);
      }
    }

    console.log(`[Router] Loaded ${files.length} route(s) from ${this.baseDir}`)
  }


  public setupHotReload() {
    if (!this.baseDir) {
      console.warn(`Hot reload cannot be  set up because base directory is not set.`);
      return;
    }

    if (!this.watcher) {
      this.watcher = chokidar.watch(this.baseDir, {
        ignored: /(^|[\/\\])\../,
        persistent: true
      })
    }

    this.watcher.on('change', (filePath: string) => {

      const relPath: string = path.relative(this.baseDir, filePath)
      const fullPath: string = path.resolve(process.cwd(), 'src', 'routes', relPath);

      const formattedPath: string | undefined = fullPath.replace(/\\/g, '/').match(/(?<=src)\s*(.*)/)?.[0];

      console.log(`[Hot Reload] Change detected in: ${formattedPath}`);

      this.app.router.stack.length = 0;

      delete require.cache[require.resolve(fullPath)];

      this.loadRoutes()
      this.app.router.rebuild();

      console.log('[HMR] Router rebuilt successfully');
    })
  }

  public start(): void {
    this.loadRoutes();

    if (this.env === 'development') {
      this.setupHotReload();
    }
  }
}

export default RouteManager;
