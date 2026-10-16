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

// Field dropdowns (AI Model / Resolution): .field-select + sibling .field-menu
document.querySelectorAll(".field-dd").forEach((wrap) => {
  const btn = wrap.querySelector(".field-select");
  const menu = wrap.querySelector(".field-menu");
  if (btn && menu) dropdownPairs.push([btn, menu]);
});

// Switch to menu
document.querySelectorAll(".switch-dd").forEach((wrap) => {
  const btn = wrap.querySelector(".switch-to");
  const menu = wrap.querySelector(".switch-menu");
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
document.querySelectorAll(".ratio-row .ratio").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ratio-row .ratio").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});



// Auto-grow the prompt textarea + enable Enhance Prompt when there's text
const promptInput = document.querySelector(".prompt-input");
const enhanceBtn = document.getElementById("enhanceBtn");
if (promptInput) {
  const grow = () => {
    promptInput.style.height = "auto";
    promptInput.style.height = Math.min(promptInput.scrollHeight, 160) + "px";
  };
  const syncEnhance = () => {
    if (enhanceBtn) enhanceBtn.disabled = promptInput.value.trim().length === 0;
  };
  promptInput.addEventListener("input", () => { grow(); syncEnhance(); });
  syncEnhance();
}

// Populate the recent filmstrip with placeholder thumbs
const filmThumbs = document.getElementById("filmThumbs");
const canvasEmpty = document.getElementById("canvasEmpty");
const canvasImage = document.getElementById("canvasImage");

// Show a thumbnail's image in the main canvas
function showInCanvas(src) {
  if (canvasImage) { canvasImage.src = src; canvasImage.hidden = false; }
  if (canvasEmpty) canvasEmpty.hidden = true;
  setCanvasToolsEnabled(true);
}

// Enable/disable all toolbar tools based on the current board selection.
// Reference Image is now tied to the selected board image too.
function setCanvasToolsEnabled(on) {
  document.querySelectorAll(".canvas-tools .ctool").forEach((b) => { b.disabled = !on; });
}

if (filmThumbs) {
  const palettes = [
    ["#2b3a5a","#121a2e"], ["#3a2b4a","#1a1226"], ["#2b4a3a","#122618"],
    ["#4a3a2b","#261a12"], ["#4a2b3a","#260f1c"],
  ];
  for (let i = 0; i < 20; i++) {
    const pair = palettes[i % palettes.length];
    const t = document.createElement("button");
    t.className = "film-thumb";
    t.style.background = `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
    // render the gradient to a canvas so it can display large in the main canvas
    t.addEventListener("click", () => {
      const c = document.createElement("canvas");
      c.width = 600; c.height = 600;
      const ctx = c.getContext("2d");
      const g = ctx.createLinearGradient(0, 0, 600, 600);
      g.addColorStop(0, pair[0]); g.addColorStop(1, pair[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 600, 600);
      showInCanvas(c.toDataURL());
    });
    filmThumbs.appendChild(t);
  }
}

// ---- Upload Photo -> Upload Media modal ----
const uploadSlots = document.getElementById("uploadSlots");
const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const uploadModal = document.getElementById("uploadModal");
const uploadModalClose = document.getElementById("uploadModalClose");
const umGrid = document.getElementById("umGrid");
const umLocal = document.getElementById("umLocal");
const umLocalInput = document.getElementById("umLocalInput");

// Keep the empty "No photo uploaded yet" placeholder visible only when empty
function refreshEmptyPlaceholder() {
  if (!uploadSlots) return;
  const empty = uploadSlots.querySelector(".upload-area.empty");
  const hasPhoto = uploadSlots.querySelector(".photo-card");
  if (empty) empty.hidden = !!hasPhoto;
}

// Add a photo as a non-clickable placeholder card in the panel
function addPhoto(src) {
  if (!uploadSlots) return;
  const card = document.createElement("div");
  card.className = "upload-area photo-card filled";

  const img = document.createElement("img");
  img.className = "upload-preview";
  img.alt = "Uploaded photo";
  img.src = src;
  card.appendChild(img);

  const remove = document.createElement("button");
  remove.className = "slot-remove";
  remove.setAttribute("aria-label", "Remove photo");
  remove.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  remove.addEventListener("click", () => { card.remove(); refreshEmptyPlaceholder(); });
  card.appendChild(remove);

  uploadSlots.prepend(card);
  uploadSlots.scrollTop = 0;
  refreshEmptyPlaceholder();
}

// Modal open/close
function openUploadModal() {
  if (uploadModal) {
    uploadModal.classList.add("open");
    closeAllMenus(null);
    // Render folders/grid for whichever tab is currently active
    if (typeof renderUmFolders === "function") renderUmFolders();
  }
}
function closeUploadModal() {
  if (uploadModal) uploadModal.classList.remove("open");
}
if (uploadPhotoBtn) uploadPhotoBtn.addEventListener("click", openUploadModal);
if (uploadModalClose) uploadModalClose.addEventListener("click", closeUploadModal);
if (uploadModal) {
  uploadModal.addEventListener("click", (e) => { if (e.target === uploadModal) closeUploadModal(); });
}

// Populate the modal grid with placeholder image tiles
if (umGrid) {
  const palettes = [
    ["#3a4a6a", "#1a2440"],
    ["#5a4a3a", "#2a1f12"],
    ["#3a5a4a", "#122a1c"],
    ["#5a3a4a", "#2a1220"],
    ["#4a3a5a", "#1f1230"],
    ["#6a5a3a", "#2a2210"],
  ];
  for (let i = 0; i < 23; i++) {
    const pair = palettes[i % palettes.length];
    const tile = document.createElement("button");
    tile.className = "um-tile";
    tile.style.background = `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
    tile.addEventListener("click", () => {
      addSwatchPhoto(pair);
      closeUploadModal();
    });
    umGrid.appendChild(tile);
  }
}

// Render a placeholder gradient to a canvas and use it as the uploaded photo
function addSwatchPhoto(pair) {
  const c = document.createElement("canvas");
  c.width = c.height = 240;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 240, 240);
  g.addColorStop(0, pair[0]);
  g.addColorStop(1, pair[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 240, 240);
  addPhoto(c.toDataURL());
}

// Local Upload opens the real file picker
if (umLocal && umLocalInput) {
  umLocal.addEventListener("click", () => umLocalInput.click());
  umLocalInput.addEventListener("change", () => {
    Array.from(umLocalInput.files || []).forEach((file) => {
      if (file.type.startsWith("image/")) addPhoto(URL.createObjectURL(file));
    });
    umLocalInput.value = "";
    closeUploadModal();
  });
}

// Modal tabs — switching updates the breadcrumb, folder cards, and grid visibility
const umCrumb = document.getElementById("umCrumb");
const umFolders = document.getElementById("umFolders");
const umScroll = document.getElementById("umScroll");

// Simple folder-cards-at-top view for these tabs (subfolders inside the current folder)
const umTabFolders = {
  "Upload History": ["Images", "Assets"],   // inside Uploaded
  "Your Generations": ["Images", "Assets"], // inside Generated
};

// Build a navigable folder card (file-browser style)
function umNavFolderCard(name, onOpen) {
  const card = document.createElement("div");
  card.className = "um-folder-card nav";
  card.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="um-folder-name">${name}</span>`;
  card.addEventListener("click", () => { if (onOpen) onOpen(name); });
  return card;
}

// Plain (non-navigable) subfolder card for the simple tabs
function umPlainFolderCard(name) {
  const card = document.createElement("div");
  card.className = "um-folder-card";
  card.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="um-folder-name">${name}</span>`;
  return card;
}

// Set the breadcrumb: path is an array of crumb labels after "Folder"
function setUmCrumb(path) {
  const crumbs = document.querySelector(".um-crumbs");
  if (!crumbs) return;
  crumbs.innerHTML = '<a href="#" data-um-root>Folder</a>';
  path.forEach((p) => {
    crumbs.insertAdjacentHTML("beforeend", `<span class="crumb-sep">\u203a</span><span class="crumb-current">${p}</span>`);
  });
}

const umFolderContent = document.getElementById("umFolderContent");
const umContentName = document.getElementById("umContentName");

// ---- Browse Assets: file-browser mode ----
function browseAssetsRoot() {
  setUmCrumb([]);                 // just "Folder"
  umFolders.innerHTML = "";
  umFolders.classList.add("wide");
  [["Generated", browseAssetsFolder], ["Uploaded", browseAssetsFolder]].forEach(([name, open]) => {
    umFolders.appendChild(umNavFolderCard(name, open));
  });
  umFolders.hidden = false;
  if (umScroll) umScroll.hidden = true;        // no content at root
  if (umFolderContent) umFolderContent.hidden = true;
}

function browseAssetsFolder(name) {
  setUmCrumb([name]);             // "Folder › Generated"
  umFolders.innerHTML = "";
  umFolders.classList.add("wide");             // 2-ish wide subfolder cards (Images / Assets)
  ["Images", "Assets"].forEach((n) => umFolders.appendChild(umPlainFolderCard(n)));
  umFolders.hidden = false;
  if (umScroll) umScroll.hidden = false;        // show the folder content + grid
  if (umFolderContent) umFolderContent.hidden = false;
  if (umContentName) umContentName.textContent = name;
}

// Simple tabs: subfolders at top + image grid (no folder-content toolbar)
function renderSimpleTab(tabLabel, crumb) {
  umFolders.classList.remove("wide");
  setUmCrumb([crumb]);
  const folders = umTabFolders[tabLabel] || [];
  umFolders.innerHTML = "";
  folders.forEach((n) => umFolders.appendChild(umPlainFolderCard(n)));
  umFolders.hidden = folders.length === 0;
  if (umScroll) umScroll.hidden = false;
  if (umFolderContent) umFolderContent.hidden = true;
}

function renderUmTab(tab) {
  const label = tab.textContent.trim();
  if (label === "Browse Assets") {
    browseAssetsRoot();
  } else {
    renderSimpleTab(label, tab.dataset.crumb || label);
  }
}

document.querySelectorAll(".um-tabs .um-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".um-tabs .um-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderUmTab(tab);
  });
});

