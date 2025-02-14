'use client';
import { useState, useEffect } from "react";

import issuebookSlice, { fetchBooks } from "@/store/slice/issuebookSlice";
import { AppDispatch,RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";




interface IssuedBook { 
    id: number;
    bookName: string;
    ISBN: string;
    userName: string;
    email: string;
    issueDate: string;
    dueDate: string;
  }
  


const IssueBook = () =>{

    // const [issuedBook, setIssuedBook] = useState<IssuedBook[]>([]);

    const dispatch : AppDispatch = useDispatch()

    const books = useSelector((state:RootState)=> state.issueBook.books)


//fetching the data from the db.json/issue-book

useEffect(()=>{
    // const fetchData = async()=>{ 
    //     const response= await fetch('http://localhost:3001/issue-book')
    //     const data = await response.json()
    //     setIssuedBook(data)
    // }; fetchData()
    dispatch(fetchBooks())
}, [dispatch])


    return(
        <div>
            <h1>Book Lending records</h1>
            <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Issued Books</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Book Name</th>
            <th className="border border-gray-300 px-4 py-2">ISBN</th>
            <th className="border border-gray-300 px-4 py-2">User</th>           
            <th className="border border-gray-300 px-4 py-2">Issue Date</th>
            <th className="border border-gray-300 px-4 py-2">Return Date</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{book.bookName}</td>
              <td className="border border-gray-300 px-4 py-2">{book.ISBN}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span className="font-medium">{book.userName}</span>
                <br />
                <span className="text-sm text-gray-500">{book.email}</span>
              </td>
              <td className="border border-gray-300 px-4 py-2">{book.issueDate}</td>
              <td className="border border-gray-300 px-4 py-2">{book.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
    )
}
export default IssueBook;