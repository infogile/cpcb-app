import { apiClient } from 'app/services/client';
import ApiConfig from 'app/config/api-config';
import { Platform } from 'react-native';

export default function fieldreport(data, setProgress = null) {
  let progressChanger;
  if (setProgress) {
    progressChanger = setProgress;
  }
  //   const data = apiClient.post(ApiConfig.LOGIN, { username, password });
  //   return data;
  // return { success: true, data: { id: 1 }, message: 'Success' };
  var formData = new FormData();
  data.fieldReport.images.forEach((img) =>
    formData.append('images', {
      name: img,
      type: 'image/jpeg',
      uri: Platform.OS === 'android' ? img : img.replace('file://', ''),
    }),
  );
  formData.append('body', JSON.stringify(data));
  var axiosRequest = apiClient.post(ApiConfig.MYFIELDREPORT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      mimeType: 'multipart/form-data',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': '*',
      Accept: '*',
    },
    onUploadProgress: (progress) => {
      const { total, loaded } = progress;
      const totalSizeInMB = total / 1000000;
      const loadedSizeInMB = loaded / 1000000;
      const uploadPercentage = (loadedSizeInMB / totalSizeInMB) * 100;
      // dispatch upload Percentage
      // console.log('setProgress', setProgress);
      // console.log('uploadPrecentage', uploadPercentage);
      if (progressChanger) {
        progressChanger(uploadPercentage);
      }
    },
  });
  return axiosRequest;
}
