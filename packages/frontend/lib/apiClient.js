import { RestClient } from "./RestClient";

export const apiClient = new RestClient(
  process.env.ZUM_FRONT_MODE === 'publish' ? "/stub" : '/'
);