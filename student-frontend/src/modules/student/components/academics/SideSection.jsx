import Assignments from "./Results"

const SideSection = ({setTotalGrade}) => {
  return (
    <div className="mx-6 shadow-xl rounded-3xl bg-white hidden md:inline">
        <Assignments setTotalGrade={setTotalGrade}/>
    </div>
  )
}

export default SideSection
