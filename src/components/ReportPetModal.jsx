import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Cat,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Dog,
  ImagePlus,
  PawPrint,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import ReportStatusBadge from "@/components/ReportStatusBadge";
import { cn } from "@/lib/utils";
import { fileToJpegDataUrl } from "@/lib/image";
import { freeServices, normalizeReport } from "@/services/free";

function makeEmptyForm(defaultPetStatus) {
  const normalized = String(defaultPetStatus || "").toLowerCase();
  const petStatus = normalized === "found" ? "found" : "lost";
  return {
    petStatus,
    petType: "dog",
    petName: "",
    markings: "",
    lastSeenAt: "",
    location: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    whatsappPreferred: true,
    photoFile: null,
    photoDataUrl: null,
  };
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function safeParseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function hasDraftContent(form) {
  if (!form) return false;
  return Boolean(
    String(form.petName || "").trim() ||
      String(form.markings || "").trim() ||
      String(form.location || "").trim() ||
      String(form.firstName || "").trim() ||
      String(form.lastName || "").trim() ||
      String(form.phoneNumber || "").trim() ||
      String(form.lastSeenAt || "").trim() ||
      form.photoFile ||
      String(form.photoDataUrl || "").trim()
  );
}

function dataUrlToFile(dataUrl, { filename = "pet-photo.jpg" } = {}) {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return null;
  const [meta, b64] = dataUrl.split(",", 2);
  if (!meta || !b64) return null;

  const mimeMatch = meta.match(/^data:(.*?);base64$/);
  const mime = mimeMatch?.[1] || "image/jpeg";

  try {
    const binStr = atob(b64);
    const len = binStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) bytes[i] = binStr.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  } catch {
    return null;
  }
}

