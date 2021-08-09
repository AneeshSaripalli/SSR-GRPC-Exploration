import { Server, ServerCredentials } from "@grpc/grpc-js";
import { GreeterService } from "../../protos/models/hello_world_grpc_pb";
import { Greeter } from "./services/hello_world_service";

// Do not use @grpc/proto-loader
const server = new Server({
  "grpc.max_receive_message_length": -1,
  "grpc.max_send_message_length": -1,
});
//   server.addService(KeyValueService, KeyValue);
server.addService(GreeterService, new Greeter());

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
