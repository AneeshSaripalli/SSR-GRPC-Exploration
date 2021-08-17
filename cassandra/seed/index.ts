import { Client, ClientOptions } from "cassandra-driver";
import { emulate_activity } from "./modules/emulate_activity";

const options: ClientOptions = {
  contactPoints: [process.env.HOST!],
  localDataCenter: "datacenter1",
};

async function main() {
  const cassandraClient = new Client(options);
  await cassandraClient.connect();

  await emulate_activity(cassandraClient);
}

main();
