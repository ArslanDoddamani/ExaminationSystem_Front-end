import { Routes, Route, Link } from 'react-router-dom';
import { Menu, User, BookOpen, GraduationCap, LogOut } from 'lucide-react';
import Profile from './Profile';
import Semester from './Semester';
import Subjects from './Subjects/index';
import Results from './Results/Results';
import PaymentHistory from './PaymentHistory/PaymentHistory';
import ReRegistration from './Subjects/ReRegistration';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <nav className="bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-indigo-500" />
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                to=""
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-200"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link
                to="payments"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-200"
              >
                <User className="h-5 w-5" />
                <span>Payments</span>
              </Link>
              <Link
                to="semester"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-200"
              >
                <BookOpen className="h-5 w-5" />
                <span>Semester</span>
              </Link>
              <Link
                to="subjects"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
                <span>Subjects</span>
              </Link>
              <Link
                to="results"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-200"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Results</span>
              </Link>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="" element={<Profile />} />
          <Route path="semester" element={<Semester />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="subjects/reregister" element={<ReRegistration />} />
          <Route path="results" element={<Results />} />
          <Route path="payments" element={<PaymentHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;