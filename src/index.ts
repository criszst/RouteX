import { app } from "./express";

import { setupHotReload } from "./utils/hotReload";
import loadRoutes from "./utils/loadRoutes";

const port = 3000;

loadRoutes();
setupHotReload(loadRoutes);

app.listen(port, () => {
  console.log(`✅ Servidor rodando em http://localhost:${port}`);
});
