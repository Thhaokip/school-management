import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, BookOpen, 
  CalendarDays, Receipt, CreditCard, 
  Settings, ChevronLeft, ChevronRight,
  LogOut, School, User, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
  active?: boolean;
}

function SidebarLink({ to, icon, label, collapsed, active }: SidebarLinkProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "justify-start px-3.5 py-2.5 font-normal hover:bg-secondary",
        active && "bg-secondary font-medium",
        collapsed && "px-2.5"
      )}
      onClick={() => {
        window.location.href = to;
      }}
    >
      <div className="flex items-center">
        {icon}
        {!collapsed && <span className="ml-2">{label}</span>}
      </div>
    </Button>
  );
}

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  // Redirect based on role
  if (user?.role === 'accountant' && location.pathname !== '/payments' && !location.pathname.includes('/payments')) {
    return <Navigate to="/payments" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            {!collapsed && <h2 className="text-lg font-bold">School ERP</h2>}
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-7 w-7"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {/* Admin links */}
          {user?.role === 'admin' && (
            <>
              <SidebarLink
                to="/"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                collapsed={collapsed}
                active={location.pathname === '/'}
              />
              <SidebarLink
                to="/school-profile"
                icon={<School size={20} />}
                label="School Profile"
                collapsed={collapsed}
                active={location.pathname === '/school-profile'}
              />
              <SidebarLink
                to="/academic-sessions"
                icon={<CalendarDays size={20} />}
                label="Academic Sessions"
                collapsed={collapsed}
                active={location.pathname === '/academic-sessions'}
              />
              <SidebarLink
                to="/classes"
                icon={<BookOpen size={20} />}
                label="Classes"
                collapsed={collapsed}
                active={location.pathname === '/classes'}
              />
              <SidebarLink
                to="/students"
                icon={<Users size={20} />}
                label="Students"
                collapsed={collapsed}
                active={location.pathname === '/students'}
              />
              <SidebarLink
                to="/accountants"
                icon={<User size={20} />}
                label="Accountants"
                collapsed={collapsed}
                active={location.pathname === '/accountants'}
              />
              <SidebarLink
                to="/fee-management"
                icon={<CreditCard size={20} />}
                label="Fee Management"
                collapsed={collapsed}
                active={location.pathname === '/fee-management'}
              />
            </>
          )}

          {/* Both admin and accountant can access payments */}
          <SidebarLink
            to="/payments"
            icon={<Receipt size={20} />}
            label="Payments"
            collapsed={collapsed}
            active={location.pathname === '/payments'}
          />

          {/* Admin only settings */}
          {user?.role === 'admin' && (
            <SidebarLink
              to="/settings"
              icon={<Settings size={20} />}
              label="Settings"
              collapsed={collapsed}
              active={location.pathname === '/settings'}
            />
          )}
        </div>
      </div>

      <div className={cn("mt-auto px-3 pb-4", collapsed ? "pt-2" : "pt-4")}>
        <Separator className="mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name || 'User'}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</span>
              </div>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
                  <LogOut size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <ScrollArea className="h-full py-2">
              {sidebarContent}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      ) : (
        <div
          className={cn(
            "bg-card h-full border-r transition-all overflow-hidden",
            collapsed ? "w-[68px]" : "w-[240px]"
          )}
        >
          <ScrollArea className="h-full">{sidebarContent}</ScrollArea>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
