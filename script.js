// ─────────────────────────────────────────
// EmailJS config — fill in your credentials
// ─────────────────────────────────────────
var EMAILJS_PUBLIC_KEY  = "ND9MNOl_0ixeKes-u";
var EMAILJS_SERVICE_ID  = "service_g0ns8hj";
var EMAILJS_TEMPLATE_ID = "template_maq7tya";

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
  navLogo.innerHTML = `<img src="img/logos/jns-logo.png" alt="${data.meta.logo}" style="width:100%;height:100%;object-fit:contain;border-radius:6px;" />`;
  document.title = data.meta.title;

  const pages = ["home", "about", "project", "contact"];
  const labels = {
    home: "Home",
    about: "About",
    project: "Project",
    contact: "Contact",
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
function ctaBannerHTML() {
  return `
    <section class="cta-banner">
      <div class="cta-blob cta-b1"></div>
      <div class="cta-blob cta-b2"></div>
      <div class="cta-inner">
        <div class="cta-badge">✦ Available for Work</div>
        <h2 class="cta-heading">${data.home.cta_banner}</h2>
        <p class="cta-sub">Let's collaborate and build something amazing together.</p>
        <div class="cta-actions">
          <button class="cta-btn-primary" onclick="showPage('contact')">Hire Me &rarr;</button>
          <button class="cta-btn-ghost" onclick="showPage('project')">View Projects</button>
        </div>
      </div>
    </section>`;
}

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
          <button class="btn btn-outline" onclick="showPage('project')">${h.cta_primary}</button>
          <button class="btn btn-blue" onclick="showPage('contact')">${h.cta_secondary}</button>
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

  const ctaHTML = ctaBannerHTML();

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
  const imgs = p.imgs && p.imgs.length > 0 ? p.imgs : p.img ? [p.img] : [];
  if (imgs.length > 0) {
    if (size === "lg") {
      const slides = imgs
        .map(function (src, i) {
          return `
          <div class="carousel-slide" style="display:${i === 0 ? "block" : "none"};width:100%;height:100%;cursor:zoom-in;position:relative;" onclick="openLightbox('${p.id}',${i})">
            <img src="${src}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" />
            <div class="img-expand-hint" style="position:absolute;inset:0;border-radius:12px;background:transparent;display:flex;align-items:center;justify-content:center;transition:background .2s;">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0;transition:opacity .2s;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
            </div>
          </div>`;
        })
        .join("");
      const counter =
        imgs.length > 1
          ? `<div class="carousel-counter" style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.5);color:#fff;font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:.04em;z-index:3;pointer-events:none;">1 / ${imgs.length}</div>`
          : "";
      const dots =
        imgs.length > 1
          ? `<div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:3;">
        ${imgs
          .map(function (_, i) {
            return `<span class="carousel-dot" style="width:7px;height:7px;border-radius:50%;background:${i === 0 ? "#fff" : "rgba(255,255,255,0.4)"};display:inline-block;cursor:pointer;transition:background .2s;" onclick="event.stopPropagation();goSlide('${p.id}',${i})"></span>`;
          })
          .join("")}
      </div>`
          : "";
      const arrows =
        imgs.length > 1
          ? `
        <button onclick="event.stopPropagation();prevSlide('${p.id}')" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.9);color:#1e56e8;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;z-index:3;box-shadow:0 2px 8px rgba(0,0,0,0.15);">‹</button>
        <button onclick="event.stopPropagation();nextSlide('${p.id}')" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.9);color:#1e56e8;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;z-index:3;box-shadow:0 2px 8px rgba(0,0,0,0.15);">›</button>`
          : "";
      return `<div id="carousel-${p.id}" data-current="0" style="position:relative;width:100%;height:260px;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(30,86,232,0.10);background:#ffffff;">
        ${slides}${counter}${arrows}${dots}
      </div>`;
    }
    return `<div class="${cls}"><img src="${imgs[0]}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" /></div>`;
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

