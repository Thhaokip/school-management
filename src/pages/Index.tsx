
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStudents, mockAcademicSessions } from '@/data/mockData';
import { UsersIcon, BookOpenIcon, CreditCardIcon, CalendarIcon } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const activeSession = mockAcademicSessions.find(session => session.isActive);

  // Simple analytics data for the dashboard
  const analytics = {
    totalStudents: mockStudents.length,
    activeSession: activeSession?.name || 'None',
    pendingFees: '₹75,000',
    collectedFees: '₹2,50,000'
  };
  
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
      onClick: () => {}
    },
    {
      title: 'Collected Fees',
      value: analytics.collectedFees,
      icon: <CreditCardIcon className="h-5 w-5 text-emerald-500" />,
      onClick: () => {}
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <PageHeader 
          title="Dashboard" 
          description={`Welcome to Fee Master - Manage your school fees effortlessly.`}
        />

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
              <p className="text-sm text-muted-foreground">
                This section will display recent fee transactions and activities.
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-3 shadow-subtle animate-slide-in animate-delay-200">
            <CardHeader>
              <CardTitle>Fee Collection Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This section will display charts for fee collection statistics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
