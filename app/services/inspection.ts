import { apiClient } from './client';
import ApiConfig from 'app/config/api-config';

export const getInspection = (date: string) => {
  const data = apiClient.post(ApiConfig.MYINSPECTION, { date: date });
  return data;
};
