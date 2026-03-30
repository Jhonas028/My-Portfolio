// ─────────────────────────────────────────
// In-memory data store
// ─────────────────────────────────────────
let data = {};

// ─────────────────────────────────────────
// BOOTSTRAP — fetch JSON, render everything
// ─────────────────────────────────────────
fetch("jsonData.json")
  .then(function (res) {
    return res.json();
  })
  .then(function (json) {
    data = json;
    renderAll();
  })
  .catch(function () {
    alert("Could not load portfolio.json. Make sure it is in the same folder.");
  });

// ─────────────────────────────────────────
// renderAll() — builds entire site
// ─────────────────────────────────────────
function renderAll() {
  renderNav();
  renderHomePage();
  renderAboutPage();
  renderProjectPage();
  renderContactPage();
  renderDynamicPage();
  renderFooter();
  showPage("home");
}

// ═══════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════
function renderNav() {
  const navLogo = document.getElementById("navLogo");
  navLogo.innerHTML = `<img src="img/jns-logo.png" alt="${data.meta.logo}" style="width:100%;height:100%;object-fit:contain;border-radius:6px;" />`;
  document.title = data.meta.title;

  const pages = ["home", "about", "project", "contact", "dynamic"];
  const labels = {
    home: "Home",
    about: "About",
    project: "Project",
    contact: "Contact",
    dynamic: "Dynamic",
  };
  const ul = document.getElementById("navLinks");
  ul.innerHTML = "";

  pages.forEach(function (p) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#" class="nav-link" data-page="${p}"
      onclick="showPage('${p}'); return false;">${labels[p]}</a>`;
    ul.appendChild(li);
  });
}

// ═══════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════
function renderHomePage() {
  const h = data.home;
  const el = document.getElementById("page-home");

  // ── Hero
  const heroHTML = `
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">${h.badge}</span>
        <h1 class="hero-title">${heroTitle(h.headline)}</h1>
        <p class="hero-sub">${h.tagline}</p>
        <div class="hero-cta">
          <button class="btn btn-blue" onclick="showPage('project')">${h.cta_primary}</button>
          <button class="btn btn-outline" onclick="showPage('contact')">${h.cta_secondary}</button>
        </div>
      </div>
      <div class="hero-photo">
        <div class="hero-photo-frame"></div>
        <div class="hero-photo-box">
          ${h.photo ? `<img src="${h.photo}" alt="${data.meta.name}" />` : "👤"}
        </div>
      </div>
    </section>

  `;

  // ── Skills cards
  const skillsHTML = `
    <section class="skills-section">
      <div class="wrap">
        <h2 class="section-title">CORE SKILLS</h2>
        <div class="card-grid" id="skillsGrid"></div>
      </div>
    </section>
  `;

  // ── Projects preview list
  const projHTML = `
    <section class="section">
      <div class="wrap">
        <h2 class="section-title dark">Projects</h2>
        <div class="project-list" id="homeProjectList"></div>
      </div>
    </section>
  `;

  // ── CTA Banner
  const ctaHTML = `
    <section class="cta-banner">
      <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;width:100%;">
        <div>
          <h2>${h.cta_banner}</h2>
          <button class="btn btn-blue" onclick="showPage('contact')">Hire Me</button>
        </div>
    
      </div>
    </section>
  `;

  el.innerHTML = heroHTML + skillsHTML + projHTML + ctaHTML;

  renderSkillCards();
  renderHomeProjects();
}

// Bolds the name inside the headline
function heroTitle(headline) {
  const name = data.meta.name;
  return headline.replace(name, `<span class="highlight">${name}</span>`);
}

// ── Skill cards
function renderSkillCards() {
  const grid = document.getElementById("skillsGrid");
  grid.innerHTML = "";
  data.home.skills.forEach(function (s) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    `;
    grid.appendChild(card);
  });
}

