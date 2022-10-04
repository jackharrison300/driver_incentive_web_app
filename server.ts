import { createRequestHandler } from "@remix-run/architect";
import * as build from "@remix-run/dev/server-build";
import { PrismaClient } from '@prisma/client';

if (process.env.NODE_ENV !== "production") {
  require("./mocks");
}

// initialize outside of handler
// cf. https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-serverless-environments
export const prisma = new PrismaClient();

export const handler = createRequestHandler({
  build,
  getLoadContext(context) {
    return {...context};
  },
  mode: process.env.NODE_ENV,
});
