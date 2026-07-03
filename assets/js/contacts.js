const email = "egorvikturov@gmail.com";

function getTranslation(key) {
  return window.egorI18n?.getTranslation?.(key) || key;
}

document.querySelector("[data-copy-email]")?.addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopPropagation();

  try {
    await navigator.clipboard.writeText(email);
  } catch (error) {
    console.warn("Could not copy email", error);
  }

  const toast = document.getElementById("toast");
  toast?.classList.add("show");
  window.setTimeout(() => toast?.classList.remove("show"), 2500);
});

// Topic chips: update hidden input when a chip is clicked
document.querySelectorAll(".topic-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".topic-chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    const topicInput = document.getElementById("topic-value");
    if (topicInput) {
      topicInput.value = chip.textContent.trim();
    }
  });
});

// Show success toast if redirected back after FormSubmit
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("sent") === "true") {
  window.addEventListener("DOMContentLoaded", () => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = getTranslation("messageSent") || "Сообщение отправлено!";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 4000);
    }
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  });
}
