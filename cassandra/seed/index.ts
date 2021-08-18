import { Client, ClientOptions } from "cassandra-driver";
import { emulateClientActivity } from "./modules/emulate_activity";

const hosts: string[] = process.env.HOSTS!.split(",");

const options: ClientOptions = {
  contactPoints: hosts,
  localDataCenter: "datacenter1",
};

function main() {
  const cassandraClient = new Client(options);
  console.log("Connecting to Cassandra...");
  return cassandraClient
    .connect()
    .then((value) => {
      console.log("Connected to hosts: ", hosts);

      console.log("Emulating clients");
      return emulateClientActivity(cassandraClient).then(() => {
        console.log("Exiting...");
      });
    })
    .catch(console.error);
}

main().then((value) => process.exit(0));
