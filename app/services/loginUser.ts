import { apiClient } from 'app/services/client';
import ApiConfig from 'app/config/api-config';

export default async function loginUser(username: string, password: string) {
  // const data = 
  const data = await apiClient.post(ApiConfig.LOGIN, { username, password })
  .then(res=>{
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',res.data);
    return res;
  })
  .catch(err=>{
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',err)
  })
  // const datafinal = data.then(res => res.data);
  // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",data);
  return data


  // return { success: true, data: { id: 1 }, message: 'Success' };
}
