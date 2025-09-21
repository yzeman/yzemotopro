import { createRequestHandler } from "@react-router/node";

export const handler = createRequestHandler({
  build: () => import("../build/server/index.js"),
});
