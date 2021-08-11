import { IInventoryManagmentServer } from "ssr-grpc-proto-lib/models/inventory_management_grpc_pb";
import {
  CreateItemRequest,
  CreateItemResponse,
  GetItemRequest,
  GetItemResponse,
} from "ssr-grpc-proto-lib/models/inventory_management_pb";
import { IHandler, UntypedGrpcServiceInterface } from "./types";

export class InventoryManagement
  implements UntypedGrpcServiceInterface<IInventoryManagmentServer>
{
  [method: string]: IHandler<any, any>;

  public createItem: IHandler<CreateItemRequest, CreateItemResponse> = (
    _request: CreateItemRequest
  ) => {
    const response = new CreateItemResponse();
    response.setSuccess(true);
    return response;
  };

  public getItem: IHandler<GetItemRequest, GetItemResponse> = (request) => {
    const response = new GetItemResponse();
    return response;
  };
}
