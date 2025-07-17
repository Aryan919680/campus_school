import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReceiptDocument from "./ReceiptDocument";

export default function ReceiptDownloadButton({ receipt }) {
  return (
    <PDFDownloadLink
      document={<ReceiptDocument receipt={receipt} />}
      fileName={`receipt_${receipt.receiptNo || "payment"}.pdf`}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      {({ loading }) => (loading ? "Preparing PDF..." : "Download Receipt")}
    </PDFDownloadLink>
  );
}
