'use client';

import { useEffect, useState } from "react";

type Book = {
  id: number;
  userId: string;
  bookName: string;
  ISBN: string;
  issueDate: string;
  dueDate: string;
};

const UserDashboard = () => {
  const [book, setBook] = useState<Book[]>([]);
  const [message, setMessage] = useState("");

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");


  //fetching the user by userId , if found fetch book details , else show message.
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/issue-book?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            setBook(data);
          } else {
            setMessage("You haven't borrowed any books.");
          }
        })
        .catch((error) => {
          console.error("Error in fetching books", error);
        });
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Welcome to Dashboard, {username}
      </h1>
      {message && (
        <p className="text-center text-red-500 font-medium text-lg mb-4">
          {message}
        </p>
      )}
      {book.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Borrowed Books
          </h2>
          <ul className="space-y-4">
            {book.map((book) => (
              <li
                key={book.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <p className="text-lg">
                  <strong className="text-gray-700">Book Name:</strong>{" "}
                  <span className="text-blue-600">{book.bookName}</span>
                </p>
                <p>
                  <strong className="text-gray-700">ISBN:</strong>{" "}
                  <span className="text-gray-600">{book.ISBN}</span>
                </p>
                <p>
                  <strong className="text-gray-700">Issue Date:</strong>{" "}
                  <span className="text-green-600">{book.issueDate}</span>
                </p>
                <p>
                  <strong className="text-gray-700">Return Date:</strong>{" "}
                  <span className="text-red-600">{book.dueDate}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default UserDashboard;
