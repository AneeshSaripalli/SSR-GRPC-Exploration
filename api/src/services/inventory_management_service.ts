import { UntypedHandleCall } from "@grpc/grpc-js";
import { IInventoryManagmentServer } from "ssr-grpc-proto-lib/models/inventory_management_grpc_pb";
import {
  CreateItemRequest,
  CreateItemResponse,
  GetItemRequest,
  GetItemResponse,
} from "ssr-grpc-proto-lib/models/inventory_management_pb";
import { createGrpcHandler } from "./types";

export class InventoryManagement implements IInventoryManagmentServer {
  [method: string]: UntypedHandleCall;

  public createItem = createGrpcHandler<CreateItemRequest, CreateItemResponse>(
    (_request) => {
      const response = new CreateItemResponse();
      response.setSuccess(true);
      return response;
    }
  );

  public getItem = createGrpcHandler<GetItemRequest, GetItemResponse>(
    (request) => {
      const response = new GetItemResponse();
      return response;
    }
  );
}
