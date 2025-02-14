"use client";

import { AUTH_ROUTES } from "@/constants/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UseSelector, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

import {  createUser, fetchUsers, updateUser } from "@/store/slice/userSlice";

interface User {
  fullName: string;
  id?: number|undefined; 
  email?: string;
  password?: string;
}

const UserDetails = () => {
  const dispatch : AppDispatch= useDispatch();
  const users = useSelector((state:RootState)=>state.api.users)

  // const [tempusers, setTempUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const response = await fetch("http://localhost:3001/user");
    //     if (response.ok) {
    //       const data: User[] = await response.json();
    //       setUsers(data);
    //     } else {
    //       console.error("Failed to fetch user data");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };

    // fetchUsers();

    dispatch(fetchUsers())
  }, [dispatch]);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (editUser) {
      setEditUser((prev) => (prev ? { ...prev, [name]: value } : null));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(createUser(newUser)).unwrap().then(()=>{
      setIsFormOpen(false)
      setNewUser({fullName:"", email:"", password:""})
    }).catch((error)=>{
      console.error("Error in creating user",error);
    })

    // try {
    //   const response = await fetch("http://localhost:3001/user", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(newUser),
    //   });

    //   if (response.ok) {
    //     const createdUser = await response.json();
    //     setTempUsers((prevUsers) => [...prevUsers, createdUser]);
    //     setIsFormOpen(false);
    //     setNewUser({ fullName: "", email: "", password: "" });
    //   } else {
    //     console.error("Failed to create user");
    //   }
    // } catch (error) {
    //   console.error("Error creating user:", error);
    // }
  };

  const [editUser, setEditUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setIsFormOpen(true);
  }; 

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if(editUser){
      dispatch(updateUser(editUser))
      setEditUser(null)
      setIsFormOpen(false)
    }
    // if (editUser) {
    //   try {
    //     const response = await fetch(`http://localhost:3001/user/${editUser.id}`);
    //     if (!response.ok) {
    //       console.error("Failed to fetch existing user details");
    //       return;
    //     }

    //     const existingUser = await response.json();
    //     const updatedData = { ...existingUser, fullName: editUser.fullName };

    //     const updateResponse = await fetch(`http://localhost:3001/user/${editUser.id}`, {
    //       method: "PUT",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(updatedData),
    //     });

    //     if (updateResponse.ok) {
    //       const updatedUser = await updateResponse.json();
    //       setTempUsers((prevUsers) =>
    //         prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    //       );
    //       setIsFormOpen(false);
    //       setEditUser(null);
    //     } else {
    //       console.error("Failed to update user");
    //     }
    //   } catch (error) {
    //     console.error("Error updating user:", error);
    //   }
    // }
  };

  const router = useRouter();

  const handleIssueBookNavigation = () => {
    router.push(AUTH_ROUTES.ISSUE_BOOK);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        User Details Page
      </h1>
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={handleIssueBookNavigation}
          className="bg-green-400 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-all"
        >
          Issued Books
        </button>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-all"
        >
          Create User
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={editUser ? handleUpdateUser : handleCreateUser}
            className="bg-white p-8 rounded-lg shadow-md w-1/3"
          >
            <label className="block mb-4">
              Full Name:
              <input
                type="text"
                name="fullName"
                value={editUser ? editUser.fullName : newUser.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              />
            </label>
            <label className="block mb-4">
              Email:
              <input
                type="email"
                name="email"
                value={editUser ? editUser.email || "" : newUser.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded ${
                  editUser ? "bg-gray-100" : ""
                }`}
                required={!editUser}
                disabled={!!editUser}
              />
            </label>
            {!editUser && (
              <label className="block mb-4">
                Password:
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </label>
            )}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditUser(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                {editUser ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {users.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-grey-100">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="border px-4 py-3 text-gray-800 font-medium">
                  {user.id}
                </td>
                <td className="border px-4 py-3 text-gray-600">{user.fullName}</td>
                <td className="border px-4 py-3 text-gray-600">{user.email}</td>
                <td className="border px-4 py-3 text-center">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 gap-2 text-white px-6 py-2 rounded-lg transition-all mb-2 mr-4"
                  >
                    Edit
                  </button>
                  <button className="bg-red-500 gap-2 text-white px-6 py-2 rounded-lg transition-all mb-2 mr-4">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 mt-4">No users found or still loading...</p>
      )}
    </div>
  );
};

export default UserDetails;
