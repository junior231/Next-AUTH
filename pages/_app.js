import { SessionProvider } from "next-auth/react";
import Layout from "../components/layout/Layout";
import "../styles/globals.css";
import "antd/dist/antd.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
