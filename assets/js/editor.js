const STORAGE_KEY = "egorPortfolioProjects";
const DATA_URL = "./data/projects.json";

const form = document.querySelector("[data-project-form]");
const listRoot = document.querySelector("[data-project-list]");
const previewRoot = document.querySelector("[data-editor-preview]");
const importInput = document.querySelector("[data-import-json]");
const coverInput = document.querySelector("[data-cover-file]");
const galleryInput = document.querySelector("[data-gallery-files]");

let projects = [];
let selectedId = "";

function t(key) {
  return window.egorI18n?.getTranslation?.(key) || key;
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-+|-+$/g, "") || `project-${Date.now()}`
  );
}

function splitLines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitComma(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function joinComma(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects, null, 2));
}

function getSelectedProject() {
  return projects.find((project) => project.id === selectedId) || projects[0] || null;
}

function createProject() {
  return {
    id: `new-project-${Date.now()}`,
    title: t("newProjectTitle"),
    category: "",
    tag: "",
    description: "",
    features: [],
    learnings: [],
    technologies: [],
    primaryActionLabel: t("openButton"),
    primaryActionUrl: "#",
    secondaryActionLabel: t("learnMoreButton"),
    secondaryActionUrl: "#",
    image: "",
    gallery: [],
    flipped: projects.length % 2 === 1,
  };
}

function readForm() {
  const data = new FormData(form);
  const title = data.get("title").trim();
  const current = getSelectedProject();

  return {
    id: current?.id || slugify(title),
    title,
    category: data.get("category").trim(),
    tag: data.get("tag").trim(),
    description: data.get("description").trim(),
    features: splitLines(data.get("features")),
    learnings: splitLines(data.get("learnings")),
    technologies: splitComma(data.get("technologies")),
    primaryActionLabel: data.get("primaryActionLabel").trim(),
    primaryActionUrl: data.get("primaryActionUrl").trim() || "#",
    secondaryActionLabel: data.get("secondaryActionLabel").trim(),
    secondaryActionUrl: data.get("secondaryActionUrl").trim() || "#",
    image: data.get("image").trim(),
    gallery: splitComma(data.get("gallery")),
    flipped: data.get("flipped") === "on",
  };
}

function fillForm(project) {
  form.elements.title.value = project?.title || "";
  form.elements.category.value = project?.category || "";
  form.elements.tag.value = project?.tag || "";
  form.elements.description.value = project?.description || "";
  form.elements.features.value = joinLines(project?.features);
  form.elements.learnings.value = joinLines(project?.learnings);
  form.elements.technologies.value = joinComma(project?.technologies);
  form.elements.primaryActionLabel.value = project?.primaryActionLabel || "";
  form.elements.primaryActionUrl.value = project?.primaryActionUrl || "";
  form.elements.secondaryActionLabel.value = project?.secondaryActionLabel || "";
  form.elements.secondaryActionUrl.value = project?.secondaryActionUrl || "";
  form.elements.image.value = project?.image || "";
  form.elements.gallery.value = joinComma(project?.gallery);
  form.elements.flipped.checked = Boolean(project?.flipped);
}

function renderList() {
  listRoot.innerHTML = "";

  projects.forEach((project, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `project-list-item ${project.id === selectedId ? "active" : ""}`.trim();
    button.innerHTML = `<span>${index + 1}. ${project.title || t("untitledProject")}</span><small>${project.category || t("uncategorizedProject")}</small>`;
    button.addEventListener("click", () => {
      selectedId = project.id;
      fillForm(project);
      renderList();
      renderPreview();
    });
    listRoot.append(button);
  });
}

