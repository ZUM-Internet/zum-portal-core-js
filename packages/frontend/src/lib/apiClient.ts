import { RestClient } from './RestClient';

const prefix = process.env.ZUM_FRONT_MODE === 'publish' ? '/stub' : '/';

export const apiClient = new RestClient(prefix);
