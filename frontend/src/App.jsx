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
// import { useEffect,useState } from 'react';
// import { useQuery } from '@tanstack/react-query';

// import { axiosInstance } from './lib/axios.js';
// import { getAuthUser } from './lib/api.js';
import useAuthUser from './hooks/useAuthUser.js';
import axios from "axios";
import PageLoader from './components/PageLoader.jsx';


const App = () => {
//   const {data:authData,isLoading}=useQuery({
//     queryKey:["authUser"],
//     queryFn: getAuthUser,
//     retry:false,//to check only one time if req failed(authorization check)

// });  //created custom hook and used this

/*----> this*/ const{isLoading,authUser}=useAuthUser();
const isAuthenticated=Boolean(authUser);
const isOnboarded=authUser?.isOnboarded;

//const authUser= authData?.user;// as hook is created so we dont need this

if(isLoading) return <PageLoader/> //as user is returned by the backend for signup(signup controller)


  return (
    <div className='h-screen' data-theme="night">
      {/* <button onClick={()=>toast.error("hello world")}> create a toast</button> */}
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded?( <HomePage />): (
          <Navigate to = {!isAuthenticated?"/login":"/onboarding"}/>
        ) 
      }
          />
         <Route path="/signup" element={!isAuthenticated? < SignUpPage /> : <Navigate to ="/"/>} />
          <Route path="/login" element={!isAuthenticated? < LoginPage /> : <Navigate to ="/"/>} />
           <Route path="/notifications" element={isAuthenticated? <NotificationsPage/>: <Navigate to ="/login" />} />
            <Route path="/call" element={isAuthenticated? <CallPage />: <Navigate to ="/login" />} />
             <Route path="/chat" element={isAuthenticated? <ChatPage/>: <Navigate to ="/login" />} />
              <Route 
              path="/onboarding"
               element={isAuthenticated? (!isOnboarded? (<OnBoardingPage/>): ( <Navigate to ="/"/>)) : 
                (<Navigate to ="/login" />)} />
      </Routes>
    <Toaster/>
</div>
  )
}

export default App