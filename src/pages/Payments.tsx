import { useState, useEffect, useRef } from 'react';
import { usePDF } from 'react-to-pdf';
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
import { 
  Search, FileText, Download, CreditCard, Plus, Printer, 
  Receipt, Eye, User, Loader2 
} from 'lucide-react';
import { 
  studentsAPI, feeHeadsAPI, academicSessionsAPI, 
  accountantsAPI, paymentsAPI, schoolProfileAPI 
} from '@/services/api';
import { Student, FeeHead, FeePayment, SchoolProfile, Accountant, AcademicSession } from '@/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export default function Payments() {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<FeePayment | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: '',
    feeHeadId: '',
    amount: '',
    month: '',
    paymentMethod: 'Cash',
    accountantId: '',
    academicSessionId: ''
  });

  const receiptRef = useRef<HTMLDivElement>(null);
  const { toPDF, targetRef } = usePDF({
    filename: selectedPayment ? `Receipt-${selectedPayment.receiptNumber}.pdf` : 'Receipt.pdf',
  });

  const [isStudentPopoverOpen, setIsStudentPopoverOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [
          studentsData,
          accountantsData,
          feeHeadsData,
          academicSessionsData,
          paymentsData,
          schoolProfileData
        ] = await Promise.all([
          studentsAPI.getAll(),
          accountantsAPI.getAll(),
          feeHeadsAPI.getAll(),
          academicSessionsAPI.getAll(),
          paymentsAPI.getAll(),
          schoolProfileAPI.get()
        ]);
        
        setStudents(studentsData);
        setAccountants(accountantsData);
        setFeeHeads(feeHeadsData);
        setAcademicSessions(academicSessionsData);
        setPayments(paymentsData);
        setSchoolProfile(schoolProfileData);
        
        // Set default academic session
        const activeSession = academicSessionsData.find(session => session.isActive);
        if (activeSession) {
          setFormData(prev => ({ ...prev, academicSessionId: activeSession.id }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  const getFeeHeadById = (id: string) => {
    return feeHeads.find(feeHead => feeHead.id === id);
  };

  const getAccountantById = (id: string) => {
    return accountants.find(accountant => accountant.id === id);
  };

  const handlePrintReceipt = () => {
    if (toPDF) {
      toPDF();
    }
  };

  const handlePaymentView = (payment: FeePayment) => {
    setSelectedPayment(payment);
    setReceiptDialogOpen(true);
  };

  const handleCreatePayment = () => {
    // Reset form data but keep the academic session
    setFormData({
      studentId: '',
      feeHeadId: '',
      amount: '',
      month: '',
      paymentMethod: 'Cash',
      accountantId: '',
      academicSessionId: formData.academicSessionId
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

  const handleSubmit = async () => {
    if (!formData.studentId || !formData.feeHeadId || !formData.amount || !formData.paymentMethod || !formData.accountantId) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const selectedFeeHead = getFeeHeadById(formData.feeHeadId);
    if (selectedFeeHead && !selectedFeeHead.isOneTime && !formData.month) {
      toast.error("Please select a month for monthly fee");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const paymentData = {
        studentId: formData.studentId,
        feeHeadId: formData.feeHeadId,
        amount: amount,
        academicSessionId: formData.academicSessionId,
        month: formData.month,
        paymentMethod: formData.paymentMethod,
        accountantId: formData.accountantId
      };
      
      const result = await paymentsAPI.create(paymentData);
      
      // Add the new payment to the state
      setPayments(prev => [result.payment, ...prev]);
      
      setIsDialogOpen(false);
      toast.success("Payment recorded successfully");
      
      // Show receipt after adding payment
      setSelectedPayment(result.payment);
      setReceiptDialogOpen(true);
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const student = getStudentById(payment.studentId);
    const feeHead = getFeeHeadById(payment.feeHeadId);
    const accountant = getAccountantById(payment.accountantId);
    
    // If we have studentName, feeHeadName from the API response, use those
    const studentName = payment.studentName || student?.name || '';
    const studentId = payment.studentCode || student?.studentId || '';
    const feeHeadName = payment.feeHeadName || feeHead?.name || '';
    const accountantName = payment.accountantName || accountant?.name || '';
    
    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feeHeadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accountantName.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Filter only active accountants
  const activeAccountants = accountants.filter(accountant => accountant.isActive);

  // Filter students based on search query
  const filteredStudents = students.filter((student) => 
    student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
    student.studentId.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Fee Payments"
          description="Manage and track all student fee payments"
        />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
                  <TableHead>Collected By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
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
                    const accountant = getAccountantById(payment.accountantId);
                    
                    // Use properties from the API response if available, otherwise fallback to related objects
                    const studentName = payment.studentName || student?.name || 'Unknown Student';
                    const feeHeadName = payment.feeHeadName || feeHead?.name || 'Unknown Fee';
                    const accountantName = payment.accountantName || accountant?.name || 'Admin';
                    
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                        <TableCell>{studentName}</TableCell>
                        <TableCell>{feeHeadName}</TableCell>
                        <TableCell>{new Date(payment.paidDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>₹{Number(payment.amount).toLocaleString('en-IN')}</TableCell>
                        <TableCell>{accountantName}</TableCell>
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

      {/* New Payment Dialog with searchable student dropdown */}
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
              <Popover open={isStudentPopoverOpen} onOpenChange={setIsStudentPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isStudentPopoverOpen}
                    className="w-full justify-between"
                  >
                    {formData.studentId
                      ? students.find((student) => student.id === formData.studentId)?.name || "Select student"
                      : "Select student"}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search student name or ID..." 
                      value={studentSearchQuery}
                      onValueChange={setStudentSearchQuery}
                    />
                    <CommandEmpty>No student found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {filteredStudents.map((student) => (
                          <CommandItem
                            key={student.id}
                            value={student.id}
                            onSelect={() => {
                              handleSelectChange('studentId', student.id);
                              setIsStudentPopoverOpen(false);
                              setStudentSearchQuery('');
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{student.name}</span>
                              <span className="text-xs text-muted-foreground">ID: {student.studentId} • Class: {student.class}</span>
                            </div>
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                formData.studentId === student.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Rest of the form fields */}
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
            {formData.feeHeadId && getFeeHeadById(formData.feeHeadId)?.isOneTime === false && (
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
              <Label htmlFor="accountantId">Collected By *</Label>
              <Select 
                value={formData.accountantId} 
                onValueChange={(value) => handleSelectChange('accountantId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select accountant" />
                </SelectTrigger>
                <SelectContent>
                  {activeAccountants.length > 0 ? (
                    activeAccountants.map((accountant) => (
                      <SelectItem key={accountant.id} value={accountant.id}>
                        {accountant.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="admin">Administrator</SelectItem>
                  )}
                </SelectContent>
              </Select>
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
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Generate Receipt
            </Button>
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
          {selectedPayment && schoolProfile && (
            <>
              <div className="py-4">
                <PaymentReceipt
                  ref={(el) => {
                    receiptRef.current = el;
                    if (targetRef && typeof targetRef !== 'function') {
                      targetRef.current = el;
                    }
                  }}
                  payment={selectedPayment}
                  student={getStudentById(selectedPayment.studentId) || {
                    id: selectedPayment.studentId,
                    studentId: selectedPayment.studentCode || '',
                    name: selectedPayment.studentName || 'Unknown Student',
                    class: '',
                    section: '',
                    rollNumber: '',
                    parentName: '',
                    contactNumber: ''
                  }}
                  feeHead={getFeeHeadById(selectedPayment.feeHeadId) || {
                    id: selectedPayment.feeHeadId,
                    name: selectedPayment.feeHeadName || 'Unknown Fee Type',
                    amount: Number(selectedPayment.amount),
                    isOneTime: true,
                    isActive: true,
                    createdAt: ''
                  }}
                  schoolProfile={schoolProfile}
                  accountant={getAccountantById(selectedPayment.accountantId) || {
                    id: selectedPayment.accountantId,
                    name: selectedPayment.accountantName || 'Admin',
                    email: '',
                    phone: '',
                    joinDate: '',
                    isActive: true
                  }}
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
