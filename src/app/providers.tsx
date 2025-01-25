"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { type ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { type State, WagmiProvider } from "wagmi";

import { getConfig } from "@/wagmi";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <ConnectKitProvider>{props.children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
