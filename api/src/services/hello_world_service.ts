import {
  sendUnaryData,
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
  status,
  UntypedHandleCall,
} from "@grpc/grpc-js";
import { randomBytes } from "crypto";
import { IGreeterServer } from "../../../protos/models/hello_world_grpc_pb";
import {
  HelloRequest,
  HelloResponse,
} from "../../../protos/models/hello_world_pb";
import { ServiceError } from "./error";

/**
 * package helloworld
 * service Greeter
 */
class Greeter implements IGreeterServer {
  // Argument of type 'Greeter' is not assignable to parameter of type 'UntypedServiceImplementation'.
  // Index signature is missing in type 'Greeter'.ts(2345)
  [method: string]: UntypedHandleCall;

  /**
   * Implements the SayHello RPC method.
   */
  public sayHello(
    call: ServerUnaryCall<HelloRequest, HelloResponse>,
    callback: sendUnaryData<HelloResponse>
  ): void {
    const res: HelloResponse = new HelloResponse();
    const name = call.request.getName();

    if (name === "error") {
      // https://grpc.io/grpc/node/grpc.html#.status__anchor
      return callback(
        new ServiceError(status.INVALID_ARGUMENT, "InvalidValue"),
        null
      );
    }

    const metadataValue = call.metadata.get("foo");
    res.setMessage(`Hello ${metadataValue.length > 0 ? metadataValue : name}`);

    callback(null, res);
  }

  public sayHelloStreamRequest(
    call: ServerReadableStream<HelloRequest, HelloResponse>,
    callback: sendUnaryData<HelloResponse>
  ): void {
    console.info("sayHelloStreamRequest:", call.getPeer());

    const data: string[] = [];
    call
      .on("data", (req: HelloRequest) => {
        data.push(`${req.getName()} - ${randomBytes(5).toString("hex")}`);
      })
      .on("end", () => {
        const res: HelloResponse = new HelloResponse();
        res.setMessage(data.join("\n"));

        callback(null, res);
      })
      .on("error", (err: Error) => {
        callback(new ServiceError(status.INTERNAL, err.message), null);
      });
  }

  public sayHelloStreamResponse(
    call: ServerWritableStream<HelloRequest, HelloResponse>
  ): void {
    console.info("sayHelloStreamResponse:", call.request.toObject());

    const name = call.request.getName();

    for (const text of Array(10)
      .fill("")
      .map(() => randomBytes(5).toString("hex"))) {
      const res = new HelloResponse();
      res.setMessage(`${name} - ${text}`);
      call.write(res);
    }
    call.end();
  }

  public sayHelloStream(
    call: ServerDuplexStream<HelloRequest, HelloResponse>
  ): void {
    console.info("sayHelloStream:", call.getPeer());

    call
      .on("data", (req: HelloRequest) => {
        const res = new HelloResponse();
        res.setMessage(`${req.getName()} - ${randomBytes(5).toString("hex")}`);
        call.write(res);
      })
      .on("end", () => {
        call.end();
      })
      .on("error", (err: Error) => {
        console.error("sayHelloStream:", err);
      });
  }
}

export { Greeter };
