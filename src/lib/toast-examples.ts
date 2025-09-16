// Toast Examples - How to use the toast notification system

import { showToast } from "./toast";

// Basic toast types
showToast.success("Success!", "Your action was completed successfully");
showToast.error("Error!", "Something went wrong");
showToast.info("Info", "Here's some information");
showToast.warning("Warning!", "Please be careful");

// Loading toast with manual dismiss
const toastId = showToast.loading("Loading...", "Please wait");
setTimeout(() => {
  showToast.dismiss(toastId);
  showToast.success("Loaded!", "Data fetched successfully");
}, 2000);

// Promise toast (recommended for async operations)
const fetchData = async () => {
  const response = await fetch("/api/data");
  return response.json();
};

showToast.promise(fetchData(), {
  loading: "Fetching data...",
  success: (data) => `Successfully loaded ${data.length} items`,
  error: (error) => `Failed to load data: ${error.message}`,
});

// Custom toast with actions (using sonner directly)
import { toast } from "sonner";

toast("Custom toast with action", {
  description: "This is a custom toast",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo clicked"),
  },
});