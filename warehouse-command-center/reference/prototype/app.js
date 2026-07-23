/* Warehouse Command Center — no-build browser prototype */

const STORAGE_KEY = "warehouse-command-center-high-end-v2";

const demoState = {
  currentView: "dashboard",
  selectedProjectId: "p1",
  projectTab: "materials",
  modal: null,
  mobileNavOpen: false,
  toast: null,
  photoTarget: null,
  tempPhotos: [],
  currentUser: {
    id: "u1",
    name: "Morgan Lee",
    role: "Warehouse Manager"
  },
  users: [
    { id: "u1", name: "Morgan Lee", role: "Warehouse Manager" },
    { id: "u2", name: "Andre Walker", role: "Project Manager" },
    { id: "u3", name: "Tasha Green", role: "Project Manager" },
    { id: "u4", name: "Chris Miles", role: "Purchasing" },
    { id: "u5", name: "Jordan Price", role: "Executive / Read-only" }
  ],
  projects: [
    {
      id: "p1",
      projectNumber: "RM-26041",
      clientName: "Henderson Residence",
      address: "1840 Willow Creek Dr, Marietta, GA",
      projectManagerId: "u2",
      remodelType: "High-End Kitchen",
      designRevision: "IFC-03",
      areas: ["Kitchen", "Butler Pantry"],
      tradesmen: ["Cabinetry — Artisan Millwork", "Electrical — BrightLine", "Plumbing — Apex Plumbing", "Countertops — StoneWorks"],
      plannedStart: "2026-07-29",
      priority: "High",
      status: "materials-in-progress",
      readyApproved: false,
      readinessChecklist: {
        projectMaterialListApproved: true,
        designSelectionsApproved: true,
        warehouseStagingComplete: false,
        deliveryDocumentsComplete: false,
        finishLotCompatibilityVerified: false,
        specialHandlingStorageVerified: false,
        loadoutPlanComplete: false,
        finalPmReview: false
      },
      notes: "Kitchen and first-floor renovation. Cabinets are the schedule-critical material."
    },
    {
      id: "p2",
      projectNumber: "RM-26042",
      clientName: "Franklin Kitchen & Powder Room",
      address: "925 Old Mill Rd, Smyrna, GA",
      projectManagerId: "u3",
      remodelType: "Kitchen + Powder Room",
      designRevision: "IFC-02",
      areas: ["Kitchen", "Powder Room"],
      tradesmen: ["Cabinetry — NorthStar Millwork", "Electrical — BrightLine", "Plumbing — Apex Plumbing", "Tile — FinishPro"],
      plannedStart: "2026-08-03",
      priority: "Normal",
      status: "delayed",
      readyApproved: false,
      readinessChecklist: {
        projectMaterialListApproved: true,
        designSelectionsApproved: false,
        warehouseStagingComplete: false,
        deliveryDocumentsComplete: false,
        finishLotCompatibilityVerified: false,
        specialHandlingStorageVerified: false,
        loadoutPlanComplete: false,
        finalPmReview: false
      },
      notes: "Custom cabinet finish approval and imported tile delivery are schedule-critical. Verify revised ETA daily."
    },
    {
      id: "p3",
      projectNumber: "RM-26039",
      clientName: "Parker Primary Bath",
      address: "4113 Ashford Ridge, Roswell, GA",
      projectManagerId: "u2",
      remodelType: "Primary Bathroom",
      designRevision: "IFC-04",
      areas: ["Primary Bath", "Water Closet", "Shower"],
      tradesmen: ["Tile — Precision Tile", "Plumbing — Apex Plumbing", "Glass — Atlanta Shower Glass"],
      plannedStart: "2026-07-25",
      priority: "High",
      status: "ready",
      readyApproved: true,
      readinessChecklist: {
        projectMaterialListApproved: true,
        designSelectionsApproved: true,
        warehouseStagingComplete: true,
        deliveryDocumentsComplete: true,
        finishLotCompatibilityVerified: true,
        specialHandlingStorageVerified: true,
        loadoutPlanComplete: true,
        finalPmReview: true
      },
      notes: "All material staged in Zone A."
    }
  ],
  materials: [
    {
      id: "m1", projectId: "p1", name: "Shaker Base Cabinet 36 in", category: "Cabinetry", trade: "Cabinetry",
      sku: "CAB-SBC36-RW", manufacturer: "Artisan Cabinetry", model: "SBC36", finish: "Rift White Oak / Natural Matte", dimensions: "36W x 24D x 34.5H", room: "Kitchen", installationPhase: "Cabinet Installation", selectionRef: "K-21", approvedSelection: true, specVerified: true, handlingClass: "Finished millwork — padded, dry, no stacking", storageCompliant: true, longLead: true, criticalPath: true, highValue: true, vendor: "Artisan Millwork", requiredQty: 3, orderedQty: 3, receivedQty: 3, usableQty: 3,
      damagedQty: 0, shortageQty: 0, unit: "EA", orderStatus: "received", warehouseLocation: "Zone B / Rack 2",
      inspected: true, bolVerified: true, required: true, photos: [placeholder("Cabinet", "#d8c3a5")], notes: ""
    },
    {
      id: "m2", projectId: "p1", name: "Quartz Countertop Slab", category: "Countertops", trade: "Countertops",
      sku: "QZ-CAL-126", manufacturer: "Cambria", model: "Calacatta Signature", finish: "Polished", dimensions: "126 x 63 in slab", room: "Kitchen", installationPhase: "Countertop Fabrication", selectionRef: "K-34", approvedSelection: true, specVerified: true, lotNumber: "BND-4421", slabIds: "S17, S18", handlingClass: "Stone slab — A-frame only", storageCompliant: true, longLead: true, criticalPath: true, highValue: true, vendor: "StoneWorks", requiredQty: 2, orderedQty: 2, receivedQty: 2, usableQty: 1,
      damagedQty: 1, shortageQty: 0, unit: "SLAB", orderStatus: "damaged", warehouseLocation: "Zone C / A-Frame 1",
      inspected: true, bolVerified: true, required: true, photos: [placeholder("Quartz", "#cfd6dc")], notes: "One slab chipped at corner; replacement required."
    },
    {
      id: "m3", projectId: "p1", name: "Recessed LED 6 in", category: "Electrical", trade: "Electrical",
      sku: "LED6-12PK-30K", manufacturer: "Lotus LED", model: "LL6R-30K", finish: "White / 3000K", dimensions: "6 in", room: "Kitchen", installationPhase: "Electrical Trim", selectionRef: "K-E07", approvedSelection: true, specVerified: true, handlingClass: "Boxed electrical trim", storageCompliant: true, longLead: false, criticalPath: false, highValue: false, vendor: "Supply House", requiredQty: 24, orderedQty: 24, receivedQty: 12, usableQty: 12,
      damagedQty: 0, shortageQty: 12, unit: "EA", orderStatus: "partial", warehouseLocation: "Zone B / Shelf 4",
      inspected: true, bolVerified: true, required: true, photos: [placeholder("LED", "#e8e2c2")], notes: "Second carton scheduled tomorrow."
    },
    {
      id: "m4", projectId: "p1", name: "Kitchen Faucet", category: "Plumbing", trade: "Plumbing",
      sku: "ROH-U4719-PN", manufacturer: "Rohl", model: "U.4719", finish: "Polished Nickel", dimensions: "Pull-down kitchen faucet", room: "Kitchen", installationPhase: "Plumbing Trim", selectionRef: "K-P12", approvedSelection: true, specVerified: false, handlingClass: "High-value plumbing trim — secure cage", storageCompliant: false, longLead: true, criticalPath: true, highValue: true, vendor: "Ferguson", requiredQty: 1, orderedQty: 1, receivedQty: 0, usableQty: 0,
      damagedQty: 0, shortageQty: 1, unit: "EA", orderStatus: "in-transit", warehouseLocation: "",
      inspected: false, bolVerified: false, required: true, photos: [], notes: "ETA July 24."
    },
    {
      id: "m5", projectId: "p2", name: "Imported Porcelain Floor Tile", category: "Tile", trade: "Tile",
      sku: "TILE-ITAL-24X48", manufacturer: "Atlas Concorde", model: "Marvel Calacatta Extra", finish: "Matte / Rectified", dimensions: "24 x 48 in", room: "Kitchen", installationPhase: "Tile Installation", selectionRef: "K-41", approvedSelection: true, specVerified: false, dyeLot: "Pending", caliber: "Pending", handlingClass: "Tile pallet — keep dry, no mixed lots", storageCompliant: false, longLead: true, criticalPath: true, highValue: true, vendor: "ProSource", requiredQty: 1450, orderedQty: 1450, receivedQty: 0, usableQty: 0,
      damagedQty: 0, shortageQty: 1450, unit: "SF", orderStatus: "delayed", warehouseLocation: "",
      inspected: false, bolVerified: false, required: true, photos: [], notes: "Vendor production delay."
    },
    {
      id: "m6", projectId: "p2", name: "Custom Walnut Vanity", category: "Cabinetry", trade: "Cabinetry",
      sku: "VAN-WAL-48-FLT", manufacturer: "NorthStar Millwork", model: "48-FLOAT", finish: "Natural Walnut / Satin", dimensions: "48W x 21D x 20H", room: "Powder Room", installationPhase: "Vanity Installation", selectionRef: "PR-08", approvedSelection: true, specVerified: true, cabinetTag: "PR-V01", handlingClass: "Finished millwork — padded, climate controlled", storageCompliant: true, longLead: true, criticalPath: true, highValue: true, vendor: "NorthStar Millwork", requiredQty: 1, orderedQty: 1, receivedQty: 1, usableQty: 1,
      damagedQty: 0, shortageQty: 0, unit: "EA", orderStatus: "received", warehouseLocation: "Climate Zone / Padded Bay 2",
      inspected: true, bolVerified: true, required: true, photos: [placeholder("Lumber", "#c89f70")], notes: ""
    },
    {
      id: "m7", projectId: "p3", name: "Porcelain Wall Tile", category: "Tile", trade: "Tile",
      sku: "TILE-CARR-12X24", manufacturer: "Porcelanosa", model: "Carrara Blanco", finish: "Honed / Rectified", dimensions: "12 x 24 in", room: "Primary Bath / Shower", installationPhase: "Waterproofing & Tile", selectionRef: "PB-31", approvedSelection: true, specVerified: true, dyeLot: "DL-8826", caliber: "C2", handlingClass: "Tile pallet — keep dry, same dye lot", storageCompliant: true, longLead: true, criticalPath: true, highValue: true, vendor: "Floor & Decor", requiredQty: 420, orderedQty: 440, receivedQty: 440, usableQty: 440,
      damagedQty: 0, shortageQty: 0, unit: "SF", orderStatus: "received", warehouseLocation: "Zone A / Pallet 3",
      inspected: true, bolVerified: true, required: true, photos: [placeholder("Tile", "#e1ded6")], notes: "Includes waste factor."
    },
    {
      id: "m8", projectId: "p3", name: "Freestanding Tub", category: "Plumbing", trade: "Plumbing",
      sku: "TUB-FS-67-WH", manufacturer: "Victoria + Albert", model: "Barcelona 67", finish: "Gloss White", dimensions: "67 x 31.5 in", room: "Primary Bath", installationPhase: "Plumbing Fixture Set", selectionRef: "PB-14", approvedSelection: true, specVerified: true, serialNumber: "VA-BAR67-260418", handlingClass: "Oversize fragile fixture — padded floor zone", storageCompliant: true, longLead: true, criticalPath: true, highValue: true, vendor: "Ferguson", requiredQty: 1, orderedQty: 1, receivedQty: 1, usableQty: 1,
      damagedQty: 0, shortageQty: 0, unit: "EA", orderStatus: "received", warehouseLocation: "Zone A / Oversize 1",
      inspected: true, bolVerified: true, required: true, photos: [placeholder("Tub", "#f1f2f4")], notes: ""
    }
  ],
  deliveries: [
    {
      id: "d1", projectId: "p1", vendor: "Supply House", carrier: "R+L Carriers", driverName: "D. Smith",
      bolNumber: "RL-773195", scheduledDate: "2026-07-23", actualDate: "", status: "scheduled", delayReason: "",
      bolVerified: false, receiverId: "", materialIds: ["m3"], photos: [], notes: "Remaining LED carton."
    },
    {
      id: "d2", projectId: "p1", vendor: "StoneWorks", carrier: "StoneWorks Fleet", driverName: "A. Monroe",
      bolNumber: "SW-62018", scheduledDate: "2026-07-21", actualDate: "2026-07-21", status: "received", delayReason: "",
      bolVerified: true, receiverId: "u1", materialIds: ["m2"], photos: [placeholder("BOL", "#e6e6e6")], notes: "Damage noted before driver release."
    },
    {
      id: "d3", projectId: "p2", vendor: "ProSource", carrier: "International Freight / Final Mile", driverName: "",
      bolNumber: "", scheduledDate: "2026-07-24", actualDate: "", status: "delayed", delayReason: "Imported tile delayed — revised ETA and dye-lot confirmation pending",
      bolVerified: false, receiverId: "", materialIds: ["m5"], photos: [], notes: "Escalated to purchasing and PM. Do not accept split dye lots without written approval."
    }
  ],
  requests: [
    {
      id: "r1", projectId: "p1", requestedById: "u2", source: "Home Depot", neededBy: "2026-07-23T14:00",
      priority: "Urgent", status: "approved", items: [{ description: "1-1/2 in PVC trap adapter", sku: "PVC-TA-15", qty: 4, unit: "EA" }],
      reason: "Field condition requires additional adapters", approverId: "u1", receiptPhoto: "", createdAt: "2026-07-22T09:10"
    },
    {
      id: "r2", projectId: "p2", requestedById: "u3", source: "Warehouse", neededBy: "2026-07-24T08:00",
      priority: "Normal", status: "pending", items: [{ description: "Construction adhesive", sku: "ADH-PL375", qty: 12, unit: "TUBE" }],
      reason: "Framing crew startup stock", approverId: "", receiptPhoto: "", createdAt: "2026-07-22T11:30"
    }
  ],
  claims: [
    {
      id: "c1", projectId: "p1", materialId: "m2", deliveryId: "d2", claimNumber: "DMG-26017",
      type: "Damage", blocking: true, status: "open", vendor: "StoneWorks", carrier: "StoneWorks Fleet",
      description: "Corner chip approximately 4 inches on one quartz slab. Damage photographed before unloading was completed and noted on delivery ticket.",
      requestedResolution: "Replacement slab expedited at vendor cost", ownerId: "u4", openedAt: "2026-07-21T10:40",
      dueDate: "2026-07-23", photos: [placeholder("Damage", "#c8c8c8")], notes: "Vendor acknowledged claim; replacement date not confirmed."
    }
  ],
  warehouseStock: [
    { id: "s1", name: "Construction Adhesive", sku: "ADH-PL375", onHand: 36, committed: 12, unit: "TUBE", location: "Consumables / Shelf 2", reorderPoint: 18 },
    { id: "s2", name: "Blue Painter's Tape", sku: "TAPE-BLUE-188", onHand: 24, committed: 8, unit: "ROLL", location: "Consumables / Shelf 1", reorderPoint: 12 },
    { id: "s3", name: "6 mil Poly Sheeting", sku: "POLY-6MIL-20X100", onHand: 3, committed: 2, unit: "ROLL", location: "Protection / Rack 3", reorderPoint: 2 }
  ],
  audit: [
    { id: "a1", at: "2026-07-22T11:30", userId: "u3", action: "Material request submitted", detail: "12 tubes construction adhesive requested for RM-26042", projectId: "p2" },
    { id: "a2", at: "2026-07-22T09:20", userId: "u1", action: "Material request approved", detail: "Home Depot emergency request approved for RM-26041", projectId: "p1" },
    { id: "a3", at: "2026-07-21T10:40", userId: "u1", action: "Damage claim opened", detail: "Quartz slab damage documented before driver release", projectId: "p1" },
    { id: "a4", at: "2026-07-21T10:32", userId: "u1", action: "Delivery received", detail: "StoneWorks delivery checked against BOL SW-62018", projectId: "p1" },
    { id: "a5", at: "2026-07-20T16:05", userId: "u2", action: "Project readiness approved", detail: "RM-26039 cleared for field start", projectId: "p3" }
  ]
};

