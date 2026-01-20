import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function BillingForm({ formData, errors, handleChange, handleCheckout, isSubmitting = false }) {
  const fieldWrapperClass = "space-y-1.5";
  const fieldLabelClass = "text-sm";
  const fieldErrorClass = "text-xs font-medium text-destructive";
  const selectBaseClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <>
      <form
        className="grid gap-4"
        noValidate
        onSubmit={handleCheckout}
      >
        {[
          { id: "firstName", label: "First name", required: true, type: "text" },
          { id: "lastName", label: "Last name", required: true, type: "text" },
          { id: "email", label: "Email (Optional)", required: false, type: "email" },
          { id: "address", label: "Address", required: true, type: "text" },
          { id: "address2", label: "Address 2", required: false, type: "text" },
          {
            id: "country",
            label: "Country",
            required: true,
            type: "select",
            options: ["South Africa"],
          },
          {
            id: "province",
            label: "Province",
            required: true,
            type: "select",
            options: [
              "Gauteng",
              "Western Cape",
              "KwaZulu-Natal",
              "Eastern Cape",
              "Free State",
              "Limpopo",
              "Mpumalanga",
              "North West",
              "Northern Cape",
            ],
          },
          { id: "zip", label: "Postal Code", required: true, type: "text" },
        ].map(({ id, label, required, type, options }) => (
          <div key={id} className={fieldWrapperClass}>
            <Label htmlFor={id} className={cn(fieldLabelClass, errors[id] && "text-destructive")}>
              {label}{required && <span className="text-destructive"> *</span>}
            </Label>
            {type === "select" ? (
              <select
                id={id}
                value={formData[id]}
                onChange={handleChange}
                required={required}
                className={cn(selectBaseClass, errors[id] && "border-destructive")}
                aria-invalid={!!errors[id]}
              >
                <option value="">Choose...</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type={type}
                id={id}
                value={formData[id]}
                onChange={handleChange}
                required={required}
                aria-invalid={!!errors[id]}
                className={cn(errors[id] && "border-destructive")}
              />
            )}
            {errors[id] && (
              <p className={fieldErrorClass}>
                {errors[id]}
              </p>
            )}
          </div>
        ))}

        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting…
            </>
          ) : (
            "Complete checkout"
          )}
        </Button>
      </form>
    </>
  );
}

export default BillingForm;
