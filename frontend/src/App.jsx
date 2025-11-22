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
import Layout from './components/Layout.jsx';
import useThemeStore from './store/useThemeStore.js';




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

 const{theme}=useThemeStore();
if(isLoading) return <PageLoader/>
 //as user is returned by the backend for signup(signup controller)


  return (
    <div className='h-screen' data-theme={theme}>
      {/* <button onClick={()=>toast.error("hello world")}> create a toast</button> */}
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded?( 
          <Layout showSidebar={true}>
            <HomePage/>


          </Layout>
        ): (
          <Navigate to = {!isAuthenticated?"/login":"/onboarding"}/>
        ) 
      }
          />
         <Route path="/signup" element={!isAuthenticated? < SignUpPage /> : <Navigate to ={isOnboarded ? "/":"/onboarding"}/>} />
          <Route path="/login" element={!isAuthenticated? < LoginPage /> : <Navigate to ={isOnboarded ? "/":"/onboarding"}/>} />

           <Route path="/notifications" element={isAuthenticated && isOnboarded?( 
          <Layout showSidebar={true}>
            <NotificationsPage/>


          </Layout>
        ): (
          <Navigate to = {!isAuthenticated?"/login":"/onboarding"}/>
        ) }/>
        <Route path="/call/:id" element={isAuthenticated && isOnboarded? <CallPage />:( <Navigate to ={isAuthenticated?"/login":"/onboarding"}/>)
      }
      />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />        
        
         <Route 
              path="/onboarding"
               element={isAuthenticated? (!isOnboarded? <OnBoardingPage/>:  <Navigate to ="/"/>) : 
                (<Navigate to ="/login" />)} />
      </Routes>
    <Toaster/>
</div>
  )
}

export default App