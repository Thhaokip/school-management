
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define user roles
export type UserRole = 'admin' | 'accountant';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from an API/database
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, NEVER store passwords in plain text
    role: 'admin' as UserRole
  },
  {
    id: '2',
    name: 'Accountant User',
    email: 'accountant@example.com',
    password: 'accountant123',
    role: 'accountant' as UserRole
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage (for persistence)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user with matching credentials
    const matchedUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (matchedUser) {
      // Create user object (without password)
      const { password, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Redirect based on role
      if (userWithoutPassword.role === 'accountant') {
        navigate('/payments');
      } else {
        navigate('/');
      }
      
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
