// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChannelCredentials } from "@grpc/grpc-js";
import { InventoryManagmentClient } from "ssr-grpc-proto-lib/models/inventory_management_grpc_pb";
import {
  CreateItemRequest,
  CreateItemResponse,
  GetItemRequest,
  GetItemResponse,
} from "ssr-grpc-proto-lib/models/inventory_management_pb";
import { KeyValueClient } from "ssr-grpc-proto-lib/models/key_value_service_grpc_pb";
import {
  GetValuesRequest,
  GetValuesResponse,
} from "ssr-grpc-proto-lib/models/key_value_service_pb";
import { config } from "../env";
import { GrpcCall, GrpcPromise } from "./grpc/types";

const keyValueService = new KeyValueClient(
  // ! Don't prefix with http:// or https://
  `${config.API_HOST}:${config.API_PORT}`,
  ChannelCredentials.createInsecure(),
  {}
);

const inventoryManagementService = new InventoryManagmentClient(
  // ! Don't prefix with http:// or https://
  `${config.API_HOST}:${config.API_PORT}`,
  ChannelCredentials.createInsecure(),
  {}
);

// Helper function to convert the Grpc callback syntax into
// a promise with async/await syntax.
const promisifyGrpc =
  <IRequest, IResponse>(func: GrpcCall<IRequest, IResponse>) =>
  (request: IRequest): Promise<IResponse> =>
    new Promise<IResponse>((resolve, reject) => {
      func(request, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      });
    });

// Type definition for the service initializer.
// Not sure this is required.
type IService = {
  keyValueService: {
    getValues: GrpcPromise<GetValuesRequest, GetValuesResponse>;
  };
  inventoryManagementService: {
    createItem: GrpcPromise<CreateItemRequest, CreateItemResponse>;
    getItem: GrpcPromise<GetItemRequest, GetItemResponse>;
  };
};

// NOTE: Typescript can't infer the implicit types on the GRPC
// callback, which means we need to explicitly specify the response
// type. https://github.com/microsoft/TypeScript/issues/31146
export const getService = (): IService => ({
  keyValueService: {
    getValues: (() => {
      return promisifyGrpc<GetValuesRequest, GetValuesResponse>(
        keyValueService.getValues.bind(keyValueService)
      );
    })(),
  },
  inventoryManagementService: {
    createItem: (() => {
      return promisifyGrpc<CreateItemRequest, CreateItemResponse>(
        inventoryManagementService.createItem.bind(inventoryManagementService)
      );
    })(),
    getItem: (() => {
      return promisifyGrpc<GetItemRequest, GetItemResponse>(
        inventoryManagementService.getItem.bind(inventoryManagementService)
      );
    })(),
  },
});