let state = loadState();

function placeholder(text, color = "#d7dde6") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="44" fill="#334155">${text}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(demoState);
    return { ...structuredClone(demoState), ...JSON.parse(saved), modal: null, toast: null, photoTarget: null, tempPhotos: [] };
  } catch (error) {
    console.warn("Unable to load saved state", error);
    return structuredClone(demoState);
  }
}

function persist() {
  const copy = { ...state, modal: null, toast: null, photoTarget: null, tempPhotos: [], mobileNavOpen: false };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  } catch (error) {
    console.warn("Storage limit reached. Large photos may not persist in this prototype.", error);
    showToast("Photo saved for this session, but browser storage may be full.");
  }
}

function uid(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function userName(id) {
  return state.users.find(u => u.id === id)?.name || "Unassigned";
}

function projectById(id) { return state.projects.find(p => p.id === id); }
function materialById(id) { return state.materials.find(m => m.id === id); }
function deliveryById(id) { return state.deliveries.find(d => d.id === id); }
function projectMaterials(id) { return state.materials.filter(m => m.projectId === id); }
function projectDeliveries(id) { return state.deliveries.filter(d => d.projectId === id); }
function projectClaims(id) { return state.claims.filter(c => c.projectId === id); }
function projectRequests(id) { return state.requests.filter(r => r.projectId === id); }

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function statusLabel(status) {
  const map = {
    "materials-in-progress": "Materials In Progress",
    ready: "Ready to Start",
    delayed: "Delayed",
    received: "Received",
    partial: "Partial",
    damaged: "Damaged",
    ordered: "Ordered",
    "in-transit": "In Transit",
    scheduled: "Scheduled",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    open: "Open",
    closed: "Closed",
    draft: "Draft"
  };
  return map[status] || status.replaceAll("-", " ").replace(/\b\w/g, c => c.toUpperCase());
}

function statusClass(status) {
  if (["ready", "received", "closed", "approved"].includes(status)) return "ready";
  if (["damaged", "delayed", "open", "rejected"].includes(status)) return "danger";
  if (["partial", "pending", "scheduled", "materials-in-progress"].includes(status)) return "warning";
  if (["ordered", "in-transit"].includes(status)) return "info";
  return "neutral";
}

function badge(status, label = statusLabel(status)) {
  return `<span class="badge badge-${statusClass(status)}">${escapeHtml(label)}</span>`;
}

function readiness(projectId) {
  const project = projectById(projectId);
  const mats = projectMaterials(projectId).filter(m => m.required !== false);
  const completedMaterials = mats.filter(m => Number(m.usableQty || 0) >= Number(m.requiredQty || 0));
  const materialComplete = mats.length > 0 && completedMaterials.length === mats.length;
  const blockingClaims = projectClaims(projectId).filter(c => c.blocking && c.status !== "closed");
  const requiredReceipts = mats.filter(m => Number(m.receivedQty || 0) > 0);
  const inspectionsComplete = requiredReceipts.every(m => m.inspected && m.photos?.length > 0);
  const bolComplete = requiredReceipts.every(m => m.bolVerified);
  const selectionsApproved = mats.every(m => m.approvedSelection !== false);
  const specificationsVerified = requiredReceipts.every(m => m.specVerified !== false);
  const storageVerified = requiredReceipts.every(m => m.storageCompliant !== false);
  const checklist = project?.readinessChecklist || {};
  const checklistItems = Object.values(checklist);
  const checklistComplete = checklistItems.length > 0 && checklistItems.every(Boolean);
  const gates = [materialComplete, blockingClaims.length === 0, inspectionsComplete, bolComplete, selectionsApproved, specificationsVerified, storageVerified, checklistComplete];
  const score = Math.round((gates.filter(Boolean).length / gates.length) * 100);
  const preApprovalReady = materialComplete && blockingClaims.length === 0 && inspectionsComplete && bolComplete && selectionsApproved && specificationsVerified && storageVerified && checklistComplete;
  const ready = preApprovalReady && Boolean(project?.readyApproved);
  const issues = [];
  if (!materialComplete) issues.push(`${mats.length - completedMaterials.length} required material line(s) incomplete`);
  if (blockingClaims.length) issues.push(`${blockingClaims.length} blocking claim(s) open`);
  if (!inspectionsComplete) issues.push("Required receiving photos or inspections missing");
  if (!bolComplete) issues.push("BOL verification incomplete");
  if (!selectionsApproved) issues.push("Approved design selection missing");
  if (!specificationsVerified) issues.push("Model, finish, dimensions, lot, or serial verification incomplete");
  if (!storageVerified) issues.push("Special handling or storage verification incomplete");
  if (!checklistComplete) issues.push("Readiness checklist incomplete");
  if (preApprovalReady && !project.readyApproved) issues.push("Final authorized approval required");
  return { score, ready, preApprovalReady, issues, materialComplete, blockingClaims, inspectionsComplete, bolComplete, selectionsApproved, specificationsVerified, storageVerified, checklistComplete };
}

function materialPercent(projectId) {
  const mats = projectMaterials(projectId).filter(m => m.required !== false);
  const required = mats.reduce((sum, m) => sum + Number(m.requiredQty || 0), 0);
  const usable = mats.reduce((sum, m) => sum + Math.min(Number(m.usableQty || 0), Number(m.requiredQty || 0)), 0);
  return required ? Math.round((usable / required) * 100) : 0;
}

function addAudit(action, detail, projectId = "") {
  state.audit.unshift({ id: uid("a"), at: new Date().toISOString(), userId: state.currentUser.id, action, detail, projectId });
}

function showToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(() => { state.toast = null; render(); }, 2600);
}

