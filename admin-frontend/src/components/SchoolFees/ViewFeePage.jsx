
import { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
// import ReceiptDownloadButton from "./ReceiptDownloadButton";
export default function ViewFeePage() {
  const [filters, setFilters] = useState({
  search: "",
  course: "All Courses",
  semester: "All Semesters",
  category: "All Categories",
  status: "All Statuses",
});
const [selectedCategory, setSelectedCategory] = useState("All Categories");
const [selectedStatus, setSelectedStatus] = useState("All Statuses");

    const [receiptData, setReceiptData] = useState(null);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
   const [classes, setClasses] = useState([]);
   const [subClasses, setSubClasses] = useState([]);
   const [selectedClass, setSelectedClass] = useState("");
   const [selectedSubClass, setSelectedSubClass] = useState("");
 const [selectedReceiptRecordId, setSelectedReceiptRecordId] = useState(null);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.FETCH_CLASS(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setClasses(data.data.class);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);

    // Find and update the subclasses dropdown
    const selectedClassObj = classes.find((cls) => cls.classId === selectedClassId);
    setSubClasses(selectedClassObj ? selectedClassObj.subClass : []);
    setSelectedSubClass(""); // Reset subclass selection
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) getStudents();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

useEffect(() => {
  if (selectedClass || selectedSubClass  || selectedCategory || selectedStatus) {
    fetchFeeRecords(searchTerm);
  }
}, [selectedClass, selectedSubClass, selectedCategory, selectedStatus]);

  const getStudents = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_STUDENTS_DATA(), {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm },
      });
      setStudents(response.data.data);
    } catch (error) {
      console.error("Failed to fetch students.", error);
    }
  };

const fetchFeeRecords = async (studentName = "") => {
  setLoading(true);
  try {
    const response = await axios.get(API_ENDPOINTS.FEES_SUMMARY(), {
      headers: { Authorization: `Bearer ${token}` },
     params: {
  studentName: studentName || filters.search,
  // departmentIds: selectedDepartment || undefined,
  // courseIds: selectedCourse || undefined,
  // semesterIds: selectedSemester || undefined,
  category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
  status: selectedStatus !== "All Statuses" ? selectedStatus : undefined,
}

    });

    setFeeRecords(response.data.data || []);
  } catch (error) {
    console.error("Error fetching fee records:", error);
    setFeeRecords([]);
  } finally {
    setLoading(false);
  }
};

const handleGenerateReceipt = async (record) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.GET_PAYMENT_FEES()}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { name: record.studentName },
    });
    const payments = response.data[0].payments;
    const fees =  response.data[0].fees;
    const feeSummary = response.data[0].feeSummary;
    // Group payments by feesId to calculate total paid so far (oldPaid)
    const oldPaidMap = {};
    payments.forEach(p => {
      if (!oldPaidMap[p.feesId]) oldPaidMap[p.feesId] = 0;
      oldPaidMap[p.feesId] += p.paidAmount;
    });

    // Get the latest payments (assumes sorted by createdAt ascending, reverse if needed)
    const latestPayments = payments.slice(-3); // or filter based on a timestamp or condition

    const updatedFees = latestPayments.map(fee => {
      const fullFee = fees.find(f => f.feesId === fee.feesId);
      const totalPaidForFee = oldPaidMap[fee.feesId] || 0;

      return {
        name: fullFee?.name || "Fee",
        oldPaid: totalPaidForFee - fee.paidAmount,
        newPaid: totalPaidForFee,
        due: fee.dueAmount,
      };
    });

    const receipt = {
      receiptNo: record.receiptNo || "RCPT-XXXXXX",
      student: {
        name: record.studentName || "Student",
        id: record.studentId,
        course: record.courseName || "-",
        semester: record.semesterName || "-",
      },
      breakdown: updatedFees,
      summary: {
        discountLabel: `${record.discount}`,
        amountReceived: feeSummary[0].totalPaid,
        paymentMode: response.data.payment?.paymentMode || "Online",
        totalPaid: feeSummary[0].totalFee,
        totalDue: feeSummary[0].remainingDue
      },
    };

    setReceiptData(receipt);
    setSelectedReceiptRecordId(record.studentId);
  } catch (error) {
    console.error("Error generating receipt:", error);
  }
};


  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">View Fee Records</h2>

      {/* Filters */}
      <div className="flex  gap-2 mb-6">

        <div className="mb-4 w-[250px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Student..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
              🔍
            </span>
          </div>

          {showSuggestions && students.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-60 overflow-y-auto rounded-md mt-1 shadow">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(student);
                    setSearchTerm(student.name);
                    setShowSuggestions(false);
                    fetchFeeRecords(student.name); 
                  }}
                >
                  {student.name} - {student.departmentName} , {student.courseName}, {student.semesterName}
                </li>

              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2 ">
          <select onChange={handleClassChange} value={selectedClass}>
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setSelectedSubClass(e.target.value)}
              value={selectedSubClass}
              disabled={!selectedClass}
            >
              <option value="">Select Subclass</option>
              {subClasses.map((subCls) => (
                <option key={subCls.subClassId} value={subCls.subClassId}>
                  {subCls.subClassName}
                </option>
              ))}
            </select>
          <select
  onChange={(e) => {
    setSelectedCategory(e.target.value);
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  }}
  value={selectedCategory}
>
  <option>All Categories</option>
  <option>GENERAL</option>
  <option>SC</option>
  <option>BC</option>
  <option>ST</option>
</select>

<select
  onChange={(e) => {
    setSelectedStatus(e.target.value);
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  }}
  value={selectedStatus}
>
  <option>All Statuses</option>
  <option>FULLY PAID</option>
  <option>PARTIALLY PAID</option>
   <option>NOT PAID</option>
</select>

        </div>
      </div>

      {/* Fee Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : feeRecords.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No records found.</div>
        ) : (
          <table className="min-w-full border divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left font-medium">
              <tr>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Student ID</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Semester</th>
                <th className="px-4 py-2">Total Fee (₹)</th>
                <th className="px-4 py-2">Paid (₹)</th>
                <th className="px-4 py-2">Due (₹)</th>
                <th className="px-4 py-2">Receipt No.</th>
                <th className="px-4 py-2">Last Payment</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feeRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-2">{record.studentName}</td>
                  <td className="px-4 py-2">{record.studentId}</td>
                  <td className="px-4 py-2">{record.courseName}</td>
                  <td className="px-4 py-2">{record.semesterName}</td>
                  <td className="px-4 py-2">{record.totalFee}</td>
                  <td className="px-4 py-2">{record.totalPaid}</td>
                  <td className="px-4 py-2">{record.totalDue}</td>
                  <td className="px-4 py-2">{record.receiptNo}</td>
                  <td className="px-4 py-2">{(record.lastPayment)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${record.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {record.status}
                    </span>
                  </td>
              
                     <td className="px-4 py-2">
  {/* {selectedReceiptRecordId === record.studentId ? (
    <ReceiptDownloadButton
   
      receipt={receiptData}
      onDownloadComplete={() => {
        setReceiptData(null);
        setSelectedReceiptRecordId(null);
      }}
    />
  ) : (
    <button
      onClick={() => handleGenerateReceipt(record)}
      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
      Generate Receipt
    </button>
  )} */}
</td>

                        
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

