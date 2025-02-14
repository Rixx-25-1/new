"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/constants/auth";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBook, addBook, updateBook, deleteBook } from "@/store/slice/adminSlice";

import { z } from "zod";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  status: string;
}

//zod validation schema
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(1, "ISBN is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
});

const AdminDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  //for issue button
  const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);
  const [issueDetails, setIssueDetails] = useState({
    bookName: "",
    ISBN: "",
    issueDate: new Date().toISOString().split("T")[0], // Default to current date
    dueDate: "",
  });

  const [newBook, setNewBook] = useState<Book>({
    id: 0,
    title: "",
    author: "",
    isbn: "",
    quantity: 0,
    status: "Available",
  });

  const [books, setBooks] = useState<Book[]>([]);

  // const fetchBooks = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3001/books");
  //     const data: Book[] = await response.json();
  //     setBooks(data);
  //   } catch (error) {
  //     console.error("Error fetching books:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchBooks();
  // }, []);

  const dispatch = useDispatch<AppDispatch>();
  const bookss = useSelector((state: RootState) => state.adminSlice.book);

  useEffect(() => {
    dispatch(fetchBook());
  }, [dispatch]);
  useEffect(() => {
    console.log("Fetched books from Redux:", bookss);
  }, [bookss]);

  //search logic
  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredBooks = bookss
    ?.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery) ||
        book.isbn.includes(searchQuery)
    )
    .sort((a, b) => {
      const aMatch =
        a.title.toLowerCase().includes(searchQuery) ||
        a.author.toLowerCase().includes(searchQuery) ||
        a.isbn.includes(searchQuery);
      const bMatch =
        b.title.toLowerCase().includes(searchQuery) ||
        b.author.toLowerCase().includes(searchQuery) ||
        b.isbn.includes(searchQuery);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

  const handleAddBookToggle = () => {
    setIsFormOpen(!isFormOpen);
    setIsEditing(false);
    setNewBook({
      id: 0,
      title: "",
      author: "",
      isbn: "",
      quantity: 0,
      status: "Available",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: name === "quantity" ? parseInt(value) : value,
    });
  };

  const handleAddBook = async () => {
    //     const result = bookSchema.safeParse(newBook);
    // //agr condition fullfill nhi hogi , then alert
    //     if (!result.success) {
    //       alert(result.error.errors.map((err) => err.message).join(", "));
    //       return;
    //     }

    // const bookData = { ...newBook, id: undefined };
    try {
      // const response = await fetch("http://localhost:3001/books", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(bookData),
      // });

      // if (response.ok) {
      //   dispatch(fetchBook()); // Refresh book list
      //   setIsFormOpen(false);
      //   setNewBook({
      //     id: 0,
      //     title: "",
      //     author: "",
      //     isbn: "",
      //     quantity: 0,
      //     status: "Available",
      //   });
      // }

      const resultAction = await dispatch(addBook(newBook)).unwrap();
      alert("Book added successfully!");
      setIsFormOpen(false);
      setNewBook({
        id: 0,
        title: "",
        author: "",
        isbn: "",
        quantity: 0,
        status: "Available",
      });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleUpdateBook = async () => {
    if (!currentBookId) {
      console.error("Error: No book ID provided for update.");
      alert("Error: No book selected for update.");
      return;
    }
    
    try {
      // const response = await fetch(
      //   `http://localhost:3001/books/${currentBookId}`,
      //   {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(newBook), // Send updated book
      //   }
      // );

      // if (response.ok) {
      //   dispatch(fetchBook());
      //   setIsFormOpen(false);
      //   setIsEditing(false);
      //   setCurrentBookId(null);
      //   alert("Book updated");
      // }

      const updatedBook = {
        ...newBook, // Assuming newBook contains the updated values
        id: currentBookId, // Ensure the correct ID is passed
      };
      

      await dispatch(updateBook({ bookId: currentBookId, updatedBook })).unwrap();

      alert("Book updated");
      setIsFormOpen(false);
      setIsEditing(false);
      setCurrentBookId(null);
    } catch (error: any) {
      console.error("An error occurred:", error);
      alert(error?.message || "Failed to update the book. Please try again.");
    }
    
  
  };


  const handleCancel = () => {
    setNewBook({
      id: 0,
      title: "",
      author: "",
      isbn: "",
      quantity: 0,
      status: "Available",
    });
    setIsFormOpen(false);
    setIsEditing(false);
  };

  const handleEditBook = (book: Book) => {
    setNewBook(book);
    setIsFormOpen(true); //form open
    setIsEditing(true);
    setCurrentBookId(book.id);
  };
  const handleDeleteBook = async (id: number) => {
    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete this book?"
    // );
    // if (!confirmDelete) return;
    // try {
    //   const response = await fetch(`http://localhost:3001/books/${id}`, {
    //     method: "DELETE",
    //   });

    //   if (response.ok) {
    //     setBooks(books.filter((book) => book.id !== id));
    //     alert("Book deleted successfully");
    //   }

    // } 
 dispatch(deleteBook(id))
 dispatch(fetchBook());
  };

  //form open of issue button
  const handleIssueBookClick = (book: Book) => {
    setIssueDetails({
      bookName: book.title,
      ISBN: book.isbn,
      issueDate: new Date().toISOString().split("T")[0], // Current Date
      dueDate: "",
    });
    setIsIssueFormOpen(true);
  };

  //user search for issueing-book
  const [userSearchQuery, setUserSearchQuery] = useState(""); 
  const [searchedUser, setSearchedUser] = useState<{
    id: number;
    fullName: string;
  } | null>(null); // Stores matched user

  const handleUserSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setUserSearchQuery(query);

    if (!query) {
      setSearchedUser(null); // Reset if input is empty
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/user");
      const users = await response.json();
      console.log(users);

      const foundUser = users.find((user: { fullName: string }) =>
        user.fullName.toLowerCase().includes(query)
      );

      if (foundUser) {
        setSearchedUser(foundUser);
      } else {
        setSearchedUser(null);
      }
    } catch (error) {
      console.error("Error searching user:", error);
    }
  };

  //if the user exists the book detail and user will store in the db.json/issue-books
  const handleIssueBook = async () => {
    if (!searchedUser) {
      alert("You have to create the account first!");
      return;
    }
                              
    // Find the book in the list
    const bookToIssue = books.find((book) => book.isbn === issueDetails.ISBN);

    if (!bookToIssue) {
      alert("Book not found!");
      return;
    }

    if (bookToIssue.quantity <= 0) {
      alert("Book is out of stock!");
      return;
    }

    const issueData = {
      userId: searchedUser.id,
      userName: searchedUser.fullName,
      bookName: issueDetails.bookName,
      ISBN: issueDetails.ISBN,
      issueDate: issueDetails.issueDate,
      dueDate: issueDetails.dueDate,
    };

    try {
      // Issue book (store in issue-books)
      const response = await fetch("http://localhost:3001/issue-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        // Reduce book quantity by 1
        const updatedQuantity = bookToIssue.quantity - 1;

        await fetch(`http://localhost:3001/books/${bookToIssue.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...bookToIssue, quantity: updatedQuantity }),
        });

        alert("Book issued successfully!");
        setIsIssueFormOpen(false);
        setUserSearchQuery(""); // Reset search input
        setSearchedUser(null);
        dispatch(fetchBook()); // Refresh book list
      }
    } catch (error) {
      console.error("Error issuing book:", error);
    }
  };

  //Navigate to the user-screen
  const router = useRouter();
  const handleUserNavigation = () => {
    router.push(AUTH_ROUTES.USER_DETAILS);
  };

  // filtered users from the dropdown of the search input field
  // const[filteredUser, setFilteredUser] = useState([])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Book Management Screen</h1>
      <button
        onClick={handleAddBookToggle}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all mb-4"
      >
        Add Book
      </button>

      <input
        className="w-max px-4 py-2 border rounded-lg mb-4 mr-4 gap-2 "
        type="text"
        placeholder="Search by name, Author,ISBN"
        value={searchQuery}
        onChange={handleSearch}
      />

      <button
        onClick={handleUserNavigation}
        className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-all mb-4 fixed top-4 right-4"
      >
        See All Users
      </button>

      {/* add book form validation via zod */}

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Book" : "Add New Book"}
            </h2>
            <form>
              <label className="block mb-2">
                Title:
                <input
                  type="text"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />
              </label>
              <label className="block mb-2">
                Author:
                <input
                  type="text"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />
              </label>
              <label className="block mb-2">
                ISBN:
                <input
                  type="text"
                  name="isbn"
                  value={newBook.isbn}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />
              </label>
              <label className="block mb-4">
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={newBook.quantity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />
              </label>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleUpdateBook}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                  >
                    Update Book
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddBook}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                  >
                    Add Book
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {isIssueFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Issue Book</h2>
            <form>
              <label className="block mb-2">
                {/* user search  Input*/}
                Select User:
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                  placeholder="Search user by name"
                  value={userSearchQuery}
                  onChange={handleUserSearch}
                />
              </label>
              {/* Show Found User */}
              {searchedUser ? (
                <p className="text-green-600 mb-4">
                  Selected: {searchedUser.fullName}
                </p>
              ) : (
                userSearchQuery && (
                  <p className="text-red-600 mb-4">
                    User not found! Please create an account.
                  </p>
                )
              )}

              <label className="block mb-2">
                Book Name:
                <input
                  type="text"
                  name="bookName"
                  value={issueDetails.bookName}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg mb-4 bg-gray-100"
                />
              </label>
              <label className="block mb-2">
                Book ID (ISBN):
                <input
                  type="text"
                  name="bookId"
                  value={issueDetails.ISBN}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg mb-4 bg-gray-100"
                />
              </label>
              <label className="block mb-2">
                Issue Date:
                <input
                  type="date"
                  name="issueDate"
                  value={issueDetails.issueDate}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg mb-4 bg-gray-100"
                />
              </label>
              <label className="block mb-2">
                Due Date:
                <input
                  type="date"
                  name="dueDate"
                  value={issueDetails.dueDate}
                  onChange={(e) =>
                    setIssueDetails({
                      ...issueDetails,
                      dueDate: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />
              </label>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsIssueFormOpen(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                  onClick={handleIssueBook}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Author</th>
              <th className="border px-4 py-2">ISBN</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.author}</td>
                <td className="border px-4 py-2">{book.isbn}</td>
                <td className="border px-4 py-2">{book.quantity}</td>
                <td className="border px-4 py-2">{book.status}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="bg-yellow-500 gap-2 text-white px-6 py-2 rounded-lg transition-all mb-2 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg transition-all mb-2 mr-4"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      handleIssueBookClick(book);
                    }}
                    className="bg-green-500 gap-2 text-white px-6 rounded-lg py-2 transition-all mb-2"
                  >
                    Issue
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
