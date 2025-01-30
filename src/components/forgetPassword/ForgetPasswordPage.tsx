import { useState } from "react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/user");
      const users = await response.json();

      const userIndex = users.findIndex((user: any) => user.email === email);

      //agar index nhi mila to return back
      if (userIndex === -1) {
        alert("You need to create an account first.");
        return;
      }

      
      users[userIndex].password = newPassword;

    
      await fetch("http://localhost:3001/user", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(users),
      });

      setError("");
      setSuccess("Password updated successfully!");
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold">Forget Password</h2>
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="my-2">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="my-2">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            className="border p-2 w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="my-2">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            className="border p-2 w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2 w-full mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}
