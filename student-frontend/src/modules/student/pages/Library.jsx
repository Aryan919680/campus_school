import { LibraryBig } from "lucide-react";
import Subject from "../components/library/Subject";
import BookList from "../components/library/BookList";
import { useEffect, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import axios from "axios";

import { useContext} from "react";
import { AuthContext } from "@/auth/context/AuthContext";

const Subjects = [
  "Science",
  "Maths",
  "Social Science",
  "Computer Science",
  "Arts",
];

const Library = () => {
  const [filterSubs, setFilterSubs] = useState([]);
  const [notes, setNotes] = useState(true);
  const [bookList, setBookList] = useState([]);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([])
  
  const { data } = useContext(AuthContext);

  async function fetchBooks() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/library/fetch-books/${data.campusId}`
      );
      console.log(response.data.data);

      if (!response.data.data.length) {
        setError("no books to available");
      } else {
        setBookList(response.data.data);
        setSearchData(response.data.data);
      }
    } catch (err) {
      console.log(err);
      setError("error fetching data");
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(()=>{
    setSearchData(()=>bookList.filter((book)=>book.name.includes(search)))
  },[search])

  return (
    <div className="flex flex-col w-full gap-4 mx-10 my-6">
      <div className="heading flex gap-2 items-center text-3xl font-bold">
        <LibraryBig className="size-8" /> Library
      </div>
      <ToggleGroup
        type="single"
        defaultValue="notes"
        onValueChange={(value) => {
          console.log("Dwd");
          if (value == "notes") setNotes(true);
          else setNotes(false);
        }}
      >
        <ToggleGroupItem value="notes">Notes</ToggleGroupItem>
        <ToggleGroupItem value="books">Books</ToggleGroupItem>
      </ToggleGroup>
      <Input className="bg-white w-72" placeholder="search" onChange={(e)=>setSearch(e.target.value)}/>
      {notes ? (
        <div className="flex">
          <Subject
            Subjects={Subjects}
            filterSubs={filterSubs}
            setFilterSubs={setFilterSubs}
          />
          <BookList bookList={searchData} filterSubs={filterSubs} error={error}/>
        </div>
      ) : (
        <div>No Books till now</div>
      )}
    </div>
  );
};

export default Library;
