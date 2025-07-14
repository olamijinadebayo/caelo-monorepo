
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { AuthService, LoginRequest } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/use-toast';

const DEMO_USERS = [
  { label: "Admin (Sarah)", email: "sarah@withcaelo.ai" },
  { label: "Analyst (Mike)", email: "mike@cdfi.example.org" },
  { label: "Borrower (Jessica)", email: "jessica@smallbiz.com" },
];

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginRequest>();

  const [selectedDemo, setSelectedDemo] = useState<string>("");

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: "Login Successful",
        description: "Welcome to Caelo!",
      });
    } catch (error: unknown) {
      toast({
        title: "Login Failed",
        description: (error as Error).message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const email = e.target.value;
    setSelectedDemo(email);
    if (email) {
      setValue("email", email);
      setValue("password", "demo123");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign In to Caelo</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-user">Switch User (Demo)</Label>
            <select
              id="demo-user"
              className="w-full border rounded px-2 py-1"
              value={selectedDemo}
              onChange={handleDemoChange}
            >
              <option value="">Select a demo user</option>
              {DEMO_USERS.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.label}
                </option>
              ))}
            </select>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
