import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc";
import superjson from "superjson";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ],
});
