import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { student, admin } from "../../services/api";

interface Subject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
  grade?: string; // Optional field for grade
}

const GRADE_OPTIONS = ["O", "A+", "A", "B+", "B", "C", "P", "F", "W"];

const StudentSubjects = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [grades, setGrades] = useState<{ [subjectId: string]: string }>({}); // Object to store grades for each subject

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the registered subject IDs
      const response = await student.registeredsubjects(studentId);
      const subjectIds = response.data.map((item) => item.subject);
      const gradesArray = response.data.map((item) => item.grade);
      const registerTypes = response.data.map((item) => item.registerType);

      // Fetch the full details for each subject ID
      const subjectDetails = await Promise.all(
        subjectIds.map(async (subjectId: string, index: number) => {
          try {
            const subjectResponse = await student.getSubjectWithId(subjectId);
            return {
              ...subjectResponse.data,
              grade: gradesArray[index], // Use gradesArray here
              type: registerTypes[index],

            };
          } catch (err) {
            console.error(`Error fetching subject with ID ${subjectId}:`, err);
            return null;
          }
        })
      );

      const validSubjects = subjectDetails.filter((subject) => subject !== null) as Subject[];
      setSubjects(validSubjects);

      // Initialize grades for each subject
      const initialGrades = validSubjects.reduce((acc, subject) => {
        acc[subject._id] = subject.grade || ""; // Use subject._id as the key
        return acc;
      }, {} as { [subjectId: string]: string });
      setGrades(initialGrades);
    } catch (err) {
      console.error("Error fetching registered subjects:", err);
      setError("Failed to fetch registered subjects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [studentId]);

  const handleGradeChange = (subjectId: string, gradePoint: string) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [subjectId]: gradePoint, // Update the grade for the specific subject
    }));
  };

  const handleSubmit = async (subjectId: string) => {
    const grade = grades[subjectId]; // Get the grade for the specific subject
    if (!grade) {
      alert("Please select a grade before submitting.");
      return;
    }

    try {
      console.log(studentId, subjectId, grade);
      await admin.addGrades(studentId, subjectId, grade); // Pass studentId, subjectId, and grade
      alert("Grade updated successfully.");
      fetchSubjects();
    } catch (error) {
      console.error("Failed to update grade:", error);
      alert("Failed to update grade. Please try again.");
    }
  };


  return (
    <div className="bg-gray-800 text-white min-h-screen py-6 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Registered Subjects
      </h1>

      {loading && <p className="text-center">Loading subjects...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && subjects.length === 0 && (
        <p className="text-center">No subjects found.</p>
      )}

      {!loading && !error && subjects.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-gray-700 rounded-lg shadow-lg">
            <thead className="bg-gray-900">
              <tr>
                <th className="p-3 border border-gray-600">Subject Name</th>
                <th className="p-3 border border-gray-600">Semester</th>
                <th className="p-3 border border-gray-600">Credits</th>
                <th className="p-3 border border-gray-600">Department</th>
                <th className="p-3 border border-gray-600">Type</th>
                <th className="p-3 border border-gray-600">Current Grade</th>
                <th className="p-3 border border-gray-600">New Grade</th>
                <th className="p-3 border border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.code} className="hover:bg-gray-600">
                  <td className="p-3 border border-gray-600">{subject.name}</td>
                  <td className="p-3 border border-gray-600">{subject.semester}</td>
                  <td className="p-3 border border-gray-600">{subject.credits}</td>
                  <td className="p-3 border border-gray-600">{subject.department}</td>
                  <td className="p-3 border border-gray-600">{subject.type}</td>
                  <td className="p-3 border border-gray-600">{subject.grade}</td>
                  <td className="p-3 border border-gray-600">
                    <select
                      value={grades[subject._id] || ""} // Use subject._id
                      onChange={(e) => handleGradeChange(subject._id, e.target.value)} // Use subject._id
                      className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                    >
                      <option value="">Select Grade</option>
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border border-gray-600">
                    <button
                      onClick={() => handleSubmit(subject._id)} // Use subject._id
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Submit Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentSubjects;
