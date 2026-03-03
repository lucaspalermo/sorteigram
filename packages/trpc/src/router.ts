import { router } from "./trpc";
import { sorteioRouter } from "./router/sorteio";
import { instagramRouter } from "./router/instagram";
import { pagamentoRouter } from "./router/pagamento";

export const appRouter = router({
  sorteio: sorteioRouter,
  instagram: instagramRouter,
  pagamento: pagamentoRouter,
});

export type AppRouter = typeof appRouter;
