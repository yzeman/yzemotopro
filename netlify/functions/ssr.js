import { createRequestHandler } from "@react-router/node";

export const handler = createRequestHandler({
  build: async () => {
    // Use dynamic import with the correct path
    const serverBuild = await import(
      process.cwd() + "/build/server/index.js"
    );
    return serverBuild;
  },
});
