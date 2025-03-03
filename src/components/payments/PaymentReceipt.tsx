
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Student, FeeHead, FeePayment, SchoolProfile } from '@/types';

interface PaymentReceiptProps {
  payment: FeePayment;
  student: Student;
  feeHead: FeeHead;
  schoolProfile: SchoolProfile;
}

export const PaymentReceipt = React.forwardRef<HTMLDivElement, PaymentReceiptProps>(
  ({ payment, student, feeHead, schoolProfile }, ref) => {
    const paymentDate = new Date(payment.paidDate);
    
    return (
      <div 
        ref={ref}
        className="bg-white p-8 max-w-2xl mx-auto border border-gray-200 rounded-lg shadow-sm"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{schoolProfile.name}</h1>
            <p className="text-gray-500">{schoolProfile.address}</p>
            <p className="text-gray-500">{schoolProfile.city}, {schoolProfile.state} - {schoolProfile.zipCode}</p>
            <p className="text-gray-500">Phone: {schoolProfile.phone}</p>
            <p className="text-gray-500">Email: {schoolProfile.email}</p>
          </div>
          {schoolProfile.logo && (
            <img 
              src={schoolProfile.logo} 
              alt="School Logo" 
              className="w-24 h-24 object-contain"
            />
          )}
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">PAYMENT RECEIPT</h2>
          <p className="text-center text-gray-600">Receipt No: {payment.receiptNumber}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-gray-500">Student ID:</p>
            <p className="font-medium">{student.studentId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Date:</p>
            <p className="font-medium">{paymentDate.toLocaleDateString('en-IN')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Student Name:</p>
            <p className="font-medium">{student.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Time:</p>
            <p className="font-medium">{paymentDate.toLocaleTimeString('en-IN')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Class:</p>
            <p className="font-medium">{student.class} {student.section}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Roll No:</p>
            <p className="font-medium">{student.rollNumber}</p>
          </div>
        </div>
        
        <table className="min-w-full mb-6">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-4 text-sm text-gray-800">{feeHead.name}</td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right">
                {payment.month || 'One-time'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right">₹{payment.amount.toLocaleString('en-IN')}</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="py-3 px-4"></td>
              <td className="py-3 px-4 text-sm font-medium text-gray-800 text-right">Total:</td>
              <td className="py-3 px-4 text-sm font-bold text-gray-800 text-right">₹{payment.amount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Payment Method:</p>
          <p className="font-medium">{payment.paymentMethod}</p>
        </div>
        
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Received By</p>
            <div className="mt-10 pt-2 border-t border-gray-300 w-32">
              <p className="text-xs text-gray-500 text-center">Authorized Signature</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">This is a computer-generated receipt.</p>
            <p className="text-xs text-gray-500">No signature required.</p>
          </div>
        </div>
      </div>
    );
  }
);

PaymentReceipt.displayName = 'PaymentReceipt';
