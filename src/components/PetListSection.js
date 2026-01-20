import React from "react";
import { FaEye, FaEdit, FaTrash, FaCartPlus, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PetListSkeleton from "../loadingskeletons/PetListSkeleton";
import { toast } from "react-toastify";
import { FaCreditCard } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "../config/api";
import { cn } from "@/lib/utils";

const PetListSection = ({
  title,
  pets,
  loading,
  user, // <-- user as a prop
  handleViewDetails,
  handleEditClick,
  handleDeleteClick,
  showHeader = true,
  className,
}) => {
  const navigate = useNavigate();

  const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatDate = (date) =>
    date
      ? date.toLocaleDateString("en-ZA", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : null;

  const normalizeDeliveryStatus = (status) => {
    const normalized = (status || "").toString().trim().toLowerCase();
    return normalized || "unfulfilled";
  };

  const deliveryStatusLabel = (status) => {
    const normalized = normalizeDeliveryStatus(status);
    if (normalized === "unfulfilled") return "Unfulfilled";
    if (normalized === "processing") return "Processing";
    if (normalized === "submitted") return "Submitted";
    if (normalized === "shipped") return "Shipped";
    if (normalized === "delivered") return "Delivered";
    if (normalized === "cancelled") return "Cancelled";
    return normalized;
  };

  const tagTimelineSteps = [
    { key: "unfulfilled", label: "Unfulfilled" },
    { key: "processing", label: "Processing" },
    { key: "submitted", label: "Submitted" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const tagTimelineBadges = (status) => {
    const normalized = normalizeDeliveryStatus(status);
    if (normalized === "cancelled") {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    const currentIndex = Math.max(0, tagTimelineSteps.findIndex((s) => s.key === normalized));
    return (
      <>
        {tagTimelineSteps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const variant = isDone ? "default" : isCurrent ? "secondary" : "outline";
          return (
            <Badge key={step.key} variant={variant}>
              {step.label}
            </Badge>
          );
        })}
      </>
    );
  };

  const getMonthlyPriceForSize = (size) => {
    const normalizedSize = (size || "").toString().trim().toLowerCase();
    if (normalizedSize === "small") return 50;
    if (normalizedSize === "medium") return 70;
    if (normalizedSize === "large") return 100;
    return null;
  };

  const handleStartSubscription = (pet) => {
    const monthlyPrice = getMonthlyPriceForSize(pet?.size);
    if (!monthlyPrice) {
      toast.warn("Please edit your pet and set Size to Small / Medium / Large before subscribing.");
      handleEditClick(pet);
      return;
    }

    navigate("/checkout", {
      state: {
        membership: true,
        total: monthlyPrice,
        package: { type: `${pet.size} Pet Subscription` },
        membershipObjectId: null,
        selectedPets: [pet],
      },
    });
  };

  const getImageSrc = (pet) =>
    pet.photoUrl?.startsWith("http") ? pet.photoUrl : `${API_BASE_URL}${pet.photoUrl || ""}`;

  return (
    <div className={cn(showHeader ? "space-y-4" : "", className)}>
      {showHeader ? (
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="secondary">{pets.length}</Badge>
        </div>
      ) : null}

      {loading ? (
        <PetListSkeleton count={3} />
      ) : pets.length > 0 ? (
        <div className="space-y-3">
          {pets.map((pet) => (
            <Card key={pet._id} className="shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  {pet.photoUrl ? (
                    <img
                      src={getImageSrc(pet)}
                      alt={`${pet.name}'s profile`}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ring-2 ring-border">
                      No Photo
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold">{pet.name}</h3>
                      <Badge variant={pet.hasMembership ? "default" : "secondary"}>
                        {pet.hasMembership ? "Subscription active" : "Not subscribed"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{pet.breed}</p>
                    {pet.hasMembership ? (
                      (() => {
                        const membershipStartDate = parseDate(
                          pet.membershipStartDate ||
                            pet.subscriptionStartDate ||
                            pet.membershipStartedAt ||
                            pet.membershipStart
                        );
                        const nextDebitDate = parseDate(
                          pet.nextDebitDate ||
                            pet.nextBillingDate ||
                            pet.nextChargeDate ||
                            pet.nextDebitAt
                        );
                        const monthlyDebitDay = (nextDebitDate || membershipStartDate)?.getDate?.() || null;
                        const startedLabel = membershipStartDate ? `Started ${formatDate(membershipStartDate)}` : null;
                        const debitLabel = nextDebitDate
                          ? `Next debit ${formatDate(nextDebitDate)}`
                          : monthlyDebitDay
                            ? `Monthly debit day: ${monthlyDebitDay}`
                            : null;

                        if (!startedLabel && !debitLabel) return null;

                        return (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {[startedLabel, debitLabel].filter(Boolean).join(" • ")}
                          </p>
                        );
                      })()
                    ) : null}

                    <p className="mt-1 text-xs text-muted-foreground">
                      {(pet.hasTag || !!pet.tagOrder)
                        ? (() => {
                            const order = pet.tagOrder || null;
                            const tagType = pet.tagType || order?.tagType || "—";
                            const status = order?.fulfillment?.status || "unfulfilled";
                            const tracking = order?.fulfillment?.pudo?.trackingNumber || null;
                            const parts = [
                              `Tag: ${tagType}`,
                              `Delivery: ${deliveryStatusLabel(status)}`,
                              tracking ? `Tracking: ${tracking}` : null,
                            ].filter(Boolean);
                            return parts.join(" • ");
                          })()
                        : "Tag: Not ordered"}
                    </p>
                    {(pet.hasTag || !!pet.tagOrder) ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tagTimelineBadges(pet.tagOrder?.fulfillment?.status || "unfulfilled")}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap justify-start gap-2 sm:justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(pet)}>
                    <FaEye />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(pet)}>
                    <FaEdit />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(pet._id)}>
                    <FaTrash />
                    Delete
                  </Button>

                  {pet.hasMembership ? (
                    <>
                      {pet.tagOrder?.paymentId ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/tag-orders/${pet.tagOrder.paymentId}`)}
                        >
                          <FaTruck />
                          Track delivery
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate("/select-tag/standard", {
                            state: { user, pet },
                          })
                        }
                      >
                        <FaCartPlus />
                        Order tag
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleStartSubscription(pet)}>
                      <FaCreditCard />
                      Subscribe
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          You don&apos;t have any pets yet. Add a pet first, then subscribe before ordering a tag.
        </p>
      )}
    </div>
  );
};

export default PetListSection;
