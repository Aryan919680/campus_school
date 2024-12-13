import { Button } from "@/components/ui/button";
import { BadgeIndianRupee } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/auth/context/AuthContext";
import paidImage from "@/assets/images/paid.png"; // Adjust the path based on your project structure

const FeesDetails = () => {
  const { data } = useContext(AuthContext);
  const studentID = data.id;
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/payment/student/${studentID}`);
        const paymentData = response.data.data.payment;
        setPayments(paymentData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPayments();
  }, [studentID]);

  const fetchPaymentDetails = async (paymentID) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/payment/status/${paymentID}`);
      setPaymentDetails(response.data.data);
      setSidebarOpen(true);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const handleViewDetails = (paymentID) => {
    fetchPaymentDetails(paymentID);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setPaymentDetails(null);
  };

  return (
    <div className="fees w-11/12 max-w-screen-lg flex flex-col gap-6 items-center p-6 relative">
      <div className="flex gap-2 text-3xl font-bold items-center">
        <BadgeIndianRupee className="text-primary-foreground size-12" /> Fee Details
      </div>
      <div className={`flex flex-wrap justify-center gap-6 ${payments.length === 1 ? 'w-full justify-center' : ''}`}>
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment.id}
              className={`bg-white py-10 px-6 rounded-xl shadow-lg ${payments.length === 1 ? 'w-full sm:w-96' : 'w-full sm:w-5/12'} relative ${payment.status === "paid" ? "bg-[url('/src/assets/images/paid.png')] bg-center bg-no-repeat bg-opacity-10" : ""}`}
            >
              <div className="py-6 bg-primary text-center rounded-t-lg px-10">
                <h1 className="text-4xl font-bold text-primary-foreground">{payment.title}</h1>
                <p className="text-xl font-bold">{payment.description || "No description available"}</p>
              </div>
              <ul className="mt-8 flex flex-col gap-3">
                <li className="flex gap-10 justify-between text-xl font-semibold">
                  <p>Amount</p>
                  <p>₹{payment.amount}</p>
                </li>
                <li className="flex gap-10 justify-between text-xl font-semibold">
                  <p>Transaction ID</p>
                  <p>{payment.localTransactionId || "N/A"}</p>
                </li>
                <li className="flex gap-10 justify-between text-xl font-semibold">
                  <p>Status</p>
                  <p>{payment.status}</p>
                </li>
                <li className="flex gap-10 justify-between text-xl font-semibold">
                  <p>Created At</p>
                  <p>{new Date(payment.created_at).toLocaleDateString()}</p>
                </li>
              </ul>
              <div className="mt-6 flex justify-center">
                {payment.status === "paid" ? (
                  <Button onClick={() => handleViewDetails(payment.id)}>View Details</Button>
                ) : (
                  <Button>Proceed</Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-2xl font-semibold">Loading...</div>
        )}
      </div>
      {sidebarOpen && paymentDetails && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 overflow-auto z-50">
          <button className="absolute top-4 right-4 text-2xl" onClick={handleCloseSidebar}>&times;</button>
          <h2 className="text-3xl font-bold mb-4">Payment Details</h2>
          <ul className="flex flex-col gap-3">
            <li className="text-xl">
              <strong>Amount:</strong> ₹{paymentDetails.paymentdetails[0].amount}
            </li>
            <li className="text-xl">
              <strong>Status:</strong> {paymentDetails.paymentdetails[0].status}
            </li>
            <li className="text-xl">
              <strong>Description:</strong> {paymentDetails.paymentdetails[0].description}
            </li>
            <li className="text-xl">
              <strong>Created At:</strong> {new Date(paymentDetails.paymentdetails[0].created_at).toLocaleDateString()}
            </li>
            <li className="text-xl">
              <strong>Updated At:</strong> {new Date(paymentDetails.paymentdetails[0].updated_at).toLocaleDateString()}
            </li>
            <li className="text-xl">
              <strong>Message:</strong> {paymentDetails.paymentdetails[0].message}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeesDetails;
