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
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
  },
  bold: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    paddingVertical: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
  },
  cell: {
    width: "33.33%", 
    textAlign: "left",
    paddingHorizontal: 4,
    fontSize: 11,
  },
  headerCell: {
    width: "33.33%",
    fontWeight: "bold",
    textAlign: "left",
    paddingHorizontal: 4,
    fontSize: 11,
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
          <Text>Class: {student.course}</Text>
          <Text>Section: {student.semester}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Fee Breakdown</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Fee Head</Text>
            <Text style={styles.headerCell}>Month</Text>
            <Text style={styles.headerCell}>Paid</Text>
            <Text style={styles.headerCell}>Due Amount</Text>
          </View>
          {breakdown.map((fee, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.cell}>{fee.name}</Text>
              <Text style={styles.cell}>{fee.month}</Text>
              <Text style={styles.cell}>Rs. {fee.newPaid}</Text>
              <Text style={styles.cell}>Rs. {fee.due}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Payment Summary</Text>
          <Text>Amount Received: Rs. {summary.amountReceived}</Text>
          <Text>Total Paid: Rs. {summary.totalPaid}</Text>
          <Text>Total Due: Rs. {summary.totalDue}</Text>
          {/* <Text>Discount: Rs. {summary.discountLabel}</Text> */}
          <Text>Payment Mode: {summary.paymentMode}</Text>
        </View>

        <Text style={{ marginTop: 20 }}>Thank you for your payment.</Text>
      </Page>
    </Document>
  );
};

export default ReceiptDocument;