// Breadcrumb "Folder" root link (used by Browse Assets to go back to root)
if (umFolders) {
  document.querySelector(".um-crumbs").addEventListener("click", (e) => {
    const root = e.target.closest("[data-um-root]");
    if (!root) return;
    e.preventDefault();
    const active = document.querySelector(".um-tabs .um-tab.active");
    if (active && active.textContent.trim() === "Browse Assets") browseAssetsRoot();
  });
}

// keep a reference for openUploadModal
function renderUmFolders() {
  const active = document.querySelector(".um-tabs .um-tab.active");
  if (active) renderUmTab(active);
}

// Escape closes the upload modal too
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeUploadModal();
});

// ---- Reset with confirm dialog ----
const resetBtn = document.querySelector(".panel-reset");
const resetModal = document.getElementById("resetModal");
const resetCancel = document.getElementById("resetCancel");
const resetConfirm = document.getElementById("resetConfirm");

function openResetModal() { if (resetModal) resetModal.classList.add("open"); }
function closeResetModal() { if (resetModal) resetModal.classList.remove("open"); }

function performReset() {
  // Prompt text
  const pi = document.querySelector(".prompt-input");
  if (pi) { pi.value = ""; pi.style.height = "auto"; }

  // Uploaded photos
  if (uploadSlots) {
    uploadSlots.querySelectorAll(".photo-card").forEach((c) => c.remove());
    if (typeof refreshEmptyPlaceholder === "function") refreshEmptyPlaceholder();
  }

  // Aspect ratio -> 1:1
  document.querySelectorAll(".ratio-row .ratio").forEach((b, i) => b.classList.toggle("active", i === 0));

  // Number of images -> 1
  const slider = document.getElementById("numSlider");
  if (slider) { slider.value = 1; slider.dispatchEvent(new Event("input")); }

  // Auto-import off
  const auto = document.getElementById("autoImport");
  if (auto) auto.classList.remove("active");

  // Field values back to defaults
  const modelVal = document.querySelector(".field-select .field-value");
  closeResetModal();
}

