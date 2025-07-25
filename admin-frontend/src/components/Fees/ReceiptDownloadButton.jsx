import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReceiptDocument from "./ReceiptDocument";

export default function ReceiptDownloadButton({ receipt, onDownloaded }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    // Wait a bit before calling onDownloaded to allow file to start downloading
    setTimeout(() => {
      onDownloaded?.(); // trigger parent reset
    }, 1000);
  };

  return (
    <div onClick={handleClick}>
      <PDFDownloadLink
        document={<ReceiptDocument receipt={receipt} />}
        fileName={`receipt_${receipt.receiptNo || "payment"}.pdf`}
      className="inline-block bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-600 transition duration-300"
      >
        {({ loading }) => (loading ? "Preparing PDF..." : "Download Receipt")}
      </PDFDownloadLink>
    </div>
  );
}
