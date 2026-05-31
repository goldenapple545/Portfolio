const PROJECTS_STORAGE_KEY = "egorPortfolioProjects";
const projectsRoot = document.querySelector("[data-projects-root]");

const defaultImage =
  "https://placehold.co/580x420/202020/e8833a?text=Project+Cover";

function getLanguage() {
  return window.egorI18n?.getLanguage?.() || "ru";
}

function t(key) {
  return window.egorI18n?.getTranslation?.(key) || key;
}

function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text) {
    element.textContent = options.text;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        element.setAttribute(key, value);
      }
    });
  }

  return element;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return [];
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
  const savedGallery = normalizeList(savedValue);
  const baseGallery = normalizeList(baseValue);
  const hasEmbeddedImages = savedGallery.some(isDataImage);

  if ((savedGallery.length === 0 || hasEmbeddedImages) && baseGallery.some((item) => !isDataImage(item))) {
    return baseGallery;
  }

  return savedGallery;
}

function mergeProjects(baseProjects, savedProjects) {
  const normalizedBase = Array.isArray(baseProjects) ? baseProjects : [];
  const normalizedSaved = Array.isArray(savedProjects) ? savedProjects : [];
  const savedById = new Map(normalizedSaved.filter((project) => project?.id).map((project) => [project.id, project]));
  const baseIds = new Set(normalizedBase.map((project) => project.id));
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
  const savedOnly = normalizedSaved.filter((project) => project?.id && !baseIds.has(project.id));

  return [...merged, ...savedOnly];
}

function getLocalizedProject(project) {
  const language = getLanguage();
  const localized = project?.i18n?.[language];

  return localized ? { ...project, ...localized } : project;
}

function createProjectCard(project, index) {
  const localizedProject = getLocalizedProject(project);
  const article = createElement("article", {
    className: `project-card ${localizedProject.flipped || index % 2 === 1 ? "flip" : ""}`.trim(),
  });

  const media = createElement("div", { className: "project-media" });
  const cover = createElement("img", {
    attributes: {
      src: project.image || defaultImage,
      alt: `${t("projectCoverAlt")} ${localizedProject.title || "Project"}`,
    },
  });
  media.append(cover);

  if (localizedProject.tag) {
    media.append(createElement("span", { className: "media-tag", text: localizedProject.tag }));
  }

  const gallery = normalizeList(project.gallery);
  if (gallery.length > 0) {
    const overlay = createElement("div", {
      className: "media-overlay",
      attributes: { "aria-label": t("projectPreviewAria") },
    });

    gallery.forEach((src, thumbIndex) => {
      const thumb = createElement("button", {
        className: `thumb ${thumbIndex === 0 ? "active" : ""}`.trim(),
        attributes: {
          type: "button",
          "aria-label": `${t("projectPreview")} ${thumbIndex + 1}`,
        },
      });
      const image = createElement("img", { attributes: { src, alt: "" } });
      thumb.append(image);
      thumb.addEventListener("click", () => {
        cover.src = src;
        overlay.querySelectorAll(".thumb").forEach((item) => item.classList.remove("active"));
        thumb.classList.add("active");
      });
      overlay.append(thumb);
    });

    media.append(overlay);
  }

  const info = createElement("div", { className: "project-info" });
  const content = createElement("div");

  content.append(createElement("p", { className: "project-category", text: localizedProject.category }));
  content.append(createElement("h2", { className: "project-title", text: localizedProject.title }));
  content.append(createElement("p", { className: "project-desc", text: localizedProject.description }));

  const features = normalizeList(localizedProject.features);
  if (features.length > 0) {
    const list = createElement("ul", { className: "feature-list" });
    features.forEach((feature) => list.append(createElement("li", { text: feature })));
    content.append(list);
  }

  const learnings = normalizeList(localizedProject.learnings);
  if (learnings.length > 0) {
    const learningsBox = createElement("div", { className: "learnings" });
    learningsBox.append(createElement("p", { className: "learnings-title", text: t("projectLearnings") }));
    const list = createElement("ul");
    learnings.forEach((learning) => list.append(createElement("li", { text: learning })));
    learningsBox.append(list);
    content.append(learningsBox);
  }

  const technologies = normalizeList(localizedProject.technologies);
  if (technologies.length > 0) {
    const tags = createElement("div", {
      className: "tags",
      attributes: { "aria-label": t("projectTechnologiesAria") },
    });
    technologies.forEach((technology) => {
      tags.append(createElement("span", { className: "tag", text: technology }));
    });
    content.append(tags);
  }

  const actions = createElement("div", { className: "project-actions" });
  if (localizedProject.primaryActionLabel) {
    actions.append(
      createElement("a", {
        className: "btn-primary",
        text: localizedProject.primaryActionLabel,
        attributes: { href: localizedProject.primaryActionUrl || "#" },
      }),
    );
  }
  if (localizedProject.secondaryActionLabel) {
    actions.append(
      createElement("a", {
        className: "btn-outline",
        text: localizedProject.secondaryActionLabel,
        attributes: { href: localizedProject.secondaryActionUrl || "#" },
      }),
    );
  }

  info.append(content, actions);
  article.append(media, info);

  return article;
}

function renderProjects(projects) {
  if (!projectsRoot) {
    return;
  }

  projectsRoot.innerHTML = "";

  if (!Array.isArray(projects) || projects.length === 0) {
    projectsRoot.append(createElement("p", { className: "empty-state", text: t("projectsEmpty") }));
    return;
  }

  projects.forEach((project, index) => {
    projectsRoot.append(createProjectCard(project, index));
  });
}

async function loadProjects() {
  const localProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);

  if (false && localProjects) {
    try {
      return JSON.parse(localProjects);
    } catch (error) {
      console.warn("Не удалось прочитать локальные проекты", error);
    }
  }

  const response = await fetch("./data/projects.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить проекты: ${response.status}`);
  }

  const baseProjects = await response.json();

  if (localProjects) {
    try {
      return mergeProjects(baseProjects, JSON.parse(localProjects));
    } catch (error) {
      console.warn("Could not read local projects", error);
    }
  }

  return baseProjects;
}

if (projectsRoot) {
  let loadedProjects = [];

  loadProjects()
    .then((projects) => {
      loadedProjects = projects;
      renderProjects(loadedProjects);
    })
    .catch((error) => {
      console.error(error);
      projectsRoot.innerHTML = "";
      projectsRoot.append(
        createElement("p", {
          className: "empty-state",
          text: t("projectsLoadError"),
        }),
      );
    });

  window.addEventListener("languagechange", () => {
    renderProjects(loadedProjects);
  });
}
