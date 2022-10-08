// src/server/router/index.ts
import { t } from "../trpc";

import { exampleRouter } from "./example";
import { todosRouter } from "./todos";

export const appRouter = t.router({
  example: exampleRouter,
  todos: todosRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
