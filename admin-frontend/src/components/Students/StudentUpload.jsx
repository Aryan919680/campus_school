import React, { useState } from "react";
import * as XLSX from "xlsx";

const StudentUpload = ({ onStudentsUpload }) => {
	const [students, setStudents] = useState([]);

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (event) => {
			const binaryStr = event.target.result;
			const workbook = XLSX.read(binaryStr, { type: "binary" });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const data = XLSX.utils.sheet_to_json(sheet);
			console.log("Uploaded Data:", data); // Log the data to verify
			onStudentsUpload(data);
		};
		reader.readAsBinaryString(file);
	};

	return (
		<div>
			<input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
			{students.length > 0 && (
				<table>
					<thead>
						<tr>
							{Object.keys(students[0]).map((key) => (
								<th key={key}>{key}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{students.map((student, index) => (
							<tr key={index}>
								{Object.values(student).map((value, i) => (
									<td key={i}>{value}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default StudentUpload;
