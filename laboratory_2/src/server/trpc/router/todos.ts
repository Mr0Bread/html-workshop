import { t } from "../trpc";
import { z } from "zod";
import { prisma } from "src/server/db/client";

export const todosRouter = t.router({
    getAll: t.procedure.query(async () => {
        const todos = await prisma.todo.findMany();

        return todos;
    }),
    add: t.procedure
        .input(z.object({
            text: z.string()
        }))
        .mutation(async ({ input }) => {
            const todo = await prisma.todo.create({
                data: {
                    text: input.text,
                },
            });

            return todo;
        }),
    delete: t.procedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ input }) => {
            const todo = await prisma.todo.delete({
                where: {
                    id: input.id
                }
            });

            return todo;
        })
})