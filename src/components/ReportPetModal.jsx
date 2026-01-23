import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ReportStatusBadge from "@/components/ReportStatusBadge";
import { cn } from "@/lib/utils";
import { freeServices, normalizeReport } from "@/services/free";

const emptyForm = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  photoFile: null,
  petStatus: "lost",
  location: "",
  description: "",
};

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function buildStepErrors(stepIndex, form) {
  const errors = {};

  if (stepIndex === 0) {
    if (!["lost", "found"].includes(form.petStatus)) errors.petStatus = "Please select Lost or Found.";
    if (!form.location.trim()) errors.location = "Location is required.";
  }

  if (stepIndex === 1) {
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required.";
    else if (digitsOnly(form.phoneNumber).length < 7) errors.phoneNumber = "Please enter a valid phone number.";
  }

  if (stepIndex === 2) {
    if (!form.photoFile) errors.photoFile = "Pet photo is required.";
  }

  return errors;
}

function Stepper({ steps, activeIndex }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, idx) => {
          const isComplete = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={step.key} className="flex min-w-0 flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary text-primary",
                  !isComplete && !isActive && "border-muted-foreground/20 text-muted-foreground"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? <Check className="h-4 w-4" /> : idx + 1}
              </div>

              <div className="min-w-0">
                <div
                  className={cn(
                    "truncate text-sm",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </div>
              </div>

              {idx !== steps.length - 1 ? (
                <div className="hidden h-px flex-1 bg-border sm:block" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-3 sm:hidden">
        <div className="text-sm font-medium text-foreground">{steps[activeIndex]?.label}</div>
        {steps[activeIndex]?.description ? (
          <div className="mt-1 text-xs text-muted-foreground">{steps[activeIndex].description}</div>
        ) : null}
      </div>
    </div>
  );
}

export default function ReportPetModal({ open, onOpenChange, onSubmitted }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  const steps = useMemo(
    () => [
      {
        key: "status",
        label: "Details",
        description: "Tell the community what happened and where.",
      },
      {
        key: "contact",
        label: "Contact",
        description: "Who should be contacted if someone helps?",
      },
      {
        key: "photo",
        label: "Photo",
        description: "A clear photo helps with quick identification.",
      },
      {
        key: "review",
        label: "Review",
        description: "Double-check before posting.",
      },
    ],
    []
  );

  const selectBaseClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  useEffect(() => {
    if (!form.photoFile) {
      setPhotoPreviewUrl(null);
      return undefined;
    }

    const url = URL.createObjectURL(form.photoFile);
    setPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.photoFile]);

  const resetAll = () => {
    setStepIndex(0);
    setForm(emptyForm);
    setErrors({});
    setSubmitting(false);
    setPhotoPreviewUrl(null);
  };

  useEffect(() => {
    if (!open) resetAll();
  }, [open]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (idx) => {
    const nextErrors = buildStepErrors(idx, form);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(stepIndex)) {
      toast.error("Please complete the required fields.");
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const submit = async () => {
    // Validate all steps in case the user skipped back/forth.
    for (let i = 0; i < 3; i += 1) {
      const nextErrors = buildStepErrors(i, form);
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        setStepIndex(i);
        toast.error("Please complete the required fields.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await freeServices.reports.submitPublicPetReport({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        petStatus: form.petStatus,
        location: form.location.trim(),
        description: form.description.trim(),
        photoFile: form.photoFile,
      });

      if (!res?.ok) {
        toast.error("Couldn't submit report.");
        return;
      }

      if (res?.data?.local) {
        toast.message("Report saved locally.", {
          description: res.warning || "We’ll sync when the server is available.",
        });
      } else {
        toast.success("Report posted.");
      }

      const created =
        (res?.report ? normalizeReport(res.report) : null) ||
        (res?.data?.report ? normalizeReport(res.data.report) : null);

      onSubmitted?.({ report: created, raw: res });
      onOpenChange?.(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <div className="border-b bg-gradient-to-br from-primary/10 via-background to-secondary/35 px-6 py-5">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-xl">Report a Lost or Found Pet</DialogTitle>
                <DialogDescription>
                  A quick step-by-step post — no login required.
                </DialogDescription>
              </div>
              <ReportStatusBadge status={form.petStatus} />
            </div>
          </DialogHeader>

          <div className="mt-4">
            <Stepper steps={steps} activeIndex={stepIndex} />
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {stepIndex === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pet-status" className={cn(errors.petStatus && "text-destructive")}>
                  Status <span className="text-destructive">*</span>
                </Label>
                <select
                  id="pet-status"
                  value={form.petStatus}
                  onChange={(e) => updateField("petStatus", e.target.value)}
                  className={cn(selectBaseClass, errors.petStatus && "border-destructive")}
                  aria-invalid={!!errors.petStatus}
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
                {errors.petStatus ? (
                  <p className="text-xs font-medium text-destructive">{errors.petStatus}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pet-location" className={cn(errors.location && "text-destructive")}>
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pet-location"
                  placeholder="e.g. Sea Point, Cape Town"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className={cn(errors.location && "border-destructive")}
                  aria-invalid={!!errors.location}
                />
                {errors.location ? (
                  <p className="text-xs font-medium text-destructive">{errors.location}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Be as specific as you can.</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Separator className="my-2" />
                <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">Tip</div>
                  <div className="mt-1">
                    If you include a description, mention collar color, markings, and last seen time.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="first-name" className={cn(errors.firstName && "text-destructive")}>
                  First name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="first-name"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={cn(errors.firstName && "border-destructive")}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName ? (
                  <p className="text-xs font-medium text-destructive">{errors.firstName}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="last-name" className={cn(errors.lastName && "text-destructive")}>
                  Last name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="last-name"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={cn(errors.lastName && "border-destructive")}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName ? (
                  <p className="text-xs font-medium text-destructive">{errors.lastName}</p>
                ) : null}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="phone" className={cn(errors.phoneNumber && "text-destructive")}>
                  Phone number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  placeholder="e.g. +27 82 123 4567"
                  value={form.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                  className={cn(errors.phoneNumber && "border-destructive")}
                  aria-invalid={!!errors.phoneNumber}
                />
                {errors.phoneNumber ? (
                  <p className="text-xs font-medium text-destructive">{errors.phoneNumber}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    This is shown on the post so helpers can reach you.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="photo" className={cn(errors.photoFile && "text-destructive")}>
                  Pet photo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateField("photoFile", e.target.files?.[0] || null)}
                  className={cn(errors.photoFile && "border-destructive")}
                  aria-invalid={!!errors.photoFile}
                />

                {photoPreviewUrl ? (
                  <div className="mt-3 flex items-start gap-4 rounded-xl border bg-card p-3">
                    <img
                      src={photoPreviewUrl}
                      alt="Selected pet"
                      className="h-20 w-20 rounded-md border object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{form.photoFile?.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        If possible, use a well-lit photo with the pet’s face visible.
                      </div>
                      <div className="mt-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => updateField("photoFile", null)}>
                          Remove photo
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                    <div>Upload a clear photo to increase visibility in the feed.</div>
                  </div>
                )}

                {errors.photoFile ? (
                  <p className="text-xs font-medium text-destructive">{errors.photoFile}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any details that can help identify the pet (breed, collar, markings, last seen time, etc.)"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium text-foreground">Post preview</div>
                  <ReportStatusBadge status={form.petStatus} />
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <div className="aspect-square overflow-hidden rounded-lg border bg-muted/20">
                      {photoPreviewUrl ? (
                        <img
                          src={photoPreviewUrl}
                          alt="Selected pet"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          Photo required
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <div className="text-sm">
                      <span className="font-medium">Location:</span>{" "}
                      <span className="text-muted-foreground">{form.location.trim() || "—"}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Contact:</span>{" "}
                      <span className="text-muted-foreground">
                        {[form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(" ") || "—"} ·{" "}
                        {form.phoneNumber.trim() || "—"}
                      </span>
                    </div>
                    {form.description.trim() ? (
                      <div className="text-sm">
                        <span className="font-medium">Description:</span>{" "}
                        <span className="text-muted-foreground">{form.description.trim()}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No description added.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                Please double-check your phone number and location — those are the fastest ways for someone to help.
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="gap-2 border-t bg-background px-6 py-4 sm:gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} disabled={submitting}>
            Cancel
          </Button>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={goBack} disabled={submitting || stepIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            {stepIndex < steps.length - 1 ? (
              <Button type="button" onClick={goNext} disabled={submitting}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={submit} disabled={submitting}>
                {submitting ? "Posting…" : "Post report"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
