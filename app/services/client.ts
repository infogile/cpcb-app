import axios from 'axios';
const apiClient = axios.create({
  baseURL: 'http://192.168.0.108',
  responseType: 'json',
  withCredentials: true,
});
// apiClient.defaults.adapter = require('axios/lib/adapters/xhr');
// apiClient.defaults.headers = {
//   'Content-Type': 'application/x-www-form-urlencoded',
//   Accept: 'application/json',
// };
export { apiClient };
// axios.defaults.adapter = require('axios/lib/adapters/xhr')
