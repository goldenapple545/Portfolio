{
const PROJECTS_STORAGE_KEY = "egorPortfolioProjects";
const DATA_URL = "./data/projects.json";

const form = document.querySelector("[data-project-form]");
const listRoot = document.querySelector("[data-project-list]");
const previewRoot = document.querySelector("[data-editor-preview]");
const importInput = document.querySelector("[data-import-json]");
const coverInput = document.querySelector("[data-cover-file]");
const galleryInput = document.querySelector("[data-gallery-files]");
const coverPreviewRoot = document.querySelector("[data-cover-preview]");
const galleryManagerRoot = document.querySelector("[data-gallery-manager]");

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

const FALLBACK_PROJECTS = [
  {
    id: "vr-weapon-system",
    title: "VR Weapon System",
    category: "VR В· Unity Asset Store",
    tag: "Unity Asset",
    description:
      "Unity Asset РґР»СЏ VR, РІ РєРѕС‚РѕСЂРѕРј СЏ СЃРѕР±СЂР°Р» РѕСЂСѓР¶РµР№РЅСѓСЋ СЃРёСЃС‚РµРјСѓ, РјРѕРґРµР»Рё, Р·РІСѓРєРё Рё РѕСЃРЅРѕРІРЅС‹Рµ РІР·Р°РёРјРѕРґРµР№СЃС‚РІРёСЏ. Р’Рѕ РІСЂРµРјСЏ СЂР°Р·СЂР°Р±РѕС‚РєРё СЏ Р°РєС‚РёРІРЅРѕ РёР·СѓС‡Р°Р» РїР°С‚С‚РµСЂРЅС‹ РїСЂРѕРµРєС‚РёСЂРѕРІР°РЅРёСЏ, SOLID Рё СЃС‚СЂСѓРєС‚СѓСЂСѓ СЂР°СЃС€РёСЂСЏРµРјС‹С… РёРіСЂРѕРІС‹С… СЃРёСЃС‚РµРј.",
    features: [
      "РњРѕРґРµР»Рё РїРёСЃС‚РѕР»РµС‚Р° Sig P320 Рё РІРёРЅС‚РѕРІРєРё M16A4",
      "РЎРёСЃС‚РµРјР° РїРµСЂРµР·Р°СЂСЏРґРєРё СЃРѕ СЃРјРµРЅРѕР№ РјР°РіР°Р·РёРЅР° Рё РІР·РІРѕРґРѕРј Р·Р°С‚РІРѕСЂР°",
      "Р’С‹Р±СЂРѕСЃ РіРёР»СЊР·, Р·РІСѓРєРё РѕСЂСѓР¶РёСЏ Рё Р±Р°Р·РѕРІР°СЏ РѕС‚РґР°С‡Р°",
      "РђСЂС…РёС‚РµРєС‚СѓСЂР° РґР»СЏ СЂР°СЃС€РёСЂРµРЅРёСЏ РЅР°Р±РѕСЂР° РѕСЂСѓР¶РёСЏ",
    ],
    learnings: [
      "РџСЂР°РєС‚РёС‡РµСЃРєРѕРµ РїСЂРёРјРµРЅРµРЅРёРµ РћРћРџ Рё SOLID",
      "РџР°С‚С‚РµСЂРЅС‹ РїСЂРѕРµРєС‚РёСЂРѕРІР°РЅРёСЏ РІ Unity",
      "Р Р°Р·СЂР°Р±РѕС‚РєР° РѕСЂСѓР¶РµР№РЅС‹С… СЃРёСЃС‚РµРј РґР»СЏ VR",
    ],
    technologies: ["Unity", "C#", "XR Toolkit", "Blender", "SOLID"],
    primaryActionLabel: "РћС‚РєСЂС‹С‚СЊ РІРёРґРµРѕ",
    primaryActionUrl: "#",
    secondaryActionLabel: "Asset Store",
    secondaryActionUrl: "#",
    image: "https://placehold.co/580x420/202020/e8833a?text=VR+Weapon+System",
    gallery: [
      "https://placehold.co/104x72/333333/e8833a?text=1",
      "https://placehold.co/104x72/333333/f5f5f5?text=2",
      "https://placehold.co/104x72/333333/f5f5f5?text=3",
    ],
    flipped: false,
    i18n: {
      en: {
        description:
          "A Unity asset for VR where I built a weapon system, models, sounds, and core interactions. During development, I actively studied design patterns, SOLID, and the structure of expandable game systems.",
        features: [
          "Sig P320 pistol and M16A4 rifle models",
          "Reloading system with magazine change and bolt charging",
          "Shell ejection, weapon sounds, and basic recoil",
          "Architecture for expanding the weapon set",
        ],
        learnings: ["Practical use of OOP and SOLID", "Design patterns in Unity", "VR weapon system development"],
        primaryActionLabel: "Open Video",
      },
    },
  },
  {
    id: "quest-island-vr",
    title: "Quest Island VR",
    category: "VR Game В· Meta Quest В· PCVR",
    tag: "VR Game",
    description:
      "VR-РёРіСЂР° РґР»СЏ Meta Quest Рё PCVR. РРіСЂРѕРє РѕРєР°Р·С‹РІР°РµС‚СЃСЏ РЅР° С‚Р°РёРЅСЃС‚РІРµРЅРЅРѕРј РѕСЃС‚СЂРѕРІРµ, СЂРµС€Р°РµС‚ РіРѕР»РѕРІРѕР»РѕРјРєРё Рё РІР·Р°РёРјРѕРґРµР№СЃС‚РІСѓРµС‚ СЃ РІРёСЂС‚СѓР°Р»СЊРЅРѕР№ РєР»Р°РІРёР°С‚СѓСЂРѕР№, РєР°СЂС‚РѕС‡РєР°РјРё-РєР»СЋС‡Р°РјРё Рё РґСЂСѓРіРёРјРё РїСЂРµРґРјРµС‚Р°РјРё.",
    features: [
      "РћСЂРёРіРёРЅР°Р»СЊРЅС‹Р№ РјРёСЂ СЃ СЃРѕР±СЃС‚РІРµРЅРЅРѕР№ Р°С‚РјРѕСЃС„РµСЂРѕР№",
      "РРЅС‚РµСЂР°РєС‚РёРІРЅС‹Рµ РіРѕР»РѕРІРѕР»РѕРјРєРё Рё РїСЂРµРґРјРµС‚РЅС‹Рµ РјРµС…Р°РЅРёРєРё",
      "РђРІС‚РѕСЂСЃРєР°СЏ РјСѓР·С‹РєР° Рё Р·РІСѓРєРѕРІРѕРµ РѕС„РѕСЂРјР»РµРЅРёРµ",
      "РџРѕРґРґРµСЂР¶РєР° Meta Quest Рё PCVR",
    ],
    learnings: [],
    technologies: ["Unity", "Meta Quest", "PCVR", "XR Toolkit", "Original Music"],
    primaryActionLabel: "РћС‚РєСЂС‹С‚СЊ РІРёРґРµРѕ",
    primaryActionUrl: "#",
    secondaryActionLabel: "РџРѕРґСЂРѕР±РЅРµРµ",
    secondaryActionUrl: "#",
    image: "https://placehold.co/580x420/0a2a3a/06b6d4?text=Quest+Island+VR",
    gallery: [
      "https://placehold.co/104x72/0a2a3a/06b6d4?text=1",
      "https://placehold.co/104x72/0a3020/f5f5f5?text=2",
    ],
    flipped: true,
    i18n: {
      en: {
        description:
          "A VR game for Meta Quest and PCVR. The player finds themselves on a mysterious island, solves puzzles, and interacts with a virtual keyboard, key cards, and other objects.",
        features: [
          "Original world with its own atmosphere",
          "Interactive puzzles and object-based mechanics",
          "Original music and sound design",
          "Support for Meta Quest and PCVR",
        ],
        primaryActionLabel: "Open Video",
        secondaryActionLabel: "Learn More",
      },
    },
  },
];

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

function getLanguage() {
  return window.egorI18n?.getLanguage?.() || "ru";
}

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

function splitGallery(value) {
  return value
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

function saveProjects() {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects, null, 2));
}

