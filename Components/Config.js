// export default API_URL = 'http://192.168.0.102:3001' // Wifi Ralph
//export default API_URL = 'http://192.168.148.161:3001' // 4G Ralph
const API_URL = 'http://192.168.96.92:3001'; //antoine

import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'x-expo-app': 'chatfuze-frontend' 
  }
});

export default api;