import { createRequestHandler } from "@react-router/netlify";

export const handler = createRequestHandler({
  build: () => import("../build/server/index.js"),
});
