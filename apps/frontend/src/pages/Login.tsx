import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import CaeloLogo from "@/components/CaeloLogo";

const Login = () => {
  const [email, setEmail] = useState("user@withcaelo.ai");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <CaeloLogo className="mb-12" />
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Please enter your details to login</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="user@withcaelo.ai"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberPassword}
                  onCheckedChange={(checked) => setRememberPassword(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-700"
                >
                  Remember password
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-red-500 hover:text-red-600"
              >
                Forgot Password?
              </Link>
            </div>

            <Button asChild className="w-full bg-caelo-navy hover:bg-caelo-navy-light">
              <Link to="/dashboard">Login</Link>
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-caelo-navy hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="flex-1 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center relative overflow-hidden">
        <div className="text-center text-white z-10">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Get the Funds Your<br />
            Business Needs,<br />
            Fast and Simple
          </h2>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/80 to-orange-600/80"></div>
      </div>
    </div>
  );
};

export default Login;