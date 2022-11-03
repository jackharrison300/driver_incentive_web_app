import { createRequestHandler } from "@remix-run/architect";
import * as build from "@remix-run/dev/server-build";
import { PrismaClient } from '@prisma/client';

// initialize outside of handler
// cf. https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-serverless-environments
export const prisma = new PrismaClient({
  log: ['query'],
});

export const handler = createRequestHandler({
  build,
  getLoadContext(context) {
    return {...context};
  },
  mode: process.env.NODE_ENV,
});
