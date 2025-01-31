'use client';
import { useEffect, useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  quantity: string;
  status: string;
}

const AdminDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const[searchQuery, setSearchQuery] = useState('')
  const [newBook, setNewBook] = useState<Book>({
    id: 0,
    title: '',
    author: '',
    isbn: '',
    quantity: '',
    status: 'Available',
  });

  const [books, setBooks] = useState<Book[]>([]);


  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3001/books');
      const data: Book[] = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  //search logic
  const handleSearch = (e:any) =>{
    setSearchQuery(e.target.value.toLowerCase());

  }

  const filteredBooks = books
  .filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.isbn.includes(searchQuery)
  )
  .sort((a, b) => {
    const aMatch = a.title.toLowerCase().includes(searchQuery) ||
      a.author.toLowerCase().includes(searchQuery) ||
      a.isbn.includes(searchQuery);
    const bMatch = b.title.toLowerCase().includes(searchQuery) ||
      b.author.toLowerCase().includes(searchQuery) ||
      b.isbn.includes(searchQuery);

    // If one book exactly matches the query, come upside
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0; // Keep the order if both match the same way
  });


  const handleAddBookToggle = () => {
    setIsFormOpen(!isFormOpen); 
    setIsEditing(false);
    setNewBook({ id: 0, title: '', author: '', isbn: '', quantity: '', status: 'Available' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: name === 'quantity' ? parseInt(value) : value });
  };

  const handleAddBook = async () => {
    const bookData = { ...newBook, id: undefined }; //by id: undefined , json-server automatically generates id to book 
  
    try {   
      const response = await fetch('http://localhost:3001/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
  
      if (response.ok) {
        fetchBooks(); // Refresh book list
        setIsFormOpen(false);
        setNewBook({ id: 0, title: '', author: '', isbn: '', quantity: '', status: 'Available' });
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };
  


  const handleUpdateBook = async () => {
    if (currentBookId === null) return; // Ensure  ID exists
  
    try {
      const response = await fetch(`http://localhost:3001/books/${currentBookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook), // Send updated book 
      });
  
      if (response.ok) {
        fetchBooks(); 
        setIsFormOpen(false);   
        setIsEditing(false); 
        setCurrentBookId(null); 
        alert('Book updated')
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }   
  };
  
  

  const handleCancel = () => {
    setNewBook({ id: 0, title: '', author: '', isbn: '', quantity: '', status: 'Available' });
    setIsFormOpen(false);
    setIsEditing(false);
  };

  const handleEditBook = (book:Book) =>{
    setNewBook(book);
    setIsFormOpen(true) //form open
    setIsEditing(true)
    setCurrentBookId(book.id)
  }
  const handleDeleteBook = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return; 
    try {
      const response = await fetch(`http://localhost:3001/books/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setBooks(books.filter(book => book.id !== id)); 
        alert('Book deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  
  

  
  
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Book Management Screen</h1>
      <button
        onClick={handleAddBookToggle}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all mb-4"
      >
       Add Book
      </button>
     
      
      <input className="w-max px-4 py-2 border rounded-lg mb-4 mr-4 gap-2 " type='text' placeholder='Search by name, Author,ISBN'
      value={searchQuery}
      onChange={handleSearch}
      />
     
      {isFormOpen && (  
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Book' : 'Add New Book'}
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
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
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
                  <button onClick={()=>handleEditBook(book)}
                    
                    className="bg-yellow-500 gap-2 text-white px-6 py-2 rounded-lg transition-all mb-4 mr-4"
                  >
                    Edit
                  </button>
                  <button onClick={()=>handleDeleteBook(book.id)}
 
  className="bg-red-500 text-white px-6 py-2 rounded-lg transition-all mb-4"
>
  Delete
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