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

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchUSN, setSearchUSN] = useState<string>('');

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
    const usn = e.target.value.toUpperCase(); // Case-insensitive search
    setSearchUSN(usn);
    if (usn === '') {
      setFilteredPayments(payments); // Reset if search is cleared
    } else {
      const filtered = payments.filter(payment =>
        payment.userUSN.toUpperCase().includes(usn)
      );
      setFilteredPayments(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="mb-4">All Payments</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by USN"
          value={searchUSN}
          onChange={handleSearch}
          className="p-2 rounded border border-gray-300 text-black"
          style={{ width: '300px' }}
        />
      </div>

      <table style={{ width: '100%', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th style={headerCellStyle}>User Name</th>
            <th style={headerCellStyle}>USN</th>
            <th style={headerCellStyle}>Amount</th>
            <th style={headerCellStyle}>Type</th>
            <th style={headerCellStyle}>Status</th>
            <th style={headerCellStyle}>Subject Name</th>
            <th style={headerCellStyle}>Subject Code</th>
            <th style={headerCellStyle}>Order ID</th>
            <th style={headerCellStyle}>Payment ID</th>
            <th style={headerCellStyle}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((payment, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{payment.userName}</td>
              <td style={cellStyle}>{payment.userUSN}</td>
              <td style={cellStyle}>{payment.amount}</td>
              <td style={cellStyle}>{payment.type}</td>
              <td style={cellStyle}>{payment.status}</td>
              <td style={cellStyle}>{payment.subject?.name || '-'}</td>
              <td style={cellStyle}>{payment.subject?.code || '-'}</td>
              <td style={cellStyle}>{payment.razorpay_order_id || '-'}</td>
              <td style={cellStyle}>{payment.razorpay_payment_id || '-'}</td>
              <td style={cellStyle}>{new Date(payment.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles for the table
const headerCellStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'left',
  backgroundColor: 'black',
  fontWeight: 'bold',
};

const cellStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'left',
};

export default AdminPayments;
