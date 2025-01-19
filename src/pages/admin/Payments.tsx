import React, { useEffect, useState } from 'react';
import { admin } from '../../services/api'; // Adjust the import path

interface Payment {
  amount: number;
  type: string;
  status: string;
  subject: {
    name?: string;
    code?: string;
  };
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  createdAt: string;
  userName: string;
  userUSN: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await admin.fetchPayments(); // Call the admin service
        setPayments(response.data);
        setFilteredPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase(); // Case-insensitive search
    setSearchTerm(term);
    if (term === '') {
      setFilteredPayments(payments); // Reset if search is cleared
    } else {
      const filtered = payments.filter(payment =>
        payment.userUSN.toLowerCase().includes(term) ||
        payment.subject?.code?.toLowerCase().includes(term) ||
        payment.razorpay_payment_id?.toLowerCase().includes(term)
      );
      setFilteredPayments(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">All Payments</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by USN, Subject Code, or Payment ID"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-lg p-3 rounded bg-gray-800 text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 border border-gray-700 text-xl">User Name</th>
              <th className="px-4 py-2 border border-gray-700 text-xl">USN</th>
              <th className="px-4 py-2 border border-gray-700 text-xl">Amount</th>
              <th className="px-4 py-2 border border-gray-700 text-xl">Type</th>
              <th className="px-4 py-2 border border-gray-700 text-xl">Subject Name</th>
              <th className="px-4 py-2 border border-gray-700 text-xl">Subject Code</th>
              <th className="px-4 py-2 border border-gray-700 text-xl">Payment ID</th>
              <th className="px-4 py-2 border border-gray-700 text-xl">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} hover:bg-gray-600`}
              >
                <td className="px-4 py-2 border border-gray-700 text-lg">{payment.userName}</td>
                <td className="px-4 py-2 border border-gray-700 text-lg">{payment.userUSN}</td>
                <td className="px-4 py-2 border border-gray-700 text-lg">{payment.amount}</td>
                <td className="px-4 py-2 border border-gray-700 text-lg">{payment.type}</td>
                <td className="px-4 py-2 border border-gray-700 text-lg">{payment.subject?.name || '-'}</td>
                <td className="px-4 py-2 border border-gray-700 text-lg">{payment.subject?.code || '-'}</td>
                <td className="px-4 py-2 border border-gray-700 text-lg">{payment.razorpay_payment_id || '-'}</td>
                <td className="px-4 py-2 border border-gray-700 text-lg">{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-400 mt-4 text-center">
        Showing {filteredPayments.length} of {payments.length} records
      </p>
    </div>
  );
};

export default Payments;
