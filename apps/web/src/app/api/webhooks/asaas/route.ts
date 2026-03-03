import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import type { AsaasWebhookPayload } from "@repo/asaas";

export async function POST(req: NextRequest) {
  // Verificar token de autenticação do webhook
  const token = req.headers.get("asaas-access-token");
  if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json()) as AsaasWebhookPayload;
  const { event, payment } = payload;

  try {
    switch (event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED": {
        // Atualizar pagamento no banco
        await prisma.pagamento.upsert({
          where: { asaasPaymentId: payment.id },
          create: {
            userId: "", // será preenchido abaixo
            asaasPaymentId: payment.id,
            asaasSubscriptionId: payment.subscription,
            valor: payment.value,
            status: "RECEBIDO",
            formaPagamento: payment.billingType,
          },
          update: {
            status: "RECEBIDO",
          },
        });

        // Se é pagamento de assinatura, ativar plano
        if (payment.subscription) {
          const user = await prisma.user.findFirst({
            where: { asaasSubscriptionId: payment.subscription },
          });
          if (user) {
            await prisma.pagamento.updateMany({
              where: { asaasPaymentId: payment.id },
              data: { userId: user.id },
            });
          }
        }
        break;
      }

      case "PAYMENT_OVERDUE": {
        if (payment.subscription) {
          // Downgrade para FREE se pagamento venceu
          await prisma.user.updateMany({
            where: { asaasSubscriptionId: payment.subscription },
            data: { plano: "FREE" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Asaas error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