function setView(view) {
  state.currentView = view;
  state.mobileNavOpen = false;
  render();
}

function openProject(id) {
  state.selectedProjectId = id;
  state.currentView = "project-detail";
  state.projectTab = "materials";
  render();
}

function setProjectTab(tab) { state.projectTab = tab; render(); }
function closeModal() { state.modal = null; state.tempPhotos = []; render(); }
function toggleMobileNav() { state.mobileNavOpen = !state.mobileNavOpen; render(); }

function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <main class="main">
        ${renderTopbar()}
        <div class="content">${renderView()}</div>
      </main>
    </div>
    ${state.modal ? renderModal() : ""}
    ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ""}
  `;
}

function renderSidebar() {
  const items = [
    ["dashboard", "▦", "Dashboard"],
    ["projects", "▣", "Projects"],
    ["receiving", "⇩", "Receive Delivery"],
    ["deliveries", "▤", "Deliveries & Delays"],
    ["requests", "+", "Material Requests"],
    ["claims", "!", "Damage Claims"],
    ["inventory", "⌂", "Warehouse Stock"],
    ["reports", "▥", "Reports"],
    ["audit", "↺", "Audit Log"],
    ["settings", "⚙", "Settings"]
  ];
  return `
    <aside class="sidebar ${state.mobileNavOpen ? "open" : ""}">
      <div class="brand">
        <div class="brand-mark">WC</div>
        <div><h1>Warehouse<br/>Command Center</h1><p>High-End Kitchen & Bath Material Control</p></div>
      </div>
      <nav class="nav-list">
        ${items.map(([view, icon, label]) => `<button class="nav-btn ${state.currentView === view || (view === "projects" && state.currentView === "project-detail") ? "active" : ""}" onclick="setView('${view}')"><span class="nav-icon">${icon}</span>${label}</button>`).join("")}
      </nav>
      <div class="sidebar-footer"><small>Signed in as</small><strong>${escapeHtml(state.currentUser.name)}</strong><small>${escapeHtml(state.currentUser.role)}</small></div>
    </aside>`;
}

function viewMeta() {
  const map = {
    dashboard: ["High-End Remodel Warehouse Dashboard", "Approved-selection readiness, exceptions, storage, and upcoming deliveries"],
    projects: ["Projects", "Control each project from ordering through field release"],
    "project-detail": ["Project Material Control", "Complete project receiving and readiness record"],
    receiving: ["Receive Delivery", "Verify documents, quantities, condition, and photo evidence"],
    deliveries: ["Deliveries & Delays", "Scheduled, in-transit, received, and delayed deliveries"],
    requests: ["Material Requests", "Warehouse pulls and last-minute vendor purchases"],
    claims: ["Damage & Shortage Claims", "Document, assign, escalate, and close material exceptions"],
    inventory: ["Warehouse Stock", "Shared consumables and uncommitted warehouse inventory"],
    reports: ["Reports", "Daily warehouse and weekly project-material reporting"],
    audit: ["Audit Log", "Who did what, when, and for which project"],
    settings: ["System Settings", "Roles, users, readiness controls, and data reset"]
  };
  return map[state.currentView] || map.dashboard;
}

function renderTopbar() {
  const [title, subtitle] = viewMeta();
  return `<header class="topbar">
    <div style="display:flex;align-items:center;gap:10px">
      <button class="btn btn-secondary mobile-menu" onclick="toggleMobileNav()">☰</button>
      <div class="topbar-title"><h2>${title}</h2><p>${subtitle}</p></div>
    </div>
    <div class="top-actions">
      <button class="btn btn-secondary desktop-only" onclick="state.modal='new-request';render()">+ Material Request</button>
      <button class="btn btn-primary" onclick="state.modal='receive';state.tempPhotos=[];render()">📷 Receive</button>
    </div>
  </header>`;
}

function renderView() {
  switch (state.currentView) {
    case "dashboard": return renderDashboard();
    case "projects": return renderProjects();
    case "project-detail": return renderProjectDetail();
    case "receiving": return renderReceivingLanding();
    case "deliveries": return renderDeliveries();
    case "requests": return renderRequests();
    case "claims": return renderClaims();
    case "inventory": return renderInventory();
    case "reports": return renderReports();
    case "audit": return renderAudit();
    case "settings": return renderSettings();
    default: return renderDashboard();
  }
}

function renderDashboard() {
  const readyCount = state.projects.filter(p => readiness(p.id).ready).length;
  const openClaims = state.claims.filter(c => c.status !== "closed").length;
  const delayed = state.deliveries.filter(d => d.status === "delayed").length;
  const pendingRequests = state.requests.filter(r => r.status === "pending").length;
  const projectRows = state.projects.map(p => {
    const r = readiness(p.id);
    return `<tr>
      <td><button class="row-link" onclick="openProject('${p.id}')">${escapeHtml(p.projectNumber)}</button><span class="subtext">${escapeHtml(p.clientName)}</span></td>
      <td>${escapeHtml(userName(p.projectManagerId))}</td>
      <td>${formatDate(p.plannedStart)}</td>
      <td><div class="progress"><span style="width:${materialPercent(p.id)}%"></span></div><div class="progress-label"><span>Usable materials</span><strong>${materialPercent(p.id)}%</strong></div></td>
      <td>${badge(r.ready ? "ready" : p.status, r.ready ? "Ready to Start" : statusLabel(p.status))}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="openProject('${p.id}')">Open</button></td>
    </tr>`;
  }).join("");
  const alerts = buildAlerts();
  return `
    <div class="grid kpi-grid">
      ${kpi("✓", readyCount, "Projects Ready to Start", "Final readiness gate passed")}
      ${kpi("!", openClaims, "Open Claims", "Damage or shortage follow-up")}
      ${kpi("↯", delayed, "Delayed Deliveries", "Schedule-impacting exceptions")}
      ${kpi("+", pendingRequests, "Requests Awaiting Approval", "Warehouse or vendor material needs")}
    </div>
    <div class="grid section-grid">
      <section class="card card-pad">
        <div class="section-title"><div><h3>Project Material Readiness</h3><p>Usable material received versus required project quantities</p></div><button class="btn btn-secondary btn-sm" onclick="setView('projects')">All Projects</button></div>
        <div class="table-wrap"><table><thead><tr><th>Project</th><th>Project Manager</th><th>Planned Start</th><th>Material Completion</th><th>Status</th><th></th></tr></thead><tbody>${projectRows}</tbody></table></div>
      </section>
      <section class="card card-pad">
        <div class="section-title"><div><h3>Exceptions Requiring Action</h3><p>Items most likely to affect project starts</p></div></div>
        <div class="alert-list">${alerts.length ? alerts.join("") : `<div class="success-box">No active exceptions.</div>`}</div>
      </section>
    </div>
    <section class="card card-pad" style="margin-top:18px">
      <div class="section-title"><div><h3>Recent Material Activity</h3><p>Latest receiving, approval, claim, and readiness actions</p></div><button class="btn btn-secondary btn-sm" onclick="setView('audit')">Full Audit Log</button></div>
      ${renderTimeline(state.audit.slice(0, 6))}
    </section>`;
}

function kpi(icon, value, label, sub) {
  return `<div class="card kpi"><div class="kpi-top"><span>${escapeHtml(label)}</span><div class="kpi-icon">${icon}</div></div><h3>${value}</h3><p>${escapeHtml(sub)}</p></div>`;
}

function buildAlerts() {
  const alerts = [];
  state.claims.filter(c => c.status !== "closed" && c.blocking).forEach(c => {
    const p = projectById(c.projectId);
    alerts.push(`<div class="alert danger"><span>!</span><div><strong>${escapeHtml(p.projectNumber)} — blocking ${escapeHtml(c.type.toLowerCase())} claim</strong><p>${escapeHtml(c.description.slice(0, 110))} · Due ${formatDate(c.dueDate)}</p></div></div>`);
  });
  state.deliveries.filter(d => d.status === "delayed").forEach(d => {
    const p = projectById(d.projectId);
    alerts.push(`<div class="alert warning"><span>↯</span><div><strong>${escapeHtml(p.projectNumber)} — ${escapeHtml(d.vendor)} delivery delayed</strong><p>${escapeHtml(d.delayReason || "Revised ETA required")}</p></div></div>`);
  });
  state.projects.forEach(p => {
    const days = Math.ceil((new Date(`${p.plannedStart}T12:00:00`) - new Date()) / 86400000);
    const r = readiness(p.id);
    if (days <= 7 && !r.ready) alerts.push(`<div class="alert info"><span>⏱</span><div><strong>${escapeHtml(p.projectNumber)} starts in ${days} day(s)</strong><p>${escapeHtml(r.issues.slice(0, 2).join("; "))}</p></div></div>`);
  });
  return alerts.slice(0, 7);
}

function renderProjects() {
  const rows = state.projects.map(p => {
    const r = readiness(p.id);
    return `<tr>
      <td><button class="row-link" onclick="openProject('${p.id}')">${escapeHtml(p.projectNumber)}</button><span class="subtext">${escapeHtml(p.clientName)}</span></td>
      <td>${escapeHtml(p.address)}</td><td>${escapeHtml(userName(p.projectManagerId))}</td><td>${formatDate(p.plannedStart)}</td>
      <td>${p.tradesmen.length}<span class="subtext">${escapeHtml(p.tradesmen.slice(0,2).join(", "))}</span></td>
      <td><div class="progress"><span style="width:${r.score}%"></span></div><div class="progress-label"><span>${r.score}% gate score</span><strong>${materialPercent(p.id)}% material</strong></div></td>
      <td>${badge(r.ready ? "ready" : p.status, r.ready ? "Ready to Start" : statusLabel(p.status))}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="openProject('${p.id}')">Manage</button></td>
    </tr>`;
  }).join("");
  return `<div class="toolbar"><div class="search"><span>⌕</span><input id="projectSearch" placeholder="Search project, client, address, or PM" oninput="filterTable('projectSearch','projectsTable')" /></div><button class="btn btn-primary" onclick="state.modal='new-project';render()">+ New Project</button></div>
    <section class="card card-pad"><div class="section-title"><div><h3>Active Remodeling Projects</h3><p>A project remains blocked until its readiness controls pass.</p></div></div>
    <div class="table-wrap"><table id="projectsTable"><thead><tr><th>Project</th><th>Address</th><th>PM</th><th>Planned Start</th><th>Trades</th><th>Readiness</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function renderProjectDetail() {
  const p = projectById(state.selectedProjectId) || state.projects[0];
  if (!p) return `<div class="empty"><strong>No project selected</strong></div>`;
  const r = readiness(p.id);
  const tabs = [["materials","Materials"],["deliveries","Deliveries"],["requests","Requests"],["claims","Claims"],["readiness","Ready Gate"],["history","History"]];
  return `<section class="card card-pad">
    <div class="project-header">
      <div><button class="btn btn-ghost btn-sm" onclick="setView('projects')">← Back to Projects</button><h3>${escapeHtml(p.projectNumber)} · ${escapeHtml(p.clientName)}</h3>
        <div class="project-meta"><span>📍 ${escapeHtml(p.address)}</span><span>👤 PM: ${escapeHtml(userName(p.projectManagerId))}</span><span>🏠 ${escapeHtml(p.remodelType || "Kitchen / Bath Remodel")}</span><span>📐 Design: ${escapeHtml(p.designRevision || "Pending")}</span><span>📅 Start: ${formatDate(p.plannedStart)}</span><span>Priority: ${escapeHtml(p.priority)}</span></div>
        <p style="color:var(--gray-600);max-width:800px">${escapeHtml(p.notes || "")}</p>
      </div>
      <div class="readiness-panel"><div class="readiness-score"><div><span class="subtext">Readiness gate</span><strong>${r.score}%</strong></div>${badge(r.ready ? "ready" : p.status, r.ready ? "Ready" : "Blocked")}</div><div class="progress"><span style="width:${r.score}%"></span></div><div class="progress-label"><span>${r.issues[0] || "All requirements complete"}</span></div></div>
    </div>
    <div class="tabbar">${tabs.map(([id,label]) => `<button class="tab-btn ${state.projectTab===id?"active":""}" onclick="setProjectTab('${id}')">${label}</button>`).join("")}</div>
    <div class="tab-content">${renderProjectTab(p, r)}</div>
  </section>`;
}

