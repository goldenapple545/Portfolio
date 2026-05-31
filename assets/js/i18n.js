const STORAGE_KEY = "egorPortfolioLanguage";

const translations = {
  ru: {
    projectsEmpty: "Проекты пока не добавлены.",
    projectsLoadError:
      "Не удалось загрузить проекты. Запустите локальный сервер или проверьте data/projects.json.",
    projectCoverAlt: "Обложка проекта",
    projectPreviewAria: "Превью проекта",
    projectPreview: "Превью",
    projectLearnings: "Чем я занимался в проекте",
    projectTechnologiesAria: "Технологии",
    untitledProject: "Без названия",
    uncategorizedProject: "Без категории",
    newProjectTitle: "Новый проект",
    openButton: "Открыть",
    learnMoreButton: "Подробнее",
    sentMessage: "Отправлено!",
  },
  en: {
    metaDescription:
      "Portfolio of Egor Vikturov: VR Developer, Game Designer, Unity and XR Interaction Toolkit.",
    pageTitle: "Egor Vikturov - VR Developer",
    navAria: "Main navigation",
    navHome: "Home",
    navProjects: "Projects",
    navMusic: "Music",
    navEditor: "Editor",
    navContacts: "Contacts",
    langSwitchAria: "Language switcher",
    heroEyebrow: "Open to offers",
    heroRole: "VR Developer & Game Designer",
    heroSub:
      "I create immersive VR games and interactive worlds since 2020. I believe that immersion is the foundation of a good game.",
    heroProjects: "View projects",
    heroCv: "Download CV",
    statsAria: "Key facts",
    statProgramming: "Years in programming",
    statCertificates: "Unity certificates",
    statProjects: "VR projects",
    statIdeas: "Ideas",
    aboutLabel: "// about me",
    aboutTitle: "About Me",
    aboutTextOne:
      "I am a VR developer: I have been programming since 2020 and working in game development since 2022. I am responsible, punctual, bring tasks to completion, and quickly find common ground with people.",
    aboutTextTwo:
      "I believe that immersion is the foundation of a good game. Besides code, I write original music for my projects and constantly experiment during development.",
    skillsTech: "Technologies",
    skillsLanguages: "Languages",
    langRussian: "Russian",
    skillsInterests: "Interests",
    interestMusic: "Music",
    interestDesign: "Design",
    educationLabel: "// education",
    educationTitle: "Education",
    mietTitle: "MIET - Automation Engineer",
    mietMeta: "2021-2025 · Zelenograd",
    eduDiploma: "Diploma",
    eduCertificate: "Certificate",
    juniorProgrammerMeta: "Unity Technologies · Introductory engine programming course",
    timelineLabel: "// path",
    timelineTitle: "How I Developed",
    timelineStartTitle: "The Beginning",
    timelineStartDesc: "Wrote my first lines of code and learned the basics of C++.",
    timelineMietTitle: "MIET + Unity Junior Programmer",
    timelineMietDesc:
      "I started with Bonelab mod development and realized that I wanted to work in game development.",
    timelineVrTitle: "First VR Projects",
    timelineVrDesc:
      "Dived into VR development, learned XR Interaction Toolkit, and studied C# in parallel.",
    timelineWorkDesc: "Built pet projects and got my first job in a company.",
    timelineNowYear: "2025 - Now",
    timelineNowTitle: "Graduated from MIET · New Horizons",
    timelineNowDesc:
      "Graduated from university and continue growing in VR/Game Dev. Open to commercial projects and collaboration.",
    gamesLabel: "// inspiration",
    gamesTitle: "Gaming Experience",
    ctaTitle: "Ready for New Projects",
    ctaText:
      "I am looking for interesting VR/gamedev tasks: Asset Store tools, indie games, or corporate VR training simulators. Write to me.",
    ctaButton: "Write",
    footer: "© 2026 Egor Vikturov · VR Developer & Game Designer",
    projectsMetaDescription:
      "Projects by Egor Vikturov: VR development, game projects, Unity, and interactive systems.",
    projectsPageTitle: "Egor Vikturov - Projects",
    projectsHeaderTitle: "My Projects",
    projectsListAria: "Project list",
    projectsLoading: "Loading projects...",
    projectsEmpty: "No projects have been added yet.",
    projectsLoadError:
      "Could not load projects. Start a local server or check data/projects.json.",
    projectCoverAlt: "Project cover",
    projectPreviewAria: "Project preview",
    projectPreview: "Preview",
    projectLearnings: "What I Worked On",
    projectTechnologiesAria: "Technologies",
    musicMetaDescription:
      "Music by Egor Vikturov: soundtracks for VR games, guitar recordings, playlists, and videos.",
    musicPageTitle: "Egor Vikturov - Music",
    musicEyebrow: "Music & Guitar",
    musicTitle: "My Music",
    musicHeroSub:
      "I write original soundtracks for my VR games and also play guitar. This page collects playlists, music experiments, and videos with live recordings.",
    listenLabel: "// listen",
    playlistsTitle: "Playlists",
    play: "Play",
    spotifyFeatured: "Spotify · Featured",
    questOstDesc:
      "The full soundtrack for Quest Island VR: atmospheric music for a mysterious island, calm ambient tracks, and dynamic themes for puzzles.",
    tracksQuest: "8 tracks · ~24 min",
    listenAction: "Listen",
    weaponOstDesc:
      "Dynamic tracks for the VR Weapon System asset: heavy riffs, tension, and action atmosphere.",
    tracksFive: "5 tracks",
    openAction: "Open",
    ambientDesc:
      "Experimental ambient sketches: music for development, focus, and finding a game atmosphere.",
    tracksTwelve: "12 tracks",
    guitarRecords: "Guitar Recordings",
    guitarPlaylistDesc:
      "A playlist with live recordings: covers and original guitar compositions.",
    playlist: "Playlist",
    watchAction: "Watch",
    synthDesc:
      "Synthesizer and electronic tracks: experiments with sound, rhythm, and space.",
    tracksSeven: "7 tracks",
    watchLabel: "// watch",
    guitarVideosTitle: "Guitar Videos",
    guitarVideoOne: "Guitar Video 1",
    guitarVideoTwo: "Guitar Video 2",
    guitarVideoThree: "Guitar Video 3",
    guitarVideoFour: "Guitar Video 4",
    videoTitleOne: "Video Title 1",
    videoTitleTwo: "Video Title 2",
    videoTitleThree: "Video Title 3",
    videoTitleFour: "Video Title 4",
    videoDescOne:
      "Short description: what you are playing, whether it is a cover or an original piece, and the mood of the recording.",
    videoDescTwo:
      "Short description: technique, style, atmosphere, or recording context.",
    videoDescShort: "Short video description.",
    musicCtaTitle: "Need Music for a Game?",
    musicCtaText:
      "I write original soundtracks for VR projects and games: from atmospheric ambient to dynamic action. Want to discuss it?",
    editorMetaDescription: "Project editor for Egor Vikturov's static portfolio.",
    editorPageTitle: "Egor Vikturov - Project Editor",
    backToProjects: "To Projects",
    editorTitle: "Project Editor",
    editorShellAria: "Project data editor",
    newProject: "New Project",
    exportJson: "Export JSON",
    importJson: "Import JSON",
    editorNote:
      "Data is saved in the browser. To publish it, export JSON and replace data/projects.json in the project.",
    fieldTitle: "Title",
    fieldCategory: "Category",
    fieldImageTag: "Image Tag",
    fieldCover: "Cover",
    fieldCoverUpload: "Upload Cover",
    fieldGallery: "Gallery",
    fieldGalleryUpload: "Add Images to Gallery",
    fieldTechnologies: "Technologies",
    fieldPrimaryLabel: "Primary Button Text",
    fieldPrimaryUrl: "Primary Button Link",
    fieldSecondaryLabel: "Secondary Button Text",
    fieldSecondaryUrl: "Secondary Button Link",
    fieldDescription: "Description",
    fieldFeatures: "Features",
    fieldLearnings: "What I Worked On",
    fieldFlipped: "Flip Card",
    saveProject: "Save Project",
    duplicate: "Duplicate",
    delete: "Delete",
    resetLocalData: "Reset Local Data",
    previewTitle: "Preview",
    openProjects: "Open Projects",
    untitledProject: "Untitled",
    uncategorizedProject: "No category",
    newProjectTitle: "New Project",
    openButton: "Open",
    learnMoreButton: "Learn More",
    placeholderImage: "URL or data:image...",
    placeholderGallery: "Comma-separated URLs",
    placeholderOpenVideo: "Open video",
    placeholderLearnMore: "Learn more",
    placeholderLines: "One item per line",
    contactsMetaDescription:
      "Contacts of Egor Vikturov: collaboration on VR projects, gamedev, and music.",
    contactsPageTitle: "Egor Vikturov - Contacts",
    contactsLayoutAria: "Contact information",
    contactsEyebrow: "In Touch",
    contactsTitle: "Contacts",
    contactsHeroSub:
      "Open to collaboration on VR projects, gamedev, and music composition. Write to me - I reply quickly.",
    contactsIntroTitle: "Let's Work Together",
    contactsIntroText:
      "Looking for a VR developer for an indie game, corporate training simulator, or Unity asset? Or need an original soundtrack? Write to me and we will discuss the details.",
    emailLabel: "Email",
    copyEmail: "Copy",
    socialsLabel: "Socials and Platforms",
    vkName: "VK",
    contactFormTitle: "Send a Message",
    contactFormSub: "Fill out the form - I will reply within a day",
    contactName: "Name",
    placeholderName: "Your name",
    contactTopic: "Topic",
    topicVr: "VR Project",
    topicSoundtrack: "Soundtrack",
    topicCollab: "Collaboration",
    topicOther: "Other",
    contactSubject: "Subject",
    placeholderSubject: "Briefly describe your request",
    contactMessage: "Message",
    placeholderMessage: "Tell me more about the project or question...",
    sendMessage: "Send Message",
    sentMessage: "Sent!",
    directEmailPrefix: "Or write directly -",
    emailCopied: "Email copied!",
  },
};