if (resetBtn) resetBtn.addEventListener("click", openResetModal);
if (resetCancel) resetCancel.addEventListener("click", closeResetModal);
if (resetConfirm) resetConfirm.addEventListener("click", performReset);
if (resetModal) {
  resetModal.addEventListener("click", (e) => { if (e.target === resetModal) closeResetModal(); });
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeResetModal(); });

// ---- Field dropdown option selection (AI Model / Resolution) ----
document.querySelectorAll(".field-dd").forEach((wrap) => {
  const valueEl = wrap.querySelector(".field-value");
  const menu = wrap.querySelector(".field-menu");
  wrap.querySelectorAll(".field-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      wrap.querySelectorAll(".field-option").forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      if (valueEl) valueEl.textContent = opt.textContent.trim();
      if (menu) menu.classList.remove("open");
    });
  });
});

// ---- Prompt Assistant panel ----
const chatModeBtn = document.getElementById("chatModeBtn");
const assistantPanel = document.getElementById("assistantPanel");
const assistantOverlay = document.getElementById("assistantOverlay");
const assistantClose = document.getElementById("assistantClose");

function openAssistant() {
  if (assistantPanel) { assistantPanel.classList.add("open"); assistantPanel.setAttribute("aria-hidden", "false"); }
  if (assistantOverlay) assistantOverlay.classList.add("open");
}
function closeAssistant() {
  if (assistantPanel) { assistantPanel.classList.remove("open"); assistantPanel.setAttribute("aria-hidden", "true"); }
  if (assistantOverlay) assistantOverlay.classList.remove("open");
}
if (chatModeBtn) chatModeBtn.addEventListener("click", openAssistant);
if (assistantClose) assistantClose.addEventListener("click", closeAssistant);
if (assistantOverlay) assistantOverlay.addEventListener("click", closeAssistant);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAssistant(); });

