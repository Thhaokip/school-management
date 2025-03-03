
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  action, 
  children, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("pb-5 mb-6 border-b flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <Button onClick={action.onClick} className="animate-fade-in">
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
