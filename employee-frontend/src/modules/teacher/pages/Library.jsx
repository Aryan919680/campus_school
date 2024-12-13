import { useState } from "react"
import BookForm from "../components/Library/BookForm"
import BookTable from "../components/Library/BookTable"

const Library = () => {

  const [refresh, setRefresh] = useState(false)

  return (
    <div className="w-full mx-6 md:mr-0">
      <div className="w-full flex justify-between align-bottom my-4">
      <h1 className="text-3xl font-bold">Library</h1>
        <BookForm setRefresh={setRefresh}/>
      </div>
      <BookTable refresh={refresh} setRefresh={setRefresh}/>
    </div>
  )
}

export default Library
