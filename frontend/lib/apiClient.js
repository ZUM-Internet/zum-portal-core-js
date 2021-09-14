import { RestClient } from "./base";

const apiClient = new RestClient(
  process.env.ZUM_FRONT_MODE === 'publish' ? "/stub" : '/'
);

module.exports = {
  apiClient
};
