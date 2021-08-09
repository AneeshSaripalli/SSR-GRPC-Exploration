import { UntypedHandleCall } from "@grpc/grpc-js";
import {
  sendUnaryData,
  ServerUnaryCall,
} from "@grpc/grpc-js/build/src/server-call";
import { IKeyValueServer } from "ssr-grpc-proto-lib/models/key_value_service_grpc_pb";
import {
  GetValuesRequest,
  GetValuesResponse,
  SetValueRequest,
  SetValueResponse,
} from "ssr-grpc-proto-lib/models/key_value_service_pb";

class KeyValue implements IKeyValueServer {
  // Argument of type 'Greeter' is not assignable to parameter of
  // type 'UntypedServiceImplementation'.
  // Index signature is missing in type 'Greeter'.ts(2345)
  [method: string]: UntypedHandleCall;

  public getValues(
    call: ServerUnaryCall<GetValuesRequest, GetValuesResponse>,
    callback: sendUnaryData<GetValuesResponse>
  ): void {
    const res = new GetValuesResponse();
    res.setValue("fake value");
    callback(null, res);
  }

  public setValue(
    call: ServerUnaryCall<SetValueRequest, SetValueResponse>,
    callback: sendUnaryData<SetValueResponse>
  ): void {
    callback(null, new SetValueResponse());
  }
}

export { KeyValue };
