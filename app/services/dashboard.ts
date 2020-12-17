import { apiClient } from './client';
import ApiConfig from 'app/config/api-config';

export const getDashboarsStatus = () => {
  const data = apiClient.get(ApiConfig.DASHBOARDSTATUS);
  return data;
};