function renderProjectTab(p, r) {
  if (state.projectTab === "materials") return renderProjectMaterials(p);
  if (state.projectTab === "deliveries") return renderDeliveryTable(projectDeliveries(p.id));
  if (state.projectTab === "requests") return renderRequestTable(projectRequests(p.id));
  if (state.projectTab === "claims") return renderClaimTable(projectClaims(p.id));
  if (state.projectTab === "readiness") return renderReadinessGate(p, r);
  if (state.projectTab === "history") return renderTimeline(state.audit.filter(a => a.projectId === p.id));
  return "";
}

function renderProjectMaterials(p) {
  const mats = projectMaterials(p.id);
  const rows = mats.map(m => `<tr>
    <td><div class="material-cell"><img class="material-thumb" src="${m.photos?.[0] || placeholder("No Photo")}" /><div><strong>${escapeHtml(m.name)}</strong><span class="subtext">${escapeHtml(m.category)} · ${escapeHtml(m.trade)}</span><span class="subtext">${escapeHtml(m.manufacturer || "")} ${escapeHtml(m.model || "")} · ${escapeHtml(m.finish || "Finish pending")}</span></div></div></td>
    <td>${escapeHtml(m.room || "Unassigned")}<span class="subtext">${escapeHtml(m.installationPhase || "Phase pending")}</span></td>
    <td>${escapeHtml(m.sku || "—")}<span class="subtext">${escapeHtml(m.vendor || "")}</span></td>
    <td>${m.requiredQty} ${escapeHtml(m.unit)}</td><td>${m.receivedQty}</td><td><strong>${m.usableQty}</strong></td><td>${m.damagedQty}</td>
    <td>${m.approvedSelection && m.specVerified ? badge("received","Verified") : badge("pending","Check Spec")}</td><td>${escapeHtml(m.warehouseLocation || "Not staged")}</td><td>${badge(m.orderStatus)}</td>
    <td><button class="btn btn-secondary btn-sm" onclick="editMaterial('${m.id}')">Edit</button></td>
  </tr>`).join("");
  return `<div class="toolbar"><button class="btn btn-primary" onclick="state.modal='new-material';render()">+ Add Material</button><button class="btn btn-secondary" onclick="state.modal='receive';state.tempPhotos=[];render()">📷 Receive Against List</button><button class="btn btn-secondary" onclick="exportProjectCsv('${p.id}')">Export CSV</button></div>
  <div class="table-wrap"><table><thead><tr><th>Material / Approved Finish</th><th>Room / Phase</th><th>SKU / Vendor</th><th>Required</th><th>Received</th><th>Usable</th><th>Damaged</th><th>Selection / Spec</th><th>Location</th><th>Status</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="11" class="empty">No materials added.</td></tr>`}</tbody></table></div>`;
}

function renderReadinessGate(p, r) {
  const checks = [
    ["All required usable quantities received", r.materialComplete],
    ["No open blocking damage or shortage claims", r.blockingClaims.length === 0],
    ["Receiving inspections and required photos complete", r.inspectionsComplete],
    ["BOL / delivery ticket verification complete", r.bolComplete],
    ["Approved client/design selections are complete", r.selectionsApproved],
    ["Manufacturer, model, finish, dimensions, lot, and serial checks pass", r.specificationsVerified],
    ["Special handling and storage requirements are verified", r.storageVerified]
  ];
  const checklistLabels = {
    projectMaterialListApproved: "Project material list approved",
    designSelectionsApproved: "Client/designer selections and current design revision approved",
    warehouseStagingComplete: "All project material grouped and staged by room and trade",
    deliveryDocumentsComplete: "Delivery documentation, packing slips, and BOLs filed",
    finishLotCompatibilityVerified: "Tile dye lots, stone bundles, cabinet finishes, and hardware finishes verified",
    specialHandlingStorageVerified: "Climate, security, padding, upright/no-stack, and fragile storage verified",
    loadoutPlanComplete: "Field loadout plan and installer chain of custody prepared",
    finalPmReview: "Project Manager final material review complete"
  };
  return `<div class="grid section-grid">
    <div>
      <div class="section-title"><div><h3>Automated Gate Checks</h3><p>These controls are calculated from project records.</p></div></div>
      <div class="alert-list">${checks.map(([label, ok]) => `<div class="alert ${ok ? "info" : "danger"}"><span>${ok ? "✓" : "!"}</span><div><strong>${escapeHtml(label)}</strong><p>${ok ? "Passed" : "Required before field release"}</p></div></div>`).join("")}</div>
    </div>
    <div>
      <div class="section-title"><div><h3>Authorized Readiness Checklist</h3><p>Warehouse Manager and PM confirmation items.</p></div></div>
      <div class="card card-pad" style="box-shadow:none">
        ${Object.entries(p.readinessChecklist).map(([key, value]) => `<label class="checkbox-row" style="margin-bottom:12px"><input type="checkbox" ${value ? "checked" : ""} onchange="toggleReadinessCheck('${p.id}','${key}',this.checked)" /> ${escapeHtml(checklistLabels[key] || key)}</label>`).join("")}
        <hr style="border:0;border-top:1px solid var(--gray-200);margin:16px 0" />
        ${r.preApprovalReady ? `<div class="success-box">All pre-approval controls passed. Final release may be completed.</div>` : `<div class="warning-box">Blocked: ${escapeHtml(r.issues.join("; "))}</div>`}
        <button class="btn btn-success" style="width:100%;margin-top:14px" ${r.preApprovalReady && !p.readyApproved ? "" : "disabled"} onclick="approveProjectReady('${p.id}')">✓ Final Approve — Ready to Start</button>
        ${p.readyApproved ? `<button class="btn btn-danger" style="width:100%;margin-top:10px" onclick="revokeProjectReady('${p.id}')">Revoke Ready Status</button>` : ""}
      </div>
    </div>
  </div>`;
}

function toggleReadinessCheck(projectId, key, checked) {
  const p = projectById(projectId);
  p.readinessChecklist[key] = checked;
  if (!checked && p.readyApproved) { p.readyApproved = false; p.status = "materials-in-progress"; }
  addAudit("Readiness checklist updated", `${key} set to ${checked ? "complete" : "incomplete"}`, projectId);
  persist(); render();
}

function approveProjectReady(projectId) {
  const p = projectById(projectId); const r = readiness(projectId);
  if (!r.preApprovalReady) return showToast("Project is still blocked by readiness requirements.");
  p.readyApproved = true; p.status = "ready";
  addAudit("Project readiness approved", `${p.projectNumber} cleared for field start`, projectId);
  persist(); showToast("Project marked Ready to Start.");
}

function revokeProjectReady(projectId) {
  const p = projectById(projectId); p.readyApproved = false; p.status = "materials-in-progress";
  addAudit("Project readiness revoked", `${p.projectNumber} returned to blocked status`, projectId);
  persist(); showToast("Ready status revoked.");
}

function renderReceivingLanding() {
  return `<section class="card card-pad"><div class="notice">Use the receiving workflow to compare the shipment with the BOL, purchase order, approved finish schedule, and current design revision before the driver leaves. Verify model, finish, dimensions, handedness, lot/dye lot, serial or slab identifiers, condition, storage requirements, and photo evidence.</div><button class="btn btn-primary" onclick="state.modal='receive';state.tempPhotos=[];render()">Start Receiving Inspection</button></section>`;
}

function renderDeliveries() {
  return `<div class="toolbar"><button class="btn btn-primary" onclick="state.modal='new-delivery';render()">+ Schedule Delivery</button><button class="btn btn-secondary" onclick="state.modal='receive';state.tempPhotos=[];render()">Receive Delivery</button></div><section class="card card-pad">${renderDeliveryTable(state.deliveries)}</section>`;
}

function renderDeliveryTable(deliveries) {
  const rows = deliveries.map(d => {
    const p = projectById(d.projectId);
    return `<tr><td><strong>${escapeHtml(d.vendor)}</strong><span class="subtext">${escapeHtml(d.carrier || "")}</span></td><td><button class="row-link" onclick="openProject('${p.id}')">${escapeHtml(p.projectNumber)}</button><span class="subtext">${escapeHtml(p.clientName)}</span></td><td>${formatDate(d.scheduledDate)}</td><td>${formatDate(d.actualDate)}</td><td>${escapeHtml(d.bolNumber || "Pending")}</td><td>${d.bolVerified ? badge("received","Verified") : badge("pending","Not Verified")}</td><td>${badge(d.status)}</td><td>${escapeHtml(d.delayReason || d.notes || "—")}</td></tr>`;
  }).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Vendor / Carrier</th><th>Project</th><th>Scheduled</th><th>Actual</th><th>BOL</th><th>Document Check</th><th>Status</th><th>Notes / Delay</th></tr></thead><tbody>${rows || `<tr><td colspan="8" class="empty">No deliveries.</td></tr>`}</tbody></table></div>`;
}

