import React, { useEffect, useState } from "react";
import { admin } from "../../services/api";

// Define the type for a challenge evaluation record
interface ChallengeEvaluation {
  _id: string;
  USN: string;
  Name: string;
  SubjectCode: string;
  SubjectName: string;
  Semester: number;
  Type: string;
  Status: "Pending" | "Approved" | "Rejected"; // Enum for status values
  createdAt: string;
  updatedAt: string;
}

const Result: React.FC = () => {
  const [response, setResponse] = useState<ChallengeEvaluation[]>([]);
  const [semester, setSemester] = useState(0);
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<keyof ChallengeEvaluation>("USN");

  useEffect(() => {
    async function fetch() {
      try {
        const res = await admin.allchallengevaluations();
        if (Array.isArray(res.data)) {
          setResponse(res.data);
        }
      } catch (err) {
        alert("Error fetching data.");
      }
    }

    fetch();
  }, []);

  const handleStatusChange = (id: string, newStatus: ChallengeEvaluation["Status"]) => {
    setResponse((prev) =>
      prev.map((data) =>
        data._id === id ? { ...data, Status: newStatus } : data
      )
    );
  };

  const handleAction = async (id: string, action: ChallengeEvaluation["Status"]) => {
    try {
      const res = await admin.updateChallengeEvaluationStatus({id, action});
      if (res?.data?.success) {
        alert(`Status updated to ${action}`);
        handleStatusChange(id, action);
      } else {
        alert("Failed to update status. Try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Network error while updating status.");
    }
  };

  const handleLaunchResults = async () => {
    if (!semester || semester <= 0) {
      alert("Please select a valid semester before launching results.");
      return;
    }

    if (!date) {
      alert("Please select a valid closing date and time.");
      return;
    }

    const confirmLaunch = window.confirm(
      `Are you sure you want to launch the results for semester ${semester}?`
    );
    if (!confirmLaunch) return;

    try {
      const res = await admin.LaunchResult({ semester, date });
      if (res?.data?.students?.length > 0) {
        alert(`Results launched successfully for semester ${semester}!`);
      } else {
        alert(res?.data?.message || "Unexpected response.");
      }
    } catch (error) {
      console.error("Error launching results:", error);
      alert("Error launching results. Please try again.");
    }
  };

  // Filter and sort the response based on search term and sort option
  const filteredResponse = response
    .filter((data) =>
      [data.USN, data.Name, data.SubjectCode, data.Type]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortOption] < b[sortOption]) return -1;
      if (a[sortOption] > b[sortOption]) return 1;
      return 0;
    });

  // Count Pending, Approved, and Rejected statuses
  const statusCount = response.reduce(
    (count, data) => {
      if (data.Status === "Pending") count.pending++;
      if (data.Status === "Approved") count.approved++;
      if (data.Status === "Rejected") count.rejected++;
      return count;
    },
    { pending: 0, approved: 0, rejected: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Dropdown for Semester Selection, Date and Launch Button */}
      <div className="mb-6 flex items-center flex-wrap gap-4">
        <div className="flex items-center">
          <label htmlFor="semester" className="block text-lg font-semibold mb-2 mr-2">
            Select Semester:
          </label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(parseInt(e.target.value, 10))}
            className="form-select mt-1 block w-64 bg-gray-300 text-black border border-gray-700 rounded-lg py-2 px-4 shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="launchDate" className="block text-lg font-semibold mb-2 mr-2">
            Closing Date and Time:
          </label>
          <input
            id="launchDate"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input mt-1 block w-64 bg-gray-300 text-black border border-gray-700 rounded-lg py-2 px-4 shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
        </div>

        <button
          onClick={handleLaunchResults}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Launch Results
        </button>
      </div>

      {/* Search and Sort Section */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by USN, Name, Subject Code, Type"
            className="form-input bg-gray-300 text-black border border-gray-700 rounded-lg py-2 px-4 shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none w-96"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as keyof ChallengeEvaluation)}
            className="form-select bg-gray-300 text-black border border-gray-700 rounded-lg py-2 px-4 shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            <option value="USN">Sort by USN</option>
            <option value="Semester">Sort by Semester</option>
            <option value="Type">Sort by Type</option>
            <option value="Status">Sort by Status</option>
          </select>
        </div>

        <div className="flex gap-6 items-center">
          <div className="text-lg">Pending: {statusCount.pending}</div>
          <div className="text-lg">Approved: {statusCount.approved}</div>
          <div className="text-lg">Rejected: {statusCount.rejected}</div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Challenge Evaluation</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-500 text-left text-lg font-semibold">
              <th className="py-3 px-4 border-b border-gray-900">USN</th>
              <th className="py-3 px-4 border-b border-gray-900">Name</th>
              <th className="py-3 px-4 border-b border-gray-900">Subject Code</th>
              <th className="py-3 px-4 border-b border-gray-900">Subject Name</th>
              <th className="py-3 px-4 border-b border-gray-900">Semester</th>
              <th className="py-3 px-4 border-b border-gray-900">Type</th>
              <th className="py-3 px-4 border-b border-gray-900">Status</th>
              <th className="py-3 px-4 border-b border-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredResponse.map((data) => (
              <tr
                key={data._id}
                className={`${data.Status === "Approved"
                    ? "bg-green-800"
                    : data.Status === "Rejected"
                      ? "bg-red-800"
                      : "bg-gray-700"
                  } hover:bg-gray-500`}
              >
                <td className="py-3 px-4 border-b border-gray-900">{data.USN}</td>
                <td className="py-3 px-4 border-b border-gray-900">{data.Name}</td>
                <td className="py-3 px-4 border-b border-gray-900">{data.SubjectCode.trim()}</td>
                <td className="py-3 px-4 border-b border-gray-900">{data.SubjectName}</td>
                <td className="py-3 px-4 border-b border-gray-900">{data.Semester}</td>
                <td className="py-3 px-4 border-b border-gray-900">{data.Type}</td>
                {/* Status Column */}
                <td className="py-3 px-4 border-b border-gray-900">
                  <span className={`font-bold ${
                    data.Status === "Approved"
                      ? "text-green-500"
                      : data.Status === "Rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}>
                    {data.Status}
                  </span>
                </td>

                {/* Action Column */}
                <td className="py-3 px-4 border-b border-gray-900 flex gap-2">
                  <button
                    onClick={() => handleAction(data._id, "Approved")}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-1 px-3 rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(data._id, "Rejected")}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Result;
