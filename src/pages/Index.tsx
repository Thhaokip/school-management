import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { studentsAPI, academicSessionsAPI, paymentsAPI } from '@/services/api';
import { UsersIcon, BookOpenIcon, CreditCardIcon, CalendarIcon, Loader2 } from 'lucide-react';
import { Student, AcademicSession, FeePayment } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data in parallel
        const [studentsData, sessionsData, paymentsData] = await Promise.all([
          studentsAPI.getAll(),
          academicSessionsAPI.getAll(),
          paymentsAPI.getAll()
        ]);
        
        setStudents(studentsData);
        setAcademicSessions(sessionsData);
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const activeSession = academicSessions.find(session => session.isActive);
  
  // Calculate analytics
  const calculateAnalytics = () => {
    const totalStudents = students.length;
    
    // Calculate fee amounts
    let pendingFees = 0;
    let collectedFees = 0;
    
    payments.forEach(payment => {
      if (payment.status === 'paid') {
        collectedFees += Number(payment.amount);
      } else if (payment.status === 'pending' || payment.status === 'overdue') {
        pendingFees += Number(payment.amount);
      }
    });
    
    return {
      totalStudents,
      activeSession: activeSession?.name || 'None',
      pendingFees: `₹${pendingFees.toLocaleString('en-IN')}`,
      collectedFees: `₹${collectedFees.toLocaleString('en-IN')}`
    };
  };
  
  const analytics = calculateAnalytics();
  
  const cards = [
    {
      title: 'Total Students',
      value: analytics.totalStudents,
      icon: <UsersIcon className="h-5 w-5 text-blue-500" />,
      onClick: () => navigate('/students')
    },
    {
      title: 'Active Session',
      value: analytics.activeSession,
      icon: <CalendarIcon className="h-5 w-5 text-green-500" />,
      onClick: () => navigate('/academic-sessions')
    },
    {
      title: 'Pending Fees',
      value: analytics.pendingFees,
      icon: <CreditCardIcon className="h-5 w-5 text-amber-500" />,
      onClick: () => navigate('/payments')
    },
    {
      title: 'Collected Fees',
      value: analytics.collectedFees,
      icon: <CreditCardIcon className="h-5 w-5 text-emerald-500" />,
      onClick: () => navigate('/payments')
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Dashboard" 
        description={`Welcome to Fee Master - Manage your school fees effortlessly.`}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <Card 
                key={card.title} 
                className="hover-scale cursor-pointer shadow-subtle animate-slide-in" 
                style={{animationDelay: `${index * 100}ms`}}
                onClick={card.onClick}
              >
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-2xl font-semibold">{card.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <Card className="col-span-4 shadow-subtle animate-slide-in animate-delay-100">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.slice(0, 5).map(payment => {
                      const student = students.find(s => s.id === payment.studentId);
                      return (
                        <div key={payment.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{student?.name || 'Unknown Student'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.paidDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{Number(payment.amount).toLocaleString('en-IN')}</p>
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent payment activities found.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3 shadow-subtle animate-slide-in animate-delay-200">
              <CardHeader>
                <CardTitle>Fee Collection Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Students</span>
                    <span className="font-semibold">{students.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payments This Month</span>
                    <span className="font-semibold">
                      {payments.filter(p => {
                        const paymentDate = new Date(p.paidDate);
                        const now = new Date();
                        return (
                          paymentDate.getMonth() === now.getMonth() && 
                          paymentDate.getFullYear() === now.getFullYear()
                        );
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Session</span>
                    <span className="font-semibold">{activeSession?.name || 'None'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
