import App from "../core/types/IApp";

import chokidar, { FSWatcher } from "chokidar";
import path from "path";

import fs from 'fs';

class RouteManager {
  private watcher?: FSWatcher;
  private baseDir: string;

  constructor(private app: App, private env = process.env.NODE_ENV) {
    this.baseDir = path.join(
      process.cwd(),
      this.env === 'production' ? 'dist' : 'src', 'examples', 'routes',
    );
  }

  private loadedRoutes = new Set<string>();

  private baseDirExist(): boolean {
    return fs.existsSync(this.baseDir);
  }

  private getRouteFiles(filePath?: string): string[] {
    return fs.readdirSync(this.baseDir)
      .filter(file => !filePath || file.includes(filePath));
  }


  private loadRouteFiles(file: string, forceReload?: boolean) {
    if (!forceReload && this.loadedRoutes.has(file)) return;

    const resolvedPath = path.resolve(this.baseDir, file);

    delete require.cache[require.resolve(resolvedPath)];

    const routeModule = require(resolvedPath);

     if (typeof routeModule.default === 'function') {
       routeModule.default(this.app);
       this.loadedRoutes.add(file);
     }
  }

  public loadRoutes(option: { filePath?: string, forceReload?: boolean } = {}): void {
    if (!this.baseDirExist()) {
      console.warn(`Routes cannot be loaded because base directory is not set.`);
      return;
    }

    const files = this.getRouteFiles(option.filePath);

    console.log(
        option.filePath ? `    [Router] Reloading changed route: ${option.filePath}` : `    [Router] Reloading all routes`
      );

    for (const file of files) {
      this.loadRouteFiles(file, Boolean(option.forceReload));
    }

    console.log(`    [Router] Loaded ${files.length} route(s) from ${this.baseDir}`);
  }


  public setupHotReload() {
    if (!this.watcher) {
      this.watcher = chokidar.watch(this.baseDir, {
        ignored: /(^|[\/\\])\../,
        persistent: true
      })
    }

    this.watcher.on('change', (filePath: string) => {

      // preventing that Hot Reload try to load the same route on tree
      if (this.app.router.stack) {
        this.app.router.stack = this.app.router.stack.filter(l => l.type !== 'route');
      }

      const relPath: string = path.relative(this.baseDir, filePath)
      const fullPath: string = path.resolve(process.cwd(), 'src', 'examples', 'routes', relPath);

      const formattedPath: string | undefined = fullPath.replace(/\\/g, '/').match(/(?<=src)\s*(.*)/)?.[0];

      console.log(`\n--- [Hot Reload] Change detected in: ${formattedPath}`);

      this.loadRoutes({ filePath: relPath, forceReload: true });
      console.log('\n--- [Hot Reload] Router rebuilt successfully');

      this.app.router?.rebuild();
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
