"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";  
import Link from "next/link";
// import { validateAdmin } from "@/utils/api";  
import { AUTH_ROUTES } from "@/constants/auth";
import { AppDispatch,RootState } from "@/store/store";
import {validateAdminn} from '@/store/slice/validateSlice'
import { useDispatch } from "react-redux";
 


const AdminLoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");  
  const router = useRouter();

  const dispatch:AppDispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // // Validate admin login
    // const result = await validateAdmin(email, password);

    // if (result.success) {
      
   
    //   // router.push(AUTH_ROUTES.DASHBOARD);// //yeh kam nhi kr rha h 
    //   router.push(AUTH_ROUTES.ADMIN_DASHBOARD)
     
         

    // } else {
      
    //   setError('Inavlid email or password entered');
    //   setPassword("")
    //   setEmail("")
     
    // }
    try {
      const result = await dispatch(validateAdminn({ email, password })).unwrap();

      if (result) {
        router.push(AUTH_ROUTES.ADMIN_DASHBOARD);
      }
    } catch (err) {
      // console.error(err);
      setError( err as string)
      // alert(err || "Invalid email or password");
      setEmail("");
      setPassword("");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please log in to access the admin panel
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
          </div>

          
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href={AUTH_ROUTES.FORGET} className="text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>
          </div>

          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
          >
            Log in as Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
