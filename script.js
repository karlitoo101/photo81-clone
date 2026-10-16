// ---- Dropdowns (notifications / language / help / folder menus) ----
// Pairs of [trigger button, dropdown menu]. Header ones are by id;
// folder ones are discovered on the page.
const dropdownPairs = [
  ["notifBtn", "notifMenu"],
  ["langBtn", "langMenu"],
  ["helpBtn", "helpMenu"],
]
  .map(([b, m]) => [document.getElementById(b), document.getElementById(m)])
  .filter(([b, m]) => b && m);

// Folder ⋮ menus: button + its sibling .folder-dropdown
document.querySelectorAll(".folder-menu-wrap").forEach((wrap) => {
  const btn = wrap.querySelector(".folder-menu");
  const menu = wrap.querySelector(".folder-dropdown");
  if (btn && menu) dropdownPairs.push([btn, menu]);
});

// Custom select dropdowns (Tools / sort): trigger + its sibling .dropdown-menu
document.querySelectorAll(".dropdown-select").forEach((wrap) => {
  const btn = wrap.querySelector(".dropdown-trigger");
  const menu = wrap.querySelector(".dropdown-menu");
  if (btn && menu) dropdownPairs.push([btn, menu]);
});

function closeAllMenus(except) {
  document.querySelectorAll(".dropdown.open").forEach((m) => {
    if (m !== except) m.classList.remove("open");
  });
}

dropdownPairs.forEach(([btnEl, menuEl]) => {
  btnEl.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menuEl.classList.contains("open");
    closeAllMenus(menuEl);
    menuEl.classList.toggle("open", !isOpen);
  });
  menuEl.addEventListener("click", (e) => e.stopPropagation());
});

// ---- Custom select: pick an option, update the trigger label ----
document.querySelectorAll(".dropdown-select").forEach((wrap) => {
  const valueEl = wrap.querySelector(".dropdown-value");
  const menu = wrap.querySelector(".dropdown-menu");
  wrap.querySelectorAll(".dropdown-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      wrap.querySelectorAll(".dropdown-option").forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      if (valueEl) valueEl.textContent = opt.textContent.trim();
      menu.classList.remove("open");
    });
  });
});

// Click anywhere else closes menus
document.addEventListener("click", () => closeAllMenus(null));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllMenus(null);
    closeModal();
  }
});

