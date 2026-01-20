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

function UserDetailsModal({ show, onHide, user, pets, handleShowQRModal }) {
  if (!user) return null;

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) onHide();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden p-0">
        <div className="border-b bg-muted/30 p-6">
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

        <div className="grid gap-6 p-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg">
                {user?.name} {user?.surname}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={user?.isAdmin ? "default" : "secondary"}>
                  {user?.isAdmin ? "Admin" : "User"}
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {user?._id}
                </Badge>
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
                  <div className="font-medium">
                    {user?.address?.street || user?.address?.city
                      ? `${user?.address?.street ?? ""}${user?.address?.street && user?.address?.city ? ", " : ""}${user?.address?.city ?? ""}`
                      : "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
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
              <Badge variant="secondary">{pets.length}</Badge>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-auto pr-1">
              {pets.length === 0 ? (
                <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">
                  No pets found.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {pets.map((pet) => (
                    <Card key={pet._id} className="overflow-hidden">
                      <CardHeader className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl border bg-muted/20">
                            {pet.photoUrl ? (
                              <img
                                src={
                                  pet.photoUrl.startsWith("http")
                                    ? pet.photoUrl
                                    : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`
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

        <div className="border-t bg-muted/30 px-6 py-4">
          <DialogFooter>
            <Button variant="outline" onClick={onHide}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailsModal;
