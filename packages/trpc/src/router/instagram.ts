import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { InstagramClient } from "@repo/instagram";

export const instagramRouter = router({
  meusPostsRecentes: protectedProcedure.query(async ({ ctx }) => {
    const account = await ctx.prisma.account.findFirst({
      where: { userId: ctx.session.user.id!, provider: "facebook" },
    });
    if (!account?.access_token || !account.igUserId) {
      throw new Error("Conta Instagram não conectada");
    }
    const ig = new InstagramClient(account.access_token);
    return ig.getUserMedia(account.igUserId);
  }),

  buscarComentarios: protectedProcedure
    .input(
      z.object({
        sorteioPostId: z.string(),
        igMediaId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.session.user.id!, provider: "facebook" },
      });
      if (!account?.access_token) {
        throw new Error("Conta Instagram não conectada");
      }

      // Atualizar status de sync
      await ctx.prisma.sorteioPost.update({
        where: { id: input.sorteioPostId },
        data: { syncStatus: "SINCRONIZANDO" },
      });

      const ig = new InstagramClient(account.access_token);
      let cursor: string | undefined;
      let totalImportados = 0;

      try {
        do {
          const result = await ig.getMediaComments(input.igMediaId, cursor);

          // Upsert comentários no banco
          for (const comment of result.data) {
            const tagCount = (comment.text.match(/@\w+/g) || []).length;
            await ctx.prisma.comentario.upsert({
              where: { igCommentId: comment.id },
              create: {
                sorteioPostId: input.sorteioPostId,
                igCommentId: comment.id,
                username: comment.username,
                texto: comment.text,
                timestamp: new Date(comment.timestamp),
                tagCount,
                hasHashtag: /#\w+/.test(comment.text),
              },
              update: {
                texto: comment.text,
                tagCount,
                hasHashtag: /#\w+/.test(comment.text),
              },
            });
            totalImportados++;
          }

          cursor = result.paging?.cursors?.after;
        } while (cursor);

        // Atualizar status
        await ctx.prisma.sorteioPost.update({
          where: { id: input.sorteioPostId },
          data: {
            syncStatus: "COMPLETO",
            lastSyncAt: new Date(),
            totalComentarios: totalImportados,
          },
        });

        return { totalImportados };
      } catch (error) {
        await ctx.prisma.sorteioPost.update({
          where: { id: input.sorteioPostId },
          data: { syncStatus: "ERRO" },
        });
        throw error;
      }
    }),
});