// ---- Enhance Prompt modal ----
const enhanceModal = document.getElementById("enhanceModal");
const enhanceClose = document.getElementById("enhanceClose");
const enhanceDiscard = document.getElementById("enhanceDiscard");
const enhanceAccept = document.getElementById("enhanceAccept");
const enhanceText = document.getElementById("enhanceText");

function openEnhance() { if (enhanceModal) enhanceModal.classList.add("open"); }
function closeEnhance() { if (enhanceModal) enhanceModal.classList.remove("open"); }

if (enhanceBtn) {
  enhanceBtn.addEventListener("click", () => {
    if (enhanceBtn.disabled) return;
    openEnhance();
  });
}
if (enhanceClose) enhanceClose.addEventListener("click", closeEnhance);
if (enhanceDiscard) enhanceDiscard.addEventListener("click", closeEnhance);
if (enhanceModal) enhanceModal.addEventListener("click", (e) => { if (e.target === enhanceModal) closeEnhance(); });
if (enhanceAccept) {
  enhanceAccept.addEventListener("click", () => {
    if (promptInput && enhanceText) {
      promptInput.value = enhanceText.textContent.trim();
      promptInput.dispatchEvent(new Event("input"));
    }
    closeEnhance();
  });
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeEnhance(); });

// ---- Clear (×) button: toggle red active state ----
const filmClear = document.querySelector(".film-clear");
if (filmClear) filmClear.addEventListener("click", () => filmClear.classList.toggle("active"));

// ---- Generation History modal (View all) ----
const viewAllBtn = document.getElementById("viewAllBtn");
const historyModal = document.getElementById("historyModal");
const historyModalClose = document.getElementById("historyModalClose");
const ghGrid = document.getElementById("ghGrid");
const ghToggle = document.getElementById("ghToggle");

if (ghGrid) {
  const palettes = [
    ["#c9a2c6","#8a5e86"], ["#d98a8a","#7a3b3b"], ["#6a7a8a","#2c3744"], ["#9aa6b2","#4a5564"],
    ["#8a7a5a","#3a2f1c"], ["#5a7a6a","#1c2a22"], ["#7a6a9a","#2a1f3a"], ["#9a7a6a","#3a241c"],
  ];
  for (let i = 0; i < 28; i++) {
    const pair = palettes[i % palettes.length];
    const c = document.createElement("canvas");
    c.width = c.height = 220;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 220, 220);
    g.addColorStop(0, pair[0]); g.addColorStop(1, pair[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 220, 220);
    const tile = document.createElement("div");
    tile.className = "gh-tile";
    const img = document.createElement("img");
    img.src = c.toDataURL();
    img.alt = "Generation";
    tile.appendChild(img);
    ghGrid.appendChild(tile);
  }
}

