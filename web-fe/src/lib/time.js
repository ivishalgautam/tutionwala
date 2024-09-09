import { format } from "date-fns";
import moment from "moment-timezone";
import { toast } from "sonner";

export const getFormattedDateTime = (followupDate, followupTime) => {
  const formattedDate = format(new Date(followupDate), "yyyy-MM-dd");

  const combinedDateTimeLocal = moment.tz(
    `${formattedDate} ${followupTime}`,
    "YYYY-MM-DD HH:mm",
    "Asia/Kolkata",
  );

  if (combinedDateTimeLocal.isValid()) {
    const formattedDateTime = combinedDateTimeLocal
      .clone()
      .tz("Asia/Kolkata")
      .format();
    return formattedDateTime;
  } else {
    toast.warning("Invalid date-time combination");
  }
};
export function formatDuration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  let result = "";
  if (days > 0) result += `${days} days, `;
  if (hours > 0 || days > 0) result += `${hours} hours, `;
  if (minutes > 0 || hours > 0 || days > 0) result += `${minutes} minutes, `;
  result += `${seconds} seconds`;

  return result;
}
