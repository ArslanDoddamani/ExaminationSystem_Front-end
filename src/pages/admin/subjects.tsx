import React, { useState } from 'react';
import { admin } from '../../services/api';

export default function Subjects() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '',
    semester: '',
    department: '',
    fees: {
      registration: '',
      reRegistrationF: '',
      reRegistrationW: '',
      challengeValuation: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('fees.')) {
      const feeKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        fees: {
          ...prev.fees,
          [feeKey]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await admin.addSubject({
        ...formData,
        credits: Number(formData.credits),
        semester: Number(formData.semester),
        fees: {
          registration: Number(formData.fees.registration),
          reRegistrationF: Number(formData.fees.reRegistrationF),
          reRegistrationW: Number(formData.fees.reRegistrationW),
          challengeValuation: Number(formData.fees.challengeValuation)
        }
      });

      alert('Subject added successfully!');
    } catch (error) {
      console.error('Error adding subject:', error);
      alert('Failed to add subject. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md md:max-w-2xl w-full space-y-8">
        <h1 className="m-2 text-white font-bold text-center text-2xl">Add New Subject</h1>
        <hr />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 w-full">
          <div>
            <label htmlFor="code" className="block text-md font-medium">Subject Code:</label>
            <input
              type="text"
              name="code"
              id="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-md font-medium">Subject Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="credits" className="block text-md font-medium">Credits:</label>
            <input
              type="number"
              name="credits"
              id="credits"
              value={formData.credits}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="semester" className="block text-md font-medium">Semester:</label>
            <input
              type="number"
              name="semester"
              id="semester"
              value={formData.semester}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-md font-medium">Department:</label>
            <input
              type="text"
              name="department"
              id="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="fees.registration" className="block text-md font-medium">Registration Fee:</label>
            <input
              type="number"
              name="fees.registration"
              id="fees.registration"
              value={formData.fees.registration}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="fees.reRegistrationF" className="block text-md font-medium">Re-Registration Fee (Full):</label>
            <input
              type="number"
              name="fees.reRegistrationF"
              id="fees.reRegistrationF"
              value={formData.fees.reRegistrationF}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="fees.reRegistrationW" className="block text-md font-medium">Re-Registration Fee (Withheld):</label>
            <input
              type="number"
              name="fees.reRegistrationW"
              id="fees.reRegistrationW"
              value={formData.fees.reRegistrationW}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="fees.challengeValuation" className="block text-md font-medium">Challenge Valuation Fee:</label>
            <input
              type="number"
              name="fees.challengeValuation"
              id="fees.challengeValuation"
              value={formData.fees.challengeValuation}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div className="col-span-full">
            <button
              type="submit"
              className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
