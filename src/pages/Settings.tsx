import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Lock, Bell, Database, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Settings" 
        description="Manage your application preferences and configuration"
      />

      <div className="grid gap-6">
        <Card className="shadow-subtle animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Configure the general application behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSave">Auto-save changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save form changes as you type
                  </p>
                </div>
                <Switch id="autoSave" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
                <Switch id="darkMode" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle animate-scale-in animate-delay-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important events
                  </p>
                </div>
                <Switch id="emailNotifications" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="feeReminders">Fee Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send automatic reminders for fee payments
                  </p>
                </div>
                <Switch id="feeReminders" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reportGeneration">Report Generation Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when reports are generated
                  </p>
                </div>
                <Switch id="reportGeneration" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle animate-scale-in animate-delay-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Database Settings</CardTitle>
            </div>
            <CardDescription>Manage database configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Database settings will be available once you connect with Supabase.
            </p>
            <Button variant="outline">Connect Database</Button>
          </CardContent>
        </Card>

        <Card className="shadow-subtle animate-scale-in animate-delay-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>Manage security settings and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require additional verification when logging in
                  </p>
                </div>
                <Switch id="twoFactorAuth" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sessionTimeout">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out inactive users after 30 minutes
                  </p>
                </div>
                <Switch id="sessionTimeout" defaultChecked />
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
