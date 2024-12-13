import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, LabelList } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MarksGraph = () => {
  const { data } = useContext(AuthContext);
  const [result, setResult] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchResult() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/results/campus/student/${data.id}`
      );
      if (response.data.data.results.length > 0) {
        setResult(response.data.data.results);
        setSubject(response.data.data.results[0]);
      } else {
        setError("No result to show");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Error fetching data");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResult();
  }, []);

  return (
    <div
      className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto"
      style={{ maxHeight: "50px", maxWidth: "600px" }} // Set a maximum height
    >
      <ResponsiveContainer width="100%" height={250}> {/* Reduce chart height */}
        <BarChart data={result} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
          <Bar
            dataKey="scoredMarks"
            fill="#000000"
            onClick={(e) => {
              console.log(e);
              setSubject(e);
            }}
          >
            <LabelList
              dataKey="subjectName"
              position="top"
              angle={0}
              fontSize={12}
              formatter={(value) => (value.length > 10 ? `${value.substring(0, 10)}...` : value)} // Truncate long subject names
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="w-full bg-black text-white p-4 mt-4 rounded-lg">
        {loading && <div className="text-center">Loading data...</div>}
        {error && <div className="text-center">{error}</div>}
        {!error && !loading && subject && (
          <>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <p className="text-4xl pb-6 ml-6 font-bold">{subject.scoredMarks}</p>
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-xl sm:text-lg md:text-xl text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                      {subject.subjectName} 
                    </p>
                    <p className="text-xl sm:text-lg md:text-xl text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                      teacher
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 ml-6">
                <h2 className="text-3xl font-medium pb-4">Feedback</h2>
                <p>{subject.feedback}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarksGraph;