// ── Project rows on home page
function renderHomeProjects() {
  const list = document.getElementById("homeProjectList");
  list.innerHTML = "";
  data.projects.forEach(function (p) {
    const row = document.createElement("div");
    row.className = "project-row";
    row.onclick = function () {
      showProjectDetail(p.id);
    };
    row.innerHTML = `
      ${thumbHTML(p)}
      <div class="proj-info">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `;
    list.appendChild(row);
  });
}

// ── Thumbnail builder
function thumbHTML(p, size) {
  const cls = size === "lg" ? "proj-visual" : "proj-thumb";
  if (p.img) {
    return `<div class="${cls}"><img src="${p.img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" /></div>`;
  }
  if (p.thumb_type === "screen") {
    if (size === "lg") {
      return `<div class="${cls} screen-v">
        <div class="detail-screen">
          <div class="ds-bar"></div>
          <div class="ds-line"></div><div class="ds-line s"></div>
          <div class="ds-chart">
            <div class="ds-bar-item" style="height:60%"></div>
            <div class="ds-bar-item" style="height:80%"></div>
            <div class="ds-bar-item" style="height:45%"></div>
            <div class="ds-bar-item" style="height:90%"></div>
          </div>
        </div>
      </div>`;
    }
    return `<div class="proj-thumb screen-thumb">
      <div class="mini-screen">
        <div class="ms-bar"></div>
        <div class="ms-line"></div>
        <div class="ms-line s"></div>
      </div>
    </div>`;
  }
  if (p.thumb_type === "label") {
    return `<div class="${cls} ${size === "lg" ? "label-v" : "label-thumb"}">
      <div class="proj-visual-label">${p.thumb_label}</div>
    </div>`;
  }
  if (p.thumb_type === "emoji") {
    return `<div class="${cls} ${size === "lg" ? "emoji-v" : "emoji-thumb"}">
      <div class="proj-visual-label">${p.thumb_label}</div>
    </div>`;
  }
  return `<div class="${cls}"></div>`;
}

