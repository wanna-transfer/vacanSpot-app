import axios from 'axios';
import {API_URL} from '../constant';

const instance = axios.create({
  baseURL: API_URL,
});

const apiStartTime = new Date().getTime();
instance.interceptors.request.use(
  config => {
    console.log(
      `📡  API REQUEST : ${config?.method ?? ''} ${config?.url ?? ''}`,
    );
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    const apiEndTime = new Date().getTime();
    console.log(
      `💡 API RESPONSE : ${response.config?.method ?? ''} ${
        response.config?.url ?? ''
      } [${response.status}] [${Math.ceil(
        (apiEndTime - apiStartTime) / 100,
      )}ms]`,
    );
    return response.data;
  },
  async err => {
    if (err?.code === 'ERR_NETWORK') {
      return Promise.reject({
        resultCode: -9999,
        data: 'Network Error',
      });
    }

    const e = err?.response?.data ?? {};

    return Promise.reject(e);
  },
);

export default instance;