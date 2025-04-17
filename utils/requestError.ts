import axios from "axios";

 export const  getError = (error: any) => {
  let e = error;
  if (axios.isAxiosError(error)) {
    
    if (error.response) {
    
      e = error.response.data;                   // data, status, headers
      if (error.response.data && error.response.data.error) {
        e = error.response.data.error;           // my app specific keys override
      }
    
      if(error.response.data.message){
        e = error.response.data.message

      }


    } else if (error.message) {
      e = error.message;
    } else {
      e = "error occured please try again";
    }
  } else {
    e = "error occured please try again";
  }
  return e;
}
