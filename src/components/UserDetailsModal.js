import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, MapPin, PawPrint, Phone, QrCode, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config/api";

function UserDetailsModal({ show, onHide, user, pets, handleShowQRModal }) {
  if (!user) return null;

  const initials = `${user?.name?.[0] ?? ""}${user?.surname?.[0] ?? ""}`.trim().toUpperCase() || "U";

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) onHide();
      }}
    >
      <DialogContent className="w-[calc(100vw-2rem)] max-w-6xl p-0">
        <div className="flex max-h-[90vh] flex-col">
          <div className="border-b bg-muted/30 p-6 pr-12">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                User profile
              </DialogTitle>
              <DialogDescription>
                Review account information and registered pets.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/20 text-base font-semibold text-primary shadow-sm ring-1 ring-primary/10">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-lg">
                        {user?.name} {user?.surname}
                      </CardTitle>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant={user?.isAdmin ? "default" : "secondary"}>
                          {user?.isAdmin ? "Admin" : "User"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="max-w-[240px] truncate border-primary/30 font-mono text-xs text-primary"
                          title={user?._id}
                        >
                          {user?._id}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 rounded-xl border bg-muted/10 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pets</span>
                      <span className="font-medium">{pets.length}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 rounded-lg border bg-card px-3 py-3">
                    <Mail className="mt-0.5 h-4 w-4 text-primary" />
                    <div className="min-w-0">
                      <div className="text-muted-foreground">Email</div>
                      <div className="truncate font-medium">{user?.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border bg-card px-3 py-3">
                    <Phone className="mt-0.5 h-4 w-4 text-primary" />
                    <div className="min-w-0">
                      <div className="text-muted-foreground">Contact</div>
                      <div className="truncate font-medium">{user?.contact || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border bg-card px-3 py-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                    <div className="min-w-0">
                      <div className="text-muted-foreground">Address</div>
                      <div className="break-words font-medium">
                        {user?.address?.street || user?.address?.city
                          ? `${user?.address?.street ?? ""}${user?.address?.street && user?.address?.city ? ", " : ""}${user?.address?.city ?? ""}`
                          : "—"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <PawPrint className="h-4 w-4 text-primary" />
                      <h3 className="text-lg font-semibold tracking-tight">
                        Registered pets
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click a pet to download QR assets.
                    </p>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {pets.length}
                  </Badge>
                </div>

                <div className="mt-4">
                  {pets.length === 0 ? (
                    <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">
                      No pets found.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {pets.map((pet) => (
                        <Card
                          key={pet._id}
                          className="overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
                        >
                          <CardHeader className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="h-14 w-14 overflow-hidden rounded-2xl border bg-muted/20">
                                {pet.photoUrl ? (
                                  <img
                                    src={
                                      pet.photoUrl.startsWith("http")
                                        ? pet.photoUrl
                                        : `${API_BASE_URL}${pet.photoUrl}`
                                    }
                                    alt={`${pet.name}'s profile`}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                    No image
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <CardTitle className="truncate text-base">{pet.name}</CardTitle>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {pet.species}
                                  {pet.breed ? ` • ${pet.breed}` : ""}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant={pet.hasMembership ? "default" : "secondary"}>
                                {pet.hasMembership ? "Membership active" : "No membership"}
                              </Badge>
                              <Badge variant="outline">
                                Tag: {pet.tagType || "N/A"}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
                              <span className="text-muted-foreground">Age</span>
                              <span className="font-medium">{pet.age ?? "—"} yrs</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
                              <span className="text-muted-foreground">Gender</span>
                              <span className="font-medium">{pet.gender || "—"}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
                              <span className="text-muted-foreground">Spayed/Neutered</span>
                              <span className="font-medium">
                                {pet.spayedNeutered ? "Yes" : "No"}
                              </span>
                            </div>

                            {pet.hasMembership ? (
                              <div className="rounded-lg border bg-muted/20 p-3">
                                <div className="text-sm font-medium">{pet.membership || "Membership"}</div>
                                {pet.membershipStartDate ? (
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    Started {new Date(pet.membershipStartDate).toLocaleDateString()}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </CardContent>

                          <CardFooter className="flex items-center justify-end border-t bg-muted/20 px-6 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleShowQRModal(pet)}
                            >
                              <QrCode className="h-4 w-4" />
                              QR downloads
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t bg-muted/30 px-6 py-4">
            <DialogFooter>
              <Button variant="outline" onClick={onHide}>
                Close
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailsModal;
