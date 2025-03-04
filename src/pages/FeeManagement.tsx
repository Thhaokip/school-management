
import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { FeeHead, Class } from "@/types";

export default function FeeManagement() {
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFeeHead, setCurrentFeeHead] = useState<FeeHead | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    isOneTime: true,
    classIds: [] as string[],
  });

  // Simulate loading classes from an API
  useEffect(() => {
    // This would be an API call in a real application
    // For now, we'll use some mock data
    const mockClasses: Class[] = [
      {
        id: "1",
        name: "Grade 1",
        description: "First grade elementary",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Grade 2",
        description: "Second grade elementary",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Grade 3",
        description: "Third grade elementary",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
    setClasses(mockClasses);
  }, []);

  const handleCreateFeeHead = () => {
    setFormData({
      name: "",
      description: "",
      amount: "",
      isOneTime: true,
      classIds: [],
    });
    setCurrentFeeHead(null);
    setIsDialogOpen(true);
  };

  const handleEditFeeHead = (feeHead: FeeHead) => {
    setFormData({
      name: feeHead.name,
      description: feeHead.description || "",
      amount: feeHead.amount.toString(),
      isOneTime: feeHead.isOneTime,
      classIds: feeHead.classIds || [],
    });
    setCurrentFeeHead(feeHead);
    setIsDialogOpen(true);
  };

  const handleDeleteFeeHead = (id: string) => {
    setFeeHeads(feeHeads.filter((feeHead) => feeHead.id !== id));
    toast.success("Fee head deleted successfully");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isOneTime: checked }));
  };

  const handleClassToggle = (classId: string) => {
    setFormData((prev) => {
      const classIds = prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId];
      return { ...prev, classIds };
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (currentFeeHead) {
      // Update existing fee head
      const updatedFeeHeads = feeHeads.map((fh) =>
        fh.id === currentFeeHead.id
          ? {
              ...fh,
              name: formData.name,
              description: formData.description,
              amount: amount,
              isOneTime: formData.isOneTime,
              classIds: formData.classIds,
            }
          : fh
      );
      setFeeHeads(updatedFeeHeads);
      toast.success("Fee head updated successfully");
    } else {
      // Create new fee head
      const newFeeHead: FeeHead = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        amount: amount,
        isOneTime: formData.isOneTime,
        isActive: true,
        createdAt: new Date().toISOString(),
        classIds: formData.classIds,
      };
      setFeeHeads((prev) => [...prev, newFeeHead]);
      toast.success("Fee head created successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Fee Management"
        description="Manage fee structure by creating and modifying fee heads"
        action={{
          label: "Create Fee Head",
          onClick: handleCreateFeeHead,
          icon: <PlusCircle />,
        }}
      />

      <div className="grid gap-6">
        {feeHeads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Fee Heads Created</h3>
              <p className="text-muted-foreground text-center mb-6">
                Create fee heads to define the fee structure for students
              </p>
              <Button onClick={handleCreateFeeHead}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Fee Head
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Applicable Classes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeHeads.map((feeHead) => (
                    <TableRow key={feeHead.id}>
                      <TableCell className="font-medium">{feeHead.name}</TableCell>
                      <TableCell>₹{feeHead.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        {feeHead.isOneTime ? "One Time" : "Monthly"}
                      </TableCell>
                      <TableCell>
                        {feeHead.classIds && feeHead.classIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {feeHead.classIds.map(classId => {
                              const classItem = classes.find(c => c.id === classId);
                              return classItem ? (
                                <span 
                                  key={classId}
                                  className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                                >
                                  {classItem.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">All Classes</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            feeHead.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {feeHead.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditFeeHead(feeHead)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteFeeHead(feeHead.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentFeeHead ? "Edit Fee Head" : "Create Fee Head"}
            </DialogTitle>
            <DialogDescription>
              {currentFeeHead
                ? "Update the details of this fee head"
                : "Add a new fee head to the fee structure"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Fee Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Tuition Fee, Library Fee"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of this fee"
              />
            </div>
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
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payment-type">Payment Type</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isOneTime ? "One-time payment" : "Monthly payment"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="is-one-time">One Time</Label>
                <Switch
                  id="is-one-time"
                  checked={formData.isOneTime}
                  onCheckedChange={handleToggleChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Applicable Classes</Label>
              <div className="border rounded-md p-4 max-h-36 overflow-y-auto">
                {classes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No classes available</p>
                ) : (
                  <div className="space-y-2">
                    {classes.map((classItem) => (
                      <div key={classItem.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`class-${classItem.id}`}
                          checked={formData.classIds.includes(classItem.id)}
                          onCheckedChange={() => handleClassToggle(classItem.id)}
                        />
                        <Label 
                          htmlFor={`class-${classItem.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {classItem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.classIds.length === 0 
                  ? "If no classes are selected, this fee will apply to all classes." 
                  : `Selected ${formData.classIds.length} ${formData.classIds.length === 1 ? 'class' : 'classes'}.`}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