function renderRequests() {
  return `<div class="toolbar"><button class="btn btn-primary" onclick="state.modal='new-request';render()">+ New Material Request</button></div><section class="card card-pad">${renderRequestTable(state.requests)}</section>`;
}

function renderRequestTable(requests) {
  const rows = requests.map(r => {
    const p = projectById(r.projectId); const item = r.items[0];
    return `<tr><td><button class="row-link" onclick="openProject('${p.id}')">${escapeHtml(p.projectNumber)}</button><span class="subtext">${escapeHtml(p.clientName)}</span></td><td>${escapeHtml(userName(r.requestedById))}</td><td><strong>${escapeHtml(item.description)}</strong><span class="subtext">${item.qty} ${escapeHtml(item.unit)} · ${escapeHtml(item.sku || "No SKU")}</span></td><td>${escapeHtml(r.source)}</td><td>${formatDateTime(r.neededBy)}</td><td>${badge(r.priority === "Urgent" ? "danger" : "neutral", r.priority)}</td><td>${badge(r.status)}</td><td>${r.status === "pending" ? `<button class="btn btn-success btn-sm" onclick="approveRequest('${r.id}')">Approve</button> <button class="btn btn-danger btn-sm" onclick="rejectRequest('${r.id}')">Reject</button>` : "—"}</td></tr>`;
  }).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Project</th><th>Requested By</th><th>Item</th><th>Source</th><th>Needed By</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows || `<tr><td colspan="8" class="empty">No requests.</td></tr>`}</tbody></table></div>`;
}

function approveRequest(id) {
  const r = state.requests.find(x => x.id === id); r.status = "approved"; r.approverId = state.currentUser.id;
  addAudit("Material request approved", `${r.items[0].qty} ${r.items[0].unit} ${r.items[0].description} approved`, r.projectId);
  persist(); showToast("Request approved.");
}
function rejectRequest(id) {
  const r = state.requests.find(x => x.id === id); r.status = "rejected"; r.approverId = state.currentUser.id;
  addAudit("Material request rejected", `${r.items[0].description} request rejected`, r.projectId);
  persist(); showToast("Request rejected.");
}

function renderClaims() {
  return `<div class="toolbar"><button class="btn btn-primary" onclick="state.modal='new-claim';state.tempPhotos=[];render()">+ Open Claim</button></div><section class="card card-pad">${renderClaimTable(state.claims)}</section>`;
}

function renderClaimTable(claims) {
  const rows = claims.map(c => {
    const p = projectById(c.projectId); const m = materialById(c.materialId);
    return `<tr><td><strong>${escapeHtml(c.claimNumber)}</strong><span class="subtext">${escapeHtml(c.type)}</span></td><td><button class="row-link" onclick="openProject('${p.id}')">${escapeHtml(p.projectNumber)}</button><span class="subtext">${escapeHtml(p.clientName)}</span></td><td>${escapeHtml(m?.name || "General delivery claim")}</td><td>${escapeHtml(c.vendor)}</td><td>${c.blocking ? badge("danger","Blocks Start") : badge("neutral","Non-blocking")}</td><td>${formatDate(c.dueDate)}</td><td>${escapeHtml(userName(c.ownerId))}</td><td>${badge(c.status)}</td><td>${c.status !== "closed" ? `<button class="btn btn-success btn-sm" onclick="closeClaim('${c.id}')">Close</button>` : "—"}</td></tr>`;
  }).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Claim</th><th>Project</th><th>Material</th><th>Vendor</th><th>Impact</th><th>Due</th><th>Owner</th><th>Status</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="9" class="empty">No claims.</td></tr>`}</tbody></table></div>`;
}

function closeClaim(id) {
  const c = state.claims.find(x => x.id === id); c.status = "closed"; c.closedAt = new Date().toISOString();
  addAudit("Claim closed", `${c.claimNumber} closed`, c.projectId);
  persist(); showToast("Claim closed. Recheck project readiness.");
}

function renderInventory() {
  const rows = state.warehouseStock.map(s => {
    const available = s.onHand - s.committed;
    const low = available <= s.reorderPoint;
    return `<tr><td><strong>${escapeHtml(s.name)}</strong></td><td>${escapeHtml(s.sku)}</td><td>${s.onHand}</td><td>${s.committed}</td><td><strong>${available}</strong></td><td>${escapeHtml(s.unit)}</td><td>${escapeHtml(s.location)}</td><td>${low ? badge("warning","Reorder") : badge("ready","Healthy")}</td></tr>`;
  }).join("");
  return `<div class="notice">Project-specific materials are controlled under each project. This page is for shared stock, consumables, and uncommitted warehouse inventory.</div><section class="card card-pad"><div class="table-wrap"><table><thead><tr><th>Item</th><th>SKU</th><th>On Hand</th><th>Committed</th><th>Available</th><th>Unit</th><th>Location</th><th>Stock Status</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function renderReports() {
  return `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
    ${reportCard("Daily Warehouse Report", "Receiving activity, rejected/damaged material, open requests, today’s deliveries, and staging actions.", "printDailyReport()")}
    ${reportCard("Weekly Project Material Report", "Readiness by project, incomplete material lines, delivery delays, claims, and next-week start risk.", "printWeeklyReport()")}
    ${reportCard("Project Material Status", "Detailed material list, quantities, condition, photos, warehouse location, and readiness gate.", "printSelectedProjectReport()")}
    ${reportCard("Open Claims Report", "Damage and shortage claim aging, owners, due dates, and blocking impact.", "printClaimsReport()")}
  </div>
  <section class="card card-pad" style="margin-top:18px"><div class="section-title"><div><h3>Operational Snapshot</h3><p>Current report data preview</p></div></div>${weeklyReportHtml()}</section>`;
}
function reportCard(title, body, action) { return `<div class="report-card"><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p><div class="report-actions"><button class="btn btn-primary btn-sm" onclick="${action}">Print / Save PDF</button></div></div>`; }

function dailyReportHtml() {
  const today = new Date().toISOString().slice(0,10);
  const todaysAudit = state.audit.filter(a => a.at.slice(0,10) === today);
  const todaysDeliveries = state.deliveries.filter(d => d.scheduledDate === today || d.actualDate === today);
  return `<h2>Daily Warehouse Report — ${formatDate(today)}</h2><p>Prepared by ${escapeHtml(state.currentUser.name)}</p><h3>Scheduled / Received Deliveries</h3>${renderDeliveryTable(todaysDeliveries)}<h3>Material Activity</h3>${renderTimeline(todaysAudit)}<h3>Open Urgent Requests</h3>${renderRequestTable(state.requests.filter(r => r.priority === "Urgent" && !["rejected"].includes(r.status)))}<h3>Open Claims</h3>${renderClaimTable(state.claims.filter(c => c.status !== "closed"))}`;
}

function weeklyReportHtml() {
  const rows = state.projects.map(p => {
    const r = readiness(p.id);
    return `<tr><td>${escapeHtml(p.projectNumber)}<span class="subtext">${escapeHtml(p.clientName)}</span></td><td>${escapeHtml(userName(p.projectManagerId))}</td><td>${formatDate(p.plannedStart)}</td><td>${materialPercent(p.id)}%</td><td>${r.score}%</td><td>${r.ready ? badge("ready","Ready") : badge("warning","Blocked")}</td><td>${escapeHtml(r.issues.join("; ") || "None")}</td></tr>`;
  }).join("");
  return `<h2>Weekly Project Material Report</h2><p>Generated ${formatDateTime(new Date().toISOString())}</p><div class="table-wrap"><table><thead><tr><th>Project</th><th>PM</th><th>Start</th><th>Material</th><th>Gate Score</th><th>Status</th><th>Blocking Items</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function projectReportHtml(projectId) {
  const p = projectById(projectId); const r = readiness(projectId);
  return `<h2>${escapeHtml(p.projectNumber)} — ${escapeHtml(p.clientName)}</h2><p>${escapeHtml(p.address)} · PM ${escapeHtml(userName(p.projectManagerId))} · Planned start ${formatDate(p.plannedStart)}</p><h3>Readiness: ${r.score}% — ${r.ready ? "READY TO START" : "BLOCKED"}</h3><p>${escapeHtml(r.issues.join("; ") || "All readiness controls passed.")}</p>${renderProjectMaterials(p)}<h3>Deliveries</h3>${renderDeliveryTable(projectDeliveries(projectId))}<h3>Claims</h3>${renderClaimTable(projectClaims(projectId))}`;
}

function openPrintWindow(title, html) {
  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>${escapeHtml(title)}</title><link rel="stylesheet" href="styles.css"></head><body><div class="content">${html}</div><script>setTimeout(()=>window.print(),500)<\/script></body></html>`);
  win.document.close();
}
function printDailyReport() { openPrintWindow("Daily Warehouse Report", dailyReportHtml()); }
function printWeeklyReport() { openPrintWindow("Weekly Project Material Report", weeklyReportHtml()); }
function printSelectedProjectReport() { openPrintWindow("Project Material Status", projectReportHtml(state.selectedProjectId || state.projects[0].id)); }
function printClaimsReport() { openPrintWindow("Open Claims Report", `<h2>Open Damage and Shortage Claims</h2>${renderClaimTable(state.claims.filter(c => c.status !== "closed"))}`); }

function renderAudit() {
  return `<section class="card card-pad"><div class="toolbar"><div class="search"><span>⌕</span><input id="auditSearch" placeholder="Search action, user, detail, or project" oninput="filterTimeline()" /></div></div><div id="auditTimeline">${renderTimeline(state.audit)}</div></section>`;
}
function renderTimeline(items) {
  if (!items.length) return `<div class="empty"><strong>No activity found.</strong></div>`;
  return `<div class="timeline">${items.map(a => `<div class="timeline-item"><div class="timeline-dot"></div><div><strong>${escapeHtml(a.action)} — ${escapeHtml(userName(a.userId))}</strong><p>${escapeHtml(a.detail)} · ${formatDateTime(a.at)}${a.projectId ? ` · ${escapeHtml(projectById(a.projectId)?.projectNumber || "")}` : ""}</p></div></div>`).join("")}</div>`;
}
function filterTimeline() {
  const q = document.getElementById("auditSearch").value.toLowerCase();
  const items = state.audit.filter(a => `${a.action} ${a.detail} ${userName(a.userId)} ${projectById(a.projectId)?.projectNumber || ""}`.toLowerCase().includes(q));
  document.getElementById("auditTimeline").innerHTML = renderTimeline(items);
}

