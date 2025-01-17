import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Faculty, student } from '../../../services/api';

// First, let's add an interface for the Subject type
interface Subject {
  id: number;
  code: string;
  name: string;
  credits: number;
  grade: string;
}

const ReRegistration = () => {

  // State to manage selected faculty for each subject
  const [selectedFaculty, setSelectedFaculty] = useState<Record<number, string>>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultys, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const decode: any = jwtDecode(token);
        const userId = decode.userId;

        const res = await student.rrsubjects(userId);

        const subjectDetails = await Promise.all(
          res.data.data.map(async (id: number, index: number) => {
            const subjectRes = await student.getSubjectWithId(id);
            return {
              ...subjectRes.data,
              grade: res.data.grades[index]
            };
          })
        );

        // Update the state with the retrieved subject details
        setSubjects(subjectDetails);

        const facultyDetails = await Faculty.getFacultyByDept(res.data.department);
        setFaculty(facultyDetails.data.allFaculty)
      } catch (error) {
        console.error("Error fetching re-register subjects:", error);
      }
    }

    fetchSubjects();
  }, []);

  // Handle re-registration action
  const handleReRegister = async (subjectId: any) => {
    try {
      setLoading(true);
      const user = await student.getProfile();
      const subject = subjects.find((subject) => subject._id === subjectId);
  
      if (!subject) {
        alert("Subject not found.");
        return;
      }

      if (subject.grade === 'W') {
        if (Object.keys(selectedFaculty).length === 0) {
          alert("Please select a faculty for this subject.");
          return;
        }
      }
  
      // Fetch order details
      const fees = subject.grade === 'W' ? subject.fees?.reRegistrationW : subject.fees?.reRegistrationF;
      const orderResponse = await student.getOrder(fees);
      
      const { order } = orderResponse.data;
      const apiKeyResponse = await student.getApiKey();
      const apiKey: string = apiKeyResponse.data;
  
      // Check if Razorpay is available
      if (!(window as any).Razorpay) {
        alert("Razorpay SDK not loaded. Please try again later.");
        return;
      }
  
      // Razorpay options
      const options = {
        key: apiKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        prefill: {
          name: "Your Name",
          email: "email@example.com",
        },
        handler: async (response: any) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
  
          try {
            const verifyResponse = await student.rrSubjectPayment({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              userId: user.data._id,
              semester: user.data.currentSemester,
              price: fees,
              subjectId: subject._id,
              type: subject.grade === 'W' ? 'Reregister - W' : 'Reregister - F',
              facultyId: selectedFaculty.facultyId, // Ensure specific faculty is passed
            });
  
            if (verifyResponse.data.success) {
              alert("Payment successful! Subjects registered.");
            } else {
              alert("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Error verifying payment.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("An error occurred during the payment process. Please try again.");
    } finally {
      setSelectedFaculty({});
      setLoading(false);
    }
  };
  

  // Handle faculty selection change
  const handleFacultyChange = (subjectId: any, facultyId: any) => {
    setSelectedFaculty({ subjectId, facultyId });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Reregister Subjects</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-700 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-800 text-gray-200">
              <th className="border border-gray-700 px-4 py-2">Sl No</th>
              <th className="border border-gray-700 px-4 py-2">Subject Code</th>
              <th className="border border-gray-700 px-4 py-2">Subject Name</th>
              <th className="border border-gray-700 px-4 py-2">Credits</th>
              <th className="border border-gray-700 px-4 py-2">Grade</th>
              <th className="border border-gray-700 px-4 py-2">Faculty</th>
              <th className="border border-gray-700 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={`${subject.id}-${index}`} className="text-center hover:bg-gray-700 transition duration-200">
                <td className="border border-gray-700 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-700 px-4 py-2">{subject.code}</td>
                <td className="border border-gray-700 px-4 py-2">{subject.name}</td>
                <td className="border border-gray-700 px-4 py-2">{subject.credits}</td>
                <td className="border border-gray-700 px-4 py-2">{subject.grade}</td>
                <td className="border border-gray-700 px-6 py-2">
                  {subject.grade !== 'F' ? (
                    <select
                      onChange={(e) => handleFacultyChange(subject._id, e.target.value)}
                      className="bg-gray-800 text-gray-200 border border-gray-600 w-3/4 py-1 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Faculty</option>
                      {facultys.map((faculty) => (
                        <option key={faculty._id} value={faculty._id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-red-500">Not Applicable</span>
                  )}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  <button
                    disabled={loading}
                    onClick={() => handleReRegister(subject._id)}
                    className={`${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white font-semibold py-1 px-4 rounded-lg transition-all duration-300 focus:outline-none`}
                  >
                    Re-register
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReRegistration;

