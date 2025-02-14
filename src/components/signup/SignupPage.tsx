"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {  z } from "zod";
import { FormEvent } from "react";
import { AUTH_ROUTES } from "@/constants/auth";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { checkUniqueEmail, createUser } from "@/store/slice/signupSlice";


//zod schema validation
const SignUpSchema = z.object({
  fullName: z.string().nonempty("Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain one special character"),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms." }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface SignUpFormData {
  fullName: string; 
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch:AppDispatch = useDispatch()
  const users = useSelector((state:RootState)=>state.signupSlice.users)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      SignUpSchema.parse(formData); // Validate using Zod

      // Check for unique email
      // const usersResponse = await fetch("http://localhost:3001/user");
      // const users = await usersResponse.json();

      // const isEmailTaken = users.some((user: any) => user.email === formData.email);
      // if (isEmailTaken) {
      //   setError("Email is already registered. Please use a different email.");
      //   return;
      // }


      const result = await dispatch(checkUniqueEmail(formData.email)).unwrap()

      if(result!==" Email is available"){
        setError("Email is already registered")
        return
      }


      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword:"",
        acceptTerms:false

      }; 

   

      // const response = await fetch("http://localhost:3001/user", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      dispatch(createUser(payload)).unwrap()

        alert("Signup Successful!");
         // Read response JSON (ensure your backend returns created user data)
  // const createdUser = {
  //   fullName: formData.fullName,
   
  // };
  
  // Store user data in localStorage
  // localStorage.setItem("username", JSON.stringify(createdUser.fullName));
  localStorage.setItem("username", JSON.stringify(formData.fullName));

  // console.log("Response data:", createdUser);
        router.push(AUTH_ROUTES.USER_DASHBOARD)
     
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0]?.message || 'validation failed');
      } else {
        console.error("Unexpected Error:", validationError);
    setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Create an account</h2>
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your name"
            /> 
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="abc@example.com"
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="********"
            />
          </div>
          <div>
            <label className="block text-sm">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="********"
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              <span className="ml-2 text-sm">I accept the terms and conditions</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};
