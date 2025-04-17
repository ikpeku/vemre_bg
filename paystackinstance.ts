
import axios from "axios";

const BaseUrl = "https://api.paystack.co";


 const paystackInstance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Acess-Control-Allow-Origin': '*',
    'Accept': "application/json"
  }
});

paystackInstance.interceptors.request.use(
  async(config) => {
   
      config.headers.Authorization = `Bearer ${process.env.PayStack_Secret_Key}`;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default paystackInstance;