// ═══════════════════════════════════════════
// PAGE: ABOUT
// ═══════════════════════════════════════════
function renderAboutPage() {
  const a = data.about;
  const el = document.getElementById("page-about");

  el.innerHTML = `
    <!-- About Hero -->
    <section class="section">
      <div class="wrap">
        <div class="about-hero">

          <!-- LEFT: photo + social icons -->
          <div class="about-photo-wrap">
            <div class="about-photo-box">
              ${a.photo ? `<img src="${a.photo}" alt="${data.meta.name}" />` : "👨‍💻"}
            </div>
            <div class="socials" id="aboutSocials"></div>
          </div>

          <!-- RIGHT: big title + bio -->
          <div class="about-right">
            <h1 class="about-big-title">ABOUT</h1>
            <div class="about-bio" id="aboutBio"></div>
          </div>

        </div>
      </div>
    </section>

    <div class="scroll-caret">˅</div>

    <!-- What I Do -->
    <section class="section skills-section">
      <div class="wrap">
        <h2 class="section-title">What I do?</h2>
        <p class="section-sub">${a.what_i_do_sub}</p>
        <div class="tech-stack" id="techStack"></div>
      </div>
    </section>

    <!-- Experience -->
    <section class="section">
      <div class="wrap">
        <h2 class="section-title">Experience</h2>
        <div class="exp-grid" id="expGrid"></div>
        <div class="soft-box" id="softBox"></div>
      </div>
    </section>

    <!-- Qualifications -->
    <section class="section qual-section">
      <div class="wrap">
        <h2 class="section-title">Qualifications</h2>
        <div class="card-grid" id="qualGrid"></div>
      </div>
    </section>

    <!-- Certifications -->
    <section class="section">
      <div class="wrap">
        <h2 class="section-title">Certifications &amp; Recognitions</h2>
        <div class="card-grid" id="certGrid"></div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-banner">
      <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;width:100%;">
        <div>
          <h2>${data.home.cta_banner}</h2>
          <button class="btn btn-blue" onclick="showPage('contact')">Hire Me</button>
        </div>
    
      </div>
    </section>
  `;

  // socials — image icons
  const socDiv = document.getElementById("aboutSocials");
  data.meta.socials.forEach(function (s) {
    const a2 = document.createElement("a");
    a2.href = s.url;
    a2.className = "social-icon-link";
    a2.target = "_blank";
    a2.innerHTML = `<img src="img/ic-${s.icon}.png" alt="${s.label}" />`;
    socDiv.appendChild(a2);
  });

  // bio paragraphs — innerHTML so highlight spans render
  const bioDiv = document.getElementById("aboutBio");
  a.bio.forEach(function (para) {
    const p = document.createElement("p");
    p.innerHTML = para;
    bioDiv.appendChild(p);
  });

  // tech stack — icon cards
  const ts = document.getElementById("techStack");
  a.tech_stack.forEach(function (t) {
    const div = document.createElement("div");
    div.className = "tech-card";
    div.innerHTML = `
    <img src="${t.img}" alt="${t.label}" />
    <span>${t.label}</span>
  `;
    ts.appendChild(div);
  });

  // experience cards
  const eg = document.getElementById("expGrid");
  a.experience.forEach(function (e) {
    const div = document.createElement("div");
    div.className = "exp-card";
    div.innerHTML = `
    <div class="exp-logo ${e.logo_class}">
      ${
        e.img
          ? `<img src="${e.img}" alt="${e.company}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />`
          : e.logo
      }
    </div>
    <div>
      <h4>${e.company}</h4>
      <p class="exp-role">${e.role}</p>
      <p class="exp-date">${e.date}</p>
    </div>
  `;
    eg.appendChild(div);
  });

  // soft skills
  const sb = document.getElementById("softBox");
  sb.innerHTML = `<h4>SOFT SKILLS</h4><div class="soft-grid" id="softGrid"></div>`;
  const sg = document.getElementById("softGrid");
  a.soft_skills.forEach(function (sk) {
    const div = document.createElement("div");
    div.className = "soft-item";
    div.textContent = sk;
    sg.appendChild(div);
  });

  // qualifications
  const qg = document.getElementById("qualGrid");
  a.qualifications.forEach(function (q) {
    const card = document.createElement("div");
    card.className = "qual-card";
    card.innerHTML = `
    <div class="qual-logo ${q.logo_class}" style="background:transparent;">
      ${
        q.img
          ? `<img src="${q.img}" alt="${q.school}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" />`
          : q.logo
      }
    </div>
    <div>
      <h4>${q.school}</h4>
      <p>${q.degree}</p>
      <p class="exp-date">${q.date}</p>
    </div>
  `;
    qg.appendChild(card);
  });

  // certifications
  const cg = document.getElementById("certGrid");
  a.certifications.forEach(function (c) {
    const card = document.createElement("div");
    card.className = "cert-card";
    if (c.type === "text") {
      card.innerHTML = `<div class="cert-text-logo">${c.logo_text}</div><p>${c.desc}</p>`;
    } else {
      card.innerHTML = `<div class="cert-icon">${c.icon}</div><p>${c.desc}</p>`;
    }
    cg.appendChild(card);
  });
}

// ═══════════════════════════════════════════
// PAGE: PROJECT
// ═══════════════════════════════════════════
function renderProjectPage() {
  const el = document.getElementById("page-project");

  const tabsHTML = data.projects
    .map(function (p, i) {
      return `<button class="proj-tab${i === 0 ? " active" : ""}"
      data-id="${p.id}" onclick="switchProject('${p.id}')">${p.title}</button>`;
    })
    .join("");

  const detailsHTML = data.projects
    .map(function (p, i) {
      return `
      <div class="proj-detail${i === 0 ? " active" : ""}" id="detail-${p.id}">
        <div class="proj-detail-top">
          <div class="proj-detail-info">
            <h1 class="proj-detail-title">${p.title.toUpperCase()}</h1>
            <span class="proj-type-tag">${p.type}</span>
            <p>${p.desc}</p>
            <p>${p.detail}</p>
            <p style="margin-top:.5rem;color:var(--blue);font-size:.85rem;">✉ ${data.meta.email}</p>
            <div style="display:flex;gap:0.5rem;margin-top:1rem;">
              <button class="modal-btn-save" onclick="editProject(${i})" style="font-size:0.78rem;padding:0.45rem 1rem;">✏️ Edit</button>
              <button class="modal-btn-cancel" onclick="deleteProject(${i})" style="font-size:0.78rem;padding:0.45rem 1rem;color:#dc2626;border-color:#fecaca;">🗑️ Delete</button>
            </div>
          </div>
          ${thumbHTML(p, "lg")}
        </div>
      </div>
    `;
    })
    .join("");

  el.innerHTML = `
    <div class="proj-detail-wrap">
      <div class="proj-tabs">
        ${tabsHTML}
        <button class="proj-tab-add" onclick="openProjectModal()" title="Add Project">＋</button>
      </div>
      ${detailsHTML}
    </div>
    <section class="cta-banner">
      <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;width:100%;">
        <div>
          <h2>${data.home.cta_banner}</h2>
          <button class="btn btn-blue" onclick="showPage('contact')">Hire Me</button>
        </div>
  
      </div>
    </section>
  `;
}

function deleteProject(index) {
  if (!confirm("Delete this project?")) return;
  data.projects.splice(index, 1);
  renderProjectPage();
  renderHomeProjects(); // also update home preview list
  if (data.projects.length > 0) {
    switchProject(data.projects[0].id);
  }
}

function editProject(index) {
  openProjectModal(index, data.projects[index]);
}

function openProjectModal(index, project) {
  const existing = document.getElementById("projectModal");
  if (existing) existing.remove();

  const isEdit = index !== undefined;
  const p = project || {};

  const modal = document.createElement("div");
  modal.id = "projectModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box" style="max-width:520px;">
      <div class="modal-header">
        <h3>${isEdit ? "Edit Project" : "Add New Project"}</h3>
        <button class="modal-close" onclick="closeProjectModal()">✕</button>
      </div>
      <div class="modal-body">
        <label class="modal-label">Project Title</label>
        <input class="modal-input" id="pTitle" type="text"
          value="${isEdit ? p.title : ""}" placeholder="e.g. My App" />

        <label class="modal-label">Type / Category</label>
        <input class="modal-input" id="pType" type="text"
          value="${isEdit ? p.type : ""}" placeholder="e.g. Mobile / Web" />

        <label class="modal-label">Short Description</label>
        <textarea class="modal-input modal-textarea" id="pDesc"
          placeholder="Brief project description...">${isEdit ? p.desc : ""}</textarea>

        <label class="modal-label">Full Detail</label>
        <textarea class="modal-input modal-textarea" id="pDetail"
          placeholder="More detailed explanation...">${isEdit ? p.detail : ""}</textarea>

        <label class="modal-label">Thumbnail Style</label>
        <select class="modal-input" id="pThumbType">
          <option value="screen" ${!isEdit || p.thumb_type === "screen" ? "selected" : ""}>Screen / Chart</option>
          <option value="label" ${isEdit && p.thumb_type === "label" ? "selected" : ""}>Text Label</option>
          <option value="emoji" ${isEdit && p.thumb_type === "emoji" ? "selected" : ""}>Emoji</option>
        </select>

        <label class="modal-label">Thumbnail Label (for Text/Emoji type)</label>
        <input class="modal-input" id="pThumbLabel" type="text"
          value="${isEdit && p.thumb_label ? p.thumb_label : ""}" placeholder="e.g. MY APP or 🚀" />
      </div>
      <div class="modal-footer">
        <button class="modal-btn-cancel" onclick="closeProjectModal()">Cancel</button>
        <button class="modal-btn-save" onclick="saveProject(${isEdit ? index : "null"})">
          ${isEdit ? "Save Changes" : "Add Project"}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeProjectModal();
  });
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (modal) modal.remove();
}

function saveProject(index) {
  const title = document.getElementById("pTitle").value.trim();
  const type = document.getElementById("pType").value.trim();
  const desc = document.getElementById("pDesc").value.trim();
  const detail = document.getElementById("pDetail").value.trim();
  const thumb_type = document.getElementById("pThumbType").value;
  const thumb_label = document.getElementById("pThumbLabel").value.trim();

  if (!title || !type || !desc || !detail) {
    alert("Please fill in all required fields.");
    return;
  }

  // generate a simple id from title
  const id = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const project = {
    id,
    title,
    type,
    desc,
    detail,
    img: "",
    thumb_type,
    thumb_label,
    color: "#1e56e8",
  };

  if (index === null || index === undefined) {
    data.projects.push(project);
  } else {
    data.projects[index] = project;
  }

  closeProjectModal();
  renderProjectPage();
  renderHomeProjects();

  // switch to the saved project
  setTimeout(function () {
    switchProject(id);
  }, 60);
}

function switchProject(id) {
  document.querySelectorAll(".proj-detail").forEach(function (d) {
    d.classList.remove("active");
  });
  document.querySelectorAll(".proj-tab").forEach(function (t) {
    t.classList.remove("active");
    if (t.dataset.id === id) t.classList.add("active");
  });
  const panel = document.getElementById("detail-" + id);
  if (panel) panel.classList.add("active");
}

function showProjectDetail(id) {
  showPage("project");
  setTimeout(function () {
    switchProject(id);
  }, 60);
}

// ═══════════════════════════════════════════
// PAGE: CONTACT
// ═══════════════════════════════════════════
function renderContactPage() {
  const c = data.contact;
  const el = document.getElementById("page-contact");

  const words = c.heading.split(" ");
  const headHTML = words
    .map(function (w) {
      return w === "WORK" ? `<span class="highlight">${w}</span>` : w;
    })
    .join(" ");

  el.innerHTML = `
    <div class="contact-wrap">
      <div class="contact-top">
        <h1 class="contact-title">${headHTML}</h1>
        <p class="contact-sub">${c.sub}</p>
      </div>
      <div class="contact-right">
        <h3 class="form-heading">Let's make it happen</h3>
        <div class="form-group">
          <input  type="text"  class="form-input" id="cName"  placeholder="Name"    />
          <input  type="email" class="form-input" id="cEmail" placeholder="Email"   />
          <textarea            class="form-input" id="cMsg"   placeholder="Message" rows="4"></textarea>
          <button class="btn-send" onclick="submitContact()">Send Message</button>
        </div>
      </div>
    </div>
  `;
}

function submitContact() {
  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const msg = document.getElementById("cMsg").value.trim();
  if (!name || !email || !msg) {
    alert("Please fill in all fields.");
    return;
  }
  alert(
    `Thanks ${name}! Your message has been received. I'll get back to you soon.`,
  );
  ["cName", "cEmail", "cMsg"].forEach(function (id) {
    document.getElementById(id).value = "";
  });
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════
function renderFooter() {
  const m = data.meta;
  const socLinks = m.socials
    .map(function (s) {
      return `<a href="${s.url}" class="foot-social" target="_blank">${s.label}</a>`;
    })
    .join("");

  document.getElementById("siteFooter").innerHTML = `
    <div class="foot-socials">${socLinks}</div>
    <div class="foot-info">
      <div>${m.email}</div>
      <div>${m.phone}</div>
    </div>
  `;
}

// ═══════════════════════════════════════════
// PAGE NAVIGATION
// ═══════════════════════════════════════════
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(function (p) {
    p.classList.remove("active");
  });

  const target = document.getElementById("page-" + pageId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.classList.remove("active");
    if (link.dataset.page === pageId) link.classList.add("active");
  });

  const nl = document.getElementById("navLinks");
  if (nl) nl.classList.remove("open");
}

