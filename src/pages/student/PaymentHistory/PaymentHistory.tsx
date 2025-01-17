import { useEffect, useState } from 'react';
import { student } from '../../../services/api';
import { AlertCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface Payment {
  _id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('User not logged in');

        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;
        const response = await student.getPaymentHistory(userId);
        setPayments(response.data);
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDownloadReceipt = (payment: Payment) => {
    const receiptData = `
      Receipt for Payment
      --------------------
      Amount: ₹${payment.amount}
      Type: ${payment.type}
      Status: ${payment.status}
      UTR: ${payment.razorpay_payment_id}
      Order ID: ${payment.razorpay_order_id}
      Date: ${new Date(payment.createdAt).toLocaleDateString()}
      Time: ${new Date(payment.createdAt).toLocaleTimeString()}
    `;
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${payment._id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-white text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Payment History</h2>
      {payments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No payment history available
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-3 px-4 text-left">Subject Code</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">UTR</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-2 px-4">{payment.subject?.code || 'N/A'}</td>
                <td className="py-2 px-4">₹{payment.amount}</td>
                <td className="py-2 px-4">{payment.razorpay_payment_id}</td>
                <td
                  className={`py-2 px-4 ${
                    payment.status === 'completed' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {payment.status}
                </td>
                <td className="py-2 px-4">{payment.type}</td>
                <td className="py-2 px-4">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(payment.createdAt).toLocaleTimeString()}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDownloadReceipt(payment)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-500"
                  >
                    Download Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
