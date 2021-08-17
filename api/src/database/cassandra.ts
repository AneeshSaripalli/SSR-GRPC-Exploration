import { Client, ClientOptions } from "cassandra-driver";

const options: ClientOptions = {
  contactPoints: ["db:9042"],
  localDataCenter: "datacenter1",
};

const cassandraClient = new Client(options);

export { cassandraClient };