function parseProjectsJson(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Could not read saved projects", error);
    return [];
  }
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

function isDataImage(value) {
  return typeof value === "string" && value.startsWith("data:image/");
}

function preferAssetImage(savedValue, baseValue) {
  if ((!savedValue || isDataImage(savedValue)) && baseValue && !isDataImage(baseValue)) {
    return baseValue;
  }

  return savedValue || baseValue || "";
}

function preferAssetGallery(savedValue, baseValue) {
  const savedGallery = repairGallery(savedValue);
  const baseGallery = repairGallery(baseValue);
  const hasEmbeddedImages = savedGallery.some(isDataImage);

  if ((savedGallery.length === 0 || hasEmbeddedImages) && baseGallery.some((item) => !isDataImage(item))) {
    return baseGallery;
  }

  return savedGallery;
}

function mergeProjects(baseProjects, savedProjects) {
  const normalizedBase = normalizeProjects(baseProjects);
  const normalizedSaved = normalizeProjects(savedProjects);
  const savedById = new Map(normalizedSaved.map((project) => [project.id, project]));
  const merged = normalizedBase.map((project) => {
    const savedProject = savedById.get(project.id);
    if (!savedProject) {
      return project;
    }

    return {
      ...project,
      ...savedProject,
      image: preferAssetImage(savedProject.image, project.image),
      gallery: preferAssetGallery(savedProject.gallery, project.gallery),
    };
  });
  const baseIds = new Set(normalizedBase.map((project) => project.id));
  const savedOnly = normalizedSaved.filter((project) => !baseIds.has(project.id));

  return [...merged, ...savedOnly];
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
  wrapper.innerHTML = `
    <div class="project-media">
      <img src="${image}" alt="">
      ${localizedProject.tag ? `<span class="media-tag">${escapeHtml(localizedProject.tag)}</span>` : ""}
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
  return wrapper;
}

function renderPreview() {
  previewRoot.innerHTML = "";
  projects.forEach((project, index) => {
    previewRoot.append(createProjectCard(project, index));
  });
}

function syncCurrentForm() {
  if (!selectedId || form.dataset.loading === "true") {
    return;
  }

  const updated = readForm();
  projects = projects.map((project) => (project.id === selectedId ? updated : project));
  selectedId = updated.id;
  saveProjects();
  renderList();
  renderPreview();
  renderImageManagers();
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

function fileToImageSource(file) {
  return ASSET_IMAGE_PATHS_BY_FILE[file.name] || fileToDataUrl(file);
}

async function loadInitialProjects() {
  form.dataset.loading = "true";
  const savedProjects = parseProjectsJson(localStorage.getItem(PROJECTS_STORAGE_KEY));
  let baseProjects = FALLBACK_PROJECTS;

  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (response.ok) {
      const loadedProjects = await response.json();
      const normalizedLoadedProjects = normalizeProjects(loadedProjects);
      if (normalizedLoadedProjects.length > 0) {
        baseProjects = normalizedLoadedProjects;
      }
    }
  } catch (error) {
    console.warn("Could not load base projects", error);
  }

  projects = mergeProjects(baseProjects, savedProjects);
  if (projects.length === 0) {
    projects = FALLBACK_PROJECTS;
  }

  selectedId = projects[0]?.id || "";
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
  saveProjects();
  form.dataset.loading = "false";
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
  localStorage.removeItem(PROJECTS_STORAGE_KEY);
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

  form.elements.image.value = await fileToImageSource(file);
  syncCurrentForm();
  coverInput.value = "";
});

galleryInput.addEventListener("change", async () => {
  const files = Array.from(galleryInput.files);
  if (files.length === 0) return;

  const urls = await Promise.all(files.map(fileToImageSource));
  const current = repairGallery(form.elements.gallery.value);
  if (!form.elements.image.value.trim()) {
    form.elements.image.value = urls[0];
  }
  form.elements.gallery.value = [...current, ...urls].join(", ");
  syncCurrentForm();
  galleryInput.value = "";
});

projects = FALLBACK_PROJECTS;
selectedId = projects[0]?.id || "";
form.dataset.loading = "true";
fillForm(getSelectedProject());
renderList();
renderPreview();
form.dataset.loading = "false";

loadInitialProjects().catch((error) => {
  console.error(error);
  projects = FALLBACK_PROJECTS;
  selectedId = "";
  selectedId = projects[0]?.id || "";
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
  saveProjects();
  form.dataset.loading = "false";
});

window.addEventListener("languagechange", () => {
  fillForm(getSelectedProject());
  renderList();
  renderPreview();
});
}
