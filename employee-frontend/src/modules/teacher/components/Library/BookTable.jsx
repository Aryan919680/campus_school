import { AuthContext } from "@/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

const BookTable = ({ refresh, setRefresh }) => {
  const [books, setBooks] = useState([]);
  const { data } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [error, setError] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      setError(false);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/library/fetch-books-byTeacher/${data.id}`
        );
        // console.log(response.data);
        if (response.data.success) {
          setBooks(response.data.data);
          setSearchData(response.data.data);
        }
      } catch (error) {
        setError(true);
        console.error(error);
      }
    }
    fetchBooks();
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    setSearchData(() =>
      books.filter((book) => book.name.includes(search) || book.subject.includes(search))
    );
  }, [search, books]);

  async function handleDelete() {
    if (!selectedBook) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/library/delete-book/${data.id}/${selectedBook.id}`
      );

      console.log(response.data);
      // Update state to remove the deleted book from the list
      setBooks(books.filter((book) => book.id !== selectedBook.id));
      setSearchData(searchData.filter((book) => book.id !== selectedBook.id));
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedBook(null); // Close the dialog after deletion
    }
  }

  return (
    <>
      <Input className="mb-4 bg-white w-72" placeholder="search" onChange={(e) => setSearch(e.target.value)} />
      <table className="w-full text-left bg-white rounded-xl shadow-lg">
        <thead>
          <tr className="text-lg font-medium text-gray-500 border-b-2">
            <th className="py-4 pl-6">Name</th>
            <th>Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchData && searchData.length ? (
            searchData.map((book) => (
              <tr key={book.id} className="text-xl font-medium border-b-2 hover:bg-slate-100">
                <td className="py-6 pl-6"><a href={book.file}>{book.name}</a></td>
                <td>{book.subject}</td>
                <td>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedBook(book)}>Delete</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          Do you really want to delete this book? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <Button onClick={handleDelete}>Confirm Delete</Button>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 text-xl font-medium">No books</td>
            </tr>
          )}
        </tbody>
      </table>
      {error && <div>Error fetching books</div>}
    </>
  );
};

export default BookTable;
