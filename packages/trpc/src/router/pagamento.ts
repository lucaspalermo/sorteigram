import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { AsaasClient, type CicloCobranca } from "@repo/asaas";
import type { Plano } from "@repo/db";

const PLANOS: Record<string, { valor: number; nome: string }> = {
  CREATOR: { valor: 29.9, nome: "SorteiGram Creator" },
  BUSINESS: { valor: 79.9, nome: "SorteiGram Business" },
  AGENCY: { valor: 199.9, nome: "SorteiGram Agency" },
};

export const pagamentoRouter = router({
  meuPlano: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id! },
      select: { plano: true, asaasCustomerId: true, asaasSubscriptionId: true },
    });
    return user;
  }),

  assinar: protectedProcedure
    .input(
      z.object({
        plano: z.enum(["CREATOR", "BUSINESS", "AGENCY"]),
        formaPagamento: z.enum(["CREDIT_CARD", "BOLETO", "PIX"]),
        cartao: z
          .object({
            holderName: z.string(),
            number: z.string(),
            expiryMonth: z.string(),
            expiryYear: z.string(),
            ccv: z.string(),
          })
          .optional(),
        holderInfo: z
          .object({
            name: z.string(),
            email: z.string(),
            cpfCnpj: z.string(),
            postalCode: z.string(),
            addressNumber: z.string(),
            phone: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const asaas = new AsaasClient(process.env.ASAAS_API_KEY!);
      const planoConfig = PLANOS[input.plano];
      if (!planoConfig) throw new Error("Plano inválido");

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id! },
      });

      // Criar cliente no Asaas se não existir
      let customerId = user.asaasCustomerId;
      if (!customerId) {
        const cliente = await asaas.criarCliente({
          name: user.name || user.email,
          email: user.email,
          cpfCnpj: input.holderInfo?.cpfCnpj || "",
        });
        customerId = cliente.id;
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { asaasCustomerId: customerId },
        });
      }

      // Criar assinatura
      const assinatura = await asaas.criarAssinatura({
        customer: customerId,
        billingType: input.formaPagamento,
        value: planoConfig.valor,
        cycle: "MONTHLY" as CicloCobranca,
        description: planoConfig.nome,
        creditCard: input.cartao
          ? {
              holderName: input.cartao.holderName,
              number: input.cartao.number,
              expiryMonth: input.cartao.expiryMonth,
              expiryYear: input.cartao.expiryYear,
              ccv: input.cartao.ccv,
            }
          : undefined,
        creditCardHolderInfo: input.holderInfo
          ? {
              name: input.holderInfo.name,
              email: input.holderInfo.email,
              cpfCnpj: input.holderInfo.cpfCnpj,
              postalCode: input.holderInfo.postalCode,
              addressNumber: input.holderInfo.addressNumber,
              phone: input.holderInfo.phone,
            }
          : undefined,
      });

      // Atualizar plano do usuário
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          plano: input.plano as Plano,
          asaasSubscriptionId: assinatura.id,
        },
      });

      return { subscriptionId: assinatura.id };
    }),

  cancelar: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id! },
    });

    if (user.asaasSubscriptionId) {
      const asaas = new AsaasClient(process.env.ASAAS_API_KEY!);
      await asaas.cancelarAssinatura(user.asaasSubscriptionId);
    }

    await ctx.prisma.user.update({
      where: { id: user.id },
      data: { plano: "FREE", asaasSubscriptionId: null },
    });

    return { success: true };
  }),
});
