"use client";
import React from "react";
import { useState } from "react";
import { ERROR_MESSAGES } from "@/constants/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/constants/auth";
import { validateUser } from "@/utils/api";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  // const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);

    if (!error && email && password) {
      //   console.log("Form submitted:", { email, password });
      const result = await validateUser(email, password);

      // Redirect to dashboard after successful login
      if (result.success) {
        alert(`Login Successfully for ${result.user.email}`);
        console.log("user data:", result.user);

        // Store user data in localStorage
        localStorage.setItem("userId", result.user.id || "");
        localStorage.setItem("username", result.user.fullName || "");

        console.log("User ID:", result.user.id);
        console.log("Username:", result.user.fullName);

        router.push(AUTH_ROUTES.USER_DASHBOARD);
      } else {
        setError("Inavlid email or password entered");
      }
    }
  };

  // Validation of the email
  const validateEmail = (value: string) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      setError(ERROR_MESSAGES.INVALID_EMAIL);
    } else {
      setError("");
    }
  };
  //here The onBlur event triggers the validation only when the user moves away from the email field.
  const handleBlur = (e: any) => {
    validateEmail(e.target.value);
  };

  //Validation of the password

  // const validatePassword = (value: any) => {
  //   const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
  //   if (!passwordPattern.test(value)) {
  //     setPasswordError(ERROR_MESSAGES.PASSWORD_TYPE);
  //   } else {
  //     setPasswordError("");
  //   }
  // };

  // const handlePasswordBlur = (e: any) => {
  //   validatePassword(e.target.value);
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please login in to your account
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
                onBlur={handleBlur}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="abc@example.com"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
                // onBlur={handlePasswordBlur}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
              />
              {/* {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )} */}
            </div>
          </div>

          {/* {role : admin / user} */}

          {/* <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            
              <select
                id="role"
                name="role"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-white rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="admin" defaultValue={''}>
                  Admin
                </option>
                <option value="user">User</option>
              </select>
            
          </div> */}

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

          {/* Login In Button */}
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
            Don't have an account?{" "}
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
