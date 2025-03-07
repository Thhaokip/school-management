import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { mockSchoolProfile } from '@/data/mockData';
import { toast } from 'sonner';
import { SchoolProfile as SchoolProfileType } from '@/types';
import { PencilIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const SchoolProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<SchoolProfileType>(mockSchoolProfile);
  const [formData, setFormData] = useState<SchoolProfileType>(mockSchoolProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    toast.success("School profile updated successfully");
  };

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
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
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
