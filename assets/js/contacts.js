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

document.querySelectorAll("[data-topic-chip], .topic-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".topic-chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
  });
});

document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = event.currentTarget.querySelector(".btn-submit");
  const label = button?.querySelector("[data-submit-label]");

  if (button) {
    button.classList.add("sent");
  }

  if (label) {
    label.textContent = getTranslation("sentMessage");
  }

  window.setTimeout(() => {
    if (label) {
      label.textContent = getTranslation("sendMessage");
    }

    button?.classList.remove("sent");
    event.currentTarget.reset();
  }, 3000);
});
