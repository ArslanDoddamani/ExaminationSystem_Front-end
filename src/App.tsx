import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Subjects from './pages/admin/subjects';
import Students from './pages/admin/students';
import Allsubjects from './pages/admin/Allsubjects';
import FacultyLogin from './pages/FacultyLogin';
import AddFaculty from './pages/admin/AddFaculty';
import AllFaculty from './pages/admin/AllFaculty';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentSubjects from './pages/admin/StudentSubjects';
import PaymentHistory from './pages/student/PaymentHistory/PaymentHistory';
import Result from './pages/admin/Result';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/student/payments" element={<PaymentHistory/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/Facultylogin" element={<FacultyLogin />} />
          <Route path="/Faculty/dashboard" element={<FacultyDashboard/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminlogin" element={<AdminLogin/>} />
          <Route path="/admin/subjects" element={<Subjects/>}></Route>
          <Route path="/admin/students" element={<Students/>}></Route>
          <Route path="/admin/allsubjects" element={<Allsubjects/>}></Route>
          <Route path="/admin/allFaculty" element={<AllFaculty/>}></Route>
          <Route path="/admin/addFaculty" element={<AddFaculty/>}></Route>
          <Route path="/admin/result" element={<Result/>}></Route>
          <Route path="/admin/students/:studentId/subjects" element={<StudentSubjects />} />
          
          
          {/* Student Routes */}
          <Route path="/student/*" element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
              <AdminDashboard />
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;