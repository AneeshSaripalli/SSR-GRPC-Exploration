import { Server, ServerCredentials } from "@grpc/grpc-js";
import { GreeterService } from "ssr-grpc-proto-lib/models/hello_world_grpc_pb";
import { InventoryManagmentService } from "ssr-grpc-proto-lib/models/inventory_management_grpc_pb";
import { KeyValueService } from "ssr-grpc-proto-lib/models/key_value_service_grpc_pb";
import { cassandraClient } from "./database/cassandra";
import { Greeter } from "./services/hello_world_service";
import { InventoryManagement } from "./services/inventory_management_service";
import { KeyValue } from "./services/key_value_service";
import { constructGrpcService } from "./services/types";

// Do not use @grpc/proto-loader
const server = new Server({
  "grpc.max_receive_message_length": -1,
  "grpc.max_send_message_length": -1,
});

server.addService(KeyValueService, new KeyValue());
server.addService(GreeterService, new Greeter());
server.addService(
  InventoryManagmentService,
  constructGrpcService(new InventoryManagement())
);

async function main() {
  await cassandraClient.connect();
  const hosts = cassandraClient.getState().getConnectedHosts();

  hosts.forEach((host) =>
    console.log("Connected to Cassandra node:", host.address)
  );
}

main();

server.bindAsync(
  "0.0.0.0:50051",
  ServerCredentials.createInsecure(),
  (err: Error | null, bindPort: number) => {
    console.log("Bound to port:", bindPort);
    if (err) {
      throw err;
    }
    server.start();
  }
);
