import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { gerarHashSeed, realizarSorteio } from "@repo/sorteio-engine";

function getUserId(ctx: { session: { user: { id?: string } } }): string {
  return ctx.session.user.id!;
}

export const sorteioRouter = router({
  listar: protectedProcedure.query(async ({ ctx }) => {
    const userId = getUserId(ctx);
    return ctx.prisma.sorteio.findMany({
      where: { userId },
      include: {
        posts: { select: { id: true, mediaUrl: true, totalComentarios: true } },
        _count: { select: { ganhadores: true } },
      },
      orderBy: { criadoEm: "desc" },
    });
  }),

  buscarPorId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = getUserId(ctx);
      return ctx.prisma.sorteio.findFirstOrThrow({
        where: { id: input.id, userId },
        include: {
          posts: { include: { _count: { select: { comentarios: true } } } },
          ganhadores: true,
        },
      });
    }),

  criar: protectedProcedure
    .input(
      z.object({
        titulo: z.string().min(1).max(200),
        descricao: z.string().optional(),
        qtdGanhadores: z.number().int().min(1).max(50).default(1),
        regras: z
          .object({
            seguir: z.boolean().default(false),
            marcarAmigos: z.number().int().min(0).default(0),
            hashtag: z.string().optional(),
            textoObrigatorio: z.string().optional(),
          })
          .default({}),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx);
      const { seed, hash } = gerarHashSeed();
      return ctx.prisma.sorteio.create({
        data: {
          userId,
          titulo: input.titulo,
          descricao: input.descricao,
          qtdGanhadores: input.qtdGanhadores,
          regras: input.regras,
          hashSeed: hash,
          seedRevelado: seed,
        },
      });
    }),

  adicionarPost: protectedProcedure
    .input(
      z.object({
        sorteioId: z.string(),
        igMediaId: z.string(),
        permalink: z.string(),
        caption: z.string().optional(),
        mediaUrl: z.string().optional(),
        mediaType: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx);
      const sorteio = await ctx.prisma.sorteio.findFirstOrThrow({
        where: { id: input.sorteioId, userId },
      });
      return ctx.prisma.sorteioPost.create({
        data: {
          sorteioId: sorteio.id,
          igMediaId: input.igMediaId,
          permalink: input.permalink,
          caption: input.caption,
          mediaUrl: input.mediaUrl,
          mediaType: input.mediaType,
        },
      });
    }),

  realizar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx);
      const sorteio = await ctx.prisma.sorteio.findFirstOrThrow({
        where: { id: input.id, userId },
        include: {
          posts: {
            include: {
              comentarios: { where: { isElegivel: true } },
            },
          },
        },
      });

      const todosComentarios = sorteio.posts.flatMap((p) => p.comentarios);

      if (todosComentarios.length === 0) {
        throw new Error("Nenhum comentário elegível para sortear");
      }

      const resultado = realizarSorteio(
        todosComentarios.map((c) => ({
          id: c.id,
          username: c.username,
        })),
        sorteio.qtdGanhadores,
        sorteio.seedRevelado!
      );

      await ctx.prisma.$transaction([
        ...resultado.ganhadores.map((g, i) =>
          ctx.prisma.ganhador.create({
            data: {
              sorteioId: sorteio.id,
              username: g.username,
              comentarioId: g.id,
              posicao: i + 1,
            },
          })
        ),
        ctx.prisma.sorteio.update({
          where: { id: sorteio.id },
          data: {
            status: "REALIZADO",
            hashResultado: resultado.hashResultado,
            dataRealizacao: new Date(),
          },
        }),
      ]);

      return resultado;
    }),

  excluir: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx);
      return ctx.prisma.sorteio.delete({
        where: { id: input.id, userId },
      });
    }),
});
