import { apiClient } from 'app/services/client';
import ApiConfig from 'app/config/api-config';

export default function loginUser(username: string, password: string) {
  const data = apiClient.post(ApiConfig.LOGIN, { username, password });
  return data;

  // return { success: true, data: { id: 1 }, message: 'Success' };
}
