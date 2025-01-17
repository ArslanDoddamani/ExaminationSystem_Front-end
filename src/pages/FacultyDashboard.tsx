import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Fixed the import
import { Faculty } from "../services/api";

export default function FacultyDashboard() {
    const [activeTab, setActiveTab] = useState("main"); // Tracks the active tab
    const [facultyDetails, setFacultyDetails] = useState(null);
    const [students, setStudents] = useState(null);

    useEffect(() => {
        async function fetchDetails(facultyId) {
            try {
                const res = await Faculty.getProfile(facultyId);
                setFacultyDetails(res.data);
                setStudents(res.data.students);
            } catch (error) {
                console.error("Error fetching faculty details:", error);
            }
        }

        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const decode = jwtDecode(token);
        const facultyId = decode.facultyId;

        fetchDetails(facultyId);
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const handleButton = async (usn, subCode, status) => {
        const isConfirmed = window.confirm(`Are you sure you want to mark this student as ${status}?`);
        if (!isConfirmed) return;

        setIsLoading(true); // Start loading
        try {
            const res = await Faculty.updateStatus({
                facultyId: facultyDetails?._id,
                usn,
                subCode,
                status
            });
            if (res.data.success) {
                alert("The status has been updated successfully.");
                setStudents((prevStudents) =>
                    prevStudents.map((student) =>
                        student.usn === usn && student.subCode === subCode
                            ? { ...student, status }
                            : student
                    )
                );
            }
        } catch (error) {
            console.error("Error updating student status:", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Filter students based on the active tab
    const filteredStudents = students?.filter((student) => {
        if (activeTab === "main") return student.status === "Pending";
        if (activeTab === "passed") return student.status === "Passed";
        if (activeTab === "failed") return student.status === "Failed";
        return false;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            {/* Faculty Details */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
                <p>
                    <span className="font-semibold">Name:</span> {facultyDetails?.name}
                </p>
                <p>
                    <span className="font-semibold">Email:</span> {facultyDetails?.email}
                </p>
                <p>
                    <span className="font-semibold">Department:</span> {facultyDetails?.department}
                </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "main"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    onClick={() => setActiveTab("main")}
                >
                    Main
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "passed"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    onClick={() => setActiveTab("passed")}
                >
                    Passed
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "failed"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    onClick={() => setActiveTab("failed")}
                >
                    Failed
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
                <table className="table-auto w-full border-collapse border border-gray-700 text-sm md:text-base">
                    <thead>
                        <tr className="bg-gray-700 text-gray-200">
                            <th className="border border-gray-700 px-4 py-2">USN</th>
                            <th className="border border-gray-700 px-4 py-2">Name</th>
                            <th className="border border-gray-700 px-4 py-2">Semester</th>
                            <th className="border border-gray-700 px-4 py-2">Subject Code</th>
                            <th className="border border-gray-700 px-4 py-2">Subject Name</th>
                            {activeTab === "main" && (
                                <th className="border border-gray-700 px-4 py-2">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents?.length > 0 ? (
                            filteredStudents.map((student, index) => (
                                <tr
                                    key={index}
                                    className="text-center hover:bg-gray-700 transition duration-200"
                                >
                                    <td className="border border-gray-700 px-4 py-2">
                                        {student?.usn}
                                    </td>
                                    <td className="border border-gray-700 px-4 py-2">
                                        {student?.name}
                                    </td>
                                    <td className="border border-gray-700 px-4 py-2">
                                        {student?.semester}
                                    </td>
                                    <td className="border border-gray-700 px-4 py-2">
                                        {student?.subCode}
                                    </td>
                                    <td className="border border-gray-700 px-4 py-2">
                                        {student?.subName}
                                    </td>
                                    {activeTab === "main" && (
                                        <td className="border border-gray-700 px-4 py-2">
                                            <div className="flex space-x-2 justify-center">
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                                                    onClick={() => handleButton(student?.usn, student?.subCode, "Passed")}
                                                >
                                                    Pass
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                                    onClick={() => handleButton(student?.usn, student?.subCode, "Failed")}
                                                >
                                                    Fail
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={activeTab === "main" ? 6 : 5}
                                    className="text-center py-4"
                                >
                                    {activeTab === "main"
                                        ? 'No students have registered yet.'
                                        : activeTab === "passed"
                                            ? 'No students have passed yet.'
                                            : 'No students have failed yet.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
