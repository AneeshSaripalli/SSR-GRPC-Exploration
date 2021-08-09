import "../styles/globals.css";
import type { AppProps } from "next/app";
import { getService } from "./api/services";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
