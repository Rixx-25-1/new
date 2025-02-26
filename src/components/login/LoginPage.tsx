"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod"; // Zod validation import
import { ERROR_MESSAGES, AUTH_ROUTES } from "@/constants/auth";
// import { validateUser } from "@/utils/api";
import { AppDispatch, RootState } from "@/store/store";
 
import { validateUsers } from "@/store/slice/validateSlice";
import { useDispatch } from "react-redux";
 
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const router = useRouter();
 
  const dispatch : AppDispatch = useDispatch()
 
  // Zod schema for login form validation
  const loginSchema = z.object({
    email: z.string().email({ message: ERROR_MESSAGES.INVALID_EMAIL }),
    password: z
      .string()
      .min(8, { message: ERROR_MESSAGES.PASSWORD_TYPE  }),
  });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    // Validate form data using Zod
    const result = loginSchema.safeParse({ email, password }); // "safe" parsing (doesn't throw error if validation fails)
 
    if (!result.success) {
      const validationErrors = result.error.format();
      setError(
        validationErrors.email?._errors[0] ||
        validationErrors.password?._errors[0] ||
        "Invalid input"
      );
      return;
    }
 
    // Clear previous error msgs
    setError("");
 
    dispatch(validateUsers({ email, password }))
    .unwrap()
    .then((user) => {
      alert(`Login Successfully for ${user.email}`);
      localStorage.setItem("userId", user.id || "");
      localStorage.setItem("username", user.fullName || "");
      router.push(AUTH_ROUTES.USER_DASHBOARD);
    })
    .catch((err) => setError(err || "Invalid email or password entered"));
};
 
  //   const validationResult = await validateUser(email, password);
 
  //   if (validationResult.success) {
  //     alert(`Login Successfully for ${validationResult.user.email}`);
  //     localStorage.setItem("userId", validationResult.user.id || "");
  //     localStorage.setItem("username", validationResult.user.fullName || "");
  //     router.push(AUTH_ROUTES.USER_DASHBOARD);
  //   } else {
  //     setError("Invalid email or password entered");
  //   }
  // };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please login to your account
          </p>
        </div>
 
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
               
                className={`appearance-none block w-full px-3 py-2 border ${
                  error && error.includes("email")
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="abc@example.com"
              />
              {error && error.includes("email") && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          </div>
 
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
             
                className={`appearance-none block w-full px-3 py-2 border ${
                  error && error.includes("Password")
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="********"
              />
              {error && error.includes("Password") && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          </div>
 
          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
 
            <div className="text-sm">
              <Link
                href={AUTH_ROUTES.FORGET}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>
 
          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Log in
          </button>
        </form>
 
        {/* Sign Up Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href={AUTH_ROUTES.SIGN_UP}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
            <br />
            <Link
              href={AUTH_ROUTES.ADMIN}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Login as Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 