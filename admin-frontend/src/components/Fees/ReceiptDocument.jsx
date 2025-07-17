// components/ReceiptDocument.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    padding: 5,
    marginBottom: 5,
  },
  divider: {
    borderBottom: "1pt solid #ccc",
    marginVertical: 10,
  },
});

const ReceiptDocument = ({ receipt }) => {
  const { receiptNo, student, breakdown, summary } = receipt;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Payment Receipt</Text>

        <View style={styles.section}>
          <Text>Receipt No: {receiptNo}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Student Information</Text>
          <Text>Name: {student.name}</Text>
          <Text>ID: {student.id}</Text>
          <Text>Course: {student.course}</Text>
          <Text>Semester: {student.semester}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Fee Breakdown</Text>
          <View style={styles.tableHeader}>
            <Text>Fee Type</Text>
            <Text>Paid</Text>
            <Text>Due</Text>
          </View>
          {breakdown.map((fee, i) => (
            <View key={i} style={styles.row}>
              <Text>{fee.name}</Text>
              <Text>₹{fee.paid}</Text>
              <Text>₹{fee.due}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Payment Summary</Text>
          <Text>Amount Received: ₹{summary.amountReceived}</Text>
          <Text>Total Paid: ₹{summary.totalPaid}</Text>
          <Text>Total Due: ₹{summary.totalDue}</Text>
          <Text>Discount: {summary.discountLabel}</Text>
          <Text>Payment Mode: {summary.paymentMode}</Text>
        </View>

        <Text style={{ marginTop: 20 }}>Thank you for your payment.</Text>
      </Page>
    </Document>
  );
};

export default ReceiptDocument;
