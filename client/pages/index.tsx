import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  GetValuesRequest,
  GetValuesResponse,
} from "ssr-grpc-proto-lib/models/key_value_service_pb";
import styles from "../styles/Home.module.css";
import { getService } from "./api/services";

type IProps = {
  response: GetValuesResponse.AsObject;
};

export default function Home(props: IProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>Response: {props.response.value}</main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: IProps }> => {
  const services = getService();

  const request = new GetValuesRequest();
  const response = await services.keyValueService.getValues(request);

  return {
    props: {
      response: response.toObject(),
    },
  };
};