// ═══════════════════════════════════════════
// PAGE: DYNAMIC
// ═══════════════════════════════════════════
function renderDynamicPage() {
  const el = document.getElementById("page-dynamic");

  el.innerHTML = `
    <div class="dynamic-wrap">
      <div class="dynamic-header">
        <h1 class="dynamic-title">Dynamic Theme</h1>
        <p class="dynamic-sub">Customize the look and feel of your portfolio in real time.</p>
      </div>

      <div class="dynamic-grid">

        <!-- Primary Color -->
        <div class="dyn-card">
          <div class="dyn-card-label">
            <span class="dyn-icon">🎨</span>
            <div>
              <h3>Primary Color</h3>
              <p>Changes buttons, links, and accents</p>
            </div>
          </div>
          <div class="dyn-presets" id="colorPresets">
            <button class="preset-dot active" data-color="#1e56e8" style="background:#1e56e8;" title="Blue"></button>
            <button class="preset-dot" data-color="#7c3aed" style="background:#7c3aed;" title="Purple"></button>
            <button class="preset-dot" data-color="#059669" style="background:#059669;" title="Green"></button>
            <button class="preset-dot" data-color="#dc2626" style="background:#dc2626;" title="Red"></button>
            <button class="preset-dot" data-color="#d97706" style="background:#d97706;" title="Amber"></button>
            <button class="preset-dot" data-color="#0891b2" style="background:#0891b2;" title="Cyan"></button>
            <button class="preset-dot" data-color="#db2777" style="background:#db2777;" title="Pink"></button>
          </div>
          <div class="dyn-custom-row">
            <label>Custom</label>
            <input type="color" id="customColor" value="#1e56e8" class="dyn-color-input" />
          </div>
        </div>

        <!-- Card Background -->
        <div class="dyn-card">
          <div class="dyn-card-label">
            <span class="dyn-icon">🃏</span>
            <div>
              <h3>Card Background</h3>
              <p>Changes all card backgrounds</p>
            </div>
          </div>
          <div class="dyn-presets" id="cardPresets">
            <button class="preset-dot active" data-card="#ffffff" style="background:#ffffff;border:2px solid #e5e7eb;" title="White"></button>
            <button class="preset-dot" data-card="#f0f5ff" style="background:#f0f5ff;" title="Light Blue"></button>
            <button class="preset-dot" data-card="#f0fdf4" style="background:#f0fdf4;" title="Light Green"></button>
            <button class="preset-dot" data-card="#fef9c3" style="background:#fef9c3;" title="Yellow"></button>
            <button class="preset-dot" data-card="#fdf2f8" style="background:#fdf2f8;" title="Pink"></button>
            <button class="preset-dot" data-card="#1e293b" style="background:#1e293b;" title="Dark"></button>
          </div>
          <div class="dyn-custom-row">
            <label>Custom</label>
            <input type="color" id="customCard" value="#ffffff" class="dyn-color-input" />
          </div>
        </div>

        <!-- Text Color -->
        <div class="dyn-card">
          <div class="dyn-card-label">
            <span class="dyn-icon">✏️</span>
            <div>
              <h3>Text Color</h3>
              <p>Changes headings and body text</p>
            </div>
          </div>
          <div class="dyn-presets" id="textPresets">
            <button class="preset-dot active" data-text="#111827" style="background:#111827;" title="Dark"></button>
            <button class="preset-dot" data-text="#1e3a5f" style="background:#1e3a5f;" title="Navy"></button>
            <button class="preset-dot" data-text="#3d2b1f" style="background:#3d2b1f;" title="Brown"></button>
            <button class="preset-dot" data-text="#134e4a" style="background:#134e4a;" title="Teal"></button>
            <button class="preset-dot" data-text="#ffffff" style="background:#ffffff;border:2px solid #e5e7eb;" title="White"></button>
          </div>
          <div class="dyn-custom-row">
            <label>Custom</label>
            <input type="color" id="customText" value="#111827" class="dyn-color-input" />
          </div>
        </div>

        <!-- Background Color -->
        <div class="dyn-card">
          <div class="dyn-card-label">
            <span class="dyn-icon">🖼️</span>
            <div>
              <h3>Page Background</h3>
              <p>Changes the overall page background</p>
            </div>
          </div>
          <div class="dyn-presets" id="bgPresets">
            <button class="preset-dot active" data-bg="#ffffff" style="background:#ffffff;border:2px solid #e5e7eb;" title="White"></button>
            <button class="preset-dot" data-bg="#f9fafb" style="background:#f9fafb;" title="Light Gray"></button>
            <button class="preset-dot" data-bg="#eef2ff" style="background:#eef2ff;" title="Light Blue"></button>
            <button class="preset-dot" data-bg="#0f172a" style="background:#0f172a;" title="Dark Navy"></button>
            <button class="preset-dot" data-bg="#1a1a2e" style="background:#1a1a2e;" title="Dark Purple"></button>
          </div>
          <div class="dyn-custom-row">
            <label>Custom</label>
            <input type="color" id="customBg" value="#ffffff" class="dyn-color-input" />
          </div>
        </div>

        <!-- Font Size -->
        <div class="dyn-card">
          <div class="dyn-card-label">
            <span class="dyn-icon">🔤</span>
            <div>
              <h3>Font Size</h3>
              <p>Scale up or down the text size</p>
            </div>
          </div>
          <div class="dyn-slider-row">
            <span class="slider-label-sm">A</span>
            <input type="range" id="fontScale" min="80" max="120" value="100" step="5" class="dyn-slider" />
            <span class="slider-label-lg">A</span>
          </div>
          <div class="dyn-slider-value"><span id="fontScaleVal">100</span>%</div>
        </div>

        <!-- Border Radius -->
        <div class="dyn-card">
          <div class="dyn-card-label">
            <span class="dyn-icon">⬜</span>
            <div>
              <h3>Border Radius</h3>
              <p>Sharp corners or rounded cards</p>
            </div>
          </div>
          <div class="dyn-slider-row">
            <span class="slider-label-sm">▪</span>
            <input type="range" id="radiusScale" min="0" max="24" value="10" step="2" class="dyn-slider" />
            <span class="slider-label-lg">●</span>
          </div>
          <div class="dyn-slider-value"><span id="radiusVal">10</span>px</div>
        </div>

      </div>

      <!-- Preview -->
      <div class="dyn-preview-section">
        <h2 class="dyn-preview-title">Live Preview</h2>
        <div class="dyn-preview-cards">
          <div class="card dyn-preview-card">
            <div class="card-icon">🖥️</div>
            <h3>Software Development</h3>
            <p>This is a preview card showing how your theme changes affect the portfolio cards.</p>
          </div>
          <div class="card dyn-preview-card">
            <div class="card-icon">📱</div>
            <h3>Mobile Development</h3>
            <p>Adjust the controls above to see your changes reflected here in real time.</p>
          </div>
          <div class="card dyn-preview-card">
            <div class="card-icon">🗄️</div>
            <h3>Database & Systems</h3>
            <p>Your theme is saved automatically and applied across all pages instantly.</p>
          </div>
        </div>
      </div>

      <!-- Reset -->
      <div class="dyn-reset-row">
        <button class="dyn-reset-btn" onclick="resetTheme()">↺ Reset to Default</button>
      </div>

    </div>
  `;

  // Wire up color presets
  document.querySelectorAll("[data-color]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll("[data-color]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyColor(btn.dataset.color);
      document.getElementById("customColor").value = btn.dataset.color;
    });
  });

  document.querySelectorAll("[data-card]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll("[data-card]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyCardBg(btn.dataset.card);
      document.getElementById("customCard").value = btn.dataset.card;
    });
  });

  document.querySelectorAll("[data-text]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll("[data-text]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyTextColor(btn.dataset.text);
      document.getElementById("customText").value = btn.dataset.text;
    });
  });

  document.querySelectorAll("[data-bg]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll("[data-bg]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyBgColor(btn.dataset.bg);
      document.getElementById("customBg").value = btn.dataset.bg;
    });
  });

  // Custom color inputs
  document.getElementById("customColor").addEventListener("input", function () {
    applyColor(this.value);
  });
  document.getElementById("customCard").addEventListener("input", function () {
    applyCardBg(this.value);
  });
  document.getElementById("customText").addEventListener("input", function () {
    applyTextColor(this.value);
  });
  document.getElementById("customBg").addEventListener("input", function () {
    applyBgColor(this.value);
  });

  // Font size slider
  const fontSlider = document.getElementById("fontScale");
  fontSlider.addEventListener("input", function () {
    document.getElementById("fontScaleVal").textContent = this.value;
    document.documentElement.style.fontSize = (this.value / 100) * 16 + "px";
  });

  // Border radius slider
  const radiusSlider = document.getElementById("radiusScale");
  radiusSlider.addEventListener("input", function () {
    document.getElementById("radiusVal").textContent = this.value;
    document.documentElement.style.setProperty("--radius", this.value + "px");
  });
}

