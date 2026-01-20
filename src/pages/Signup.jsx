import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { toast } from "sonner";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "First name is required";
    if (!formData.surname) newErrors.surname = "Last name is required";
    if (!formData.contact) newErrors.contact = "Contact number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    )
      newErrors.confirmPassword = "Passwords do not match";

    const addressFields = ["street", "city", "province", "postalCode", "country"];
    addressFields.forEach((field) => {
      if (!formData.address[field]) {
        newErrors[`address.${field}`] = `${field[0].toUpperCase() + field.slice(1)} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/users/signup`,
          formData
        );

        toast.success(response.data?.message || response.data?.msg || "Signup successful!");
        try {
          sessionStorage.setItem("pendingVerificationEmail", formData.email || "");
        } catch {
          // no-op
        }

        setTimeout(() => {
          navigate("/signup-success", { state: { email: formData.email || "" } });
        }, 2000);
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          const validationErrors = Array.isArray(data?.errors) ? data.errors : [];
          const firstValidationError =
            validationErrors.length > 0 ? validationErrors[0]?.msg : null;

          toast.error(
            data?.message ||
              data?.msg ||
              firstValidationError ||
              "Signup failed. Please try again."
          );
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const provinceSelectClassName = [
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    !formData.address.province ? "text-muted-foreground" : "",
  ].join(" ");

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img className="h-12 w-12 rounded" src="/android-chrome-192x192.png" alt="Logo" />
              <div className="min-w-0">
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                  Fill in your details below — you&apos;ll be ready in under a minute.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <section className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">User details</h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">First name</Label>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane"
                        autoComplete="given-name"
                        required
                      />
                      {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surname">Last name</Label>
                      <Input
                        id="surname"
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Doe"
                        autoComplete="family-name"
                        required
                      />
                      {errors.surname ? (
                        <p className="text-xs text-destructive">{errors.surname}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Cell number</Label>
                    <Input
                      id="contact"
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="+27"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                    />
                    {errors.contact ? (
                      <p className="text-xs text-destructive">{errors.contact}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      autoComplete="email"
                      inputMode="email"
                      required
                    />
                    {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>

                  <div className="space-y-2">
                    <Label htmlFor="address.street">Street address</Label>
                    <Input
                      id="address.street"
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      autoComplete="street-address"
                      required
                    />
                    {errors["address.street"] ? (
                      <p className="text-xs text-destructive">{errors["address.street"]}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address.city">City</Label>
                      <Input
                        id="address.city"
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="Cape Town"
                        autoComplete="address-level2"
                        required
                      />
                      {errors["address.city"] ? (
                        <p className="text-xs text-destructive">{errors["address.city"]}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.province">Province</Label>
                      <select
                        id="address.province"
                        name="address.province"
                        value={formData.address.province}
                        onChange={handleChange}
                        required
                        className={provinceSelectClassName}
                      >
                        <option value="">Select province</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="North West">North West</option>
                        <option value="Northern Cape">Northern Cape</option>
                        <option value="Western Cape">Western Cape</option>
                      </select>
                      {errors["address.province"] ? (
                        <p className="text-xs text-destructive">{errors["address.province"]}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address.postalCode">Postal code</Label>
                      <Input
                        id="address.postalCode"
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        placeholder="8001"
                        autoComplete="postal-code"
                        required
                      />
                      {errors["address.postalCode"] ? (
                        <p className="text-xs text-destructive">{errors["address.postalCode"]}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.country">Country</Label>
                      <Input
                        id="address.country"
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        placeholder="South Africa"
                        autoComplete="country-name"
                        required
                      />
                      {errors["address.country"] ? (
                        <p className="text-xs text-destructive">{errors["address.country"]}</p>
                      ) : null}
                    </div>
                  </div>
                </section>
              </div>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Security</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleShowPasswordChange}
                    aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                    />
                    {errors.password ? (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      required
                    />
                    {errors.confirmPassword ? (
                      <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                    ) : null}
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">
                  By signing up, you agree to the terms of use.
                </p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">Already have an account?</p>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Signup;
