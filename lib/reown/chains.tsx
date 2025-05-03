import { defineChain } from "viem";

export const gnosisChiado = defineChain({
  id: 10200,
  name: "Gnosis Chiado",
  network: "gnosis-chiado",
  nativeCurrency: {
    name: "xDAI",
    symbol: "xDAI",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://gnosis-chiado-rpc.publicnode.com"],
    },
  },
  testnet: true,
});
