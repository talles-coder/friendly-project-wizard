
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@example.com",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    role: "admin",
  },
  {
    id: "2",
    name: "Afiliado Teste",
    email: "afiliado@example.com",
    cpf: "987.654.321-00",
    phone: "(11) 91234-5678",
    role: "afiliado",
  },
  {
    id: "3",
    name: "Polo Teste",
    email: "polo@example.com",
    cpf: "456.789.123-00",
    phone: "(11) 94567-8901",
    role: "polo",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, accept any password with valid email
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
