import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/Home';
import Subjects from './pages/admin/subjects';
import Students from './pages/admin/students';
import Allsubjects from './pages/admin/Allsubjects';
import FacultyLogin from './pages/FacultyLogin';
import AddFaculty from './pages/admin/AddFaculty';
import AllFaculty from './pages/admin/AllFaculty';
import FacultyDashboard from './pages/FacultyDashboard';
import Subject from './pages/student/Subject';
import PaymentHistory from './pages/student/PaymentHistory/PaymentHistory';
import Result from './pages/admin/Result';
import Semester from './pages/student/Semester';
import Dashboard from './pages/student/Dashboard';
import StudentSubjects from './pages/admin/StudentSubjects';
import Results from './pages/student/Results/Results';
import Payments from './pages/admin/Payments';
import Rr_Student from './pages/admin/Rr_Student';
import ReRegistration from './pages/student/Subject/ReRegistration';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
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
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/rrStudent" element={<Rr_Student />} />

          <Route path="/payments" element={<PaymentHistory />} />
          <Route path="/semester" element={<Semester/>} />
          <Route path="/subject" element={<Subject />} />
          <Route path="/subject/reregister" element={<ReRegistration />} />
          <Route path="/result" element={<Results/>} />
          
          
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