// ── Carousel controls
function goSlide(id, index) {
  const c = document.getElementById("carousel-" + id);
  if (!c) return;
  const slides = c.querySelectorAll(".carousel-slide");
  slides.forEach(function (s, i) {
    s.style.display = i === index ? "block" : "none";
  });
  c.dataset.current = index;
  c.querySelectorAll(".carousel-dot").forEach(function (dot, i) {
    dot.style.background = i === index ? "#fff" : "rgba(255,255,255,0.4)";
  });
  const counter = c.querySelector(".carousel-counter");
  if (counter) counter.textContent = index + 1 + " / " + slides.length;
}
function prevSlide(id) {
  const c = document.getElementById("carousel-" + id);
  if (!c) return;
  const total = c.querySelectorAll(".carousel-slide").length;
  goSlide(id, (parseInt(c.dataset.current) - 1 + total) % total);
}
function nextSlide(id) {
  const c = document.getElementById("carousel-" + id);
  if (!c) return;
  const total = c.querySelectorAll(".carousel-slide").length;
  goSlide(id, (parseInt(c.dataset.current) + 1) % total);
}

// ── Lightbox
function openLightbox(projectId, startIndex) {
  const p = data.projects.find(function (proj) {
    return proj.id === projectId;
  });
  if (!p) return;
  const imgs = p.imgs && p.imgs.length > 0 ? p.imgs : [];
  if (imgs.length === 0) return;

  const existing = document.getElementById("lightbox");
  if (existing) existing.remove();

  const thumbsHTML =
    imgs.length > 1
      ? `<div style="display:flex;gap:8px;margin-top:16px;">
        ${imgs
          .map(function (src, i) {
            return `<img src="${src}" class="lb-thumb" data-index="${i}" onclick="lbGoTo(${i})"
            style="width:60px;height:44px;object-fit:cover;border-radius:6px;cursor:pointer;border:2px solid ${i === startIndex ? "#fff" : "transparent"};opacity:${i === startIndex ? "1" : "0.5"};transition:all .2s;" />`;
          })
          .join("")}
      </div>`
      : "";

  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.dataset.projectId = projectId;
  lb.dataset.current = startIndex;
  lb.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:lbFade .2s ease;";
  lb.innerHTML = `
    <button onclick="closeLightbox()" style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:50%;width:42px;height:42px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:background .2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">✕</button>
    <div id="lb-counter" style="position:absolute;top:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.6);font-size:0.78rem;font-family:Poppins,sans-serif;letter-spacing:.05em;">${startIndex + 1} / ${imgs.length}</div>
    ${imgs.length > 1 ? `<button onclick="lbPrev()" style="position:absolute;left:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:50%;width:48px;height:48px;cursor:pointer;font-size:1.5rem;display:flex;align-items:center;justify-content:center;transition:background .2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">‹</button>` : ""}
    ${imgs.length > 1 ? `<button onclick="lbNext()" style="position:absolute;right:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:50%;width:48px;height:48px;cursor:pointer;font-size:1.5rem;display:flex;align-items:center;justify-content:center;transition:background .2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">›</button>` : ""}
    <img id="lb-img" src="${imgs[startIndex]}" style="max-width:88vw;max-height:72vh;object-fit:contain;border-radius:12px;box-shadow:0 30px 60px rgba(0,0,0,0.6);" />
    ${thumbsHTML}
  `;

  document.body.appendChild(lb);
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLightbox();
  });
  document.addEventListener("keydown", lbKeyHandler);
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (lb) lb.remove();
  document.removeEventListener("keydown", lbKeyHandler);
}

function lbKeyHandler(e) {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lbPrev();
  if (e.key === "ArrowRight") lbNext();
}

function lbGoTo(index) {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const p = data.projects.find(function (proj) {
    return proj.id === lb.dataset.projectId;
  });
  const imgs = p && p.imgs ? p.imgs : [];
  lb.dataset.current = index;
  document.getElementById("lb-img").src = imgs[index];
  const counter = document.getElementById("lb-counter");
  if (counter) counter.textContent = index + 1 + " / " + imgs.length;
  lb.querySelectorAll(".lb-thumb").forEach(function (t, i) {
    t.style.border = i === index ? "2px solid #fff" : "2px solid transparent";
    t.style.opacity = i === index ? "1" : "0.5";
  });
}
function lbPrev() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const p = data.projects.find(function (proj) {
    return proj.id === lb.dataset.projectId;
  });
  const total = p && p.imgs ? p.imgs.length : 0;
  lbGoTo((parseInt(lb.dataset.current) - 1 + total) % total);
}
function lbNext() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const p = data.projects.find(function (proj) {
    return proj.id === lb.dataset.projectId;
  });
  const total = p && p.imgs ? p.imgs.length : 0;
  lbGoTo((parseInt(lb.dataset.current) + 1) % total);
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

          <!-- LEFT: photo -->
          <div class="about-photo-wrap">
            <div class="about-photo-box">
              ${a.photo ? `<img src="${a.photo}" alt="${data.meta.name}" />` : "👨‍💻"}
            </div>
          </div>

          <!-- RIGHT: big title + bio + social icons -->
          <div class="about-right">
            <h1 class="about-big-title">ABOUT</h1>
            <div class="about-bio" id="aboutBio"></div>
            <div class="socials" id="aboutSocials"></div>
          </div>

        </div>
      </div>
    </section>

    <div class="scroll-caret" onclick="document.querySelector('#page-about .skills-section').scrollIntoView({behavior:'smooth'})" style="cursor:pointer;">˅</div>

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

    ${ctaBannerHTML()}
  `;

  // socials — SVG icons
  const socialSVGs = {
    gmail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.09l8.073-5.6C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#181717"/></svg>`,
  };
  const socDiv = document.getElementById("aboutSocials");
  data.meta.socials.forEach(function (s) {
    const a2 = document.createElement("a");
    a2.href = s.url;
    a2.className = "social-icon-link";
    a2.target = s.icon === "gmail" ? "_self" : "_blank";
    a2.title = s.label;
    a2.innerHTML = socialSVGs[s.icon] || `<span>${s.label}</span>`;
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
      const active =
        i === 0
          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
          : "bg-white border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600";
      return `<button class="proj-tab px-5 py-2 rounded-full text-sm font-semibold border-2 cursor-pointer transition-all duration-200 ${active}"
        data-id="${p.id}" onclick="switchProject('${p.id}')">${p.title}</button>`;
    })
    .join("");

  const detailsHTML = data.projects
    .map(function (p, i) {
      return `
      <div class="proj-detail ${i === 0 ? "flex" : "hidden"} flex-col" id="detail-${p.id}">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
          <div class="flex flex-col lg:flex-row">

            <!-- Left: Info -->
            <div class="flex-1 p-8 flex flex-col justify-between min-w-0">
              <div>
                <div class="flex items-center gap-3 mb-5">
                  <span class="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full tracking-wider uppercase">${p.type}</span>
                  <span class="text-xs font-bold text-gray-300">#${String(i + 1).padStart(2, "0")}</span>
                </div>
                <h1 class="text-[clamp(1.4rem,3vw,2rem)] font-extrabold text-gray-900 tracking-tight leading-tight mb-3">${p.title}</h1>
                <div class="w-10 h-1 bg-blue-600 rounded-full mb-5"></div>
                <p class="text-sm text-gray-500 leading-relaxed mb-3">${p.desc}</p>
                <p class="text-sm text-gray-400 leading-relaxed">${p.detail}</p>
              </div>
              <div class="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-2">
                  <span class="text-blue-400 text-sm">✉</span>
                  <span class="text-xs text-gray-400">${data.meta.email}</span>
                </div>
                ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer"
                  style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;
                         background:#f3f4f6;color:#374151;font-size:0.75rem;font-weight:600;
                         text-decoration:none;border:1px solid #e5e7eb;transition:background .2s;"
                  onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#374151"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  View on GitHub
                </a>` : ""}
              </div>
            </div>

            <!-- Right: Image / Carousel -->
            <div class="flex-shrink-0 lg:w-[420px] bg-gradient-to-br from-slate-50 to-blue-50 border-t lg:border-t-0 lg:border-l border-gray-100 flex items-center justify-center p-6">
              ${thumbHTML(p, "lg")}
            </div>

          </div>
        </div>
      </div>
    `;
    })
    .join("");

  const otherHTML = (data.other_projects || [])
    .map(function (group) {
      const cards = group.items
        .map(function (item) {
          const thumbSrc =
            item.imgs && item.imgs.length ? item.imgs[0] : item.img || null;
          const imgCount = item.imgs ? item.imgs.length : item.img ? 1 : 0;
          const preview = thumbSrc
            ? `<div class="other-proj-preview" style="position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);width:210px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.16);border:1px solid #e5e7eb;opacity:0;pointer-events:none;transition:opacity .2s;z-index:20;">
              <img src="${thumbSrc}" style="width:100%;height:120px;object-fit:cover;" />
              <div style="padding:10px 12px;display:flex;align-items:center;justify-content:space-between;">
                <div>
                  <p style="font-size:0.75rem;font-weight:600;color:#111827;margin:0;">${item.name}</p>
                  <p style="font-size:0.68rem;color:#9ca3af;margin:0;">${item.tech}</p>
                </div>
                ${imgCount > 1 ? `<span style="font-size:0.63rem;font-weight:700;color:#1e56e8;background:#eff6ff;border:1px solid #bfdbfe;padding:2px 7px;border-radius:20px;white-space:nowrap;">${imgCount} photos</span>` : ""}
              </div>
            </div>`
            : "";
          return `
        <div class="other-proj-card" style="position:relative;background:#fff;border:1px solid #f3f4f6;border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 4px rgba(0,0,0,0.04);cursor:pointer;transition:border-color .2s,box-shadow .2s;"
          onclick="openOtherProjectModal('${item.name.replace(/'/g, "\\'")}')"
          onmouseenter="this.style.borderColor='#bfdbfe';this.style.boxShadow='0 4px 16px rgba(30,86,232,0.10)';this.querySelector('.other-proj-preview') && (this.querySelector('.other-proj-preview').style.opacity='1')"
          onmouseleave="this.style.borderColor='#f3f4f6';this.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)';this.querySelector('.other-proj-preview') && (this.querySelector('.other-proj-preview').style.opacity='0')">
          ${preview}
          <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">${group.icon}</div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-800 truncate">${item.name}</p>
            <p class="text-xs text-gray-400">${item.tech}</p>
          </div>
          ${item.github ? `<a href="${item.github}" target="_blank" rel="noopener noreferrer"
            onclick="event.stopPropagation()"
            title="View on GitHub"
            style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;
                   border-radius:6px;background:#f3f4f6;border:1px solid #e5e7eb;flex-shrink:0;
                   transition:background .2s;text-decoration:none;"
            onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#374151"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>` : ""}
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>`;
        })
        .join("");
      return `
      <div class="mb-6">
        <h4 class="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">${group.category}</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">${cards}</div>
      </div>`;
    })
    .join("");

  el.innerHTML = `
    <div class="max-w-[900px] w-full mx-auto px-6 py-12">
      <div class="mb-2">
        <p class="text-xs font-bold text-blue-500 tracking-widest uppercase mb-1">Portfolio</p>
        <h2 class="text-2xl font-extrabold text-gray-900 mb-7">My Projects</h2>
      </div>
      <div class="flex gap-2.5 flex-wrap mb-8">
        ${tabsHTML}
      </div>
      ${detailsHTML}

      <!-- Other Projects -->
      <div class="mt-12">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-1 h-px bg-gray-100"></div>
          <p class="text-xs font-bold text-gray-400 tracking-widest uppercase">Other Projects</p>
          <div class="flex-1 h-px bg-gray-100"></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;background:#f8faff;border:1px solid #e0eaff;border-radius:10px;padding:11px 15px;margin-bottom:20px;">
          <span style="font-size:0.95rem;flex-shrink:0;margin-top:1px;">💡</span>
          <p style="font-size:0.75rem;color:#6b7280;margin:0;line-height:1.6;font-family:Poppins,sans-serif;">
            These projects were built using <strong style="color:#374151;">React, Tailwind CSS, Android Java, and WordPress</strong> to showcase my skills in
            <strong style="color:#374151;">frontend, mobile, and CMS development</strong>. Click any card to view screenshots.
          </p>
        </div>
        ${otherHTML}
      </div>
    </div>
    ${ctaBannerHTML()}
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
    d.classList.remove("flex");
    d.classList.add("hidden");
  });
  document.querySelectorAll(".proj-tab").forEach(function (t) {
    t.classList.remove(
      "bg-blue-600",
      "border-blue-600",
      "text-white",
      "shadow-sm",
    );
    t.classList.add("bg-white", "border-gray-200", "text-gray-500");
  });
  const panel = document.getElementById("detail-" + id);
  if (panel) {
    panel.classList.remove("hidden");
    panel.classList.add("flex");
  }
  const tab = document.querySelector(`.proj-tab[data-id="${id}"]`);
  if (tab) {
    tab.classList.remove("bg-white", "border-gray-200", "text-gray-500");
    tab.classList.add(
      "bg-blue-600",
      "border-blue-600",
      "text-white",
      "shadow-sm",
    );
  }
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
  const m = data.meta;
  const el = document.getElementById("page-contact");

  const socialSVGs = {
    gmail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.09l8.073-5.6C21.69 2.28 24 3.434 24 5.457z" fill="currentColor"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/></svg>`,
  };

  const socialsHTML = m.socials
    .map(function (s) {
      return `<a href="${s.url}" class="contact-social-btn" target="${s.icon === "gmail" ? "_self" : "_blank"}" title="${s.label}">
      ${socialSVGs[s.icon] || s.label}
      <span>${s.label}</span>
    </a>`;
    })
    .join("");

  el.innerHTML = `
    <div class="contact-page-wrap">

      <!-- Decorative blobs -->
      <div class="c-blob c-blob-1"></div>
      <div class="c-blob c-blob-2"></div>

      <div class="contact-grid">

        <!-- LEFT: info panel -->
        <div class="contact-info-panel">
          <p class="c-eyebrow">GET IN TOUCH</p>
          <h1 class="c-big-title">Let's Build<br/>Something <span>Great.</span></h1>
          <p class="c-desc">Have a project in mind or looking for a developer to join your team? I'd love to hear from you.</p>

          <div class="c-details">
            <div class="c-detail-row">
              <div class="c-detail-icon">✉</div>
              <div>
                <p class="c-detail-label">Email</p>
                <a href="mailto:${m.email}" class="c-detail-value">${m.email}</a>
              </div>
            </div>
            <div class="c-detail-row">
              <div class="c-detail-icon">📞</div>
              <div>
                <p class="c-detail-label">Phone</p>
                <p class="c-detail-value">${m.phone}</p>
              </div>
            </div>
          </div>

          <div class="c-socials">${socialsHTML}</div>
        </div>

        <!-- RIGHT: form -->
        <div class="contact-form-panel">
          <h3 class="c-form-title">Send a Message</h3>
          <p class="c-form-sub">I usually respond within 24 hours.</p>
          <div class="form-group">
            <div class="form-field">
              <label class="form-label">Your Name</label>
              <input type="text" class="form-input" id="cName" placeholder="e.g. Juan Dela Cruz" />
            </div>
            <div class="form-field">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="cEmail" placeholder="you@email.com" />
            </div>
            <div class="form-field">
              <label class="form-label">Message</label>
              <textarea class="form-input" id="cMsg" placeholder="Tell me about your project or idea..." rows="5"></textarea>
            </div>
            <button class="btn-send" onclick="submitContact()">Send Message &rarr;</button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function submitContact() {
  var name  = document.getElementById("cName").value.trim();
  var email = document.getElementById("cEmail").value.trim();
  var msg   = document.getElementById("cMsg").value.trim();

  if (!name || !email || !msg) {
    showContactNotif("error", "Please fill in all fields before sending.");
    return;
  }

  var btn = document.querySelector(".btn-send");
  btn.textContent = "Sending…";
  btn.disabled = true;

  emailjs.init(EMAILJS_PUBLIC_KEY);
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:  name,
    from_email: email,
    message:    msg,
    to_email:   data.contact.email
  }).then(function () {
    btn.textContent = "Send Message →";
    btn.disabled = false;
    showContactNotif("success", name);
    ["cName", "cEmail", "cMsg"].forEach(function (id) {
      document.getElementById(id).value = "";
    });
  }).catch(function () {
    btn.textContent = "Send Message →";
    btn.disabled = false;
    showContactNotif("error", "Something went wrong. Please email me directly at <strong style='color:#1e56e8;'>" + data.contact.email + "</strong>.");
  });
}

function showContactNotif(type, payload) {
  var existing = document.getElementById("contactNotif");
  if (existing) existing.remove();

  var isSuccess = type === "success";

  var modal = document.createElement("div");
  modal.id = "contactNotif";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(8,12,30,0.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:lbFade .2s ease;";

  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px;width:100%;max-width:380px;padding:2.5rem 2rem 2rem;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.22);font-family:Poppins,sans-serif;">

      <!-- Icon -->
      <div style="width:66px;height:66px;border-radius:50%;
                  background:${isSuccess ? "#ecfdf5" : "#fef2f2"};
                  border:2px solid ${isSuccess ? "#bbf7d0" : "#fecaca"};
                  display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;">
        ${isSuccess
          ? `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
          : `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        }
      </div>

      <!-- Title -->
      <h3 style="font-size:1.05rem;font-weight:700;color:#111827;margin:0 0 0.5rem;">
        ${isSuccess ? "Message Sent!" : "Oops!"}
      </h3>

      <!-- Body -->
      <p style="font-size:0.83rem;color:#6b7280;margin:0 0 1.75rem;line-height:1.7;">
        ${isSuccess
          ? `Thanks <strong style="color:#111827;">${payload}</strong>! Your message has been received. I'll get back to you soon.`
          : payload}
      </p>

      <!-- Button -->
      <button onclick="document.getElementById('contactNotif').remove()"
        style="width:100%;padding:0.72rem;border-radius:10px;background:#1e56e8;color:#fff;border:none;
               font-family:Poppins,sans-serif;font-size:0.875rem;font-weight:600;cursor:pointer;
               transition:background .2s;box-shadow:0 4px 14px rgba(30,86,232,0.25);"
        onmouseover="this.style.background='#1240c0'" onmouseout="this.style.background='#1e56e8'">
        Got it
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════
function renderFooter() {
  const m = data.meta;
  const socLinks = m.socials
    .map(function (s) {
      if (s.icon === "gmail") {
        return `<a href="#" class="foot-social" onclick="showPage('contact');return false;">${s.label}</a>`;
      }
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
// OTHER PROJECTS MODAL
// ═══════════════════════════════════════════
var _opm = { imgs: [], current: 0 };

function openOtherProjectModal(name) {
  var item = null;
  (data.other_projects || []).forEach(function (group) {
    group.items.forEach(function (it) {
      if (it.name === name) item = it;
    });
  });
  if (!item) return;

  _opm.imgs =
    item.imgs && item.imgs.length ? item.imgs : item.img ? [item.img] : [];
  _opm.current = 0;
  if (_opm.imgs.length === 0) return;

  var existing = document.getElementById("otherProjModal");
  if (existing) existing.remove();

  var thumbsHTML = _opm.imgs
    .map(function (src, i) {
      return `<img src="${src}" class="opm-thumb" onclick="opmGoTo(${i})"
      style="width:60px;height:42px;object-fit:cover;border-radius:7px;cursor:pointer;
             border:2px solid ${i === 0 ? "#1e56e8" : "transparent"};
             opacity:${i === 0 ? "1" : "0.5"};transition:all .2s;flex-shrink:0;" />`;
    })
    .join("");

  var modal = document.createElement("div");
  modal.id = "otherProjModal";
  modal.style.cssText =
    "position:fixed;inset:0;background:rgba(8,12,30,0.78);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:lbFade .2s ease;backdrop-filter:blur(3px);";

  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px;width:100%;max-width:780px;overflow:hidden;
                box-shadow:0 32px 80px rgba(0,0,0,0.35);display:flex;flex-direction:column;max-height:90vh;">

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid #f3f4f6;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:38px;height:38px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;
                      display:flex;align-items:center;justify-content:center;font-size:1.1rem;">🖥️</div>
          <div>
            <h3 style="font-size:1rem;font-weight:700;color:#111827;margin:0 0 3px;font-family:Poppins,sans-serif;">${item.name}</h3>
            <span style="font-size:0.68rem;font-weight:600;color:#1e56e8;background:#eff6ff;
                         border:1px solid #bfdbfe;padding:2px 9px;border-radius:20px;font-family:Poppins,sans-serif;">${item.tech}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:0.7rem;color:#9ca3af;font-family:Poppins,sans-serif;">${_opm.imgs.length} image${_opm.imgs.length > 1 ? "s" : ""}</span>
          ${item.github ? `<a href="${item.github}" target="_blank" rel="noopener noreferrer"
            style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:7px;
                   background:#f3f4f6;color:#374151;font-size:0.72rem;font-weight:600;
                   text-decoration:none;border:1px solid #e5e7eb;transition:background .2s;white-space:nowrap;"
            onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#374151"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            GitHub
          </a>` : ""}
          <button onclick="closeOtherProjModal()"
            style="background:#f3f4f6;border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;
                   font-size:0.9rem;display:flex;align-items:center;justify-content:center;color:#6b7280;
                   transition:background .2s;flex-shrink:0;"
            onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">✕</button>
        </div>
      </div>

      <!-- Main Image -->
      <div style="position:relative;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:320px;flex:1;overflow:hidden;">
        <img id="opm-main-img" src="${_opm.imgs[0]}"
          style="max-width:100%;max-height:440px;object-fit:contain;display:block;" />
        ${
          _opm.imgs.length > 1
            ? `
          <div id="opm-counter"
            style="position:absolute;top:12px;right:14px;background:rgba(0,0,0,0.55);color:#fff;
                   font-size:0.7rem;font-weight:700;padding:4px 12px;border-radius:20px;
                   font-family:Poppins,sans-serif;letter-spacing:.04em;">1 / ${_opm.imgs.length}</div>
          <button onclick="opmPrev()"
            style="position:absolute;left:14px;top:50%;transform:translateY(-50%);
                   background:rgba(255,255,255,0.92);color:#1e56e8;border:none;border-radius:50%;
                   width:40px;height:40px;cursor:pointer;font-size:1.4rem;display:flex;
                   align-items:center;justify-content:center;transition:background .2s;
                   box-shadow:0 2px 12px rgba(0,0,0,0.25);z-index:4;"
            onmouseover="this.style.background='#fff'" onmouseout="this.style.background='rgba(255,255,255,0.92)'">‹</button>
          <button onclick="opmNext()"
            style="position:absolute;right:14px;top:50%;transform:translateY(-50%);
                   background:rgba(255,255,255,0.92);color:#1e56e8;border:none;border-radius:50%;
                   width:40px;height:40px;cursor:pointer;font-size:1.4rem;display:flex;
                   align-items:center;justify-content:center;transition:background .2s;
                   box-shadow:0 2px 12px rgba(0,0,0,0.25);z-index:4;"
            onmouseover="this.style.background='#fff'" onmouseout="this.style.background='rgba(255,255,255,0.92)'">›</button>
        `
            : ""
        }
      </div>

      <!-- Thumbnail Strip -->
      ${
        _opm.imgs.length > 1
          ? `
        <div id="opm-thumbs"
          style="display:flex;gap:8px;padding:14px 22px;overflow-x:auto;background:#f9fafb;
                 border-top:1px solid #f3f4f6;flex-shrink:0;scrollbar-width:thin;">
          ${thumbsHTML}
        </div>
      `
          : ""
      }
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeOtherProjModal();
  });
  document.addEventListener("keydown", _opmKeyHandler);
}

function closeOtherProjModal() {
  var modal = document.getElementById("otherProjModal");
  if (modal) modal.remove();
  document.removeEventListener("keydown", _opmKeyHandler);
}

function _opmKeyHandler(e) {
  if (e.key === "Escape") closeOtherProjModal();
  if (e.key === "ArrowLeft") opmPrev();
  if (e.key === "ArrowRight") opmNext();
}

function opmGoTo(index) {
  var modal = document.getElementById("otherProjModal");
  if (!modal) return;
  _opm.current = index;
  document.getElementById("opm-main-img").src = _opm.imgs[index];
  var counter = document.getElementById("opm-counter");
  if (counter) counter.textContent = index + 1 + " / " + _opm.imgs.length;
  modal.querySelectorAll(".opm-thumb").forEach(function (t, i) {
    t.style.border =
      i === index ? "2px solid #1e56e8" : "2px solid transparent";
    t.style.opacity = i === index ? "1" : "0.5";
  });
}

function opmPrev() {
  opmGoTo((_opm.current - 1 + _opm.imgs.length) % _opm.imgs.length);
}
function opmNext() {
  opmGoTo((_opm.current + 1) % _opm.imgs.length);
}

// ═══════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════
function toggleMenu() {
  const nl = document.getElementById("navLinks");
  if (nl) nl.classList.toggle("open");
}
