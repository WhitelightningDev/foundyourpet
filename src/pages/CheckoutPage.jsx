import { useLocation } from "react-router-dom";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import BillingForm from "../components/BillingForm";
import { API_BASE_URL } from "../config/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "../context/AuthContext";
import { PRICING } from "@/config/pricing";

function CheckoutPage() {
  const { state } = useLocation();
  const {
    package: pkg,
    total = 0,
    membership = false,
    membershipObjectId,
    selectedPets = [],
    petDraft,
    order,
  } = state || {};

  const { user: authUser, token: authToken, refreshUser } = useContext(AuthContext);
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
  const didAttemptRefreshRef = useRef(false);

  const subtotal = total;
  const petsForDisplay = selectedPets.length
    ? selectedPets
    : petDraft
      ? [petDraft]
      : [];
  const isNewPetSubscription = membership && !selectedPets.length && !!petDraft;
  const normalizedOrder = order
    ? {
        tagCount: Number(order.tagCount) || 0,
        tagUnitPrice: Number(order.tagUnitPrice) || PRICING.TAG_ONCE_OFF_RANDS,
        membershipCount: Number(order.membershipCount) || 0,
        membershipUnitPrice: Number(order.membershipUnitPrice) || PRICING.MEMBERSHIP_MONTHLY_RANDS,
      }
    : null;
  const tagTotal = normalizedOrder ? normalizedOrder.tagCount * normalizedOrder.tagUnitPrice : 0;
  const membershipTotalToday = normalizedOrder
    ? normalizedOrder.membershipCount * normalizedOrder.membershipUnitPrice
    : 0;
  const membershipRecurringMonthly = membershipTotalToday;

  const buildPrefillFromUser = (user) => {
    if (!user) return null;

    const rawName = (user?.name || "").toString().trim();
    const rawSurname = (user?.surname || "").toString().trim();
    const fullName = rawName || rawSurname ? `${rawName} ${rawSurname}`.trim() : "";
    const [firstFromFull, ...rest] = fullName.split(/\s+/).filter(Boolean);
    const lastFromFull = rest.join(" ");

    const address = user?.address || {};
    const street = (address?.street || "").toString().trim();
    const city = (address?.city || "").toString().trim();
    const province = (address?.province || "").toString().trim();
    const country = (address?.country || "South Africa").toString().trim();
    const postalCode = (address?.postalCode || "").toString().trim();

    return {
      firstName: firstFromFull || rawName,
      lastName: rawSurname || lastFromFull,
      email: (user?.email || "").toString().trim(),
      address: street,
      address2: city,
      country,
      province,
      zip: postalCode,
    };
  };

  const mergeOnlyEmptyFields = (prev, next) => {
    const merged = { ...prev };
    Object.entries(next || {}).forEach(([key, value]) => {
      const prevValue = (merged[key] || "").toString();
      const nextValue = (value || "").toString();
      if (!prevValue.trim() && nextValue.trim()) merged[key] = nextValue;
    });
    return merged;
  };

  useEffect(() => {
    const getStoredUser = () => {
      if (authUser) return authUser;
      try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    };

    const storedUser = getStoredUser();
    const prefill = buildPrefillFromUser(storedUser);
    if (prefill) {
      setFormData((prev) => mergeOnlyEmptyFields(prev, prefill));
    }

    const needsHardFields =
      !prefill?.firstName?.trim() ||
      !prefill?.lastName?.trim() ||
      !prefill?.address?.trim() ||
      !prefill?.province?.trim() ||
      !prefill?.zip?.trim();

    if (token && needsHardFields && !didAttemptRefreshRef.current) {
      didAttemptRefreshRef.current = true;
      Promise.resolve(refreshUser?.(token))
        .then((fresh) => {
          const freshPrefill = buildPrefillFromUser(fresh);
          if (freshPrefill) setFormData((prev) => mergeOnlyEmptyFields(prev, freshPrefill));
        })
        .catch(() => {
          // ignore: user can still fill the form manually
        });
    }
  }, [authUser, refreshUser, token]);

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

      if (membership) {
        if (!token) {
          alert("Please log in again to start subscription checkout.");
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/subscriptions/checkout`,
          {
            planKey: "MONTHLY",
            petIds,
            ...(safePetDraft ? { petDraft: safePetDraft } : {}),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const actionUrl = response.data?.actionUrl || response.data?.payfastUrl || response.data?.payfast_url;
        const fields = response.data?.fields;

        const submitPayfastForm = (url, formFields) => {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = url;

          Object.entries(formFields || {}).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value === null || value === undefined ? "" : String(value);
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        };

        if (actionUrl && fields && typeof fields === "object") {
          submitPayfastForm(actionUrl, fields);
          return;
        }

        // Fallback: older backend response can provide a browser redirect URL
        const checkoutUrl = response.data?.checkout_url;
        if (checkoutUrl) {
          window.location.assign(checkoutUrl);
          return;
        }

        console.error("Checkout URL not received:", response.data);
        alert("Checkout URL not received from server. Please try again.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/payment/createCheckout`,
        {
          userId,
          petIds,
          amountInCents: Math.round(subtotal * 100),
          membership: false,
          membershipId: membershipObjectId,
          packageType: pkg?.type || "Standard",
          billingDetails: formData,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

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
          You&apos;ll be redirected to {membership ? "PayFast" : "Yoco"} to complete your payment securely.
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
                  </div>
                ))}
              </div>

              <Separator />

              {normalizedOrder ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                      Tags (once-off) · R{normalizedOrder.tagUnitPrice} × {normalizedOrder.tagCount}
                    </p>
                    <p className="font-semibold">R{tagTotal.toFixed(2)}</p>
                  </div>
                  {normalizedOrder.membershipCount ? (
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">
                        Membership (monthly) · R{normalizedOrder.membershipUnitPrice} × {normalizedOrder.membershipCount}
                      </p>
                      <p className="font-semibold">R{membershipTotalToday.toFixed(2)}</p>
                    </div>
                  ) : null}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Total due today</p>
                    <p className="text-base font-semibold">R{subtotal.toFixed(2)}</p>
                  </div>
                  {normalizedOrder.membershipCount ? (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Then monthly</p>
                      <p className="text-xs font-medium">R{membershipRecurringMonthly.toFixed(2)}/month</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="text-base font-semibold">R{subtotal.toFixed(2)}</p>
                </div>
              )}

              <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                {normalizedOrder ? (
                  normalizedOrder.membershipCount ? (
                    <p>
                      You&apos;ll pay once today for your tag(s) and the first month of membership. Membership renews monthly
                      at R{normalizedOrder.membershipUnitPrice} per pet.
                    </p>
                  ) : (
                    <p>This is a once-off tag order. No monthly membership is added.</p>
                  )
                ) : membership ? (
                  <p>This is a monthly subscription for the selected pet.</p>
                ) : (
                  <p>This is a once-off order.</p>
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
