
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SchoolProfile as SchoolProfileType } from '@/types';
import { PencilIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { schoolProfileAPI } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SchoolProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['schoolProfile'],
    queryFn: schoolProfileAPI.get
  });

  const [formData, setFormData] = useState<SchoolProfileType | null>(null);

  // Set form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const saveProfileMutation = useMutation({
    mutationFn: schoolProfileAPI.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schoolProfile'] });
      setIsEditing(false);
      toast.success("School profile updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to save profile: ${(error as Error).message}`);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      saveProfileMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <h3 className="text-lg font-medium">Error loading school profile</h3>
          <p>{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (!profile || !formData) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
          <h3 className="text-lg font-medium">No profile found</h3>
          <p>Please create a school profile to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="School Profile" 
        description="View and manage your school details"
        action={
          !isEditing ? {
            label: "Edit Profile",
            icon: <PencilIcon className="mr-2 h-4 w-4" />,
            onClick: () => setIsEditing(true)
          } : undefined
        }
      />

      <Card className="shadow-subtle animate-scale-in">
        <CardContent className="pt-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established">Established Year</Label>
                  <Input
                    id="established"
                    name="established"
                    value={formData.established || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  disabled={saveProfileMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={saveProfileMutation.isPending}
                >
                  {saveProfileMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-24 h-24 rounded-md bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-2xl text-primary">
                    {profile.name.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">
                    Established: {profile.established || 'N/A'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-muted-foreground text-sm mb-2">Contact Information</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Email:</span> {profile.email}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span> {profile.phone}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Website:</span> {profile.website || 'N/A'}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground text-sm mb-2">Address</h3>
                  <p>
                    {profile.address}, {profile.city}, <br />
                    {profile.state}, {profile.zipCode}
                  </p>
                </div>
              </div>
              
              {profile.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-muted-foreground text-sm mb-2">About</h3>
                    <p>{profile.description}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolProfile;