function renderSettings() {
  return `<div class="grid section-grid">
    <section class="card card-pad"><div class="section-title"><div><h3>Users and Roles</h3><p>Prototype role list. Production permissions must be enforced in the database.</p></div></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody>${state.users.map(u => `<tr><td>${escapeHtml(u.name)}</td><td>${badge("neutral",u.role)}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="card card-pad"><div class="section-title"><div><h3>Prototype Data</h3><p>Reset the browser demo to the original sample records.</p></div></div><div class="danger-box">Reset permanently removes changes saved in this browser.</div><button class="btn btn-danger" style="margin-top:14px" onclick="resetDemo()">Reset Demo Data</button></section>
  </div>`;
}
function resetDemo() { if (!confirm("Reset all prototype data?")) return; localStorage.removeItem(STORAGE_KEY); state = structuredClone(demoState); render(); }

function renderModal() {
  switch (state.modal) {
    case "new-project": return modalShell("Create Project", newProjectForm(), "saveProject()", "Create Project");
    case "new-material": return modalShell("Add Project Material", materialForm(), "saveMaterial()", "Add Material");
    case "edit-material": return modalShell("Edit Material", materialForm(state.editingMaterialId), "saveMaterial(true)", "Save Changes");
    case "receive": return modalShell("Receive and Inspect Delivery", receiveForm(), "saveReceiving()", "Complete Receiving");
    case "new-delivery": return modalShell("Schedule Delivery", deliveryForm(), "saveDelivery()", "Schedule Delivery");
    case "new-request": return modalShell("Create Material Request", requestForm(), "saveRequest()", "Submit Request");
    case "new-claim": return modalShell("Open Damage / Shortage Claim", claimForm(), "saveClaim()", "Open Claim");
    default: return "";
  }
}
function modalShell(title, body, action, saveLabel) {
  return `<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal"><div class="modal-header"><h3>${escapeHtml(title)}</h3><button class="icon-btn" onclick="closeModal()">✕</button></div><div class="modal-body">${body}</div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="${action}">${escapeHtml(saveLabel)}</button></div></div></div>`;
}

function projectOptions(selected = "") { return state.projects.map(p => `<option value="${p.id}" ${selected===p.id?"selected":""}>${escapeHtml(p.projectNumber)} — ${escapeHtml(p.clientName)}</option>`).join(""); }
function userOptions(selected = "") { return state.users.map(u => `<option value="${u.id}" ${selected===u.id?"selected":""}>${escapeHtml(u.name)} — ${escapeHtml(u.role)}</option>`).join(""); }

function newProjectForm() {
  return `<div class="form-grid">
    ${field("Project Number","projectNumber","text","RM-26043")}${field("Client Name","clientName","text","Client or project name")}
    ${field("Project Address","address","text","Street, city, state","full")}
    <div class="form-group"><label>Project Manager</label><select id="projectManagerId">${userOptions("u2")}</select></div>
    <div class="form-group"><label>Remodel Type</label><select id="remodelType"><option>High-End Kitchen</option><option>Primary Bathroom</option><option>Kitchen + Bathroom</option><option>Multiple Bathrooms</option><option>Other Luxury Interior</option></select></div>
    ${field("Current Design Revision","designRevision","text","IFC-01 or approved selection-set revision")}
    ${field("Rooms / Areas","projectAreas","text","Kitchen, Butler Pantry, Primary Bath...","full")}
    ${field("Planned Start","plannedStart","date","")}
    <div class="form-group"><label>Priority</label><select id="priority"><option>Normal</option><option>High</option><option>Critical</option></select></div>
    ${field("Project Tradesmen / Crews","tradesmen","textarea","One trade or crew per line","full")}
    ${field("Project Notes","projectNotes","textarea","Scope, long-lead materials, special handling, or schedule risks","full")}
  </div>`;
}

function materialForm(editId = "") {
  const m = editId ? materialById(editId) : null;
  return `<div class="form-grid cols-3">
    <div class="form-group"><label>Project</label><select id="materialProjectId">${projectOptions(m?.projectId || state.selectedProjectId)}</select></div>
    ${field("Material Name","materialName","text","Custom cabinet, faucet trim, porcelain tile...","",m?.name)}
    ${field("SKU / Product Number","materialSku","text","Scan or enter SKU","",m?.sku)}
    ${field("Room / Area","materialRoom","text","Kitchen, pantry, primary bath...","",m?.room)}
    ${field("Installation Phase","materialPhase","text","Cabinet install, plumbing trim, tile...","",m?.installationPhase)}
    ${field("Category","materialCategory","text","Cabinetry, countertop, tile, fixture, appliance...","",m?.category)}
    ${field("Trade","materialTrade","text","Responsible installer or trade","",m?.trade)}
    ${field("Manufacturer","materialManufacturer","text","Brand / fabricator","",m?.manufacturer)}
    ${field("Model / Series","materialModel","text","Exact approved model","",m?.model)}
    ${field("Finish / Color","materialFinish","text","Exact finish, color, sheen, temperature...","",m?.finish)}
    ${field("Dimensions / Handing","materialDimensions","text","Size, left/right hand, orientation","",m?.dimensions)}
    ${field("Selection Reference","materialSelectionRef","text","Finish schedule or design selection ID","",m?.selectionRef)}
    ${field("Lot / Dye Lot / Caliber","materialLot","text","Required for tile, stone, flooring","",m?.dyeLot || m?.lotNumber || m?.caliber)}
    ${field("Serial / Slab / Cabinet Tag","materialSerial","text","Serial, slab ID, cabinet tag or carton","",m?.serialNumber || m?.slabIds || m?.cabinetTag)}
    ${field("Vendor","materialVendor","text","Supplier name","",m?.vendor)}
    ${field("Required Quantity","requiredQty","number","0","",m?.requiredQty)}
    ${field("Ordered Quantity","orderedQty","number","0","",m?.orderedQty)}
    ${field("Unit","materialUnit","text","EA, SET, BOX, SF, SLAB...","",m?.unit)}
    ${field("Received Quantity","receivedQty","number","0","",m?.receivedQty || 0)}
    ${field("Usable Quantity","usableQty","number","0","",m?.usableQty || 0)}
    ${field("Damaged Quantity","damagedQty","number","0","",m?.damagedQty || 0)}
    <div class="form-group"><label>Approved Selection?</label><select id="approvedSelection"><option value="yes" ${m?.approvedSelection!==false?"selected":""}>Yes</option><option value="no" ${m?.approvedSelection===false?"selected":""}>No / Pending</option></select></div>
    <div class="form-group"><label>Long-Lead / Critical Path?</label><select id="criticalMaterial"><option value="yes" ${m?.criticalPath?"selected":""}>Yes</option><option value="no" ${!m?.criticalPath?"selected":""}>No</option></select></div>
    <div class="form-group"><label>High-Value / Secure Storage?</label><select id="highValueMaterial"><option value="yes" ${m?.highValue?"selected":""}>Yes</option><option value="no" ${!m?.highValue?"selected":""}>No</option></select></div>
    ${field("Special Handling / Storage","materialHandling","text","Climate controlled, padded, upright, no stack, secure cage...","full",m?.handlingClass)}
    ${field("Warehouse Location","warehouseLocation","text","Climate zone / A-frame / padded bay / rack / bin","full",m?.warehouseLocation)}
    ${field("Notes","materialNotes","textarea","Approved substitution rules, accessories, claim deadlines, or exceptions","full",m?.notes)}
  </div>`;
}

function receiveForm() {
  const selectedProject = state.selectedProjectId || state.projects[0]?.id;
  return `<div class="notice"><strong>High-end driver-release control:</strong> Do not sign a clean BOL or release the driver until the physical item is checked against the PO, approved selection, finish schedule, design revision, label, quantities, and visible condition. Note every exception on the delivery document.</div>
  <div class="form-grid cols-3">
    <div class="form-group"><label>Project</label><select id="receiveProjectId" onchange="refreshReceiveMaterials(this.value)">${projectOptions(selectedProject)}</select></div>
    <div class="form-group"><label>Scheduled Delivery</label><select id="receiveDeliveryId">${deliveryOptions(selectedProject)}</select></div>
    ${field("BOL / Delivery Ticket Number","receiveBol","text","Required")}
    ${field("Driver Name","receiveDriver","text","Driver or carrier contact")}
    ${field("Actual Delivery Date","receiveDate","date","","",new Date().toISOString().slice(0,10))}
    ${field("Warehouse Location","receiveLocation","text","Climate zone / A-frame / padded bay / secure cage")}
    <div class="form-group full"><label>Material Line</label><select id="receiveMaterialId">${materialOptions(selectedProject)}</select></div>
    ${field("Received Quantity","receiveQty","number","0")}${field("Damaged Quantity","receiveDamaged","number","0")}${field("Short Quantity","receiveShort","number","0")}
    <div class="form-group"><label>Visible Condition</label><select id="receiveCondition"><option value="good">Good</option><option value="damaged">Damaged</option><option value="mixed">Mixed</option><option value="rejected">Rejected at delivery</option></select></div>
    <div class="form-group"><label>BOL / PO Matches?</label><select id="receiveBolVerified"><option value="yes">Yes — verified</option><option value="no">No — discrepancy</option></select></div>
    <div class="form-group"><label>Approved Model / Finish / Size Matches?</label><select id="receiveSpecVerified"><option value="yes">Yes — exact match</option><option value="no">No / unable to verify</option></select></div>
    <div class="form-group"><label>Lot / Dye Lot / Slab / Serial Verified?</label><select id="receiveIdentityVerified"><option value="yes">Yes / not applicable</option><option value="no">No — mismatch or missing</option></select></div>
    <div class="form-group"><label>Packaging Intact?</label><select id="receivePackaging"><option value="yes">Yes</option><option value="no">No — damage or tampering</option></select></div>
    <div class="form-group"><label>Inspection Level</label><select id="receiveInspectionLevel"><option>Packaging + label inspection</option><option>Opened carton visual inspection</option><option>Full piece-by-piece inspection</option><option>Concealed inspection deferred per manufacturer</option></select></div>
    <div class="form-group"><label>Special Storage Confirmed?</label><select id="receiveStorageVerified"><option value="yes">Yes</option><option value="no">No — location not compliant</option></select></div>
    <div class="form-group"><label>Driver Acknowledged Exceptions?</label><select id="receiveDriverAck"><option value="na">No exception</option><option value="yes">Yes</option><option value="no">No / refused</option></select></div>
    <div class="form-group"><label>Inspection Completed?</label><select id="receiveInspected"><option value="yes">Yes</option><option value="no">No</option></select></div>
    ${field("Concealed-Damage Claim Deadline","receiveClaimDeadline","date","Vendor notice deadline, when applicable")}
    ${field("Receiving Notes / Exceptions","receiveNotes","textarea","Record finish/model comparison, cabinet tags, tile lot, slab/serial IDs, packaging condition, BOL notation, driver acknowledgment, and next action","full")}
    <div class="form-group full"><label>Photo Evidence</label><div class="photo-placeholder"><div><strong>Capture overall load, every label/SKU, approved finish comparison, BOL, storage location, and each exception.</strong><br/><button class="btn btn-secondary btn-sm" style="margin-top:10px" onclick="openCamera('receive-photo')">📷 Add Photos</button> <button class="btn btn-secondary btn-sm" style="margin-top:10px" onclick="scanSkuFromCamera()">▦ Scan Barcode / SKU</button><div class="help">Automated image or barcode matching may assist the receiver, but final acceptance always requires human confirmation.</div></div></div><div id="tempPhotoGrid">${renderTempPhotos()}</div></div>
    <label class="checkbox-row full"><input id="autoClaim" type="checkbox" checked /> Automatically open a blocking claim for damage, shortage, BOL mismatch, wrong finish/model, lot mismatch, packaging failure, or storage noncompliance.</label>
  </div>`;
}