const textDefaults = new Map();
const attrDefaults = new Map();

function saveDefaults() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    textDefaults.set(element, element.textContent.trim());
  });

  document.querySelectorAll("[data-i18n-attrs]").forEach((element) => {
    const defaults = {};
    element.dataset.i18nAttrs.split(";").forEach((entry) => {
      const [attr] = entry.split(":");
      if (attr) {
        defaults[attr] = element.getAttribute(attr) || "";
      }
    });
    attrDefaults.set(element, defaults);
  });
}

function getPreferredLanguage() {
  const storedLanguage = localStorage.getItem(STORAGE_KEY);
  return storedLanguage === "en" ? "en" : "ru";
}

function getTranslation(key, language = getPreferredLanguage()) {
  const dictionary = translations[language] || {};
  return dictionary[key] || key;
}

function translatePage(language) {
  const dictionary = translations[language] || {};

  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = dictionary[key] || textDefaults.get(element) || "";
  });

  document.querySelectorAll("[data-i18n-attrs]").forEach((element) => {
    element.dataset.i18nAttrs.split(";").forEach((entry) => {
      const [attr, key] = entry.split(":");
      if (!attr || !key) {
        return;
      }

      const defaults = attrDefaults.get(element) || {};
      element.setAttribute(attr, dictionary[key] || defaults[attr] || "");
    });
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  localStorage.setItem(STORAGE_KEY, language);
  window.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
}

saveDefaults();
translatePage(getPreferredLanguage());

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    translatePage(button.dataset.lang);
  });
});

window.egorI18n = {
  getLanguage: getPreferredLanguage,
  getTranslation,
  translatePage,
};
