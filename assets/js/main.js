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

  /* ---------- Portada: vídeo (montaje escritorio 16:9 / móvil 9:16) ---------- */
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
    // fuera de pantalla, el vídeo se para
    if ("IntersectionObserver" in window && !reduce) {
      new IntersectionObserver(([e]) => { e.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause(); }).observe(heroVideo);
    }
  }

  /* ---------- Eventos: lista sencilla ---------- */
  const agenda = $("#agenda");

  function proximos() {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const todos = KR.getEventos();
    const fut = todos.filter((e) => new Date(e.fecha + "T23:59:00") >= hoy);
    return (fut.length ? fut : todos).slice(0, 5);
  }

  function renderEventos() {
    if (!agenda) return;
    const esc = KR.esc;
    const lista = proximos();
    if (!lista.length) {
      agenda.innerHTML = '<li class="empty">No hay eventos programados. Llámanos al 946 75 12 76.</li>';
      return;
    }
    agenda.innerHTML = lista.map((ev) => {
      const d = KR.fmtFecha(ev.fecha);
      return `
        <li class="ev">
          <img class="ev-ph" src="${esc(ev.img || "assets/img/p0351-sm.jpg")}" alt="" loading="lazy">
          <div class="ev-date"><b>${d.dia}</b><span><i>${d.mes}</i> <i>${d.semana}</i></span></div>
          <div class="ev-main">
            <h3>${esc(ev.titulo)}</h3>
            <span class="ev-hora">${esc(ev.hora)} h</span>
          </div>
          <a class="btn btn-sm" href="#reservar" data-event="${esc(ev.id)}">Reservar</a>
          <a class="ev-link" href="#reservar" data-event="${esc(ev.id)}" aria-label="Reservar para ${esc(ev.titulo)}"></a>
        </li>`;
    }).join("");
  }

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
          <h3>${esc(g.nombre)}</h3>
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

  /* ---------- El sitio: los vídeos del mosaico se cargan y reproducen al verse ---------- */
  const vids = $$(".mosaic video[data-src]");
  if (vids.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (!v.getAttribute("src")) v.src = v.dataset.src;
          if (!reduce) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      });
    }, { threshold: 0.3 });
    vids.forEach((v) => io.observe(v));
  }

  const moreBtn = $("#moreBtn");
  const mosaicMore = $("#mosaicMore");
  if (moreBtn && mosaicMore) {
    moreBtn.addEventListener("click", () => {
      mosaicMore.hidden = false;
      moreBtn.setAttribute("aria-expanded", "true");
      moreBtn.closest(".more-row").hidden = true;
    });
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

  renderEventos();
  renderCarta();
})();
