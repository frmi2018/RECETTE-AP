import Layout from "../components/Layout";
import "../styles/globals.css"; // Si vous avez des styles globaux

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
