import { ClientUnaryCall, ServiceError } from "@grpc/grpc-js";

export type GrpcCall<IRequest, IResponse> = (
  request: IRequest,
  callback: (error: ServiceError | null, response: IResponse) => void
) => ClientUnaryCall;

export type GrpcPromise<IRequest, IResponse> = (
  request: IRequest
) => Promise<IResponse>;
