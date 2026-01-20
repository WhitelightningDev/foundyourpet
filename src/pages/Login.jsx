import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Import your AuthContext if using one
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: string }
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ADD this line
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      showMessage("All fields are required!");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showMessage("Please enter a valid email address!");
      return false;
    }
    return true;
  };

  const showMessage = (text, type = "error") => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true); 
    setMessage(null);
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        { email, password }
      );
  
      if (response.status === 200) {
        const { token, user } = response.data;
        login(token, user);
  
        showMessage("Login successful! Redirecting...", "success");
  
        const redirectPath = user?.isAdmin ? "/admin-dashboard" : "/dashboard";
  
        setTimeout(() => {
          navigate(redirectPath);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false); 
      handleLoginError(error);
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
          showMessage("Oops: " + message);
          break;
        case 401:
          showMessage("Incorrect email or password.");
          break;
        case 404:
          showMessage("User not found. Please sign up.");
          break;
        case 409:
          showMessage(message);
          break;
        case 500:
          showMessage("Server error. Please try again later.");
          break;
        default:
          showMessage("An unexpected error occurred. Try again.");
      }
    } else {
      showMessage("Network error. Please check your connection.");
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
            {message ? (
              <div
                className={[
                  "rounded-md border px-3 py-2 text-sm",
                  message.type === "success"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-destructive/30 bg-destructive/10 text-destructive",
                ].join(" ")}
                role="status"
              >
                {message.text}
              </div>
            ) : null}

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
