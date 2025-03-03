
import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-pdf';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PaymentReceipt } from '@/components/payments/PaymentReceipt';
import { Search, FileText, Download, CreditCard, Plus, Printer, Receipt, Eye } from 'lucide-react';
import { mockStudents } from '@/data/mockData';
import { Student, FeeHead, FeePayment, SchoolProfile } from '@/types';

// Mock data for development
const mockSchoolProfile: SchoolProfile = {
  id: '1',
  name: 'Oak Tree International School',
  address: '123 Education Street',
  city: 'Bangalore',
  state: 'Karnataka',
  zipCode: '560001',
  phone: '+91 8765432109',
  email: 'info@oaktreeschool.edu',
  logo: 'https://placehold.co/400x400?text=School+Logo',
  established: '1995',
  description: 'Nurturing young minds for a brighter future'
};

const mockFeeHeads: FeeHead[] = [
  { 
    id: '1', 
    name: 'Tuition Fee', 
    description: 'Monthly tuition fee', 
    amount: 5000, 
    isOneTime: false, 
    isActive: true, 
    createdAt: '2023-01-01T00:00:00Z' 
  },
  { 
    id: '2', 
    name: 'Admission Fee', 
    description: 'One-time admission fee', 
    amount: 25000, 
    isOneTime: true, 
    isActive: true, 
    createdAt: '2023-01-01T00:00:00Z' 
  },
  { 
    id: '3', 
    name: 'Library Fee', 
    description: 'Annual library fee', 
    amount: 2000, 
    isOneTime: true, 
    isActive: true, 
    createdAt: '2023-01-01T00:00:00Z' 
  }
];

const mockAcademicSessions = [
  { id: '1', name: '2023-2024', startDate: '2023-04-01', endDate: '2024-03-31', isActive: true }
];

const mockPayments: FeePayment[] = [
  {
    id: '1',
    studentId: mockStudents[0].id,
    feeHeadId: '1',
    amount: 5000,
    paidDate: '2023-06-10T10:30:00Z',
    academicSessionId: '1',
    month: 'June 2023',
    receiptNumber: 'RCPT-23-0001',
    paymentMethod: 'Online Transfer',
    status: 'paid'
  },
  {
    id: '2',
    studentId: mockStudents[1].id,
    feeHeadId: '2',
    amount: 25000,
    paidDate: '2023-05-15T14:20:00Z',
    academicSessionId: '1',
    receiptNumber: 'RCPT-23-0002',
    paymentMethod: 'Cash',
    status: 'paid'
  }
];

export default function Payments() {
  const [payments, setPayments] = useState<FeePayment[]>(mockPayments);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>(mockFeeHeads);
  const [academicSessions] = useState(mockAcademicSessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<FeePayment | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: '',
    feeHeadId: '',
    amount: '',
    month: '',
    paymentMethod: 'Cash',
    academicSessionId: academicSessions[0]?.id || ''
  });

  const receiptRef = useRef<HTMLDivElement>(null);

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id) || students[0];
  };

  const getFeeHeadById = (id: string) => {
    return feeHeads.find(feeHead => feeHead.id === id) || feeHeads[0];
  };

  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: selectedPayment ? `Receipt-${selectedPayment.receiptNumber}` : 'Receipt',
  });

  const handlePaymentView = (payment: FeePayment) => {
    setSelectedPayment(payment);
    setReceiptDialogOpen(true);
  };

  const handleCreatePayment = () => {
    setFormData({
      studentId: '',
      feeHeadId: '',
      amount: '',
      month: '',
      paymentMethod: 'Cash',
      academicSessionId: academicSessions[0]?.id || ''
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill amount when fee head is selected
    if (name === 'feeHeadId') {
      const selectedFeeHead = feeHeads.find(fh => fh.id === value);
      if (selectedFeeHead) {
        setFormData(prev => ({ ...prev, amount: selectedFeeHead.amount.toString() }));
      }
    }
  };

  const generateReceiptNumber = () => {
    const prefix = 'RCPT';
    const year = new Date().getFullYear().toString().slice(-2);
    const count = payments.length + 1;
    return `${prefix}-${year}-${count.toString().padStart(4, '0')}`;
  };

  const handleSubmit = () => {
    if (!formData.studentId || !formData.feeHeadId || !formData.amount || !formData.paymentMethod) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const selectedFeeHead = getFeeHeadById(formData.feeHeadId);
    if (!selectedFeeHead.isOneTime && !formData.month) {
      toast.error("Please select a month for monthly fee");
      return;
    }

    const newPayment: FeePayment = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      feeHeadId: formData.feeHeadId,
      amount: amount,
      paidDate: new Date().toISOString(),
      academicSessionId: formData.academicSessionId,
      month: formData.month,
      receiptNumber: generateReceiptNumber(),
      paymentMethod: formData.paymentMethod,
      status: 'paid'
    };

    setPayments(prev => [...prev, newPayment]);
    setIsDialogOpen(false);
    toast.success("Payment recorded successfully");
    
    // Show receipt after adding payment
    setSelectedPayment(newPayment);
    setReceiptDialogOpen(true);
  };

  const filteredPayments = payments.filter(payment => {
    const student = getStudentById(payment.studentId);
    const feeHead = getFeeHeadById(payment.feeHeadId);
    
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feeHead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      const monthName = date.toLocaleString('en-US', { month: 'long' });
      months.push(`${monthName} ${currentYear}`);
    }
    
    return months;
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Fee Payments"
        description="Manage and track all student fee payments"
        action={{
          label: "Record Payment",
          onClick: handleCreatePayment,
          icon: <Plus />,
        }}
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Payment Records
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      {searchTerm 
                        ? "No payments match your search criteria." 
                        : "No payments recorded yet."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => {
                    const student = getStudentById(payment.studentId);
                    const feeHead = getFeeHeadById(payment.feeHeadId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{feeHead.name}</TableCell>
                        <TableCell>{new Date(payment.paidDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>₹{payment.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                            ${payment.status === 'paid' 
                              ? "bg-green-50 text-green-700" 
                              : payment.status === 'pending' 
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePaymentView(payment)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Receipt</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* New Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
            <DialogDescription>
              Enter the payment details to generate a receipt
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="studentId">Student *</Label>
              <Select 
                value={formData.studentId} 
                onValueChange={(value) => handleSelectChange('studentId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.studentId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="feeHeadId">Fee Type *</Label>
              <Select 
                value={formData.feeHeadId} 
                onValueChange={(value) => handleSelectChange('feeHeadId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  {feeHeads.map((feeHead) => (
                    <SelectItem key={feeHead.id} value={feeHead.id}>
                      {feeHead.name} (₹{feeHead.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.feeHeadId && !getFeeHeadById(formData.feeHeadId).isOneTime && (
              <div className="grid gap-2">
                <Label htmlFor="month">Month *</Label>
                <Select 
                  value={formData.month} 
                  onValueChange={(value) => handleSelectChange('month', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {getMonthOptions().map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online Transfer">Online Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save & Generate Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              Receipt #{selectedPayment?.receiptNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <>
              <div className="py-4">
                <PaymentReceipt
                  ref={receiptRef}
                  payment={selectedPayment}
                  student={getStudentById(selectedPayment.studentId)}
                  feeHead={getFeeHeadById(selectedPayment.feeHeadId)}
                  schoolProfile={mockSchoolProfile}
                />
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setReceiptDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={handlePrintReceipt}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