function deliveryOptions(projectId) { return `<option value="">Create receiving record without scheduled delivery</option>${projectDeliveries(projectId).filter(d => d.status !== "received").map(d => `<option value="${d.id}">${escapeHtml(d.vendor)} · ${formatDate(d.scheduledDate)} · ${escapeHtml(d.bolNumber || "BOL pending")}</option>`).join("")}`; }
function materialOptions(projectId) { return projectMaterials(projectId).map(m => `<option value="${m.id}">${escapeHtml(m.name)} · ${escapeHtml(m.sku)} · Need ${Math.max(0,m.requiredQty-m.usableQty)} ${escapeHtml(m.unit)}</option>`).join(""); }
function refreshReceiveMaterials(projectId) { document.getElementById("receiveMaterialId").innerHTML = materialOptions(projectId); document.getElementById("receiveDeliveryId").innerHTML = deliveryOptions(projectId); }

function deliveryForm() {
  return `<div class="form-grid cols-3"><div class="form-group"><label>Project</label><select id="deliveryProjectId">${projectOptions(state.selectedProjectId)}</select></div>${field("Vendor","deliveryVendor","text","Supplier")}${field("Carrier","deliveryCarrier","text","Carrier or vendor fleet")}${field("Scheduled Date","deliveryDate","date","")}${field("BOL / PO Reference","deliveryBol","text","Optional until provided")}${field("Driver / Contact","deliveryDriver","text","Optional")}${field("Material IDs / SKUs","deliveryMaterialRefs","text","Comma-separated SKU references","full")}${field("Notes","deliveryNotes","textarea","Delivery window, unloading requirements, contact, or special handling","full")}</div>`;
}

function requestForm() {
  return `<div class="form-grid cols-3"><div class="form-group"><label>Project</label><select id="requestProjectId">${projectOptions(state.selectedProjectId)}</select></div><div class="form-group"><label>Requested By</label><select id="requestedById">${userOptions(state.currentUser.id)}</select></div><div class="form-group"><label>Source</label><select id="requestSource"><option>Warehouse</option><option>Home Depot</option><option>Lowe's</option><option>Supply House</option><option>Other Vendor</option></select></div>${field("Item Description","requestItem","text","Material or consumable","full")}${field("SKU","requestSku","text","Optional")}${field("Quantity","requestQty","number","1")}${field("Unit","requestUnit","text","EA, BOX, SF...")}${field("Needed By","requestNeededBy","datetime-local","")}
  <div class="form-group"><label>Priority</label><select id="requestPriority"><option>Normal</option><option>Urgent</option><option>Emergency</option></select></div>${field("Reason / Field Need","requestReason","textarea","Explain why it is needed, schedule impact, and whether work is blocked","full")}</div>`;
}

function claimForm() {
  const pid = state.selectedProjectId || state.projects[0]?.id;
  return `<div class="form-grid cols-3"><div class="form-group"><label>Project</label><select id="claimProjectId" onchange="document.getElementById('claimMaterialId').innerHTML=materialOptions(this.value)">${projectOptions(pid)}</select></div><div class="form-group"><label>Material</label><select id="claimMaterialId">${materialOptions(pid)}</select></div><div class="form-group"><label>Claim Type</label><select id="claimType"><option>Damage</option><option>Shortage</option><option>Wrong Item</option><option>Concealed Damage</option><option>Quality Defect</option></select></div>${field("Vendor","claimVendor","text","Supplier")}${field("Carrier","claimCarrier","text","Carrier")}${field("Response Due Date","claimDueDate","date","")}
  <div class="form-group"><label>Claim Owner</label><select id="claimOwnerId">${userOptions("u4")}</select></div><div class="form-group"><label>Blocks Project Start?</label><select id="claimBlocking"><option value="yes">Yes</option><option value="no">No</option></select></div>${field("Requested Resolution","claimResolution","text","Replacement, credit, expedited shipment...","full")}${field("Description and Evidence","claimDescription","textarea","What was found, when, who witnessed it, document notation, and impact","full")}<div class="form-group full"><label>Evidence Photos</label><button class="btn btn-secondary" onclick="openCamera('claim-photo')">📷 Add Claim Photos</button>${renderTempPhotos()}</div></div>`;
}

function field(labelText, id, type = "text", placeholderText = "", className = "", value = "") {
  const tag = type === "textarea" ? `<textarea id="${id}" placeholder="${escapeHtml(placeholderText)}">${escapeHtml(value ?? "")}</textarea>` : `<input id="${id}" type="${type}" placeholder="${escapeHtml(placeholderText)}" value="${escapeHtml(value ?? "")}" />`;
  return `<div class="form-group ${className}"><label>${escapeHtml(labelText)}</label>${tag}</div>`;
}

function saveProject() {
  const number = val("projectNumber"), client = val("clientName"), address = val("address"), start = val("plannedStart");
  if (!number || !client || !address || !start) return showToast("Project number, client, address, and planned start are required.");
  const p = { id: uid("p"), projectNumber:number, clientName:client, address, projectManagerId:val("projectManagerId"), remodelType:val("remodelType"), designRevision:val("designRevision"), areas:val("projectAreas").split(",").map(s=>s.trim()).filter(Boolean), tradesmen:val("tradesmen").split("\n").map(s=>s.trim()).filter(Boolean), plannedStart:start, priority:val("priority"), status:"materials-in-progress", readyApproved:false, readinessChecklist:{projectMaterialListApproved:false,designSelectionsApproved:false,warehouseStagingComplete:false,deliveryDocumentsComplete:false,finishLotCompatibilityVerified:false,specialHandlingStorageVerified:false,loadoutPlanComplete:false,finalPmReview:false}, notes:val("projectNotes") };
  state.projects.push(p); state.selectedProjectId = p.id; addAudit("Project created", `${number} created for ${client}`, p.id); persist(); closeModal(); openProject(p.id);
}

function editMaterial(id) { state.editingMaterialId = id; state.modal = "edit-material"; render(); }
function saveMaterial(edit = false) {
  const requiredQty = num("requiredQty"), orderedQty = num("orderedQty"), receivedQty = num("receivedQty"), usableQty = num("usableQty"), damagedQty = num("damagedQty");
  const record = {
    projectId: val("materialProjectId"), name: val("materialName"), sku: val("materialSku"), room: val("materialRoom"), installationPhase: val("materialPhase"), category: val("materialCategory"), trade: val("materialTrade"), manufacturer: val("materialManufacturer"), model: val("materialModel"), finish: val("materialFinish"), dimensions: val("materialDimensions"), selectionRef: val("materialSelectionRef"), dyeLot: val("materialLot"), serialNumber: val("materialSerial"), vendor: val("materialVendor"), requiredQty, orderedQty, receivedQty, usableQty, damagedQty,
    shortageQty: Math.max(0, requiredQty - usableQty), unit: val("materialUnit") || "EA", approvedSelection: val("approvedSelection") === "yes", criticalPath: val("criticalMaterial") === "yes", longLead: val("criticalMaterial") === "yes", highValue: val("highValueMaterial") === "yes", handlingClass: val("materialHandling"), warehouseLocation: val("warehouseLocation"), notes: val("materialNotes"),
    orderStatus: usableQty >= requiredQty ? "received" : damagedQty > 0 ? "damaged" : receivedQty > 0 ? "partial" : orderedQty > 0 ? "ordered" : "draft",
    inspected: receivedQty > 0, bolVerified: false, specVerified: false, storageCompliant: false, required: true
  };
  if (!record.name || !record.projectId || !requiredQty) return showToast("Project, material name, and required quantity are required.");
  if (edit) {
    const m = materialById(state.editingMaterialId); Object.assign(m, record); m.photos = m.photos || [];
    addAudit("Material updated", `${m.name} quantities or details updated`, m.projectId);
  } else {
    const m = { id:uid("m"), ...record, photos:[] }; state.materials.push(m); addAudit("Material added", `${m.name} added to project material list`, m.projectId);
  }
  persist(); closeModal(); showToast(edit ? "Material updated." : "Material added.");
}

function saveDelivery() {
  const projectId=val("deliveryProjectId"), vendor=val("deliveryVendor"), date=val("deliveryDate");
  if(!projectId||!vendor||!date) return showToast("Project, vendor, and scheduled date are required.");
  const refs=val("deliveryMaterialRefs").split(",").map(s=>s.trim()).filter(Boolean);
  const materialIds=state.materials.filter(m=>m.projectId===projectId && refs.includes(m.sku)).map(m=>m.id);
  const d={id:uid("d"),projectId,vendor,carrier:val("deliveryCarrier"),driverName:val("deliveryDriver"),bolNumber:val("deliveryBol"),scheduledDate:date,actualDate:"",status:"scheduled",delayReason:"",bolVerified:false,receiverId:"",materialIds,photos:[],notes:val("deliveryNotes")};
  state.deliveries.push(d); addAudit("Delivery scheduled", `${vendor} delivery scheduled for ${formatDate(date)}`, projectId); persist(); closeModal(); showToast("Delivery scheduled.");
}

