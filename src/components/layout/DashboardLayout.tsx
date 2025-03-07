
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, BookOpen, 
  CreditCard, UserPlus, School, Settings, Menu, X, LogOut, GraduationCap, Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  path, 
  active = false, 
  collapsed = false, 
  onClick 
}: SidebarItemProps) => {
  const linkClasses = cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
    "hover:bg-accent/50 group",
    active ? "bg-accent text-accent-foreground font-medium" : "text-foreground/70"
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "w-10 h-10 p-0", 
                active ? "bg-accent text-accent-foreground" : "text-foreground/70"
              )}
              onClick={onClick}
            >
              <Icon size={20} />
              <span className="sr-only">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-1">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button 
      variant="ghost" 
      className={linkClasses}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Button>
  );
};

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // If role is accountant, only show Payments
  const sidebarItems = user?.role === 'accountant' ? [
    { icon: Receipt, label: "Payments", path: "/payments" },
  ] : [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: School, label: "School Profile", path: "/school-profile" },
    { icon: BookOpen, label: "Academic Sessions", path: "/academic-sessions" },
    { icon: GraduationCap, label: "Classes", path: "/classes" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: UserPlus, label: "Accountants", path: "/accountants" },
    { icon: CreditCard, label: "Fee Management", path: "/fee-management" },
    { icon: Receipt, label: "Payments", path: "/payments" },
  ];

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "h-screen flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        {/* Logo section */}
        <div className={cn(
          "p-4 flex items-center gap-3",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">FM</span>
              </div>
              <span className="font-bold text-lg">Fee Master</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>

        <Separator />

        {/* Navigation */}
        <div className={cn(
          "flex flex-col py-4",
          collapsed ? "px-2 items-center" : "px-3 space-y-1"
        )}>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              collapsed={collapsed}
              onClick={() => navigateTo(item.path)}
            />
          ))}
        </div>

        <div className="mt-auto">
          <Separator />
          <div className={cn(
            "p-4",
            collapsed ? "flex justify-center" : ""
          )}>
            {user?.role !== 'accountant' && (
              <SidebarItem
                icon={Settings}
                label="Settings"
                path="/settings"
                collapsed={collapsed}
                onClick={() => navigateTo("/settings")}
              />
            )}
            <SidebarItem
              icon={LogOut}
              label="Logout"
              path="/logout"
              collapsed={collapsed}
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
