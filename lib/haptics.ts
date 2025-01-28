export const triggerHapticFeedback = () => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10); // Short vibration
  }
};
