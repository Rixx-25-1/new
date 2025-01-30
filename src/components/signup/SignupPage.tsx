"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent } from "react";
import { ERROR_MESSAGES, AUTH_ROUTES } from "@/constants/auth";

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
  const [passwordValidationMessage, setPasswordValidationMessage] = useState<string>("");

  const handlePasswordBlur = (e: any) => {
    validatePassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(ERROR_MESSAGES.PASSWORD_MISMATCH);
      setLoading(false);
      return;
    }

    if (passwordValidationMessage) {
      setError(passwordValidationMessage);
      setLoading(false);
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };

    const isAdminRegistered = localStorage.getItem("isAdminRegistered");
    const endpoint = isAdminRegistered ? "user" : "admin";

    try {
      const response = await fetch(`http://localhost:3001/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`${isAdminRegistered ? "User" : "Admin"} Signup Successfully !!`);
        
        if (!isAdminRegistered) {
          localStorage.setItem("isAdminRegistered", "true");
        }
      } else {
        setError(`Failed to register ${isAdminRegistered ? "user" : "admin"}. Please try again.`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (value: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(value)) {
      setError(ERROR_MESSAGES.INVALID_EMAIL);
    } else {
      setError("");
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const upperCaseRegex = /[A-Z]/;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      setPasswordValidationMessage("Password must be at least 8 characters long.");
    } else if (!upperCaseRegex.test(password)) {
      setPasswordValidationMessage("Password must contain at least one uppercase letter.");
    } else if (!specialCharacterRegex.test(password)) {
      setPasswordValidationMessage("Password must contain at least one special character.");
    } else {
      setPasswordValidationMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">Join us today and get started</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={(e) => validateEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="abc@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => {
                const password = e.target.value;
                setFormData({ ...formData, password });
                validatePassword(password);
              }}
              onBlur={(e) => validatePassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
            {passwordValidationMessage && (
              <p className="text-sm text-red-600 mt-1">{passwordValidationMessage}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              required
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};
