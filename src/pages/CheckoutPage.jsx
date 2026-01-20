import { useLocation } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import axios from "axios";
import BillingForm from "../components/BillingForm";
import { API_BASE_URL } from "../config/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "../context/AuthContext";

function CheckoutPage() {
  const { state } = useLocation();
  const {
    package: pkg,
    total = 0,
    membership = false,
    membershipObjectId,
    selectedPets = [],
    petDraft,
  } = state || {};

  const { user: authUser, token: authToken } = useContext(AuthContext);
  const token = useMemo(() => authToken || localStorage.getItem("authToken"), [authToken]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    address2: "",
    country: "South Africa",
    province: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed separate membership cost addition since total includes it
  const subtotal = total;
  const petsForDisplay = selectedPets.length
    ? selectedPets
    : petDraft
      ? [petDraft]
      : [];
  const perPetPrice = petsForDisplay.length ? subtotal / petsForDisplay.length : subtotal;
  const isNewPetSubscription = membership && !selectedPets.length && !!petDraft;

  const resolveUserId = () => {
    if (authUser?._id) return authUser._id;

    if (token) {
      try {
        const payload = token.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        const decoded = JSON.parse(atob(padded));
        if (decoded?.userId) return decoded.userId;
      } catch {
        // ignore
      }
    }

    try {
      const storedUser = localStorage.getItem("user");
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      return parsed?._id || null;
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["firstName", "lastName", "address", "province", "zip"];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.zip && !/^\d{4}$/.test(formData.zip)) {
      newErrors.zip = "Please enter a valid postal code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form.");
      return;
    }

    try {
      setIsSubmitting(true);
      const userId = resolveUserId() || "";
      if (!userId) {
        alert("User not logged in or missing user ID.");
        return;
      }

      const petIds = selectedPets.map((pet) => pet._id).filter(Boolean);
      const safePetDraft = isNewPetSubscription
        ? {
            ...petDraft,
            userId,
          }
        : null;

      if (membership && petIds.length === 0 && !safePetDraft) {
        alert("No pet selected for subscription. Please go back and select a pet.");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/payment/createCheckout`, {
        userId,
        petIds,
        amountInCents: Math.round(subtotal * 100),
        membership,
        membershipId: membershipObjectId,
        packageType: pkg?.type || "Standard",
        billingDetails: formData,
        ...(safePetDraft ? { petDraft: safePetDraft } : {}),
      }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);

      const checkoutUrl = response.data?.checkout_url;
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
      } else {
        console.error("Checkout URL not received:", response.data);
        alert("Checkout URL not received from server. Please try again.");
      }
    } catch (err) {
      const data = err?.response?.data;
      const serverMessage = data?.message;
      const providerDetails =
        data?.provider === "yoco"
          ? `Yoco error${data?.status ? ` (${data.status})` : ""}: ${typeof data?.details === "string" ? data.details : "See server logs"}`
          : null;
      const extra =
        data?.details
          ? typeof data.details === "string"
            ? data.details
            : JSON.stringify(data.details)
          : null;
      const requestId = data?.requestId ? `Request ID: ${data.requestId}` : null;
      console.error("Checkout error:", err.response?.data || err.message);
      alert(
        [providerDetails || serverMessage || "There was an error initiating checkout. Please try again.", requestId, extra]
          .filter(Boolean)
          .join("\n")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;ll be redirected to Yoco to complete your payment securely.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="shadow-sm lg:sticky lg:top-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">Order summary</CardTitle>
                  <CardDescription>{pkg?.type || (membership ? "Subscription" : "Order")}</CardDescription>
                </div>
                <Badge variant="secondary">{petsForDisplay.length} pet{petsForDisplay.length === 1 ? "" : "s"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {petsForDisplay.map((pet, index) => (
                  <div key={pet._id || `${pet.name || "pet"}-${index}`} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{pet.name || "Pet"}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {(pet.breed || "Unknown breed")}{pet.species ? ` • ${pet.species}` : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold">R{perPetPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-base font-semibold">R{subtotal.toFixed(2)}</p>
              </div>

              <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                {membership ? (
                  <p>
                    This is a monthly subscription for the selected pet.
                  </p>
                ) : (
                  <p>
                    Tags can only be ordered for pets with an active subscription.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Billing details</CardTitle>
              <CardDescription>Use the billing address linked to your payment method.</CardDescription>
            </CardHeader>
            <CardContent>
              <BillingForm
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleCheckout={handleCheckout}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
