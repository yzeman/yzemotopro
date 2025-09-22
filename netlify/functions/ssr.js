// Option 1: Try named import
import { createRequestHandler } from "@react-router/node";

// Option 2: Try default import if named doesn't work
// import createRequestHandler from "@react-router/node";

// Option 3: Try the entire namespace
// import * as reactRouterNode from "@react-router/node";
// const { createRequestHandler } = reactRouterNode;

export const handler = createRequestHandler({
  build: async () => {
    const serverBuild = await import(
      process.cwd() + "/build/server/index.js"
    );
    return serverBuild;
  },
});qqqqq
