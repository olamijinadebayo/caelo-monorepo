import { Link, useLocation } from "react-router-dom";
import { Search, BarChart3, Settings, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CaeloLogo from "./CaeloLogo";
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/analytics", icon: BarChart3, current: location.pathname === "/analytics" },
    { name: "Settings", href: "/settings", icon: Settings, current: location.pathname === "/settings" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6">
        <CaeloLogo />
      </div>

      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search" 
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <nav className="flex-1 px-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-gray-200">

        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-gray-900" onClick={logout}>
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
        
        <div className="mt-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">User Name</p>
            <p className="text-xs text-gray-500">User@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;