function createProjectCard(project, index) {
  const wrapper = document.createElement("article");
  wrapper.className = `project-card ${project.flipped || index % 2 === 1 ? "flip" : ""}`.trim();
  const image = escapeHtml(project.image || "https://placehold.co/580x420/202020/e8833a?text=Project");
  wrapper.innerHTML = `
    <div class="project-media">
      <img src="${image}" alt="">
      ${project.tag ? `<span class="media-tag">${escapeHtml(project.tag)}</span>` : ""}
    </div>
    <div class="project-info">
      <div>
        <p class="project-category">${escapeHtml(project.category || "")}</p>
        <h2 class="project-title">${escapeHtml(project.title || t("untitledProject"))}</h2>
        <p class="project-desc">${escapeHtml(project.description || "")}</p>
        ${
          project.features?.length
            ? `<ul class="feature-list">${project.features.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : ""
        }
        ${
          project.learnings?.length
            ? `<div class="learnings"><p class="learnings-title">${escapeHtml(t("projectLearnings"))}</p><ul>${project.learnings
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}</ul></div>`
            : ""
        }
        ${
          project.technologies?.length
            ? `<div class="tags">${project.technologies.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>`
            : ""
        }
      </div>
      <div class="project-actions">
        ${
          project.primaryActionLabel
            ? `<a class="btn-primary" href="${escapeHtml(project.primaryActionUrl || "#")}">${escapeHtml(project.primaryActionLabel)}</a>`
            : ""
        }
        ${
          project.secondaryActionLabel
            ? `<a class="btn-outline" href="${escapeHtml(project.secondaryActionUrl || "#")}">${escapeHtml(project.secondaryActionLabel)}</a>`
            : ""
        }
      </div>
    </div>
  `;
  return wrapper;
}

function renderPreview() {
  previewRoot.innerHTML = "";
  projects.forEach((project, index) => {
    previewRoot.append(createProjectCard(project, index));
  });
}

function syncCurrentForm() {
  if (!selectedId) {
    return;
  }

  const updated = readForm();
  projects = projects.map((project) => (project.id === selectedId ? updated : project));
  selectedId = updated.id;
  saveProjects();
  renderList();
  renderPreview();
}

function downloadJson() {
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "projects.json";
  link.click();
  URL.revokeObjectURL(url);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loadInitialProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    projects = JSON.parse(saved);
  } else {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    projects = await response.json();
    saveProjects();
  }

  selectedId = projects[0]?.id || "";
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  syncCurrentForm();
});

form.addEventListener("input", () => {
  syncCurrentForm();
});

document.querySelector("[data-action='new']").addEventListener("click", () => {
  const project = createProject();
  projects = [...projects, project];
  selectedId = project.id;
  saveProjects();
  fillForm(project);
  renderList();
  renderPreview();
});

document.querySelector("[data-action='duplicate']").addEventListener("click", () => {
  const current = getSelectedProject();
  if (!current) return;

  const copy = {
    ...current,
    id: `${current.id}-copy-${Date.now()}`,
    title: `${current.title} copy`,
  };
  projects = [...projects, copy];
  selectedId = copy.id;
  saveProjects();
  fillForm(copy);
  renderList();
  renderPreview();
});

document.querySelector("[data-action='delete']").addEventListener("click", () => {
  if (!selectedId) return;

  projects = projects.filter((project) => project.id !== selectedId);
  selectedId = projects[0]?.id || "";
  saveProjects();
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
});

document.querySelector("[data-action='reset']").addEventListener("click", async () => {
  localStorage.removeItem(STORAGE_KEY);
  await loadInitialProjects();
});

document.querySelector("[data-action='export']").addEventListener("click", downloadJson);

importInput.addEventListener("change", async () => {
  const [file] = importInput.files;
  if (!file) return;

  const text = await file.text();
  const imported = JSON.parse(text);
  projects = Array.isArray(imported) ? imported : [];
  selectedId = projects[0]?.id || "";
  saveProjects();
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
  importInput.value = "";
});

coverInput.addEventListener("change", async () => {
  const [file] = coverInput.files;
  if (!file) return;

  form.elements.image.value = await fileToDataUrl(file);
  syncCurrentForm();
  coverInput.value = "";
});

galleryInput.addEventListener("change", async () => {
  const files = Array.from(galleryInput.files);
  if (files.length === 0) return;

  const urls = await Promise.all(files.map(fileToDataUrl));
  const current = splitComma(form.elements.gallery.value);
  form.elements.gallery.value = [...current, ...urls].join(", ");
  syncCurrentForm();
  galleryInput.value = "";
});

loadInitialProjects().catch((error) => {
  console.error(error);
  projects = [];
  selectedId = "";
  renderList();
  renderPreview();
});

window.addEventListener("languagechange", () => {
  renderList();
  renderPreview();
});
