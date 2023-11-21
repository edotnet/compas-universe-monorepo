import { api, authHeader } from "@/utils/axios";
import { contextType } from "@/utils/types/context.types";
import RequestMethod from "@/utils/types/enums/request-method.enum";

export const useFetchSSR = async (
  context: contextType,
  reqType: RequestMethod,
  url: string,
  body: object = {},
  data = false
) => {
  try {
    if (reqType === RequestMethod.Get) {
      const response = await api.get(url, authHeader(context));

      return data ? response : response.data;
    }

    if (reqType === RequestMethod.Post) {
      const response = await api.post(url, body, authHeader(context));
      return data ? response : response.data;
    }
  } catch (e) {
    return null;
  }
};