function applyColor(hex) {
  // darken by ~15%
  const dark = shadeColor(hex, -15);
  const light = hexToRgba(hex, 0.1);
  const mid = hexToRgba(hex, 0.3);
  document.documentElement.style.setProperty("--blue", hex);
  document.documentElement.style.setProperty("--blue-dark", dark);
  document.documentElement.style.setProperty("--blue-light", light);
  document.documentElement.style.setProperty("--blue-mid", mid);
}

function applyCardBg(hex) {
  document.documentElement.style.setProperty("--white", hex);
}

function applyTextColor(hex) {
  document.documentElement.style.setProperty("--dark", hex);
  document.documentElement.style.setProperty("--text", hex);
}

function applyBgColor(hex) {
  document.body.style.background = hex;
}

function resetTheme() {
  document.documentElement.style.setProperty("--blue", "#1e56e8");
  document.documentElement.style.setProperty("--blue-dark", "#1240c0");
  document.documentElement.style.setProperty("--blue-light", "#eef2ff");
  document.documentElement.style.setProperty("--blue-mid", "#c7d7fd");
  document.documentElement.style.setProperty("--white", "#ffffff");
  document.documentElement.style.setProperty("--dark", "#111827");
  document.documentElement.style.setProperty("--text", "#1f2937");
  document.documentElement.style.setProperty("--radius", "10px");
  document.documentElement.style.fontSize = "16px";
  document.body.style.background = "#ffffff";

  // reset sliders
  document.getElementById("fontScale").value = 100;
  document.getElementById("fontScaleVal").textContent = 100;
  document.getElementById("radiusScale").value = 10;
  document.getElementById("radiusVal").textContent = 10;

  // reset active dots
  document
    .querySelectorAll(".preset-dot")
    .forEach((b) => b.classList.remove("active"));
  const firstColor = document.querySelector("[data-color='#1e56e8']");
  const firstCard = document.querySelector("[data-card='#ffffff']");
  const firstText = document.querySelector("[data-text='#111827']");
  const firstBg = document.querySelector("[data-bg='#ffffff']");
  if (firstColor) firstColor.classList.add("active");
  if (firstCard) firstCard.classList.add("active");
  if (firstText) firstText.classList.add("active");
  if (firstBg) firstBg.classList.add("active");

  document.getElementById("customColor").value = "#1e56e8";
  document.getElementById("customCard").value = "#ffffff";
  document.getElementById("customText").value = "#111827";
  document.getElementById("customBg").value = "#ffffff";
}

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(
    255,
    Math.max(0, (num >> 16) + Math.round(2.55 * percent)),
  );
  const g = Math.min(
    255,
    Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)),
  );
  const b = Math.min(
    255,
    Math.max(0, (num & 0xff) + Math.round(2.55 * percent)),
  );
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function hexToRgba(hex, alpha) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// ═══════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════
function toggleMenu() {
  const nl = document.getElementById("navLinks");
  if (nl) nl.classList.toggle("open");
}