// ---- Language select active state ----
document.querySelectorAll(".lang-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".lang-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// ---- Notification tabs ----
document.querySelectorAll(".ntab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".ntab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

// ---- Contact modal ----
const modal = document.getElementById("contactModal");

function openModal() {
  modal.classList.add("open");
  closeAllMenus(null);
}
function closeModal() {
  modal.classList.remove("open");
}

document.getElementById("contactBtn").addEventListener("click", openModal);
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancel").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ---- Sidebar: let real links (Home/Creations) navigate; keep others inert ----
document.querySelectorAll(".nav .nav-item").forEach((item) => {
  const href = item.getAttribute("href");
  if (!href || href === "#") {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav .nav-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  }
});

// ---- Create folder modal ----
const folderModal = document.getElementById("folderModal");
const addFolderBtn = document.querySelector(".add-folder-btn");
const folderNameInput = document.getElementById("folderNameInput");
const charCount = document.getElementById("charCount");
const createFolderBtn = document.getElementById("createFolderBtn");
const folderForm = document.getElementById("folderForm");
const folderModalClose = document.getElementById("folderModalClose");

function openFolderModal() {
  if (!folderModal) return;
  folderModal.classList.add("open");
  closeAllMenus(null);
  if (folderNameInput) {
    folderNameInput.value = "";
    folderNameInput.dispatchEvent(new Event("input"));
    setTimeout(() => folderNameInput.focus(), 0);
  }
}
function closeFolderModal() {
  if (folderModal) folderModal.classList.remove("open");
}

if (addFolderBtn) addFolderBtn.addEventListener("click", openFolderModal);
if (folderModalClose) folderModalClose.addEventListener("click", closeFolderModal);
if (folderModal) {
  folderModal.addEventListener("click", (e) => {
    if (e.target === folderModal) closeFolderModal();
  });
}

if (folderNameInput) {
  folderNameInput.addEventListener("input", () => {
    const len = folderNameInput.value.length;
    if (charCount) charCount.textContent = len;
    if (createFolderBtn) createFolderBtn.disabled = folderNameInput.value.trim().length === 0;
  });
}

if (folderForm) {
  folderForm.addEventListener("submit", () => {
    const name = folderNameInput.value.trim();
    if (!name) return;
    addFolderCard(name);
    closeFolderModal();
  });
}

// Build a folder card (matching the existing markup) and append to the visible row
function addFolderCard(name) {
  // Add into whichever folder-row is actually on screen (not inside a hidden view).
  // offsetParent is null when the element or any ancestor is hidden/display:none.
  const targetRow = Array.from(document.querySelectorAll(".folder-row"))
    .find((r) => r.offsetParent !== null);
  if (!targetRow) return;

  const card = document.createElement("div");
  card.className = "folder-card";
  card.innerHTML = `
    <span class="folder-ico">
      <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <span class="folder-name"></span>
    <div class="folder-menu-wrap">
      <button class="folder-menu" aria-label="More">\u22ee</button>
      <div class="dropdown folder-dropdown">
        <button class="folder-menu-item"><svg viewBox="0 0 24 24"><path d="M4 20l4-1L19 8a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0L4 15z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>Rename</button>
        <button class="folder-menu-item"><svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 13h5M13 11l2 2-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Move Folder</button>
        <button class="folder-menu-item danger"><svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Delete Folder</button>
      </div>
    </div>`;
  card.querySelector(".folder-name").textContent = name;
  targetRow.appendChild(card);

  // Wire its ⋮ dropdown into the shared dropdown system
  const btn = card.querySelector(".folder-menu");
  const menu = card.querySelector(".folder-dropdown");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains("open");
    closeAllMenus(menu);
    menu.classList.toggle("open", !isOpen);
  });
  menu.addEventListener("click", (e) => e.stopPropagation());
}

// ---- Creations folder navigation (root "Folder" <-> inside "Generated") ----
const backBtn = document.getElementById("backBtn");
const folderTitle = document.getElementById("folderTitle");
const rootView = document.getElementById("rootView");
const generatedView = document.getElementById("generatedView");
const crumbSep = document.getElementById("crumbSep");
const crumbCurrent = document.getElementById("crumbCurrent");
const crumbRoot = document.getElementById("crumbRoot");

function openFolder(name) {
  if (rootView) rootView.hidden = true;
  if (generatedView) generatedView.hidden = false;
  if (backBtn) backBtn.hidden = false;
  if (folderTitle) folderTitle.textContent = name;
  if (crumbSep) crumbSep.hidden = false;
  if (crumbCurrent) { crumbCurrent.hidden = false; crumbCurrent.textContent = name; }
  document.querySelector(".content").scrollTop = 0;
}

function goToRoot() {
  if (generatedView) generatedView.hidden = true;
  if (rootView) rootView.hidden = false;
  if (backBtn) backBtn.hidden = true;
  if (folderTitle) folderTitle.textContent = "Folder";
  if (crumbSep) crumbSep.hidden = true;
  if (crumbCurrent) crumbCurrent.hidden = true;
  document.querySelector(".content").scrollTop = 0;
}

// Click a folder card (that has data-folder) to open it
document.querySelectorAll(".folder-card[data-folder]").forEach((card) => {
  card.addEventListener("click", (e) => {
    // don't trigger when interacting with the ⋮ menu
    if (e.target.closest(".folder-menu-wrap")) return;
    openFolder(card.getAttribute("data-folder"));
  });
});

if (backBtn) backBtn.addEventListener("click", goToRoot);
if (crumbRoot) crumbRoot.addEventListener("click", (e) => { e.preventDefault(); goToRoot(); });

// ---- Favorites toggle (shows empty state when no favorites) ----
const favBtn = document.querySelector(".fav-btn");
const favEmpty = document.getElementById("favEmpty");
const genGridEl = document.getElementById("genGrid");
const dateLabelEl = document.querySelector(".date-label");

