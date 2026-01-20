import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Import your AuthContext if using one
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ADD this line
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      toast.error("All fields are required.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true); 
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        { email, password }
      );
  
      if (response.status === 200) {
        const { token, user } = response.data;
        login(token, user);
        const redirectPath = user?.isAdmin ? "/admin-dashboard" : "/dashboard";
        toast.success("Signed in successfully.");
        navigate(redirectPath);
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoginError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const validationErrors = Array.isArray(data?.errors) ? data.errors : [];
      const firstValidationError =
        validationErrors.length > 0 ? validationErrors[0]?.msg : null;
      const message =
        data?.error ||
        data?.message ||
        data?.msg ||
        firstValidationError ||
        "An unexpected error occurred.";
  
      switch (status) {
        case 400:
          toast.error(message);
          break;
        case 401:
          toast.error("Incorrect email or password.");
          break;
        case 404:
          toast.error("User not found. Please sign up.");
          break;
        case 409:
          toast.error(message);
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error("An unexpected error occurred. Try again.");
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }
  };
  

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <img
                className="h-10 w-10 rounded"
                src="/android-chrome-192x192.png"
                alt="Logo"
              />
              <div className="min-w-0">
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Welcome back — enter your details to continue.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Signing you in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                By signing in, you agree to the terms of use.
              </p>
            </form>

            <Separator />

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button variant="outline" asChild>
                <Link to="/password-reset">Forgot password</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Create account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;
