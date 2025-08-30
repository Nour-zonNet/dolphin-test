import { Canceled, Checked, Experimental, Finished } from "../utils/icons";

// constants/STATUS_CONFIG.js
export const STATUS_CONFIG = {
  active: {
    color: "bg-[#F8E0BF] text-status font-semibold",
    labelKey: "subscription.active",
    daysLeftKey: "subscription.daysLeft",
    actions: ["changeGroup", "useCoupon", "cancel"],
    message: null,
    lineColor: "stroke-[#185A80]", 
    fill: "#185A80",
    bg: "bg-health",
    icon: Checked 
  },
  trial: {
    color: "border border-[#99A1A7] text-status h-9 w-32 px-4 font-semibold",
    labelKey: "subscription.trial",
    actions: ["reactivate"],
    messageKey: "subscription.trialExpiredMessage",
    lineColor: "stroke-[#185A80]", 
    fill: "#185A80",
    bg: "bg-health",
    buttonTextKey: "subscription.extendSubscription",
    icon: Experimental
  },
  expired: {
    color: "bg-[#595959] h-9 w-32 text-white font-semibold px-4",
    labelKey: "subscription.expired",
    actions: ["renew"],
    messageKey: "subscription.expiredMessage",
    lineColor: "stroke-[#B3261E]",
    fill: "#B3261E",
    bg: "bg-health",
    buttonTextKey: "subscription.renewSubscription",
    icon: Finished
  },
  cancelled: {
    color: "bg-[#FFD8E4] text-status h-9 w-32 px-4 font-semibold",
    labelKey: "subscription.cancelled",
    actions: ["canceled"],
    messageKey: "subscription.cancelledMessage",
    lineColor: "stroke-[#185A80]", 
    fill: "#185A80",
    buttonTextKey: "subscription.requestReactivateSubscription",
    bg: "bg-englishLevelOne",
    icon: Canceled,
  },
};
