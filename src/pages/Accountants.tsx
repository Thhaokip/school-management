import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockAccountants } from '@/data/mockData';
import { Accountant } from '@/types';
import { 
  Search, UserPlus, Users, Mail, Phone, Pencil, 
  Eye, FileEdit
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

const Accountants = () => {
  const [accountants, setAccountants] = useState<Accountant[]>(mockAccountants);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAccountant, setEditingAccountant] = useState<Accountant | null>(null);
  const [formData, setFormData] = useState<Partial<Accountant>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    isActive: true
  });

  const handleCreate = () => {
    setEditingAccountant(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      joinDate: format(new Date(), 'yyyy-MM-dd'),
      isActive: true
    });
    setOpenDialog(true);
  };

  const handleEdit = (accountant: Accountant) => {
    setEditingAccountant(accountant);
    setFormData({
      name: accountant.name,
      email: accountant.email,
      phone: accountant.phone,
      address: accountant.address || '',
      joinDate: accountant.joinDate,
      isActive: accountant.isActive
    });
    setOpenDialog(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (editingAccountant) {
      // Update existing accountant
      setAccountants(prev => 
        prev.map(accountant => 
          accountant.id === editingAccountant.id 
            ? { ...accountant, ...formData } as Accountant
            : accountant
        )
      );
      toast.success("Accountant information updated successfully");
    } else {
      // Create new accountant
      const newAccountant: Accountant = {
        id: String(accountants.length + 1),
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address,
        joinDate: formData.joinDate || format(new Date(), 'yyyy-MM-dd'),
        isActive: formData.isActive || true
      };
      
      setAccountants(prev => [...prev, newAccountant]);
      toast.success("Accountant added successfully");
    }
    
    setOpenDialog(false);
  };

  const filteredAccountants = accountants.filter(accountant => 
    accountant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accountant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accountant.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Accountants" 
        description="Manage accounting staff who handle fee collections"
        action={{
          label: "Add Accountant",
          icon: <UserPlus className="mr-2 h-4 w-4" />,
          onClick: handleCreate
        }}
      />

      <Card className="shadow-subtle animate-scale-in">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            All Accountants
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accountants..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccountants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    {searchTerm 
                      ? "No accountants match your search criteria." 
                      : "No accountants found. Add an accountant to get started."
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccountants.map((accountant) => (
                  <TableRow key={accountant.id} className="hover-scale">
                    <TableCell className="font-medium">{accountant.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {accountant.email}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {accountant.phone}
                    </TableCell>
                    <TableCell>
                      {format(new Date(accountant.joinDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={accountant.isActive ? "default" : "outline"}>
                        {accountant.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(accountant)}
                      >
                        <FileEdit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
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
              {editingAccountant ? "Edit Accountant" : "Add New Accountant"}
            </DialogTitle>
            <DialogDescription>
              {editingAccountant 
                ? "Update the accountant's details in the system."
                : "Add a new accountant to handle fee collections."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isActive">
                  Active account
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
                {editingAccountant ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accountants;
