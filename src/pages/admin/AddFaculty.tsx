import { useState } from "react";
import { Faculty } from "../../services/api";

export default function AddFaculty() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  const departments = [
    "Computer Science and Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Biotechnology",
  ]; // Updated department options

  async function AddnewFaculty(e: any) {
    e.preventDefault();

    if (!department) {
      alert("Please select a department.");
      return;
    }

    try {
      await Faculty.register(name, email, password, department); // Assuming backend supports department field
      alert("Faculty registered successfully");

      setName("");
      setEmail("");
      setPassword("");
      setDepartment("");
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Add Faculty</h1>
      <form
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        onSubmit={AddnewFaculty}
      >
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="password">
            Set Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="department">
            Department
          </label>
          <select
            id="department"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select a Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Faculty
        </button>
      </form>
    </div>
  );
}
