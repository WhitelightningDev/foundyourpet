import { PUBLIC_PET_REPORT_URL } from "@/config/notifications";
import { createPublicReportFallbackToLocal } from "@/services/reportsFeed";

export async function submitPublicPetReport({
  firstName,
  lastName,
  phoneNumber,
  petStatus,
  location,
  description,
  photoFile,
}) {
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("phoneNumber", phoneNumber);
  formData.append("petStatus", petStatus);
  formData.append("location", location);
  if (description) formData.append("description", description);
  if (photoFile) formData.append("photo", photoFile);

  try {
    const res = await fetch(PUBLIC_PET_REPORT_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      await createPublicReportFallbackToLocal({
        firstName,
        lastName,
        phoneNumber,
        petStatus,
        location,
        description,
        photoFile,
      }).catch(() => null);
      return { ok: false, error: data?.message || "Failed to submit report" };
    }

    const data = await res.json().catch(() => ({}));
    return { ok: true, data };
  } catch (error) {
    await createPublicReportFallbackToLocal({
      firstName,
      lastName,
      phoneNumber,
      petStatus,
      location,
      description,
      photoFile,
    }).catch(() => null);
    return { ok: false, error: error?.message || "Network error" };
  }
}
