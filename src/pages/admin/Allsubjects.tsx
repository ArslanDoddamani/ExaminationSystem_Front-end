import { useEffect, useState } from "react";
import { admin } from "../../services/api";

export default function AllSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await admin.allSubjects();
        setSubjects(response.data);
      } catch (err) {
        alert("Error fetching subjects");
      }
    }

    fetchSubjects();
  }, []);

  async function DeleteSubject(subjectId: any, name: string) {
    const res = confirm(
      "Are you sure you want to delete the subject " + name + "?"
    );
    if (!res) return;

    try {
      await admin.DeleteSubject(subjectId);
      alert("Subject deleted successfully");
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject._id !== subjectId)
      );
    } catch (err) {
      alert("Error while deleting subject");
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);

    const sortedSubjects = [...subjects].sort((a, b) => {
      if (option === "Name") {
        return a.name.localeCompare(b.name);
      } else if (option === "Semester") {
        return a.semester - b.semester;
      } else if (option === "Department") {
        return a.department.localeCompare(b.department);
      } else if (option === "Credits") {
        return a.credits - b.credits;
      }
      return 0;
    });

    setSubjects(sortedSubjects);
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.code.toLowerCase().includes(searchQuery) ||
      subject.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Subjects</h1>

      {/* Search and Sort Options */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Subject Code or Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-gray-700 text-white p-2 rounded-lg shadow-md w-full md:w-1/3 mb-4 md:mb-0 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="bg-gray-700 text-white p-2 rounded-lg shadow-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">Sort By</option>
          <option value="Name">Subject Name</option>
          <option value="Semester">Semester</option>
          <option value="Department">Department</option>
          <option value="Credits">Credits</option>
        </select>
      </div>

      {/* Subjects Table */}
      <div className="overflow-x-auto">
        {filteredSubjects.length > 0 ? (
          <table className="w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-700 text-left text-sm font-semibold">
                <th className="p-3 border-b border-gray-600">Subject Code</th>
                <th className="p-3 border-b border-gray-600">Subject Name</th>
                <th className="p-3 border-b border-gray-600">Semester</th>
                <th className="p-3 border-b border-gray-600">Credits</th>
                <th className="p-3 border-b border-gray-600">Department</th>
                <th className="p-3 border-b border-gray-600">Registration</th>
                <th className="p-3 border-b border-gray-600">
                  Re-Registration (F)
                </th>
                <th className="p-3 border-b border-gray-600">
                  Re-Registration (W)
                </th>
                <th className="p-3 border-b border-gray-600">
                  Challenge Valuation
                </th>
                <th className="p-3 border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr
                  key={subject._id}
                  className="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600"
                >
                  <td className="p-3 border-b border-gray-700">{subject.code}</td>
                  <td className="p-3 border-b border-gray-700">{subject.name}</td>
                  <td className="p-3 border-b border-gray-700">
                    {subject.semester}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    {subject.credits}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    {subject.department}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    {subject.fees.registration}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    {subject.fees.reRegistrationF}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    {subject.fees.reRegistrationW}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    {subject.fees.challengeValuation}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                      onClick={() => DeleteSubject(subject._id, subject.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-400">No data available.</p>
        )}
      </div>
    </div>
  );
}
