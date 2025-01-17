import React from 'react';

interface Payment {
  _id: string;
  amount: number;
  type: string; // 'ExamFee' | 'ChallengeValuation' | 'F' | 'W';
  status: string; // 'pending' | 'completed' | 'failed';
  createdAt: string;
  subject?: {
    name: string;
    code: string;
  };
}


const PaymentCard = ({ payment }: { payment: Payment }) => {
  return (
    <div className="border rounded-md p-4 shadow-sm">
      <div className="flex justify-between">
        <h3 className="font-bold text-lg">{payment.subject?.name || 'N/A'}</h3>
        <span className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-700">Amount: ₹{payment.amount}</p>
      <p className={`text-${payment.status === 'completed' ? 'green' : 'red'}-600`}>
        Status: {payment.status}
      </p>
      <p className="text-gray-500">Type: {payment.type}</p>
    </div>
  );
};

export default PaymentCard;
