import React from 'react';

//importing react router
import { BrowserRouter, Navigate, Route,Routes} from "react-router";
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnBoardingPage from './pages/OnBoardingPage.jsx';
import toast,{ Toaster } from 'react-hot-toast';
import { useEffect,useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { axiosInstance } from './lib/axios.js';


const App = () => {
  const {data:authData,isLoading,error}=useQuery({
    queryKey:["authUser"],
    queryFn: async()=>{
      const res=await axiosInstance.get("/auth/me"); // we have put the rest of URL in base url in axiosInstance
      return res.data;
    },
    retry:false,//to check only one time if req failed(authorization check)

});
const authUser= authData?.user //as user is returned by the backend for signup(signup controller)
  return (
    <div className='h-screen' data-theme="night">
      {/* <button onClick={()=>toast.error("hello world")}> create a toast</button> */}
      <Routes>
        <Route path="/" element={authUser? <HomePage />: <Navigate to ="/login" />} />
         <Route path="/signup" element={!authUser? < SignUpPage /> : <Navigate to ="/"/>} />
          <Route path="/login" element={!authUser? < LoginPage /> : <Navigate to ="/"/>} />
           <Route path="/notifications" element={authUser? <NotificationsPage/>: <Navigate to ="/login" />} />
            <Route path="/call" element={authUser? <CallPage />: <Navigate to ="/login" />} />
             <Route path="/chat" element={authUser? <ChatPage/>: <Navigate to ="/login" />} />
              <Route path="/onboarding" element={authUser? <OnBoardingPage />: <Navigate to ="/login" />} />
      </Routes>
    <Toaster/>
</div>
  )
}

export default App