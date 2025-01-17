import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { student, admin } from "../../services/api";

interface Subject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
}

interface Grade {
  subjectCode: string;
  grade: string;
}

interface Student {
  _id: string;
  USN: number | string;
  name: string;
  department: string;
  dateOfBirth: number;
  email: string;
  phone: string;
  currentSemester: number;
  registeredSubjects: Subject[];
  grades: Grade[];
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await student.getStudents();
        setStudents(response.data.students); // Assuming response.data contains students
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  async function AddUsn(userId: string) {
    const usnInput = prompt("Enter the USN");

    if (!usnInput || usnInput.trim() === "") {
      alert("Invalid USN. Please enter a valid USN.");
      return;
    }

    const USN = usnInput.trim();

    try {
      const res = await admin.assignUSN(userId, USN);
      if (res.status === 200) {
        alert("USN assigned successfully");
        setStudents((prev) =>
          prev.map((student) =>
            student._id === userId ? { ...student, USN } : student
          )
        );
      } else {
        alert("Error while assigning USN");
      }
    } catch (error) {
      alert("An error occurred: " + error);
    }
  }

  async function DeleteStudent(studentId: string, name: string) {
    const confirmDelete = confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDelete) return;

    try {
      await student.deleteStudent(studentId); // Assuming this function exists in `admin` service
      alert(`${name} deleted successfully.`);
      setStudents((prev) => prev.filter((student) => student._id !== studentId));
    } catch (err) {
      alert("Error deleting student.");
    }
  }

  const redirectToSubjects = (studentId: string) => {
    navigate(`/admin/students/${studentId}/subjects`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value;
    setSortOption(option);

    const sortedStudents = [...students].sort((a, b) => {
      if (option === "USN") {
        return String(a.USN).localeCompare(String(b.USN));
      } else if (option === "Name") {
        return a.name.localeCompare(b.name);
      } else if (option === "Department") {
        return a.department.localeCompare(b.department);
      } else if (option === "Current Semester") {
        return a.currentSemester - b.currentSemester;
      }
      return 0;
    });

    setStudents(sortedStudents);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.USN.toString().toLowerCase().includes(searchQuery) ||
      student.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen py-6 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Student Details
      </h1>

      {/* Search and Sort Toolbar */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between bg-gray-800 p-4 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Search by USN or Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-gray-700 text-white p-2 rounded-lg shadow-md w-full md:w-1/3 mb-4 md:mb-0 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="bg-gray-700 text-white p-2 rounded-lg shadow-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">Sort By</option>
          <option value="USN">USN</option>
          <option value="Name">Name</option>
          <option value="Department">Department</option>
          <option value="Current Semester">Current Semester</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        {filteredStudents.length > 0 ? (
          <table className="w-full table-auto border-collapse bg-gray-800 rounded-lg shadow-lg">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 border border-gray-700">USN</th>
                <th className="p-4 border border-gray-700">Name</th>
                <th className="p-4 border border-gray-700">Department</th>
                <th className="p-4 border border-gray-700">Date of Birth</th>
                <th className="p-4 border border-gray-700">Email</th>
                <th className="p-4 border border-gray-700">Phone</th>
                <th className="p-4 border border-gray-700">Current Semester</th>
                <th className="p-4 border border-gray-700">Registered Subjects</th>
                <th className="p-4 border border-gray-700">Assign USN</th>
                <th className="p-4 border border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"
                  } hover:bg-gray-500 transition duration-150`}
                >
                  <td className="p-3 border border-gray-700 text-center">
                    {student.USN || "Not Assigned"}
                  </td>
                  <td className="p-3 border border-gray-700">{student.name}</td>
                  <td className="p-3 border border-gray-700">
                    {student.department}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="p-3 border border-gray-700">{student.email}</td>
                  <td className="p-3 border border-gray-700">{student.phone}</td>
                  <td className="p-3 border border-gray-700 text-center">
                    {student.currentSemester}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    <button
                      className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-lg shadow"
                      onClick={() => redirectToSubjects(student._id)}
                    >
                      View
                    </button>
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow"
                      onClick={() => AddUsn(student._id)}
                    >
                      Assign
                    </button>
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                      onClick={() => DeleteStudent(student._id, student.name)}
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
};

export default Students;
