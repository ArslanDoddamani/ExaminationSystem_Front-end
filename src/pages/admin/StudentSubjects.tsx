import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { student, admin } from "../../services/api";

interface Subject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
  grade?: string;
  type?: string;
  _id: string;
  sem: number;
}

interface RegisteredSubject {
  subject: string;
  grade?: string;
  registerType?: string;
  semester: number;
}

const GRADE_OPTIONS = ["O", "A+", "A", "B+", "B", "C", "P", "F", "NE"];

const StudentSubjects = () => {
  const { studentId } = useParams<{ studentId: string }>();

  if (!studentId) {
    return (
      <div className="bg-gray-800 text-white min-h-screen py-6 px-4">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Invalid Student ID
        </h1>
      </div>
    );
  }

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [grades, setGrades] = useState<{ [key: string]: string }>({});

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await student.registeredsubjects(studentId);
      const data: RegisteredSubject[] = response.data;

      const subjectIds = data.map((item) => item.subject);
      const gradesArray = data.map((item) => item.grade);
      const registerTypes = data.map((item) => item.registerType);
      const sems = data.map((item) => item.semester);

      const subjectDetails = await Promise.all(
        subjectIds.map(async (subjectId, index) => {
          try {
            const subjectResponse = await student.getSubjectWithId(subjectId);
            return {
              ...subjectResponse.data,
              grade: gradesArray[index],
              type: registerTypes[index],
              sem: sems[index] 
            };
          } catch (err) {
            console.error(`Error fetching subject with ID ${subjectId}:`, err);
            return null;
          }
        })
      );

      const validSubjects = subjectDetails.filter((subject) => subject !== null) as Subject[];
      setSubjects(validSubjects);

      const initialGrades = validSubjects.reduce((acc, subject) => {
        acc[`${subject.code}-${subject.sem}`] = subject.grade || "";
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

  const handleGradeChange = (subjectId: string, sem: number, gradePoint: string) => {
    const key = `${subjectId}-${sem}`;
    setGrades((prevGrades) => ({
      ...prevGrades,
      [key]: gradePoint,
    }));
  };

  const handleSubmit = async (subjectId: string, sem: number) => {
    const key = `${subjectId}-${sem}`;
    const grade = grades[key];
    if (!grade) {
      alert("Please select a grade before submitting.");
      return;
    }

    try {
      if (studentId) {
        await admin.addGrades(studentId, subjectId, grade, sem);
        alert("Grade updated successfully.");
        fetchSubjects();
      } else {
        throw new Error("Invalid student ID.");
      }
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
                <tr key={`${subject.code}-${subject.sem}`} className="hover:bg-gray-600">
                  <td className="p-3 border border-gray-600">{subject.name}</td>
                  <td className="p-3 border border-gray-600">{subject.sem}</td>
                  <td className="p-3 border border-gray-600">{subject.credits}</td>
                  <td className="p-3 border border-gray-600">{subject.department}</td>
                  <td className="p-3 border border-gray-600">{subject.type}</td>
                  <td className="p-3 border border-gray-600">{subject.grade}</td>
                  <td className="p-3 border border-gray-600">
                    <select
                      value={grades[`${subject._id}-${subject.sem}`] || ""}
                      onChange={(e) => handleGradeChange(subject._id, subject.sem, e.target.value)}
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
                      onClick={() => handleSubmit(subject._id, subject.sem)}
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