function saveRequest() {
  const projectId=val("requestProjectId"), item=val("requestItem"), qty=num("requestQty"), neededBy=val("requestNeededBy");
  if(!projectId||!item||!qty||!neededBy) return showToast("Project, item, quantity, and needed-by time are required.");
  const r={id:uid("r"),projectId,requestedById:val("requestedById"),source:val("requestSource"),neededBy,priority:val("requestPriority"),status:"pending",items:[{description:item,sku:val("requestSku"),qty,unit:val("requestUnit")||"EA"}],reason:val("requestReason"),approverId:"",receiptPhoto:"",createdAt:new Date().toISOString()};
  state.requests.unshift(r); addAudit("Material request submitted", `${qty} ${r.items[0].unit} ${item} requested from ${r.source}`, projectId); persist(); closeModal(); showToast("Material request submitted.");
}

function saveClaim() {
  const projectId=val("claimProjectId"), materialId=val("claimMaterialId"), description=val("claimDescription"), dueDate=val("claimDueDate");
  if(!projectId||!description||!dueDate) return showToast("Project, description, and response due date are required.");
  const c={id:uid("c"),projectId,materialId,deliveryId:"",claimNumber:`DMG-${new Date().getFullYear().toString().slice(-2)}${String(state.claims.length+18).padStart(3,"0")}`,type:val("claimType"),blocking:val("claimBlocking")==="yes",status:"open",vendor:val("claimVendor"),carrier:val("claimCarrier"),description,requestedResolution:val("claimResolution"),ownerId:val("claimOwnerId"),openedAt:new Date().toISOString(),dueDate,photos:[...state.tempPhotos],notes:""};
  state.claims.unshift(c); addAudit("Damage/shortage claim opened", `${c.claimNumber} opened for ${materialById(materialId)?.name || "delivery"}`, projectId); persist(); closeModal(); showToast("Claim opened and assigned.");
}

function saveReceiving() {
  const projectId=val("receiveProjectId"), materialId=val("receiveMaterialId"), received=num("receiveQty"), damaged=num("receiveDamaged"), short=num("receiveShort"), bol=val("receiveBol"), verified=val("receiveBolVerified")==="yes", specVerified=val("receiveSpecVerified")==="yes", identityVerified=val("receiveIdentityVerified")==="yes", packagingIntact=val("receivePackaging")==="yes", storageVerified=val("receiveStorageVerified")==="yes", inspected=val("receiveInspected")==="yes";
  if(!projectId||!materialId||!bol||received<0||damaged<0||short<0) return showToast("Project, material, BOL number, and valid quantities are required.");
  if(received > 0 && state.tempPhotos.length===0) return showToast("Photo evidence is required for high-end receiving.");
  if(received > 0 && (!verified || !specVerified || !identityVerified || !storageVerified) && !val("receiveNotes")) return showToast("Document the discrepancy and next action before completing receiving.");
  if(damaged > received) return showToast("Damaged quantity cannot exceed received quantity.");
  const m=materialById(materialId);
  const acceptancePassed = inspected && verified && specVerified && identityVerified;
  const good=acceptancePassed ? Math.max(0,received-damaged) : 0;
  const exceptionExists = damaged>0 || short>0 || !verified || !specVerified || !identityVerified || !packagingIntact || !storageVerified || !inspected;
  m.receivedQty=Number(m.receivedQty||0)+received;
  m.damagedQty=Number(m.damagedQty||0)+damaged;
  m.usableQty=Number(m.usableQty||0)+good;
  m.shortageQty=Math.max(0,Number(m.requiredQty)-Number(m.usableQty));
  m.warehouseLocation=val("receiveLocation")||m.warehouseLocation;
  m.inspected=inspected;
  m.bolVerified=verified;
  m.specVerified=specVerified && identityVerified;
  m.storageCompliant=storageVerified;
  m.packagingIntact=packagingIntact;
  m.inspectionLevel=val("receiveInspectionLevel");
  m.concealedDamageDeadline=val("receiveClaimDeadline");
  m.photos=[...(m.photos||[]),...state.tempPhotos];
  m.notes=[m.notes,val("receiveNotes")].filter(Boolean).join(" | ");
  m.orderStatus=m.usableQty>=m.requiredQty?"received":exceptionExists?"damaged":m.receivedQty>0?"partial":"ordered";
  const deliveryId=val("receiveDeliveryId"); let d=deliveryById(deliveryId);
  if(!d){ d={id:uid("d"),projectId,vendor:m.vendor||"Unscheduled Delivery",carrier:"",driverName:val("receiveDriver"),bolNumber:bol,scheduledDate:val("receiveDate"),actualDate:val("receiveDate"),status:exceptionExists?"partial":"received",delayReason:"",bolVerified:verified,receiverId:state.currentUser.id,materialIds:[materialId],photos:[...state.tempPhotos],notes:val("receiveNotes")}; state.deliveries.push(d); }
  else { d.actualDate=val("receiveDate");d.driverName=val("receiveDriver")||d.driverName;d.bolNumber=bol;d.bolVerified=verified;d.receiverId=state.currentUser.id;d.status=exceptionExists?"partial":"received";d.photos=[...(d.photos||[]),...state.tempPhotos];d.notes=[d.notes,val("receiveNotes")].filter(Boolean).join(" | ");if(!d.materialIds.includes(materialId))d.materialIds.push(materialId); }
  addAudit("Delivery received", `${received} ${m.unit} ${m.name} received; ${good} accepted as usable; ${damaged} damaged; ${short} short; BOL ${verified?"verified":"discrepant"}; approved specification ${specVerified&&identityVerified?"verified":"mismatch/pending"}; storage ${storageVerified?"compliant":"noncompliant"}`,projectId);
  if(exceptionExists&&document.getElementById("autoClaim").checked){
    const claimType=damaged>0?"Damage":short>0?"Shortage":!verified?"BOL Discrepancy":(!specVerified||!identityVerified)?"Wrong Item / Finish / Lot":!packagingIntact?"Packaging Damage":"Storage Noncompliance";
    const c={id:uid("c"),projectId,materialId,deliveryId:d.id,claimNumber:`DMG-${new Date().getFullYear().toString().slice(-2)}${String(state.claims.length+18).padStart(3,"0")}`,type:claimType,blocking:true,status:"open",vendor:m.vendor||d.vendor,carrier:d.carrier,description:val("receiveNotes")||`${damaged} damaged, ${short} short, BOL ${verified?"passed":"failed"}, approved specification ${specVerified&&identityVerified?"passed":"failed"}, packaging ${packagingIntact?"intact":"failed"}, storage ${storageVerified?"passed":"failed"}.`,requestedResolution:"Exact approved replacement, corrected delivery, protected storage, credit, and confirmed schedule-recovery date",ownerId:"u4",openedAt:new Date().toISOString(),dueDate:val("receiveClaimDeadline")||new Date(Date.now()+2*86400000).toISOString().slice(0,10),photos:[...state.tempPhotos],notes:`Auto-created from high-end receiving inspection. Inspection level: ${val("receiveInspectionLevel")}. Driver acknowledgment: ${val("receiveDriverAck")}.`};
    state.claims.unshift(c); addAudit("Claim auto-created", `${c.claimNumber} created from receiving exception`,projectId);
  }
  const p=projectById(projectId); if(p.readyApproved){p.readyApproved=false;p.status="materials-in-progress";}
  persist(); closeModal(); showToast("Receiving inspection saved.");
}

function openCamera(target) {
  state.photoTarget = target;
  const input = document.getElementById("cameraInput");
  input.value = "";
  input.click();
}

async function handleCameraFile(file) {
  if (!file) return;
  if (state.photoTarget === "barcode") {
    await detectBarcode(file);
    return;
  }
  try {
    const dataUrl = await compressImage(file, 1000, 0.72);
    state.tempPhotos.push(dataUrl);
    render();
  } catch (error) { showToast("Unable to process photo."); }
}

function compressImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject; img.src = reader.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}

function renderTempPhotos() {
  if (!state.tempPhotos.length) return "";
  return `<div class="photo-grid">${state.tempPhotos.map((src,i)=>`<div class="photo-card"><img src="${src}"/><button onclick="removeTempPhoto(${i})">×</button></div>`).join("")}</div>`;
}
function removeTempPhoto(index) { state.tempPhotos.splice(index,1); render(); }
function scanSkuFromCamera() { state.photoTarget="barcode"; const input=document.getElementById("cameraInput"); input.value=""; input.click(); }

async function detectBarcode(file) {
  if (!("BarcodeDetector" in window)) { showToast("Barcode scanning is not supported in this browser. Enter the SKU manually."); return; }
  try {
    const detector = new BarcodeDetector({ formats: ["code_128","code_39","ean_13","ean_8","upc_a","upc_e","qr_code"] });
    const bitmap = await createImageBitmap(file); const results = await detector.detect(bitmap);
    if (!results.length) return showToast("No barcode detected. Try again or enter the SKU manually.");
    const code = results[0].rawValue;
    const select = document.getElementById("receiveMaterialId");
    const match = state.materials.find(m => m.sku === code && m.projectId === val("receiveProjectId"));
    if (match && select) select.value = match.id;
    showToast(match ? `Matched SKU ${code}.` : `Scanned ${code}; no project material match found.`);
  } catch (error) { console.warn(error); showToast("Barcode could not be read. Enter the SKU manually."); }
}

function val(id) { return document.getElementById(id)?.value?.trim?.() ?? ""; }
function num(id) { return Number(document.getElementById(id)?.value || 0); }

function filterTable(inputId, tableId) {
  const q=document.getElementById(inputId).value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(row=>{row.style.display=row.innerText.toLowerCase().includes(q)?"":"none";});
}

function exportProjectCsv(projectId) {
  const p=projectById(projectId); const headers=["Project","Client","Remodel Type","Design Revision","Room","Installation Phase","Material","Category","Manufacturer","Model","Finish","Dimensions / Handing","Selection Ref","SKU","Lot / Dye Lot","Serial / Slab / Cabinet Tag","Trade","Vendor","Required","Ordered","Received","Usable","Damaged","Short","Unit","Approved Selection","Spec Verified","Handling / Storage","Storage Compliant","Location","Status"];
  const rows=projectMaterials(projectId).map(m=>[p.projectNumber,p.clientName,p.remodelType,p.designRevision,m.room,m.installationPhase,m.name,m.category,m.manufacturer,m.model,m.finish,m.dimensions,m.selectionRef,m.sku,m.dyeLot||m.lotNumber||"",m.serialNumber||m.slabIds||m.cabinetTag||"",m.trade,m.vendor,m.requiredQty,m.orderedQty,m.receivedQty,m.usableQty,m.damagedQty,m.shortageQty,m.unit,m.approvedSelection?"Yes":"No",m.specVerified?"Yes":"No",m.handlingClass,m.storageCompliant?"Yes":"No",m.warehouseLocation,m.orderStatus]);
  const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${p.projectNumber}-materials.csv`;a.click();URL.revokeObjectURL(url);
}

document.getElementById("cameraInput").addEventListener("change", e => handleCameraFile(e.target.files?.[0]));
render();
