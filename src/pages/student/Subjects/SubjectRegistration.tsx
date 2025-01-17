import React, { useEffect, useState } from 'react';
import { student } from '../../../services/api';
import { AlertCircle } from 'lucide-react';

interface Subject {
  _id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
}

const SubjectRegistration = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await student.getProfile();
        const availableSubjects = response.data.availableSubjects;
        setSubjects(availableSubjects);
      } catch (error) {
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleRegister = async () => {
    try {
      await student.registerSubjects(selectedSubjects);
      setSuccess('Successfully registered for subjects');
      setSelectedSubjects([]);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Subject Registration</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject._id} className="flex items-center space-x-3 p-3 border rounded-md">
            <input
              type="checkbox"
              id={subject._id}
              checked={selectedSubjects.includes(subject._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSubjects([...selectedSubjects, subject._id]);
                } else {
                  setSelectedSubjects(selectedSubjects.filter(id => id !== subject._id));
                }
              }}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor={subject._id} className="flex-1">
              <div className="font-medium">{subject.name}</div>
              <div className="text-sm text-gray-500">
                Code: {subject.code} | Credits: {subject.credits}
              </div>
            </label>
          </div>
        ))}
      </div>

      {selectedSubjects.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleRegister}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Register Selected Subjects (₹{selectedSubjects.length * 1500})
          </button>
        </div>
      )}
    </div>
  );
};

export default SubjectRegistration;