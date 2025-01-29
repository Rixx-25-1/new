export const ERROR_MESSAGES = {
    INVALID_EMAIL: "Please enter a valid email address",
    REQUIRED_FIELD: "This field is required",
    PASSWORD_TYPE: "Password must contain 1 Capital letter,special character and have at least 8 characters ",
    PASSWORD_MISMATCH: "Passwords do not match",
    INVALID_CREDENTIALS: "Invalid email or password",
    UNABLE_TO_PROCESS_REQUEST:
      "Unable to process your request. Please try again later.",
  } as const; 

  export const AUTH_ROUTES = {
    LOGIN: 'auth/login',
    SIGN_UP: 'auth/signup',
    DASHBOARD : 'auth/dashboard'
  } as const;