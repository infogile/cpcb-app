import { apiClient } from 'app/services/client';

const setAuthHeader = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = token;
};
export default setAuthHeader;
