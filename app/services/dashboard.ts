import { apiClient } from './client';
import ApiConfig from 'app/config/api-config';

export async function getDashboarsStatus(){
  const data = await apiClient.get(ApiConfig.DASHBOARDSTATUS).then(res=>{
    return res.data;
  });
  console.log("dashboard dataaaaaaaaaaaaaaaaaaaaaaa",data)
  return data;
};