function buildStepErrors(stepIndex, form) {
  const errors = {};

  if (stepIndex === 0) {
    if (!["lost", "found"].includes(form.petStatus)) errors.petStatus = "Please select Lost or Found.";
  }

  if (stepIndex === 1) {
    if (!["dog", "cat", "other"].includes(String(form.petType || "").toLowerCase()))
      errors.petType = "Please select Dog, Cat, or Other.";

    if (form.petStatus === "lost" && !form.petName.trim()) {
      errors.petName = "Pet name is required for lost reports.";
    }

    if (form.petStatus === "found" && !form.photoFile && !String(form.photoDataUrl || "").trim()) {
      errors.photoFile = "A photo is required for found reports.";
    }
  }

  if (stepIndex === 2) {
    if (!form.location.trim()) errors.location = "Location is required.";
  }

  if (stepIndex === 3) {
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required.";
    else if (digitsOnly(form.phoneNumber).length < 7) errors.phoneNumber = "Please enter a valid phone number.";
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

export default function ReportPetModal({ open, onOpenChange, onSubmitted, defaultPetStatus }) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(() => makeEmptyForm(defaultPetStatus));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [submittedIsLocal, setSubmittedIsLocal] = useState(false);

  const cameraInputRef = useRef(null);
  const uploadInputRef = useRef(null);
  const wasOpenRef = useRef(false);

  const steps = useMemo(
    () => [
      {
        key: "status",
        label: "Situation",
        description: "Tell us if the pet is lost or found.",
      },
      {
        key: "pet",
        label: "Pet",
        description: "A photo and a few quick details.",
      },
      {
        key: "location",
        label: "Location",
        description: "Landmarks are perfect — it doesn’t have to be exact.",
      },
      {
        key: "review",
        label: "Contact",
        description: "How can people reach you?",
      },
      {
        key: "confirm",
        label: "Review",
        description: "Double-check before posting.",
      },
      {
        key: "done",
        label: "Done",
        description: "Share the report with your community.",
      },
    ],
    []
  );

  const DRAFT_KEY = "publicPetReportDraft:v1";

  useEffect(() => {
    if (!form.photoFile && !form.photoDataUrl) {
      setPhotoPreviewUrl(null);
      return undefined;
    }

    if (form.photoFile) {
      const url = URL.createObjectURL(form.photoFile);
      setPhotoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setPhotoPreviewUrl(form.photoDataUrl);
    return undefined;
  }, [form.photoDataUrl, form.photoFile]);

  useEffect(() => {
    if (!open) {
      setStepIndex(0);
      setErrors({});
      setSubmitting(false);
      setPhotoPreviewUrl(null);
      setSubmittedReport(null);
      setSubmittedIsLocal(false);
      return;
    }

    setStepIndex(0);
    setSubmittedReport(null);
    setSubmittedIsLocal(false);
    setErrors({});
    setSubmitting(false);

    const empty = makeEmptyForm(defaultPetStatus);
    const restored = (() => {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(DRAFT_KEY);
      const parsed = safeParseJson(raw, null);
      if (!parsed?.form) return null;
      return parsed;
    })();

    if (restored?.form) {
      setForm((prev) => ({
        ...prev,
        ...empty,
        ...restored.form,
        petStatus: ["lost", "found"].includes(restored.form.petStatus) ? restored.form.petStatus : empty.petStatus,
        petType: ["dog", "cat", "other"].includes(restored.form.petType) ? restored.form.petType : empty.petType,
        photoFile: null,
        photoDataUrl: typeof restored.form.photoDataUrl === "string" ? restored.form.photoDataUrl : null,
      }));
      const nextStep = Number.isFinite(restored.stepIndex) ? restored.stepIndex : 0;
      setStepIndex(Math.min(Math.max(0, nextStep), steps.length - 2));
      toast.message("Draft restored — continue where you left off.");
    } else {
      setForm(empty);
    }
    setErrors({});
    setSubmitting(false);
  }, [defaultPetStatus, open, steps.length]);

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

  const persistDraft = async () => {
    if (typeof window === "undefined") return;
    if (!hasDraftContent(form)) return;
    if (submittedReport) return;

    const photoDataUrl =
      form.photoDataUrl ||
      (form.photoFile
        ? await fileToJpegDataUrl(form.photoFile, { maxSize: 720, quality: 0.82 }).catch(() => null)
        : null);

    const safeForm = {
      ...form,
      photoFile: null,
      photoDataUrl: typeof photoDataUrl === "string" && photoDataUrl.length < 1_200_000 ? photoDataUrl : null,
    };

    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          v: 1,
          savedAt: new Date().toISOString(),
          stepIndex,
          form: safeForm,
        })
      );
    } catch {
      // ignore
    }
  };

  const clearDraft = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => {
      persistDraft();
    }, 350);
    return () => window.clearTimeout(t);
  }, [form, open, stepIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;
    if (wasOpen && !open) {
      // Modal just closed.
      persistDraft();
      if (hasDraftContent(form) && !submittedReport) {
        toast.message("Your report has been saved — continue where you left off.");
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async () => {
    // Validate all required steps in case the user skipped back/forth.
    for (let i = 0; i <= 3; i += 1) {
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
      const photoToSubmit =
        form.photoFile || (form.photoDataUrl ? dataUrlToFile(form.photoDataUrl) : null);

      const descriptionParts = [
        form.markings.trim() ? `Colour / markings: ${form.markings.trim()}` : null,
        form.lastSeenAt ? `Time last seen: ${form.lastSeenAt}` : null,
        form.whatsappPreferred ? "WhatsApp: Yes" : null,
      ].filter(Boolean);

      const res = await freeServices.reports.submitPublicPetReport({
        petName: form.petName.trim(),
        petType: form.petType,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        petStatus: form.petStatus,
        location: form.location.trim(),
        description: descriptionParts.join("\n"),
        photoFile: photoToSubmit,
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
      clearDraft();
      setSubmittedReport(created);
      setSubmittedIsLocal(Boolean(res?.data?.local));
      setStepIndex(steps.length - 1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      persistDraft();
    }
    onOpenChange?.(nextOpen);
  };

  const shareUrl =
    typeof window !== "undefined" && submittedReport?.id
      ? `${window.location.origin}/share/report/${encodeURIComponent(String(submittedReport.id))}`
      : "";
  const canShare = Boolean(shareUrl) && !submittedIsLocal;

  const shareText = (() => {
    const petName = String(submittedReport?.petName || form.petName || "").trim();
    const location = String(submittedReport?.location || form.location || "").trim();
    const status = String(submittedReport?.petStatus || form.petStatus || "").toLowerCase() === "found" ? "Found" : "Lost";
    const pieces = [
      `${status} pet report${petName ? `: ${petName}` : ""}`,
      location ? `Location: ${location}` : null,
    ].filter(Boolean);
    return pieces.join(" • ");
  })();

  const openWhatsAppShare = () => {
    if (!canShare) return;
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openFacebookShare = () => {
    if (!canShare) return;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyShareLink = async () => {
    if (!canShare) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied.");
    } catch {
      toast.error("Couldn't copy link.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100vw-1.5rem)] flex-col overflow-hidden p-0 sm:max-w-xl">
        <div className="border-b bg-gradient-to-br from-primary/10 via-background to-secondary/35 px-4 py-4 sm:px-6 sm:py-5">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-xl">Report a Lost or Found Pet</DialogTitle>
                <DialogDescription>
                  A simple step-by-step report — no login required.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {submittedReport ? null : <ReportStatusBadge status={form.petStatus} />}
                {submittedReport ? null : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearDraft();
                      setSubmittedReport(null);
                      setErrors({});
                      setSubmitting(false);
                      setStepIndex(0);
                      setForm(makeEmptyForm(defaultPetStatus));
                      toast.message("Started a new report.");
                    }}
                  >
                    Start over
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4">
            <Stepper steps={steps} activeIndex={stepIndex} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {stepIndex === 0 ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-lg font-semibold tracking-tight">What’s the situation?</div>
                <div className="text-sm text-muted-foreground">
                  Choose what best describes the situation right now.
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-14 justify-start gap-3 rounded-xl border-2 text-left",
                    form.petStatus === "lost" && "border-red-300 bg-red-50 text-red-900 hover:bg-red-50"
                  )}
                  onClick={() => updateField("petStatus", "lost")}
                >
                  <AlertTriangle className="h-5 w-5" />
                  <div className="min-w-0">
                    <div className="font-semibold">Lost</div>
                    <div className="text-xs text-muted-foreground">The pet is missing.</div>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-14 justify-start gap-3 rounded-xl border-2 text-left",
                    form.petStatus === "found" && "border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-50"
                  )}
                  onClick={() => updateField("petStatus", "found")}
                >
                  <CheckCircle className="h-5 w-5" />
                  <div className="min-w-0">
                    <div className="font-semibold">Found</div>
                    <div className="text-xs text-muted-foreground">You have the pet with you.</div>
                  </div>
                </Button>
              </div>

              {errors.petStatus ? (
                <p className="text-xs font-medium text-destructive">{errors.petStatus}</p>
              ) : null}
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-lg font-semibold tracking-tight">Tell us about the pet</div>
                <div className="text-sm text-muted-foreground">Only what’s essential — photos do most of the work.</div>
              </div>

              <div className="space-y-2">
                <div className={cn("text-sm font-medium", errors.petType && "text-destructive")}>
                  Pet type <span className="text-destructive">*</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("h-12 justify-start gap-2", form.petType === "dog" && "border-primary/50 bg-primary/5")}
                    onClick={() => updateField("petType", "dog")}
                  >
                    <Dog className="h-5 w-5" /> Dog
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("h-12 justify-start gap-2", form.petType === "cat" && "border-primary/50 bg-primary/5")}
                    onClick={() => updateField("petType", "cat")}
                  >
                    <Cat className="h-5 w-5" /> Cat
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("h-12 justify-start gap-2", form.petType === "other" && "border-primary/50 bg-primary/5")}
                    onClick={() => updateField("petType", "other")}
                  >
                    <PawPrint className="h-5 w-5" /> Other
                  </Button>
                </div>
                {errors.petType ? <p className="text-xs font-medium text-destructive">{errors.petType}</p> : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pet-name" className={cn(errors.petName && "text-destructive")}>
                  Pet name{" "}
                  {form.petStatus === "lost" ? <span className="text-destructive">*</span> : <span className="text-muted-foreground">(optional)</span>}
                </Label>
                <Input
                  id="pet-name"
                  placeholder="e.g. Bella"
                  value={form.petName}
                  onChange={(e) => updateField("petName", e.target.value)}
                  className={cn(errors.petName && "border-destructive")}
                  aria-invalid={!!errors.petName}
                />
                {errors.petName ? (
                  <p className="text-xs font-medium text-destructive">{errors.petName}</p>
                ) : form.petStatus === "found" ? (
                  <p className="text-xs text-muted-foreground">If unknown, you can skip this.</p>
                ) : (
                  <p className="text-xs text-muted-foreground">This helps people recognize the post faster.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="markings">Colour / markings (optional but helpful)</Label>
                <Textarea
                  id="markings"
                  placeholder="e.g. Black collar, white paws, brown patch over left eye"
                  value={form.markings}
                  onChange={(e) => updateField("markings", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label className={cn(errors.photoFile && "text-destructive")}>
                    Photo {form.petStatus === "found" ? <span className="text-destructive">*</span> : <span className="text-muted-foreground">(optional)</span>}
                  </Label>
                </div>

                <Input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    updateField("photoFile", file);
                    updateField("photoDataUrl", null);
                  }}
                />
                <Input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    updateField("photoFile", file);
                    updateField("photoDataUrl", null);
                  }}
                />

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => cameraInputRef.current?.click?.()}
                  >
                    Use camera
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => uploadInputRef.current?.click?.()}
                  >
                    Upload photo
                  </Button>
                </div>

                {errors.photoFile ? <p className="text-xs font-medium text-destructive">{errors.photoFile}</p> : null}

                {photoPreviewUrl ? (
                  <div className="mt-3 flex items-start gap-4 rounded-xl border bg-card p-3">
                    <img
                      src={photoPreviewUrl}
                      alt="Selected pet"
                      className="h-20 w-20 rounded-md border object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{form.photoFile?.name || "Saved photo"}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        A clear, well-lit photo helps people identify the pet quickly.
                      </div>
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateField("photoFile", null);
                            updateField("photoDataUrl", null);
                          }}
                        >
                          Remove photo
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                    <div>{form.petStatus === "found" ? "Please add a photo so owners can recognize them." : "Add a photo if you have one (optional)."}</div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-lg font-semibold tracking-tight">Where was the pet last seen?</div>
                <div className="text-sm text-muted-foreground">It doesn’t have to be exact — landmarks are perfect.</div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pet-location" className={cn(errors.location && "text-destructive")}>
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pet-location"
                  placeholder="e.g. BP Garage, Gordon’s Bay"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className={cn(errors.location && "border-destructive")}
                  aria-invalid={!!errors.location}
                />
                {errors.location ? (
                  <p className="text-xs font-medium text-destructive">{errors.location}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Examples: “Near Harbour Island entrance”, “Corner of Main Rd &amp; Beach Rd”.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="last-seen-at">
                  Time last seen <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="last-seen-at"
                  type="datetime-local"
                  value={form.lastSeenAt}
                  onChange={(e) => updateField("lastSeenAt", e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-lg font-semibold tracking-tight">How can people reach you?</div>
                <div className="text-sm text-muted-foreground">
                  Your details are only shared with people trying to help reunite this pet.
                </div>
              </div>

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
                  {errors.firstName ? <p className="text-xs font-medium text-destructive">{errors.firstName}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="last-name" className={cn(errors.lastName && "text-destructive")}>
                    Surname <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="last-name"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className={cn(errors.lastName && "border-destructive")}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName ? <p className="text-xs font-medium text-destructive">{errors.lastName}</p> : null}
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
                    <p className="text-xs text-muted-foreground">This helps helpers contact you quickly.</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant={form.whatsappPreferred ? "secondary" : "outline"}
                    className="w-full justify-between"
                    onClick={() => updateField("whatsappPreferred", !form.whatsappPreferred)}
                    aria-pressed={form.whatsappPreferred}
                  >
                    WhatsApp preferred (recommended)
                    <span className="text-xs text-muted-foreground">
                      {form.whatsappPreferred ? "On" : "Off"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {stepIndex === 4 ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-lg font-semibold tracking-tight">Review your report</div>
                <div className="text-sm text-muted-foreground">Check the details before publishing.</div>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium text-foreground">Summary</div>
                  <div className="flex items-center gap-2">
                    <ReportStatusBadge status={form.petStatus} />
                    <Button type="button" size="sm" variant="outline" onClick={() => setStepIndex(0)}>
                      Edit
                    </Button>
                  </div>
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
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                          {form.petType === "cat" ? (
                            <Cat className="h-10 w-10" />
                          ) : form.petType === "dog" ? (
                            <Dog className="h-10 w-10" />
                          ) : (
                            <PawPrint className="h-10 w-10" />
                          )}
                          <div className="text-xs">No photo</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Pet:</span>{" "}
                        <span className="text-muted-foreground">
                          {form.petType}{form.petName.trim() ? ` • ${form.petName.trim()}` : ""}
                        </span>
                      </div>
                      <Button type="button" size="sm" variant="outline" onClick={() => setStepIndex(1)}>
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Location:</span>{" "}
                        <span className="text-muted-foreground">{form.location.trim() || "—"}</span>
                      </div>
                      <Button type="button" size="sm" variant="outline" onClick={() => setStepIndex(2)}>
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Contact:</span>{" "}
                        <span className="text-muted-foreground">
                          {[form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(" ") || "—"} ·{" "}
                          {form.phoneNumber.trim() || "—"}
                          {form.whatsappPreferred ? " (WhatsApp)" : ""}
                        </span>
                      </div>
                      <Button type="button" size="sm" variant="outline" onClick={() => setStepIndex(3)}>
                        Edit
                      </Button>
                    </div>

                    {form.markings.trim() ? (
                      <div className="text-sm">
                        <span className="font-medium">Markings:</span>{" "}
                        <span className="text-muted-foreground">{form.markings.trim()}</span>
                      </div>
                    ) : null}

                    {form.lastSeenAt ? (
                      <div className="text-sm">
                        <span className="font-medium">Time last seen:</span>{" "}
                        <span className="text-muted-foreground">{form.lastSeenAt}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                Please double-check your phone number and location — those are the fastest ways for someone to help.
              </div>

              <div className="text-sm text-muted-foreground">
                You can post updates later (mark as resolved is coming soon).
              </div>
            </div>
          ) : null}

          {stepIndex === 5 ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-lg font-semibold tracking-tight">
                  {submittedIsLocal ? "Report saved — you’re almost done" : "Report published – thank you for helping!"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {submittedIsLocal
                    ? "This report was saved on your device and will publish when the server is available."
                    : "Your report is now visible to the community."}
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="text-sm font-medium text-foreground">Share this report</div>
                <div className="mt-2 text-sm text-muted-foreground">{shareText}</div>
                <div className="mt-3 space-y-2">
                  <Label>Share link</Label>
                  <Input value={shareUrl} readOnly />
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <Button type="button" variant="secondary" onClick={openWhatsAppShare} disabled={!canShare}>
                    Share to WhatsApp
                  </Button>
                  <Button type="button" variant="outline" onClick={openFacebookShare} disabled={!canShare}>
                    Share to Facebook
                  </Button>
                  <Button type="button" onClick={copyShareLink} disabled={!canShare}>
                    Copy link
                  </Button>
                </div>
                {submittedIsLocal ? (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Sharing is disabled for saved-only reports because others won’t be able to view it yet.
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                {String(form.petStatus || "").toLowerCase() === "lost"
                  ? "Tip: Share widely and enable notifications to catch sightings quickly."
                  : "Owners can now contact you through the details on the report."}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  disabled={!submittedReport?.id}
                  onClick={() => {
                    const id = submittedReport?.id;
                    if (!id) return;
                    handleOpenChange(false);
                    navigate(`/reports?highlight=${encodeURIComponent(String(id))}`);
                  }}
                >
                  View report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => toast.message("Mark as resolved is coming soon.")}
                >
                  Mark as resolved later
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-col gap-2 border-t bg-background px-4 py-3 sm:flex-row sm:gap-3 sm:px-6 sm:py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {stepIndex === steps.length - 1 ? "Close" : "Cancel"}
          </Button>
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-1 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={goBack}
              disabled={submitting || stepIndex === 0 || stepIndex === steps.length - 1}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            {stepIndex < steps.length - 2 ? (
              <Button type="button" onClick={goNext} disabled={submitting} className="w-full sm:w-auto">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : stepIndex === steps.length - 2 ? (
              <Button type="button" onClick={submit} disabled={submitting} className="w-full sm:w-auto">
                {submitting ? "Publishing…" : "Submit report"}
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => handleOpenChange(false)}
              >
                Done
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
