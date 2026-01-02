import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { BASE_URL } from "./routes";

type BaseURLOption = keyof typeof BASE_URL;
type AxiosRequestConfigOption = AxiosRequestConfig & {
  base?: BaseURLOption;
};

const http = async <T = any>(
  method: string,
  config: AxiosRequestConfigOption,
): Promise<T> => {
  const baseURLKey = config.base || "APP";
  const baseURL = BASE_URL[baseURLKey];

  return new Promise((resolve, reject) => {
    axios({
      baseURL,
      method,
      ...config,
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) reject(error.response.data);
        else reject(new Error("Hmm...something seems to have gone wrong."));
      });
  });
};

export const getRequest = (config: AxiosRequestConfigOption) =>
  http("get", config);
