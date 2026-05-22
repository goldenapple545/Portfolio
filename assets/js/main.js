const PROJECTS_STORAGE_KEY = "egorPortfolioProjects";
const projectsRoot = document.querySelector("[data-projects-root]");

const defaultImage =
  "https://placehold.co/580x420/202020/e8833a?text=Project+Cover";

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

function createProjectCard(project, index) {
  const article = createElement("article", {
    className: `project-card ${project.flipped || index % 2 === 1 ? "flip" : ""}`.trim(),
  });

  const media = createElement("div", { className: "project-media" });
  const cover = createElement("img", {
    attributes: {
      src: project.image || defaultImage,
      alt: `Обложка проекта ${project.title || "Project"}`,
    },
  });
  media.append(cover);

  if (project.tag) {
    media.append(createElement("span", { className: "media-tag", text: project.tag }));
  }

  const gallery = normalizeList(project.gallery);
  if (gallery.length > 0) {
    const overlay = createElement("div", {
      className: "media-overlay",
      attributes: { "aria-label": "Превью проекта" },
    });

    gallery.forEach((src, thumbIndex) => {
      const thumb = createElement("button", {
        className: `thumb ${thumbIndex === 0 ? "active" : ""}`.trim(),
        attributes: {
          type: "button",
          "aria-label": `Превью ${thumbIndex + 1}`,
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

  content.append(createElement("p", { className: "project-category", text: project.category }));
  content.append(createElement("h2", { className: "project-title", text: project.title }));
  content.append(createElement("p", { className: "project-desc", text: project.description }));

  const features = normalizeList(project.features);
  if (features.length > 0) {
    const list = createElement("ul", { className: "feature-list" });
    features.forEach((feature) => list.append(createElement("li", { text: feature })));
    content.append(list);
  }

  const learnings = normalizeList(project.learnings);
  if (learnings.length > 0) {
    const learningsBox = createElement("div", { className: "learnings" });
    learningsBox.append(createElement("p", { className: "learnings-title", text: "Что я усвоил" }));
    const list = createElement("ul");
    learnings.forEach((learning) => list.append(createElement("li", { text: learning })));
    learningsBox.append(list);
    content.append(learningsBox);
  }

  const technologies = normalizeList(project.technologies);
  if (technologies.length > 0) {
    const tags = createElement("div", {
      className: "tags",
      attributes: { "aria-label": "Технологии" },
    });
    technologies.forEach((technology) => {
      tags.append(createElement("span", { className: "tag", text: technology }));
    });
    content.append(tags);
  }

  const actions = createElement("div", { className: "project-actions" });
  if (project.primaryActionLabel) {
    actions.append(
      createElement("a", {
        className: "btn-primary",
        text: project.primaryActionLabel,
        attributes: { href: project.primaryActionUrl || "#" },
      }),
    );
  }
  if (project.secondaryActionLabel) {
    actions.append(
      createElement("a", {
        className: "btn-outline",
        text: project.secondaryActionLabel,
        attributes: { href: project.secondaryActionUrl || "#" },
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
    projectsRoot.append(createElement("p", { className: "empty-state", text: "Проекты пока не добавлены." }));
    return;
  }

  projects.forEach((project, index) => {
    projectsRoot.append(createProjectCard(project, index));
  });
}

async function loadProjects() {
  const localProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);

  if (localProjects) {
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

  return response.json();
}

if (projectsRoot) {
  loadProjects()
    .then(renderProjects)
    .catch((error) => {
      console.error(error);
      projectsRoot.innerHTML = "";
      projectsRoot.append(
        createElement("p", {
          className: "empty-state",
          text: "Не удалось загрузить проекты. Запустите локальный сервер или проверьте data/projects.json.",
        }),
      );
    });
}
