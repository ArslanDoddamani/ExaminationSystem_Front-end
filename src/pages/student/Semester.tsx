import React, { useEffect, useState } from "react";
import { student } from "../../services/api";
import { admin } from "../../services/api";
import { jwtDecode } from "jwt-decode";

const Semester = () => {
  const [subjects, setSubjects] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [usn, setUsn] = useState<string | null>("");

  // Check usn from local storage
  useEffect(() => {
    const storedUsn = localStorage.getItem("usn");
    setUsn(storedUsn);
  }, []);

  // Function to fetch registered subject details
  async function fetchRegisteredSubjects() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");
  
      const decode: any = jwtDecode(token);
      const userId = decode.userId;
  
      // Step 1: Fetch registered subject IDs and grades
      const res = await student.registeredsubjects(userId); // API returns {"subjects": [...]}
      const subjectIds = res.data.map((item: any) => item.subject);
      const grades = res.data.map((item: any) => item.grade);
      const flags = res.data.map((item: any) => item.flag)

  
      if (subjectIds.length === 0) {
        setSubjects([]); // No subjects registered
        return;
      }
  
      // Step 2: Fetch full details of each subject and add grades
      const subjectsData = await Promise.all(
        subjectIds.map(async (subjectId, index) => {
          const subjectDetails = await admin.FindSubject(subjectId);
          return {
            ...subjectDetails.data, // Include subject details
            grade: grades[index],  // Add corresponding grade
            flag: flags[index]
          };
        })
      );
      setSubjects(subjectsData); // Update subjects with grades
    } catch (error) {
      console.error("Error fetching registered subjects:", error);
    }
  }
  

  useEffect(() => {
    if (usn && usn !== "-1") {
      fetchRegisteredSubjects();
    }
  }, [usn]);

  // Sort the data based on the selected option
  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const option = event.target.value;
    setSortOption(option);

    const sortedSubjects = [...subjects].sort((a, b) => {
      if (option === "Credits") {
        return a.subject.credits - b.subject.credits;
      } else if (option === "Department") {
        return a.subject.department.localeCompare(b.subject.department);
      } else if (option === "Semester") {
        return a.subject.semester - b.subject.semester;
      }
      return 0;
    });

    setSubjects(sortedSubjects);
  }

  // Render the message if the USN is not assigned
  if (usn === "-1") {
    return (
      <div className="semester-container bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Registered Subjects</h1>
          <p className="text-xl text-gray-400">
            Your USN has not been assigned by the admin yet. Please contact the admin for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Render the semester details if the USN is valid
  return (
    <div className="semester-container bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Registered Subjects</h1>

      {/* If no subjects are registered */}
      {subjects.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-400">No subjects registered yet. Please register subjects to view them here.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-center">
            <label htmlFor="sort" className="mr-2 text-lg font-medium">
              Sort By:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="bg-gray-800 text-white p-2 rounded-lg shadow-md"
            >
              <option value="">Select an option</option>
              <option value="Credits">Credits</option>
              <option value="Department">Department</option>
              <option value="Semester">Semester</option>
            </select>
          </div>

          <table className="min-w-full table-auto border-collapse bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="py-2 px-4 text-left text-lg">Subject Code</th>
                <th className="py-2 px-4 text-left text-lg">Subject Name</th>
                <th className="py-2 px-4 text-left text-lg">Credits</th>
                <th className="py-2 px-4 text-left text-lg">Department</th>
                <th className="py-2 px-4 text-left text-lg">Semester</th>
                <th className="py-2 px-4 text-left text-lg">Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id} className="border-b border-gray-700">
                  <td className="py-2 px-4">{subject?.subject?.code}</td>
                  <td className="py-2 px-4">{subject?.subject?.name}</td>
                  <td className="py-2 px-4">{subject?.subject?.credits}</td>
                  <td className="py-2 px-4">{subject?.subject?.department}</td>
                  <td className="py-2 px-4">{subject?.subject?.semester}</td>
                  <td className="py-2 px-4">{subject.flag ? subject.grade : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Semester;
