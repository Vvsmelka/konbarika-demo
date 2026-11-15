(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-visible"), 2800);
  }

  /* ---------- Nav sólido al salir del hero ---------- */
  const nav = $("#nav");
  const hero = $(".hero");
  if (nav && hero && "IntersectionObserver" in window) {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;left:0;bottom:80px;width:1px;height:1px;pointer-events:none";
    hero.appendChild(sentinel);
    new IntersectionObserver(([e]) => {
      nav.classList.toggle("is-solid", !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(sentinel);
  }

  /* ---------- Menú móvil ---------- */
  const mm = $("#mobileMenu");
  const openBtn = $("#navToggle");
  const closeBtn = $("#navClose");
  function setMenu(open) {
    if (!mm) return;
    mm.classList.toggle("is-open", open);
    mm.setAttribute("aria-hidden", String(!open));
    openBtn && openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  openBtn && openBtn.addEventListener("click", () => setMenu(true));
  closeBtn && closeBtn.addEventListener("click", () => setMenu(false));
  mm && $$("a", mm).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  function observeReveal(root = document) {
    const els = $$(".reveal:not(.is-in)", root);
    if (reduce || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Hero vídeo (montaje escritorio 16:9 / móvil 9:16) ---------- */
  const heroVideo = $("#heroVideo");
  if (heroVideo) {
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    heroVideo.poster = mobile ? heroVideo.dataset.mobilePoster : heroVideo.dataset.desktopPoster;
    const media = heroVideo.closest(".hero-media");
    if (media) media.style.backgroundImage = "url('" + heroVideo.poster + "')";
    if (reduce) {
      heroVideo.removeAttribute("autoplay");
    } else {
      heroVideo.src = mobile ? heroVideo.dataset.mobile : heroVideo.dataset.desktop;
      heroVideo.play().catch(() => {});
    }
    // Rótulo del plano que se ve: cada plano dura 2 s (+0,4 s de fundido)
    const capitulos = mobile
      ? ["El mural", "La entrada", "El ventanal", "La barra", "La campa", "La sala", "Las barricas", "La carta"]
      : ["La campa", "La sala", "El mural", "La terraza", "La barra", "La furgo", "El ventanal", "La entrada", "El jardín"];
    const chNum = $("#chNum"), chName = $("#chName"), chBar = $("#chBar");
    let actual = -1;
    const pintar = (i) => {
      actual = i;
      if (chNum) chNum.textContent = String(i + 1).padStart(2, "0");
      if (chName) chName.textContent = capitulos[i];
      if (chBar) { chBar.style.animation = "none"; void chBar.offsetWidth; chBar.style.animation = "chfill 2s linear forwards"; }
    };
    heroVideo.addEventListener("timeupdate", () => {
      const i = Math.min(capitulos.length - 1, Math.max(0, Math.floor((heroVideo.currentTime - 0.2) / 2)));
      if (i !== actual) pintar(i);
    });
    // fuera de pantalla, el vídeo se para
    if ("IntersectionObserver" in window && !reduce) {
      new IntersectionObserver(([e]) => { e.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause(); }).observe(heroVideo);
    }
  }

  /* ---------- Eventos ---------- */
  const posters = $("#posters");
  let filtro = "all";

  function icsFor(ev) {
    const [h, m] = (ev.hora || "20:00").split(":");
    const start = ev.fecha.replace(/-/g, "") + "T" + h + m + "00";
    const endH = String(Math.min(23, parseInt(h, 10) + 3)).padStart(2, "0");
    const end = ev.fecha.replace(/-/g, "") + "T" + endH + m + "00";
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Konba Rika//Eventos//ES", "BEGIN:VEVENT",
      "UID:" + ev.id + "@konbarika", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      "DTSTART;TZID=Europe/Madrid:" + start, "DTEND;TZID=Europe/Madrid:" + end,
      "SUMMARY:" + ev.titulo + " (Konba Rika)", "DESCRIPTION:" + (ev.texto || ""),
      "LOCATION:" + KR.info.direccion, "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  }

  function upcoming() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const all = KR.getEventos();
    const fut = all.filter((e) => new Date(e.fecha + "T23:59:00") >= today);
    return fut.length ? fut : all;
  }

  const colores = ["c-sun", "c-sea", "c-sand", "c-paper"];
  function renderEvents() {
    if (!posters) return;
    const esc = KR.esc;
    const list = upcoming().filter((e) => filtro === "all" || e.cat === filtro);
    if (!list.length) {
      posters.innerHTML = '<p class="empty">No hay eventos de este tipo en la cartelera. Vuelve pronto o pregúntanos por teléfono.</p>';
      return;
    }
    posters.innerHTML = list.map((ev, i) => {
      const d = KR.fmtFecha(ev.fecha);
      return `
        <article class="poster ${colores[i % colores.length]}${i === 0 ? " is-feature" : ""} reveal">
          <div class="p-img"><img src="${esc(ev.img || "assets/img/p0352-sm.jpg")}" alt="" loading="lazy"></div>
          <div class="p-body">
            <div class="p-date"><b>${d.dia}</b><span>${d.mes}<br>${d.semana}</span></div>
            <h3>${esc(ev.titulo)}</h3>
            <p>${esc(ev.texto)}</p>
            <div class="p-foot">
              <span class="p-meta">${esc(ev.hora)} h · ${esc(KR.categorias[ev.cat] || "Evento")}</span>
              <span class="p-acts">
                <a class="icon-btn" href="${icsFor(ev)}" download="${esc(ev.id)}.ics" aria-label="Añadir ${esc(ev.titulo)} al calendario"><i class="ph ph-calendar-plus"></i></a>
                <a class="btn btn-sm" href="#reservar" data-event="${esc(ev.id)}">Apúntate</a>
              </span>
            </div>
          </div>
        </article>`;
    }).join("");
    observeReveal(posters);
  }

  $$("#eventFilters .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      filtro = chip.dataset.cat;
      $$("#eventFilters .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      renderEvents();
    });
  });

  /* ---------- Carta ---------- */
  function renderCarta() {
    const pic = $("#menuPicoteo");
    const dia = $("#menuDia");
    const vin = $("#menuVinos");
    const esc = KR.esc;
    const agotados = KR.getAgotados();
    if (pic) {
      pic.innerHTML = KR.carta.map((g) => `
        <div class="menu-group">
          <h3><i class="ph ph-sun" aria-hidden="true"></i>${esc(g.nombre)}</h3>
          ${g.platos.map((p) => {
            const out = agotados.includes(p.id);
            return `<div class="dish${out ? " is-out" : ""}">
              <span class="name">${esc(p.nombre)}${out ? '<span class="badge-out">Agotado hoy</span>' : ""}${p.nota ? `<span class="note">${esc(p.nota)}</span>` : ""}</span>
              <span class="dots" aria-hidden="true"></span>
              <span class="price">${esc(p.precio)} €${p.unidad ? ` <small>${esc(p.unidad)}</small>` : ""}</span>
            </div>`;
          }).join("")}
        </div>`).join("");
    }
    if (dia) {
      const m = KR.getMenuDia();
      const col = (t, arr) => `<div><h3>${t}</h3><ul>${(arr || []).filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
      dia.innerHTML = `
        <div class="menudia-top"><span class="price">${esc(m.precio)} €</span><span>De lunes a viernes<br>${esc(m.aperitivo || "")}</span></div>
        <div class="menudia">${col("Primeros", m.primeros)}${col("Segundos", m.segundos)}${col("Postres", m.postres)}</div>
        <p class="menu-note" style="margin-top:1.5rem">${esc(m.incluye || "")}</p>`;
    }
    if (vin) {
      vin.innerHTML = KR.vinos.map((g) => `<div><h3>${esc(g.grupo)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
    }
  }

  const tabs = $$('[role="tab"]');
  function selectTab(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        selectTab(n); n.focus();
      }
    });
  });

  /* ---------- QR de mesa ---------- */
  const qrBox = $("#qrBox");
  if (qrBox && window.qrcode) {
    const url = new URL("carta.html?mesa=12", window.location.href).href;
    try {
      const qr = qrcode(0, "M");
      qr.addData(url);
      qr.make();
      qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      const svg = qrBox.querySelector("svg");
      if (svg) { svg.setAttribute("aria-hidden", "true"); }
    } catch (e) { qrBox.textContent = "QR"; }
  }

  /* ---------- Rincones (carrusel) ---------- */
  const rin = $("#rincones");
  if (rin) {
    const step = () => { const c = $(".rin", rin); return c ? c.getBoundingClientRect().width + 18 : 300; };
    $("#rinPrev") && $("#rinPrev").addEventListener("click", () => rin.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }));
    $("#rinNext") && $("#rinNext").addEventListener("click", () => rin.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }));
  }

  /* ---------- Galería: los vídeos se cargan y reproducen al verse ---------- */
  const vids = $$("#masonry video[data-src]");
  if (vids.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (!v.getAttribute("src")) v.src = v.dataset.src;
          if (!reduce) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      });
    }, { threshold: 0.35 });
    vids.forEach((v) => io.observe(v));
  }

  /* ---------- Reservas ---------- */
  const form = $("#bookForm");
  const motivo = $("#f-motivo");
  const fecha = $("#f-fecha");
  if (fecha) {
    const t = new Date();
    fecha.min = t.toISOString().slice(0, 10);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-motivo],[data-event]");
    if (!a || !form) return;
    if (a.dataset.motivo && motivo) motivo.value = a.dataset.motivo;
    if (a.dataset.event) {
      const ev = KR.getEventos().find((x) => x.id === a.dataset.event);
      if (ev) {
        motivo && (motivo.value = "evento");
        fecha && (fecha.value = ev.fecha);
        const c = $("#f-com");
        if (c) c.value = "Quiero apuntarme a: " + ev.titulo;
      }
    }
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$(".field", form).forEach((f) => {
        const input = $("input,select", f);
        const err = $(".err", f);
        if (!input || !input.required) return;
        let msg = "";
        if (!input.value.trim()) msg = "Este campo es necesario.";
        else if (input.type === "tel" && input.value.replace(/\D/g, "").length < 9) msg = "Revisa el teléfono, faltan cifras.";
        f.classList.toggle("has-error", !!msg);
        if (err) err.textContent = msg;
        if (msg) ok = false;
      });
      if (!ok) { const first = $(".has-error input, .has-error select", form); first && first.focus(); return; }
      $("#formOk").classList.add("is-visible");
      form.querySelector('button[type="submit"]').disabled = true;
      toast("Solicitud enviada. Te llamamos para confirmar.");
    });
    $$("input,select", form).forEach((i) => i.addEventListener("input", () => {
      const f = i.closest(".field");
      if (f && f.classList.contains("has-error") && i.value.trim()) { f.classList.remove("has-error"); const er = $(".err", f); er && (er.textContent = ""); }
    }));
  }

  renderEvents();
  renderCarta();
  observeReveal();
})();
