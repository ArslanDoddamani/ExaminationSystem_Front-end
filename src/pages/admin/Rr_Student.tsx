import React, { useState, useEffect } from "react";

interface Payment {
    usn: string;
    name: string;
    subjectCode: string;
    faculty: string;
    type: string;
}

// Simulated backend data
const fetchPayments = async (): Promise<Payment[]> => {
    return [
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "N/A", type: "Semester 1 Registration fees", faculty: "NA" },
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "N/A", type: "ChallengeValuation", faculty: "NA" },
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "N/A", type: "ChallengeValuation", faculty: "NA" },
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "N/A", type: "ChallengeValuation", faculty: "NA" },
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "21UCS101C", type: "ChallengeValuation", faculty: "NA" },
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "N/A", type: "Reregister - F", faculty: "NA" },
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "21UCS204C", type: "Reregister - W", faculty: "NA" },
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "21UCS204C", type: "Reregister - W", faculty: "NA" },
        { usn: "2BA21CS022", name: "John Doe", subjectCode: "21UCS204C", type: "Reregister - W", faculty: "NA" },
    ];
};

const Rr_Student: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Simulate fetching data from the backend
        fetchPayments().then((data) => setPayments(data));
    }, []);

    const filteredPayments = payments.filter((payment) =>
        [payment.usn, payment.name, payment.subjectCode, payment.faculty, payment.type]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
            <h2 className="text-center text-3xl font-bold mb-8">Payment History</h2>

            {/* Search Bar */}
            <div className="w-full max-w-[90%] mb-4">
                <input
                    type="text"
                    placeholder="Search by USN, Name, Subject Code, Faculty, or Type"
                    className="w-full px-4 py-2 rounded bg-gray-800 text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Row Count */}
            <p className="text-gray-400 mb-4">
                Showing {filteredPayments.length} of {payments.length} rows
            </p>

            {/* Table */}
            <div className="w-full max-w-[90%] overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                    <thead className="bg-gray-800 text-gray-300">
                        <tr>
                            <th className="px-4 py-2 border border-gray-700">USN</th>
                            <th className="px-4 py-2 border border-gray-700">Name</th>
                            <th className="px-4 py-2 border border-gray-700">Subject Code</th>
                            <th className="px-4 py-2 border border-gray-700">Faculty</th>
                            <th className="px-4 py-2 border border-gray-700">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((payment, index) => (
                            <tr
                                key={index}
                                className={`${
                                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                } hover:bg-gray-600`}
                            >
                                <td className="px-4 py-2 border border-gray-700">{payment.usn}</td>
                                <td className="px-4 py-2 border border-gray-700">{payment.name}</td>
                                <td className="px-4 py-2 border border-gray-700">{payment.subjectCode}</td>
                                <td className="px-4 py-2 border border-gray-700">{payment.faculty}</td>
                                <td className="px-4 py-2 border border-gray-700">{payment.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Rr_Student;
