const DATA_FILE_NAME = "projects.json";
const DATA_FILE_PATH = "data/projects.json";

const form = document.querySelector("[data-project-form]");
const listRoot = document.querySelector("[data-project-list]");
const previewRoot = document.querySelector("[data-editor-preview]");
const importInput = document.querySelector("[data-import-json]");
const coverInput = document.querySelector("[data-cover-file]");
const galleryInput = document.querySelector("[data-gallery-files]");
const coverPreviewRoot = document.querySelector("[data-cover-preview]");
const galleryManagerRoot = document.querySelector("[data-gallery-manager]");
const editorShell = document.querySelector(".editor-shell");
const editorPreview = document.querySelector(".editor-preview");
const openFileButton = document.querySelector("[data-action='open-file']");

const LOCALIZED_FIELDS = [
  "title",
  "category",
  "tag",
  "description",
  "features",
  "learnings",
  "technologies",
  "primaryActionLabel",
  "secondaryActionLabel",
];

const ASSET_IMAGE_PATHS_BY_FILE = {
  "2025-02-05_21-38-56.png": "./assets/img/FlyAcademy/2025-02-05_21-38-56.png",
  "2025-02-05_21-39-26.png": "./assets/img/FlyAcademy/2025-02-05_21-39-26.png",
  "720_6a0b682e82682c5cc0be46a0.jpg": "./assets/img/Saper/720_6a0b682e82682c5cc0be46a0.jpg",
  "S78E29ma_gqPVxhXqDIICc95r8V9MEU5ooiO5GAjOfORvN1HgTrELX64D-LLTlFnKZsrdbNT_zZXUU-No1N9-5p-.jpg":
    "./assets/img/SenseAndHome/S78E29ma_gqPVxhXqDIICc95r8V9MEU5ooiO5GAjOfORvN1HgTrELX64D-LLTlFnKZsrdbNT_zZXUU-No1N9-5p-.jpg",
  "__10.png": "./assets/img/Old Projects/__10.png",
  "__9.png": "./assets/img/Old Projects/__9.png",
  "comstresslevelzerobo.jpg": "./assets/img/Old Projects/comstresslevelzerobo.jpg",
  "main (1).png": "./assets/img/Project1/main (1).png",
  "main (2).png": "./assets/img/Project1/main (2).png",
  "main (3).png": "./assets/img/Project1/main (3).png",
  "n9.png": "./assets/img/FlyAcademy/n9.png",
  "n91.png": "./assets/img/FlyAcademy/n91.png",
  "n92.png": "./assets/img/FlyAcademy/n92.png",
  "n98.jpeg": "./assets/img/FlyAcademy/n98.jpeg",
  "photo_2023-07-23_14-.jpg": "./assets/img/Project2/photo_2023-07-23_14-.jpg",
  "t7SdfCHSW0ffvOE5zi1fOUzAfTwDvyzdd804nTcFPuDbqLTE2jziTyQU1pybPOWYgPEYkzEyuWCecFTJd_jjfPeB.jpg":
    "./assets/img/SenseAndHome/t7SdfCHSW0ffvOE5zi1fOUzAfTwDvyzdd804nTcFPuDbqLTE2jziTyQU1pybPOWYgPEYkzEyuWCecFTJd_jjfPeB.jpg",
};

let projects = [];
let selectedId = "";
let projectsFileHandle = null;
let noticeTimer = 0;

function getLanguage() {
  return window.egorI18n?.getLanguage?.() || "ru";
}

function t(key) {
  return window.egorI18n?.getTranslation?.(key) || key;
}

function isLocalFileEditor() {
  return window.location.protocol === "file:";
}

function canWriteLocalFiles() {
  return Boolean(window.showOpenFilePicker);
}

function showEditorNotice(message, type = "success") {
  let notice = document.querySelector("[data-editor-notice]");

  if (!notice) {
    notice = document.createElement("div");
    notice.className = "editor-notice";
    notice.setAttribute("data-editor-notice", "");
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    document.body.append(notice);
  }

  window.clearTimeout(noticeTimer);
  notice.textContent = message;
  notice.className = `editor-notice ${type} show`;

  noticeTimer = window.setTimeout(() => {
    notice.classList.remove("show");
  }, 3600);
}

