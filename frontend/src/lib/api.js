import { axiosInstance } from "./axios";
export const signup =async (signupData)=>{
      const response=await axiosInstance.post("/auth/signup",signupData);
      
      return response.data;

    };

 export const getAuthUser =   async()=>{
      //check if user is authenticated or not (point of earlier mistake which i made)
      const res=await axiosInstance.get("/auth/me"); // we have put the rest of URL in base url in axiosInstance
      
      return res.data;
     
    };

export const completeOnboarding=async(userData)=>{
    const response=await axiosInstance.post("/auth/onboarding",userData);
    return response.data;
}