function openHistory() { if (historyModal) { historyModal.classList.add("open"); closeAllMenus(null); } }
function closeHistory() { if (historyModal) historyModal.classList.remove("open"); }

if (viewAllBtn) viewAllBtn.addEventListener("click", openHistory);
if (historyModalClose) historyModalClose.addEventListener("click", closeHistory);
if (historyModal) historyModal.addEventListener("click", (e) => { if (e.target === historyModal) closeHistory(); });
if (ghToggle) ghToggle.addEventListener("click", () => ghToggle.classList.toggle("active"));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeHistory(); });


// ---- Image tools toolbar actions ----
(() => {
  const img = document.getElementById("canvasImage");
  const canvas = document.getElementById("canvas");
  const hasImage = () => img && !img.hidden && img.getAttribute("src");

  const refBtn = document.getElementById("toolRef");
  const fullscreenBtn = document.getElementById("toolFullscreen");
  const cropBtn = document.getElementById("toolCrop");
  const copyBtn = document.getElementById("toolCopy");
  const downloadBtn = document.getElementById("toolDownload");

  // Reference Image: transfer ONLY the currently selected board image into the
  // existing Upload Photo workflow (no file picker). Reuses addPhoto() which is
  // the same ingestion the Upload Media "Local Upload" / tile selection uses.
  if (refBtn) refBtn.addEventListener("click", async () => {
    if (!hasImage() || refBtn.disabled) return;
    if (refBtn.dataset.busy === "1") return;       // prevent duplicate submissions
    refBtn.dataset.busy = "1";
    const original = refBtn.getAttribute("data-tooltip");
    try {
      const src = img.getAttribute("src");
      // Preserve the actual image data: fetch the selected image to a blob URL
      // so the upload panel receives the real image, not a stale reference.
      let useSrc = src;
      try {
        const blob = await (await fetch(src)).blob();
        useSrc = URL.createObjectURL(blob);
      } catch (_) { useSrc = src; }               // fall back to the URL if fetch fails
      if (typeof addPhoto === "function") {
        addPhoto(useSrc);
        refBtn.setAttribute("data-tooltip", "Added as reference");
      }
    } catch (_) {
      refBtn.setAttribute("data-tooltip", "Couldn't add reference");
    } finally {
      setTimeout(() => {
        refBtn.setAttribute("data-tooltip", original);
        refBtn.dataset.busy = "0";
      }, 1500);
    }
  });

  // Fullscreen: expand the preview image
  if (fullscreenBtn) fullscreenBtn.addEventListener("click", () => {
    if (!hasImage()) return;
    const target = canvas || img;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (target.requestFullscreen) target.requestFullscreen();
  });

  // Crop: toggle the crop overlay on the selected image
  if (cropBtn) cropBtn.addEventListener("click", () => {
    if (!hasImage()) return;
    canvas.classList.toggle("cropping");
  });

  // Copy the image to the clipboard, with feedback via the tooltip label
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    if (!hasImage()) return;
    const original = copyBtn.getAttribute("data-tooltip");
    try {
      const blob = await (await fetch(img.src)).blob();
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        copyBtn.setAttribute("data-tooltip", "Copied!");
      } else {
        copyBtn.setAttribute("data-tooltip", "Copy not supported");
      }
    } catch (_) {
      copyBtn.setAttribute("data-tooltip", "Copy failed");
    }
    setTimeout(() => copyBtn.setAttribute("data-tooltip", original), 1500);
  });

  // Download the current image
  if (downloadBtn) downloadBtn.addEventListener("click", () => {
    if (!hasImage()) return;
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "photo81-image.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Reset clears the canvas -> re-disable the image-dependent tools
  const resetConfirmBtn = document.getElementById("resetConfirm");
  if (resetConfirmBtn) {
    resetConfirmBtn.addEventListener("click", () => {
      if (img) { img.hidden = true; img.removeAttribute("src"); }
      const empty = document.getElementById("canvasEmpty");
      if (empty) empty.hidden = false;
      if (canvas) canvas.classList.remove("cropping");
      setCanvasToolsEnabled(false);
    });
  }
})();
