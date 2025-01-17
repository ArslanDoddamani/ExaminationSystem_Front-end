import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 min-h-screen p-8 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold text-white mb-12 text-center">
                Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                <button
                    onClick={() => navigate('/admin/subjects')}
                    className="p-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-2xl hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Add New Subject</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/addFaculty')}
                    className="p-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow-2xl hover:from-purple-600 hover:to-purple-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Add Faculty</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/students')}
                    className="p-8 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-2xl hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">All Students</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/allsubjects')}
                    className="p-8 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-2xl hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">All Subjects</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/allFaculty')}
                    className="p-8 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-lg shadow-2xl hover:from-yellow-600 hover:to-yellow-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">All Faculty</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/result')}
                    className="p-8 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg shadow-2xl hover:from-teal-600 hover:to-teal-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Result</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/analytics')}
                    className="p-8 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg shadow-2xl hover:from-indigo-600 hover:to-indigo-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Analytics</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/settings')}
                    className="p-8 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-lg shadow-2xl hover:from-pink-600 hover:to-pink-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Settings</h2>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
