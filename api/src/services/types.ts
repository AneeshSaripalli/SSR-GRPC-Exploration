import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";

export type IHandler<IRequest, IResponse> =
  | ((request: IRequest) => Promise<IResponse>)
  | ((request: IRequest) => IResponse);

export function createGrpcHandler<IRequest, IResponse>(
  handler: IHandler<IRequest, IResponse>
) {
  return async (
    call: ServerUnaryCall<IRequest, IResponse>,
    callback: sendUnaryData<IResponse>
  ): Promise<void> => {
    try {
      const result = await handler(call.request);
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  };
}
