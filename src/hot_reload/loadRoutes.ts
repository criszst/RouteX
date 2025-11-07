import fs from 'fs';
import path from 'path';


const loadRoutes = (): void => {
  const isDev: boolean = process.env.NODE_ENV === 'development';

  const baseDir: string = path.join(process.cwd(), isDev ? 'src' : 'dist', 'routes');

  if (!fs.existsSync(baseDir)) {
    console.warn(`Routes directory not found at ${baseDir}`);
    return;
  }

  const files: string[] = fs.readdirSync(baseDir)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of files) {
    const resolvePath: string = path.resolve(baseDir, file);


    const route: NodeJS.Require | any = require(resolvePath);
    if (typeof route.default === 'function') {
      route.default();
    }
  }

  console.log(`[Router] Loaded ${files.length} route(s) from ${baseDir}`);
};

export default loadRoutes;