function showEditorBlock(message) {
  const block = document.createElement("section");
  block.className = "editor-blocked";
  block.innerHTML = `
    <h2>${escapeHtml(getLanguage() === "en" ? "Editor is unavailable" : "Редактор недоступен")}</h2>
    <p>${escapeHtml(message)}</p>
  `;

  editorShell?.replaceWith(block);
  editorPreview?.remove();
}

function setFormDisabled(disabled) {
  form?.querySelectorAll("input, textarea, button").forEach((element) => {
    element.disabled = disabled;
  });

  document.querySelectorAll("[data-action='new'], [data-action='export']").forEach((element) => {
    element.disabled = disabled;
  });

  if (importInput) {
    importInput.disabled = disabled;
  }
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
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitComma(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitGallery(value) {
  return String(value || "")
    .split(/,\s*(?=(?:data:image\/|https?:\/\/|\.{1,2}\/))/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function repairGallery(value) {
  const items = Array.isArray(value) ? value.filter(Boolean) : splitGallery(value || "");
  const repaired = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = String(items[index]).trim();
    const next = items[index + 1] ? String(items[index + 1]).trim() : "";

    if (/^data:image\/[^;,]+;base64$/i.test(item) && next) {
      repaired.push(`${item},${next}`);
      index += 1;
    } else {
      repaired.push(item);
    }
  }

  return repaired;
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

function normalizeProjects(value) {
  return Array.isArray(value)
    ? value
        .filter((project) => project?.id)
        .map((project) => {
          const gallery = repairGallery(project.gallery);
          return {
            ...project,
            image: project.image || gallery[0] || "",
            gallery,
          };
        })
    : [];
}

function getSelectedProject() {
  return projects.find((project) => project.id === selectedId) || projects[0] || null;
}

function getLocalizedProject(project) {
  const language = getLanguage();
  const localized = project?.i18n?.[language];

  return localized ? { ...project, ...localized } : project;
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
  const language = getLanguage();
  const localizedValues = {
    title,
    category: data.get("category").trim(),
    tag: data.get("tag").trim(),
    description: data.get("description").trim(),
    features: splitLines(data.get("features")),
    learnings: splitLines(data.get("learnings")),
    technologies: splitComma(data.get("technologies")),
    primaryActionLabel: data.get("primaryActionLabel").trim(),
    secondaryActionLabel: data.get("secondaryActionLabel").trim(),
  };
  const gallery = repairGallery(data.get("gallery"));

  const updated = {
    ...(current || {}),
    id: current?.id || slugify(title),
    primaryActionUrl: data.get("primaryActionUrl").trim() || "#",
    secondaryActionUrl: data.get("secondaryActionUrl").trim() || "#",
    image: data.get("image").trim() || gallery[0] || "",
    gallery,
    flipped: data.get("flipped") === "on",
  };

  if (language === "ru") {
    LOCALIZED_FIELDS.forEach((field) => {
      updated[field] = localizedValues[field];
    });
  } else {
    updated.i18n = {
      ...(current?.i18n || {}),
      [language]: {
        ...(current?.i18n?.[language] || {}),
        ...localizedValues,
      },
    };
  }

  return updated;
}

function fillForm(project) {
  const editableProject = getLocalizedProject(project);

  form.elements.title.value = editableProject?.title || "";
  form.elements.category.value = editableProject?.category || "";
  form.elements.tag.value = editableProject?.tag || "";
  form.elements.description.value = editableProject?.description || "";
  form.elements.features.value = joinLines(editableProject?.features);
  form.elements.learnings.value = joinLines(editableProject?.learnings);
  form.elements.technologies.value = joinComma(editableProject?.technologies);
  form.elements.primaryActionLabel.value = editableProject?.primaryActionLabel || "";
  form.elements.primaryActionUrl.value = project?.primaryActionUrl || "";
  form.elements.secondaryActionLabel.value = editableProject?.secondaryActionLabel || "";
  form.elements.secondaryActionUrl.value = project?.secondaryActionUrl || "";
  form.elements.image.value = project?.image || "";
  form.elements.gallery.value = joinComma(repairGallery(project?.gallery));
  form.elements.flipped.checked = Boolean(project?.flipped);
  renderImageManagers();
}

function getRemoveImageLabel() {
  return getLanguage() === "en" ? "Remove" : "Удалить";
}

function getCoverPreviewLabel() {
  return getLanguage() === "en" ? "Cover" : "Обложка";
}

function getImageMetaLabel(src) {
  if (!src.startsWith("data:image/")) {
    return src;
  }

  const match = src.match(/^data:image\/([^;]+);base64,/i);
  const type = match?.[1]?.toUpperCase() || "IMAGE";
  return getLanguage() === "en" ? `${type} embedded image` : `${type} встроенное изображение`;
}

function createImageManagerItem(src, label, onRemove) {
  const item = document.createElement("div");
  item.className = "image-manager-item";

  const image = document.createElement("img");
  image.src = src;
  image.alt = "";

  const meta = document.createElement("div");
  meta.className = "image-manager-meta";
  meta.innerHTML = `<span>${escapeHtml(label)}</span><small title="${escapeHtml(src)}">${escapeHtml(getImageMetaLabel(src))}</small>`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "image-remove-button";
  removeButton.textContent = getRemoveImageLabel();
  removeButton.addEventListener("click", onRemove);

  item.append(image, meta, removeButton);
  return item;
}

function renderImageManagers() {
  coverPreviewRoot.innerHTML = "";
  galleryManagerRoot.innerHTML = "";

  const cover = form.elements.image.value.trim();
  if (cover) {
    coverPreviewRoot.append(
      createImageManagerItem(cover, getCoverPreviewLabel(), () => {
        form.elements.image.value = "";
        syncCurrentForm();
      }),
    );
  }

  repairGallery(form.elements.gallery.value).forEach((src, index) => {
    galleryManagerRoot.append(
      createImageManagerItem(src, `${index + 1}`, () => {
        const gallery = repairGallery(form.elements.gallery.value);
        gallery.splice(index, 1);
        form.elements.gallery.value = gallery.join(", ");
        syncCurrentForm();
      }),
    );
  });
}

function renderList() {
  listRoot.innerHTML = "";

  if (projects.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("projectsEmpty");
    listRoot.append(empty);
    return;
  }

  projects.forEach((project, index) => {
    const localizedProject = getLocalizedProject(project);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `project-list-item ${project.id === selectedId ? "active" : ""}`.trim();
    button.innerHTML = `<span>${index + 1}. ${escapeHtml(localizedProject.title || t("untitledProject"))}</span><small>${escapeHtml(
      localizedProject.category || t("uncategorizedProject"),
    )}</small>`;
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
  const localizedProject = getLocalizedProject(project);
  const wrapper = document.createElement("article");
  wrapper.className = `project-card ${project.flipped || index % 2 === 1 ? "flip" : ""}`.trim();
  const image = escapeHtml(project.image || "https://placehold.co/580x420/202020/e8833a?text=Project");
  const gallery = repairGallery(project.gallery);
  const galleryMarkup = gallery.length
    ? `<div class="media-overlay" aria-label="${escapeHtml(t("projectPreviewAria"))}">
        ${gallery
          .map(
            (src, thumbIndex) => `
              <button class="thumb ${thumbIndex === 0 ? "active" : ""}" type="button" data-preview-thumb="${thumbIndex}" aria-label="${escapeHtml(
                `${t("projectPreview")} ${thumbIndex + 1}`,
              )}">
                <img src="${escapeHtml(src)}" alt="">
              </button>
            `,
          )
          .join("")}
      </div>`
    : "";

  wrapper.innerHTML = `
    <div class="project-media">
      <img src="${image}" alt="" data-preview-cover>
      ${localizedProject.tag ? `<span class="media-tag">${escapeHtml(localizedProject.tag)}</span>` : ""}
      ${galleryMarkup}
    </div>
    <div class="project-info">
      <div>
        <p class="project-category">${escapeHtml(localizedProject.category || "")}</p>
        <h2 class="project-title">${escapeHtml(localizedProject.title || t("untitledProject"))}</h2>
        <p class="project-desc">${escapeHtml(localizedProject.description || "")}</p>
        ${
          localizedProject.features?.length
            ? `<ul class="feature-list">${localizedProject.features.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : ""
        }
        ${
          localizedProject.learnings?.length
            ? `<div class="learnings"><p class="learnings-title">${escapeHtml(t("projectLearnings"))}</p><ul>${localizedProject.learnings
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}</ul></div>`
            : ""
        }
        ${
          localizedProject.technologies?.length
            ? `<div class="tags">${localizedProject.technologies.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>`
            : ""
        }
      </div>
      <div class="project-actions">
        ${
          localizedProject.primaryActionLabel
            ? `<a class="btn-primary" href="${escapeHtml(project.primaryActionUrl || "#")}">${escapeHtml(localizedProject.primaryActionLabel)}</a>`
            : ""
        }
        ${
          localizedProject.secondaryActionLabel
            ? `<a class="btn-outline" href="${escapeHtml(project.secondaryActionUrl || "#")}">${escapeHtml(localizedProject.secondaryActionLabel)}</a>`
            : ""
        }
      </div>
    </div>
  `;

  const cover = wrapper.querySelector("[data-preview-cover]");
  wrapper.querySelectorAll("[data-preview-thumb]").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const thumbIndex = Number(thumb.getAttribute("data-preview-thumb"));
      if (cover && gallery[thumbIndex]) {
        cover.src = gallery[thumbIndex];
      }

      wrapper.querySelectorAll("[data-preview-thumb]").forEach((item) => item.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  return wrapper;
}

function renderPreview() {
  previewRoot.innerHTML = "";
  projects.forEach((project, index) => {
    previewRoot.append(createProjectCard(project, index));
  });
}

function renderAll() {
  selectedId = projects[0]?.id || "";
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
}

function syncCurrentForm() {
  if (!selectedId || form.dataset.loading === "true") {
    return false;
  }

  const updated = readForm();
  projects = projects.map((project) => (project.id === selectedId ? updated : project));
  selectedId = updated.id;
  renderList();
  renderPreview();
  renderImageManagers();
  return true;
}

async function saveProjects() {
  syncCurrentForm();

  if (!projectsFileHandle) {
    showEditorNotice(
      getLanguage() === "en"
        ? `Open ${DATA_FILE_PATH} first. Changes were not written to disk.`
        : `Сначала открой ${DATA_FILE_PATH}. Изменения не записаны на диск.`,
      "error",
    );
    return false;
  }

  try {
    const writable = await projectsFileHandle.createWritable();
    await writable.write(JSON.stringify(projects, null, 2));
    await writable.close();
    showEditorNotice(getLanguage() === "en" ? "Saved to data/projects.json" : "Сохранено в data/projects.json");
    return true;
  } catch (error) {
    console.error("Could not save projects file", error);
    showEditorNotice(getLanguage() === "en" ? "Could not write data/projects.json" : "Не удалось записать data/projects.json", "error");
    return false;
  }
}

function downloadJson() {
  syncCurrentForm();
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = DATA_FILE_NAME;
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

function fileToImageSource(file) {
  return ASSET_IMAGE_PATHS_BY_FILE[file.name] || fileToDataUrl(file);
}

async function openProjectsFile() {
  if (!canWriteLocalFiles()) {
    showEditorNotice(
      getLanguage() === "en"
        ? "This browser cannot write local files. Use Chrome or Edge and open editor.html as a file."
        : "Этот браузер не умеет записывать локальные файлы. Используй Chrome или Edge и открой editor.html как файл.",
      "error",
    );
    return;
  }

  try {
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      types: [
        {
          description: "Project data",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    const file = await handle.getFile();
    const parsed = JSON.parse(await file.text());

    projectsFileHandle = handle;
    projects = normalizeProjects(parsed);
    renderAll();
    setFormDisabled(false);
    showEditorNotice(getLanguage() === "en" ? `Opened ${file.name}` : `Открыт файл ${file.name}`);
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }

    console.error("Could not open projects file", error);
    showEditorNotice(getLanguage() === "en" ? "Could not open JSON file" : "Не удалось открыть JSON-файл", "error");
  }
}

function importProjectsFile(file) {
  return file.text().then((text) => {
    projectsFileHandle = null;
    projects = normalizeProjects(JSON.parse(text));
    renderAll();
    setFormDisabled(false);
    showEditorNotice(
      getLanguage() === "en"
        ? "JSON imported for preview. Use Open data/projects.json to save directly."
        : "JSON импортирован для предпросмотра. Для прямого сохранения открой data/projects.json.",
    );
  });
}

function initEditor() {
  if (!isLocalFileEditor()) {
    setFormDisabled(true);
    showEditorBlock(
      getLanguage() === "en"
        ? "Open editor.html directly from the project folder for local editing. The server and the published site read only data/projects.json."
        : "Открой editor.html напрямую из папки проекта для локального редактирования. Сервер и опубликованный сайт читают только data/projects.json.",
    );
    return;
  }

  setFormDisabled(true);
  showEditorNotice(
    getLanguage() === "en"
      ? `Open ${DATA_FILE_PATH} before editing.`
      : `Перед редактированием открой ${DATA_FILE_PATH}.`,
    "error",
  );
}

openFileButton?.addEventListener("click", openProjectsFile);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveProjects();
});

form.addEventListener("input", () => {
  syncCurrentForm();
});

document.querySelector("[data-action='new']").addEventListener("click", () => {
  const project = createProject();
  syncCurrentForm();
  projects = [...projects, project];
  selectedId = project.id;
  fillForm(project);
  renderList();
  renderPreview();
});

document.querySelector("[data-action='duplicate']").addEventListener("click", () => {
  const current = getSelectedProject();
  if (!current) return;

  syncCurrentForm();
  const copy = {
    ...current,
    id: `${current.id}-copy-${Date.now()}`,
    title: `${current.title} copy`,
  };
  projects = [...projects, copy];
  selectedId = copy.id;
  fillForm(copy);
  renderList();
  renderPreview();
});

document.querySelector("[data-action='delete']").addEventListener("click", () => {
  if (!selectedId) return;

  projects = projects.filter((project) => project.id !== selectedId);
  selectedId = projects[0]?.id || "";
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
});

document.querySelector("[data-action='reset']").addEventListener("click", openProjectsFile);
document.querySelector("[data-action='export']").addEventListener("click", downloadJson);

importInput.addEventListener("change", async () => {
  const [file] = importInput.files;
  if (!file) return;

  try {
    await importProjectsFile(file);
  } catch (error) {
    console.error("Could not import JSON", error);
    showEditorNotice(getLanguage() === "en" ? "Could not import JSON" : "Не удалось импортировать JSON", "error");
  } finally {
    importInput.value = "";
  }
});

coverInput.addEventListener("change", async () => {
  const [file] = coverInput.files;
  if (!file) return;

  try {
    form.elements.image.value = await fileToImageSource(file);
    syncCurrentForm();
    await saveProjects();
  } catch (error) {
    console.error("Could not add cover image", error);
    showEditorNotice(getLanguage() === "en" ? "Could not add cover image" : "Не удалось добавить обложку", "error");
  } finally {
    coverInput.value = "";
  }
});

galleryInput.addEventListener("change", async () => {
  const files = Array.from(galleryInput.files);
  if (files.length === 0) return;

  try {
    const urls = await Promise.all(files.map(fileToImageSource));
    const current = repairGallery(form.elements.gallery.value);
    if (!form.elements.image.value.trim()) {
      form.elements.image.value = urls[0];
    }
    form.elements.gallery.value = [...current, ...urls].join(", ");
    syncCurrentForm();
    await saveProjects();
  } catch (error) {
    console.error("Could not add gallery images", error);
    showEditorNotice(getLanguage() === "en" ? "Could not add gallery images" : "Не удалось добавить изображения", "error");
  } finally {
    galleryInput.value = "";
  }
});

window.addEventListener("languagechange", () => {
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
});

initEditor();
