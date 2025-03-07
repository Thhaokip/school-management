import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { classesAPI } from "@/services/api";
import type { Class } from "@/types";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const data = await classesAPI.getAll();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClass = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setCurrentClass(null);
    setIsDialogOpen(true);
  };

  const handleEditClass = (classItem: Class) => {
    setFormData({
      name: classItem.name,
      description: classItem.description || "",
      isActive: classItem.isActive,
    });
    setCurrentClass(classItem);
    setIsDialogOpen(true);
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await classesAPI.delete(id);
      setClasses(classes.filter((classItem) => classItem.id !== id));
      toast.success("Class deleted successfully");
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Failed to delete class");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Please enter a class name");
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (currentClass) {
        // Update existing class
        await classesAPI.update({
          ...currentClass,
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
        });
        
        setClasses(prevClasses => 
          prevClasses.map(cls => 
            cls.id === currentClass.id 
              ? {
                  ...cls,
                  name: formData.name,
                  description: formData.description,
                  isActive: formData.isActive,
                }
              : cls
          )
        );
        
        toast.success("Class updated successfully");
      } else {
        // Create new class
        const newClassData = {
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
        };
        
        const response = await classesAPI.create(newClassData);
        const newClass = {
          id: response.id,
          ...newClassData,
          createdAt: new Date().toISOString(),
        };
        
        setClasses((prev) => [...prev, newClass]);
        toast.success("Class created successfully");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving class:", error);
      toast.error("Failed to save class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Class Management"
        description="Manage classes and sections for fee allocation"
        action={{
          label: "Create Class",
          onClick: handleCreateClass,
          icon: <PlusCircle />,
        }}
      />

      <div className="grid gap-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : classes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Classes Created</h3>
              <p className="text-muted-foreground text-center mb-6">
                Create classes to organize students and assign fee structures
              </p>
              <Button onClick={handleCreateClass}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{classItem.name}</TableCell>
                      <TableCell>{classItem.description || "—"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            classItem.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {classItem.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClass(classItem)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClass(classItem.id)}
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
              {currentClass ? "Edit Class" : "Create Class"}
            </DialogTitle>
            <DialogDescription>
              {currentClass
                ? "Update the details of this class"
                : "Add a new class to the school structure"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Grade 1, Kindergarten, Class 10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of this class"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="status">Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="is-active">Active</Label>
                <Switch
                  id="is-active"
                  checked={formData.isActive}
                  onCheckedChange={handleToggleChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