if (favBtn) {
  favBtn.addEventListener("click", () => {
    const on = favBtn.classList.toggle("active");
    // No favorited items in this demo, so Favorites shows the empty state
    if (favEmpty) favEmpty.hidden = !on;
    if (genGridEl) genGridEl.hidden = on;
    if (dateLabelEl) dateLabelEl.hidden = on;
  });
}

// ---- Batch selection mode ----
const selectBtn = document.getElementById("selectBtn");
const selectLabel = selectBtn && selectBtn.querySelector(".select-btn-label");
const genGrid = document.getElementById("genGrid");
const selectionBar = document.getElementById("selectionBar");
const selCount = document.getElementById("selCount");
const selectAllBtn = document.getElementById("selectAllBtn");
const selectAllLabel = document.getElementById("selectAllLabel");

if (selectBtn && genGrid && selectionBar) {
  const tiles = Array.from(genGrid.querySelectorAll(".gen-tile"));

  const updateCount = () => {
    const n = genGrid.querySelectorAll(".gen-tile.selected").length;
    if (selCount) selCount.textContent = n;
    if (selectAllLabel) selectAllLabel.textContent = n === tiles.length ? "Deselect All" : "Select All";
  };

  const enterSelectMode = () => {
    selectBtn.classList.add("active");
    if (selectLabel) selectLabel.textContent = "Batch Selection";
    genGrid.classList.add("selecting");
    selectionBar.hidden = false;
    updateCount();
  };

  const exitSelectMode = () => {
    selectBtn.classList.remove("active");
    if (selectLabel) selectLabel.textContent = "Select";
    genGrid.classList.remove("selecting");
    selectionBar.hidden = true;
    tiles.forEach((t) => t.classList.remove("selected"));
  };

  selectBtn.addEventListener("click", () => {
    if (selectBtn.classList.contains("active")) exitSelectMode();
    else enterSelectMode();
  });

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      if (!genGrid.classList.contains("selecting")) return;
      tile.classList.toggle("selected");
      updateCount();
    });
  });

  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", () => {
      const allSelected = genGrid.querySelectorAll(".gen-tile.selected").length === tiles.length;
      tiles.forEach((t) => t.classList.toggle("selected", !allSelected));
      updateCount();
    });
  }
}

// ---- View toggle (list / grid) on the Creations page ----
document.querySelectorAll(".view-toggle .vt-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view-toggle .vt-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ======================= IMAGE PROMPT TOOL PAGE =======================

// Number-of-images slider: fill + chip
const numSlider = document.getElementById("numSlider");
const numImages = document.getElementById("numImages");
if (numSlider) {
  const updateSlider = () => {
    const min = +numSlider.min, max = +numSlider.max, val = +numSlider.value;
    const pct = ((val - min) / (max - min)) * 100;
    numSlider.style.setProperty("--fill", pct + "%");
    if (numImages) numImages.textContent = val;
  };
  numSlider.addEventListener("input", updateSlider);
  updateSlider();
}

// Auto-import toggle
const autoImport = document.getElementById("autoImport");
if (autoImport) {
  autoImport.addEventListener("click", () => autoImport.classList.toggle("active"));
}

// Aspect ratio selection
document.querySelectorAll(".ratio-grid .ratio").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ratio-grid .ratio").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Prompt mode toggle (image / chat)
document.querySelectorAll(".prompt-toggle .pt-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".prompt-toggle .pt-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Auto-grow the prompt textarea
const promptInput = document.querySelector(".prompt-input");
if (promptInput) {
  const grow = () => {
    promptInput.style.height = "auto";
    promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + "px";
  };
  promptInput.addEventListener("input", grow);
}

// Populate the recent filmstrip with placeholder thumbs
const filmThumbs = document.getElementById("filmThumbs");
if (filmThumbs) {
  const palettes = [
    "linear-gradient(135deg,#2b3a5a,#121a2e)",
    "linear-gradient(135deg,#3a2b4a,#1a1226)",
    "linear-gradient(135deg,#2b4a3a,#122618)",
    "linear-gradient(135deg,#4a3a2b,#261a12)",
    "linear-gradient(135deg,#4a2b3a,#260f1c)",
  ];
  for (let i = 0; i < 20; i++) {
    const t = document.createElement("div");
    t.className = "film-thumb";
    t.style.background = palettes[i % palettes.length];
    filmThumbs.appendChild(t);
  }
}
