import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { logout } from '../lib/api';
import toast from 'react-hot-toast';

const useLogout = () => {

       const queryClient=useQueryClient();
        const{mutate:logoutMutation,isPending,error}=useMutation({
            mutationFn:logout,
            onSuccess: ()=>{
                toast.success("logged out successfully");
                 queryClient.invalidateQueries({queryKey:["authUser"]})}
            
        }
        )
        return{logoutMutation,isPending,error};
}

export default useLogout