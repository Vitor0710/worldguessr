import "@/styles/globals.css";
import "@/styles/multiPlayerModal.css";

import { GoogleAnalytics } from "nextjs-google-analytics";
import { useEffect } from "react";
export default function App({ Component, pageProps }) {
  useEffect(() => {
    console.log("App mounted - build 2");
  });
  return (
    <>
      <GoogleAnalytics trackPageViews gaMeasurementId="G-KFK0S0RXG5" />
      <Component {...pageProps} />
    </>
  );
}
