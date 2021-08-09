// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChannelCredentials } from "@grpc/grpc-js";
import { KeyValueClient } from "ssr-grpc-proto-lib/models/key_value_service_grpc_pb";
import {
  GetValuesRequest,
  GetValuesResponse,
} from "ssr-grpc-proto-lib/models/key_value_service_pb";

const service = new KeyValueClient(
  // Don't prefix with http://
  "localhost:50051",
  ChannelCredentials.createInsecure(),
  {}
);

export const getService = () => ({
  keyValueService: {
    getValues: () => {
      const request = new GetValuesRequest();
      request.setKey("1234");
      return new Promise<GetValuesResponse.AsObject>((resolve, reject) =>
        service.getValues(request, (err, response) => {
          if (err) return reject(err);
          return resolve(response.toObject());
        })
      );
    },
  },
});
