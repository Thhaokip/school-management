
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { mockAcademicSessions } from '@/data/mockData';
import { AcademicSession } from '@/types';
import { toast } from 'sonner';
import { PlusIcon, CalendarIcon, Pencil, StarIcon } from 'lucide-react';
import { format } from 'date-fns';

const AcademicSessions = () => {
  const [sessions, setSessions] = useState<AcademicSession[]>(mockAcademicSessions);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);
  const [formData, setFormData] = useState<Partial<AcademicSession>>({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  });

  const handleCreate = () => {
    setEditingSession(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      isActive: false
    });
    setOpenDialog(true);
  };

  const handleEdit = (session: AcademicSession) => {
    setEditingSession(session);
    setFormData({
      name: session.name,
      startDate: session.startDate,
      endDate: session.endDate,
      isActive: session.isActive
    });
    setOpenDialog(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.isActive) {
      // Deactivate all other sessions if this one is active
      setSessions(prev => 
        prev.map(session => ({
          ...session,
          isActive: false
        }))
      );
    }

    if (editingSession) {
      // Update existing session
      setSessions(prev => 
        prev.map(session => 
          session.id === editingSession.id 
            ? { ...session, ...formData } as AcademicSession
            : session
        )
      );
      toast.success("Academic session updated successfully");
    } else {
      // Create new session
      const newSession: AcademicSession = {
        id: String(sessions.length + 1),
        name: formData.name || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        isActive: formData.isActive || false
      };
      
      setSessions(prev => [...prev, newSession]);
      toast.success("Academic session created successfully");
    }
    
    setOpenDialog(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader 
          title="Academic Sessions" 
          description="Manage academic years and sessions"
          action={{
            label: "Add Session",
            icon: <PlusIcon className="mr-2 h-4 w-4" />,
            onClick: handleCreate
          }}
        />

        <Card className="shadow-subtle animate-scale-in">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              All Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No academic sessions found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.id} className="hover-scale">
                      <TableCell className="flex items-center gap-2 font-medium">
                        {session.name}
                        {session.isActive && <StarIcon className="h-4 w-4 text-amber-500" />}
                      </TableCell>
                      <TableCell>{formatDate(session.startDate)}</TableCell>
                      <TableCell>{formatDate(session.endDate)}</TableCell>
                      <TableCell>
                        <Badge variant={session.isActive ? "default" : "outline"}>
                          {session.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(session)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? "Edit Academic Session" : "Create Academic Session"}
              </DialogTitle>
              <DialogDescription>
                {editingSession 
                  ? "Update the details of this academic session."
                  : "Add a new academic session to your school calendar."
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Session Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. 2023-2024"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isActive">
                    Set as active session
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSession ? "Update Session" : "Create Session"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AcademicSessions;
