import WalletProvider from "@/components/ui/wallet-provider";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}
