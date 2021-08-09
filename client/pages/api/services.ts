// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChannelCredentials } from "@grpc/grpc-js";
import { KeyValueClient } from "ssr-grpc-proto-lib/models/key_value_service_grpc_pb";
import { GetValuesRequest } from "ssr-grpc-proto-lib/models/key_value_service_pb";

const service = new KeyValueClient(
  "localhost:50051",
  ChannelCredentials.createInsecure(),
  {}
);

export const getService = () => ({
  getValues: () => {
    const request = new GetValuesRequest();
    request.setKey("1234");
    return service.getValues(request, (err, response) => {
      console.log(err, response.getValue());
    });
  },
});
