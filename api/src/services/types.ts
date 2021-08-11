import {
  sendUnaryData,
  ServerUnaryCall,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";

export type IHandler<IRequest, IResponse> =
  | ((request: IRequest) => Promise<IResponse>)
  | ((request: IRequest) => IResponse);

function createGrpcHandler<IRequest, IResponse>(
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

export type UntypedGrpcServiceInterface<
  ImplementationType extends UntypedServiceImplementation
> = {
  readonly [index in keyof ImplementationType]: IHandler<any, any>;
};

export function constructGrpcService(
  base: UntypedGrpcServiceInterface<UntypedServiceImplementation>
): UntypedServiceImplementation {
  const derived: UntypedServiceImplementation = {};

  Object.keys(base).forEach((key) => {
    derived[key] = createGrpcHandler(base[key]);
  });

  return derived;
}
