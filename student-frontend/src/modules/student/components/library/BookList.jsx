import axios from "axios";
import { useEffect, useState } from "react";

const BookList = ({bookList, filterSubs, error }) => {
  // const [bookList, setBookList] = useState([]);
  // const [error, setError] = useState(false);

  // async function fetchBooks() {
  //   try {
  //     const response = await axios.get(
  //       "https://erp-system-backend.onrender.com/api/v1/library/fetch-books"
  //     );
  //     console.log(response.data.data);

  //     if (!response.data.data.length) {
  //       setError("no books to available");
  //     } else {
  //       setBookList(response.data.data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setError("error fetching data");
  //   }
  // }

  // useEffect(() => {
  //   fetchBooks();
  // }, []);

  return (
    <div className="flex flex-wrap justify-evenly">
      {error ? (
        <div>{error}</div>
      ) : (
        bookList.map((book) => {
          return (
            <div key={book.name}>
              <a href={book.file}>
                <img
                  src="assets/library/3.png"
                  className="h-80 mx-6 mt-6 mb-2"
                />
                <div className="text-center text-lg font-medium">
                  {book.name}
                </div>
              </a>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BookList;
