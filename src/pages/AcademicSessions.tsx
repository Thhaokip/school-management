
import { useState, useEffect } from 'react';
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
  DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AcademicSession } from '@/types';
import { toast } from 'sonner';
import { PlusIcon, CalendarIcon, Pencil, StarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { academicSessionsAPI } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AcademicSessions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);
  const [formData, setFormData] = useState<Partial<AcademicSession>>({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  });
  
  const queryClient = useQueryClient();
  
  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['academicSessions'],
    queryFn: academicSessionsAPI.getAll
  });

  // Mutations
  const createSessionMutation = useMutation({
    mutationFn: academicSessionsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
      toast.success("Academic session created successfully");
      setOpenDialog(false);
    },
    onError: (error) => {
      toast.error(`Failed to create session: ${error.message}`);
    }
  });
  
  const updateSessionMutation = useMutation({
    mutationFn: academicSessionsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
      toast.success("Academic session updated successfully");
      setOpenDialog(false);
    },
    onError: (error) => {
      toast.error(`Failed to update session: ${error.message}`);
    }
  });
  
  const deleteSessionMutation = useMutation({
    mutationFn: academicSessionsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
      toast.success("Academic session deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete session: ${error.message}`);
    }
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
    
    if (editingSession) {
      // Update existing session
      updateSessionMutation.mutate({
        ...editingSession,
        name: formData.name || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        isActive: formData.isActive || false
      });
    } else {
      // Create new session
      createSessionMutation.mutate({
        name: formData.name || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        isActive: formData.isActive || false
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <h3 className="text-lg font-medium">Error loading academic sessions</h3>
          <p>{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
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
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
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
            )}
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
                  disabled={createSessionMutation.isPending || updateSessionMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createSessionMutation.isPending || updateSessionMutation.isPending}
                >
                  {createSessionMutation.isPending || updateSessionMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingSession ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    editingSession ? "Update Session" : "Create Session"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default AcademicSessions;
