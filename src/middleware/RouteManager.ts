import App from "../core/types/IApp";

import chokidar, { FSWatcher } from "chokidar";
import path from "path";

import fs from 'fs';
import { log, colors } from "../utils/ConsoleColors";

class RouteManager {
  private watcher?: FSWatcher;
  private srcDir: string;

  constructor(private app: App, private env = process.env.NODE_ENV) {
    this.srcDir = path.join(__dirname, '..');
  }

  private loadedRoutes = new Set<string>();


  private getRouteDirs(): string[] {
    const rootRoutes = path.join(this.srcDir, 'routes');

    const nestedRoutes = fs.readdirSync(this.srcDir, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => path.join(this.srcDir, dir.name, 'routes'))
      .filter(routeDir => fs.existsSync(routeDir));

    return [
      ...(fs.existsSync(rootRoutes) ? [rootRoutes] : []),
      ...nestedRoutes
    ];
  }



  private getRouteFiles(filePath?: string): string[] {
    return this.getRouteDirs()
      .flatMap(routeDir => fs.readdirSync(routeDir)
        .filter(file => !filePath || file.includes(filePath))
        .map(file => path.join(routeDir, file))
      );
  }


  private loadRouteFiles(file: string, forceReload?: boolean) {
    if (!forceReload && this.loadedRoutes.has(file)) return;

    delete require.cache[require.resolve(file)];

    const routeModule = require(file);

     if (typeof routeModule.default === 'function') {
       routeModule.default(this.app);
       this.loadedRoutes.add(file);
     }
  }

  public loadRoutes(option: { filePath?: string, forceReload?: boolean } = {}): void {
    const routes = this.getRouteDirs();

    if (routes.length == 0) {
      console.warn(`Routes cannot be loaded because base directory is not set.`);
      return;
    }

    const files = this.getRouteFiles(option.filePath);

    log('Router', option.filePath ? `Reloading changed route: ${option.filePath}` : 'Reloading all routes', colors.blue);

    for (const file of files) {
      this.loadRouteFiles(file, Boolean(option.forceReload));
    }

    log('Router', `Loaded ${files.length} route(s) from ${this.getRouteDirs().join(', ')}`, colors.blue);
  }


  public setupHotReload() {
    const routeDirs = this.getRouteDirs()

    if (!this.watcher) {
      this.watcher = chokidar.watch(routeDirs, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
      });
    }

    this.watcher.on('change', (filePath: string) => {

      // preventing that Hot Reload try to load the same route on tree
      if (this.app.router.stack) {
        this.app.router.stack = this.app.router.stack.filter(l => l.type !== 'route');
      }

      const currentRouteDir = this.getRouteDirs()
      const routeDir = currentRouteDir.find(dir => filePath.startsWith(dir))

      if (!routeDir) {
        console.warn(`No route directory found for: ${filePath}`)
        return
      }

      const formattedPath: string | undefined = filePath.replace(/\\/g, '/').match(/(?<=src)\s*(.*)/)?.[0] ?? filePath;

      console.log(`\n--- [Hot Reload] Change detected in: ${formattedPath}`);

      this.loadRoutes({ filePath, forceReload: true });
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
