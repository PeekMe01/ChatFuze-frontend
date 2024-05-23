//export const API_URL = 'http://192.168.0.102:3001' // Wifi Ralph
// export const API_URL = 'http://172.16.181.230:3001' // Wifi Uni
// export const API_URL = 'http://192.168.148.161:3001' // 4G Ralph
// export const API_URL = 'http://192.168.64.161:3001' // 4G Ralph
  export const API_URL = 'http://192.168.146.92:3001'; //antoine
// export const API_URL = 'http://192.168.227.92:3001'; //antoine

import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'x-expo-app': 'chatfuze-frontend',
  }
});

export default api;