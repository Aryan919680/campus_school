import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import { toast } from "react-hot-toast";

const LeaveRequest = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const campusId = localStorage.getItem("campusId");
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !reason) {
    //   toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://webiosis-backend-asg-1-265896457.ap-south-1.elb.amazonaws.com/api/v1/leave/campus/${campusId}/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ from: fromDate, to: toDate, reason }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // toast.success("Leave request submitted successfully");
        setFromDate("");
        setToDate("");
        setReason("");
      } else {
        throw new Error(data.message || "Failed to submit leave request");
      }
    } catch (error) {
    //   toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Request Leave</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">From Date:</label>
        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">To Date:</label>
        <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Reason:</label>
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason for leave" />
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Leave Request"}
      </Button>
    </div>
  );
};

export default LeaveRequest;