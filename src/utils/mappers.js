// utils/mappers.js

// Convert API status → STATUS_CONFIG key
const translateStatus = (status) => {
  switch (status) {
    case "active":
    case "trial":
    case "expired":
    case "cancelled":
      return status; // already matches keys

    // In case API sends Arabic or mixed strings
    case "فعالة":
      return "active";
    case "تجريبي":
      return "trial";
    case "منتهي":
      return "expired";
    case "ملغاة":
      return "cancelled";

    default:
      return "active"; // fallback
  }
};

export const mapSubscriptionToCard = (sub) => ({
  id: sub.id,
  title: sub.package_name,
  subject: sub.subjects?.map((s) => s.name).join(", ") || "",
  startDate: sub.start_date,
  endDate: sub.end_date,
  group: sub.group_name,
  daysLeft: sub.days_remaining,
  status: translateStatus(sub.status), // ✅ fixed
  image: null, // map subject → image later if needed
});
