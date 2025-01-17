import { useEffect, useState } from "react";
import { admin, student } from "../../../services/api";
import { jwtDecode } from "jwt-decode";

const Results = () => {
  const [studentData, setStudentData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [usn, setUsn] = useState<string | null>("");
  const [date, setDate] = useState<Date | null>(null);
  const [isDetailsFetched, setIsDetailsFetched] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const currentTime = new Date();

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await student.getProfile();
        setStudentData(response.data);
        setIsDetailsFetched(true);
      } catch (err) {
        alert("Error fetching student data.");
      }
    }
    fetchDetails();
  }, []);

  useEffect(() => {
    const storedUsn = localStorage.getItem("usn");
    setUsn(storedUsn);
  }, []);

  async function fetchRegisteredSubjects() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const decode: any = jwtDecode(token);
      const userId = decode.userId;

      const res = await student.registeredsubjects(userId);
      const subjectIds = res.data.map((item: any) => item.subject);
      const grades = res.data.map((item: any) => item.grade);
      const flags = res.data.map((item: any) => item.flag);
      const times = res.data.map((item: any) => item.time);
      const semesters = res.data.map((item: any) => item.semester);

      if (subjectIds.length === 0) {
        setSubjects([]);
        return;
      }

      const subjectsData = await Promise.all(
        subjectIds.map(async (subjectId, index) => {
          if (
            semesters[index] == studentData?.currentSemester &&
            flags[index] == true
          ) {
            setDate(new Date(times[index]));
            const subjectDetails = await admin.FindSubject(subjectId);
            return {
              ...subjectDetails.data,
              grade: grades[index],
            };
          }
          return null;
        })
      );

      const filteredSubjects = subjectsData.filter((subject) => subject !== null);
      setSubjects(filteredSubjects);
    } catch (error) {
      console.error("Error fetching registered subjects:", error);
    }
  }

  useEffect(() => {
    if (usn && usn !== "-1" && isDetailsFetched) {
      fetchRegisteredSubjects();
    }
  }, [usn, isDetailsFetched]);

  async function initiatePayment(subject, index) {
    try {
      setLoadingIndex(index);
      const orderResponse = await student.createOrder(studentData?.currentSemester, subject?.fees.challengeValuation);
      const { order } = orderResponse.data;

      const apiKeyResponse = await student.getApiKey();
      const apiKey: string = apiKeyResponse.data;

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
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not logged in");

            const decode: any = jwtDecode(token);
            const userId = decode.userId;

            const verifyResponse = await student.challengingValuation({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              userId,
              subjectId: subject?._id,
              userSem: studentData?.currentSemester,
              price: subject?.fees.challengeValuation
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
      alert("Error during payment. Please try again.");
    }
    finally {
      setLoadingIndex(null);
    }
  }

  const handleChallengeValuation = (subject: any) => {
    initiatePayment(subject)
  };

  const gradeSystem = {
    grades: ["O", "A+", "A", "B+", "B", "C", "P", "F", "PP", "NP", "NE", "W"],
    ranges: [
      "90-100",
      "80-89",
      "70-79",
      "60-69",
      "55-59",
      "50-54",
      "40-49",
      "0-39",
      ">= 40",
      "0-39",
      "SEE NOT ELIGIBLE",
      "Withdraw",
    ],
  };

  if (usn === "-1") {
    return (
      <div className="semester-container bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Result</h1>
          <p className="text-xl text-gray-400">
            Your USN has not been assigned by the admin yet. Please contact the admin for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div key={date?.toISOString()}> {/* Add key to force re-mount */}
      <h1 className="text-3xl font-bold text-center mb-6">Result</h1>
      {currentTime > date ? (
        <p className="text-xl text-center text-gray-400">Results not yet announced for this semester</p>
      ) : subjects.length === 0 ? (
        <p className="text-xl text-center text-gray-400">Results not yet announced</p>
      ) : (
        <div className="bg-gray-900 text-white min-h-3/4 py-8 px-4">
          <div className="max-w-6xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="mb-4">
              <p className="text-lg font-bold">USN: {studentData?.USN}</p>
              <p className="text-lg font-bold">Name: {studentData?.name}</p>
              <p className="text-lg font-bold">Branch: {studentData?.department}</p>
              <p className="text-lg font-bold">Semester: {studentData?.currentSemester}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-left text-md font-semibold">
                    <th className="py-3 px-4 border-b border-gray-600">Sl No</th>
                    <th className="py-3 px-4 border-b border-gray-600">Subject Code</th>
                    <th className="py-3 px-4 border-b border-gray-600">Subject Name</th>
                    <th className="py-3 px-4 border-b border-gray-600">Credits</th>
                    <th className="py-3 px-4 border-b border-gray-600">Grade</th>
                    <th className="py-3 px-2 border-b border-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((item, index) => (
                    <tr
                      key={index}
                      className={`text-sm ${item?.grade === 'F' || item?.grade === 'W' ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'} transition duration-200`}
                    >
                      <td className="py-3 px-4 border-b border-gray-600">{index + 1}</td>
                      <td className="py-3 px-4 border-b border-gray-600">{item?.subject?.code}</td>
                      <td className="py-3 px-4 border-b border-gray-600">{item?.subject?.name}</td>
                      <td className="py-3 px-4 border-b border-gray-600">{item?.subject?.credits}</td>
                      <td className="py-3 px-4 border-b border-gray-600">{item?.grade}</td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        <button
                          className={`${loadingIndex === index
                              ? 'bg-gray-600 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                            } px-4 py-2 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300`}
                          onClick={() => handleChallengeValuation(item?.subject, index)}
                          disabled={loadingIndex === index}
                        >
                          {loadingIndex === index ? 'Processing...' : 'Challenge Valuation'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            <div className="flex justify-between mt-6 text-lg font-bold">
              <div>SGPA: 8.5</div>
              <div>CGPA: 8.2</div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold mb-4">Grading System</p>
            <table className="w-full table-auto text-sm text-center border-collapse">
              <tbody>
                <tr className="hover:bg-gray-700 transition duration-200">
                  <td className="py-3 pr-4 border border-gray-600 font-semibold text-center bg-gray-700">
                    Grade
                  </td>
                  {gradeSystem.grades.map((grade, index) => (
                    <td key={index} className="py-3 px-4 border border-gray-600 font-medium">
                      {grade}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-700 transition duration-200">
                  <td className="py-3 pr-2 border border-gray-600 font-semibold text-center bg-gray-700">
                    Range of Marks
                  </td>
                  {gradeSystem.ranges.map((range, index) => (
                    <td key={index} className="py-3 px-4 border border-gray-600 font-medium">
                      {range}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
