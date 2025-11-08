export function showToast(message: string) {
  if (typeof document === "undefined") return;
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => {
    el.classList.add("toast-out");
    setTimeout(() => el.remove(), 300);
  }, 2500);
}





