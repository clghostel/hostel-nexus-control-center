
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Hostel {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'user';
  hostel_id: string | null;
}

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'user';
  hostel_id: string | null;
  hostel?: Hostel;
}

interface AuthContextType {
  user: AuthUser | null;
  hostels: Hostel[];
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Mock data
const mockHostels: Hostel[] = [
  {
    id: '1',
    name: 'Sunrise Hostel',
    address: '123 Main St, Mumbai',
    email: 'contact@sunrise.com',
    phone: '+91 9876543210'
  },
  {
    id: '2',
    name: 'Blue Sky Residence',
    address: '456 Park Ave, Delhi',
    email: 'info@bluesky.com',
    phone: '+91 9876543211'
  },
  {
    id: '3',
    name: 'Green Valley Hostel',
    address: '789 Garden Road, Bangalore',
    email: 'admin@greenvalley.com',
    phone: '+91 9876543212'
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hostellog.com',
    password: 'admin123',
    full_name: 'Admin User',
    phone: '+91 9999999999',
    role: 'admin',
    hostel_id: null
  },
  {
    id: '2',
    email: 'manager@sunrise.com',
    password: 'user123',
    full_name: 'Raj Sharma',
    phone: '+91 9876543210',
    role: 'user',
    hostel_id: '1'
  },
  {
    id: '3',
    email: 'manager@bluesky.com',
    password: 'user123',
    full_name: 'Priya Patel',
    phone: '+91 9876543211',
    role: 'user',
    hostel_id: '2'
  },
  {
    id: '4',
    email: 'manager@greenvalley.com',
    password: 'user123',
    full_name: 'Amit Kumar',
    phone: '+91 9876543212',
    role: 'user',
    hostel_id: '3'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const hostel = userData.hostel_id ? mockHostels.find(h => h.id === userData.hostel_id) : undefined;
      setUser({ ...userData, hostel });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const hostel = foundUser.hostel_id ? mockHostels.find(h => h.id === foundUser.hostel_id) : undefined;
      const authUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        full_name: foundUser.full_name,
        phone: foundUser.phone,
        role: foundUser.role,
        hostel_id: foundUser.hostel_id,
        hostel
      };
      
      setUser(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      hostels: mockHostels,
      users: mockUsers,
      login,
      logout,
      isLoading
    }}>
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
