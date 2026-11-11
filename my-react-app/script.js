(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hero = document.querySelector(".hero");
  const visual = document.querySelector(".hero-visual");
  const portrait = document.querySelector(".portrait-image");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const cursor = document.querySelector(".cursor-dot");
  let particleIntensity = 0.55;
  let effectSpeed = 0.8;
  let rebuildParticles = null;

  portrait?.addEventListener("error", () => {
    portrait.closest(".portrait-wrap")?.classList.add("image-missing");
  });
  if (portrait?.complete && portrait.naturalWidth === 0) {
    portrait.closest(".portrait-wrap")?.classList.add("image-missing");
  }

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    nav?.classList.toggle("is-open", !open);
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
    });
  });

  if (finePointer) {
    document.body.classList.add("has-pointer");
    let glowFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    document.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!glowFrame) {
        glowFrame = requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--pointer-x", `${pointerX}px`);
          document.documentElement.style.setProperty("--pointer-y", `${pointerY}px`);
          const glow = document.querySelector(".cursor-glow");
          if (glow) glow.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`;
          if (cursor) cursor.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`;
          glowFrame = 0;
        });
      }
    }, { passive: true });

    visual?.addEventListener("pointermove", (event) => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      visual.style.setProperty("--mx", `${x * 9}deg`);
      visual.style.setProperty("--my", `${-y * 9}deg`);
    });
    visual?.addEventListener("pointerleave", () => {
      visual.style.setProperty("--mx", "0deg");
      visual.style.setProperty("--my", "0deg");
    });

    document.querySelectorAll(".lab-stage, .location-card, .journey-track, .experience-panel, .project-card, .contact-form").forEach((surface) => {
      surface.addEventListener("pointermove", (event) => {
        const bounds = surface.getBoundingClientRect();
        surface.style.setProperty("--shine-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
        surface.style.setProperty("--shine-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
      }, { passive: true });
      surface.addEventListener("pointerleave", () => {
        surface.style.setProperty("--shine-x", "50%");
        surface.style.setProperty("--shine-y", "50%");
      });
    });

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty("--tilt-x", `${x * 7}deg`);
        card.style.setProperty("--tilt-y", `${-y * 7}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  const revealItems = document.querySelectorAll(
    ".section-kicker, .about-heading, .about-copy, .journey-track, .skills-intro, .skill-card, .work-head, .project-card, .project-github, .experience-layout, .contact-layout"
  );
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item, index) => {
      item.classList.add("reveal");
      if (item.matches(".skill-card")) item.style.transitionDelay = `${(index % 5) * 45}ms`;
      revealObserver.observe(item);
    });
  }

  const scenes = [...document.querySelectorAll(".hero, main > .section-shell")];
  const navLinks = [...(nav?.querySelectorAll('a[href^="#"]') || [])];
  const progressBar = document.querySelector(".scroll-progress");
  let scrollFrame = 0;
  let previousScrollY = window.scrollY;
  let previousScrollTime = performance.now();
  const updateScrollExperience = () => {
    const now = performance.now();
    const currentY = window.scrollY;
    const elapsed = Math.max(16, now - previousScrollTime);
    const velocity = Math.max(-1, Math.min(1, (currentY - previousScrollY) / elapsed * 12));
    const pageRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty("--page-progress", `${currentY / pageRange}`);
    document.documentElement.style.setProperty("--scroll-direction", velocity < 0 ? "-1" : "1");
    document.documentElement.style.setProperty("--scroll-velocity", `${Math.abs(velocity)}`);
    if (progressBar) progressBar.style.transform = `scaleX(${currentY / pageRange})`;

    const focusLine = window.innerHeight * .42;
    let activeSection = "home";
    let nearestDistance = Infinity;
    scenes.forEach((scene) => {
      const bounds = scene.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
      scene.style.setProperty("--scene-progress", `${progress}`);
      scene.style.setProperty("--scene-shift", `${(progress - .5) * -26}px`);
      scene.style.setProperty("--scene-rotate", `${(progress - .5) * 18}deg`);
      scene.style.setProperty("--scene-tilt", `${(progress - .5) * 5}deg`);
      scene.style.setProperty("--scene-scale", `${(.9 + progress * .2).toFixed(3)}`);
      scene.style.setProperty("--rule-scale", `${(.55 + progress * .45).toFixed(3)}`);
      scene.style.setProperty("--scroll-rotate", `${((progress - .5) * 14 + velocity * 2.4).toFixed(2)}deg`);
      scene.style.setProperty("--project-yaw", `${((progress - .5) * 3.5).toFixed(2)}deg`);
      scene.style.setProperty("--project-pitch", `${((progress - .5) * 0.7).toFixed(2)}deg`);
      scene.style.setProperty("--hero-title-rotation", `${(-progress * 1.2).toFixed(2)}deg`);
      scene.style.setProperty("--hero-content-shift", `${((.5 - progress) * 10).toFixed(2)}px`);
      const distance = Math.abs(bounds.top + bounds.height * .42 - focusLine);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        activeSection = scene.id || "home";
      }
    });
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${activeSection}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    previousScrollY = currentY;
    previousScrollTime = now;
    scrollFrame = 0;
  };
  const scheduleScrollExperience = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollExperience);
  };
  window.addEventListener("scroll", scheduleScrollExperience, { passive: true });
  window.addEventListener("resize", scheduleScrollExperience, { passive: true });
  updateScrollExperience();

  if (finePointer) {
    const interactiveElements = document.querySelectorAll(".button, .nav-contact, .location-controls button");
    interactiveElements.forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * .08;
        const y = (event.clientY - bounds.top - bounds.height / 2) * .08;
        element.style.setProperty("--magnetic-x", `${x.toFixed(1)}px`);
        element.style.setProperty("--magnetic-y", `${y.toFixed(1)}px`);
      });
      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--magnetic-x", "0px");
        element.style.setProperty("--magnetic-y", "0px");
      });
    });

    document.addEventListener("pointerover", (event) => {
      const target = event.target.closest("a, button, [role='button']");
      if (!target || !cursor) return;
      const label = target.closest(".project-preview, .project-info") ? "EXPLORE" :
        target.matches(".nova-character, .pixel-character") ? "INTERACT" :
          target.closest(".main-nav") ? "OPEN" : "VIEW";
      cursor.dataset.cursorLabel = label;
      cursor.classList.add("is-active");
    });
    document.addEventListener("pointerout", (event) => {
      if (!event.target.closest("a, button, [role='button']") || !cursor) return;
      if (event.relatedTarget?.closest?.("a, button, [role='button']")) return;
      cursor.classList.remove("is-active");
    });
    document.addEventListener("pointerdown", () => cursor?.classList.add("is-pressed"));
    document.addEventListener("pointerup", () => cursor?.classList.remove("is-pressed"));
  }

  document.addEventListener("pointerdown", (event) => {
    const control = event.target.closest(".button, .menu-toggle, .location-controls button, .location-character-toggle");
    if (!control || reduceMotion) return;
    const bounds = control.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "interaction-ripple";
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    control.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });

  const setupParticles = () => {
    const canvas = document.querySelector(".particle-field");
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context || reduceMotion) return;

    let mobile = window.matchMedia("(max-width: 700px)").matches;
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let pointer = { x: -1000, y: -1000 };

    const resize = () => {
      mobile = window.matchMedia("(max-width: 700px)").matches;
      const bounds = hero.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round((mobile ? 32 : 68) * particleIntensity);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.25 + 0.35,
        alpha: Math.random() * 0.35 + 0.12
      }));
    };
    rebuildParticles = resize;
    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((point, index) => {
        point.x += point.vx * (effectSpeed / 0.8);
        point.y += point.vy * (effectSpeed / 0.8);
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
        const dx = point.x - pointer.x;
        const dy = point.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 115) {
          point.x += (dx / (distance || 1)) * 0.18;
          point.y += (dy / (distance || 1)) * 0.18;
        }
        context.beginPath();
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(116, 132, 145, ${point.alpha})`;
        context.fill();
        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const lineDistance = Math.hypot(point.x - other.x, point.y - other.y);
          if (lineDistance < 110) {
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(154, 164, 172, ${(1 - lineDistance / 110) * 0.16})`;
            context.lineWidth = 0.6;
            context.stroke();
          }
        }
      });
      frame = requestAnimationFrame(draw);
    };
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }, { passive: true });
    hero.addEventListener("pointerleave", () => { pointer = { x: -1000, y: -1000 }; });
    window.addEventListener("resize", resize, { passive: true });
    resize();
    draw();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      else if (frame === 0) draw();
    });
  };

  const setupThreeScene = async () => {
    if (!visual || reduceMotion || window.matchMedia("(max-width: 700px), (pointer: coarse)").matches) return;
    try {
      const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js");
      const canvas = document.querySelector(".three-field");
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
      renderer.setSize(visual.clientWidth, visual.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, visual.clientWidth / visual.clientHeight, 0.1, 40);
      camera.position.z = 8;
      scene.add(new THREE.AmbientLight(0xe5e9ed, 2.1));
      const keyLight = new THREE.PointLight(0xffffff, 30, 14);
      keyLight.position.set(-2, 2, 3);
      scene.add(keyLight);
      const violetLight = new THREE.PointLight(0xb8a4ff, 14, 14);
      violetLight.position.set(3, -2, 1);
      scene.add(violetLight);

      const objects = [];
      const addObject = (geometry, color, x, y, z, scale = 1, wireframe = false) => {
        const material = new THREE.MeshStandardMaterial({
          color, emissive: color, emissiveIntensity: 0.06, metalness: 0.82, roughness: 0.2,
          transparent: true, opacity: wireframe ? 0.78 : 0.92,
          wireframe
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.scale.setScalar(scale);
        mesh.rotation.set(Math.random(), Math.random(), Math.random());
        scene.add(mesh);
        objects.push({ mesh, baseY: y, phase: Math.random() * Math.PI * 2 });
      };
      addObject(new THREE.IcosahedronGeometry(0.3, 1), 0xc8cdd2, -2.2, 1.45, -0.2, 1, true);
      addObject(new THREE.TorusGeometry(0.33, 0.016, 8, 56), 0xf0f2f3, 2.15, -1.55, 0.1, 1, false);
      addObject(new THREE.OctahedronGeometry(0.21, 0), 0xb8a4ff, 2.45, 1.48, -0.7, 1, true);
      addObject(new THREE.TorusKnotGeometry(0.15, 0.018, 48, 6, 2, 3), 0xc8cdd2, -2.25, -1.6, -0.4, 1, false);

      let pointerX = 0;
      let pointerY = 0;
      let tick = 0;
      const pointerMove = (event) => {
        const bounds = visual.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.5;
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.35;
      };
      visual.addEventListener("pointermove", pointerMove, { passive: true });
      let sceneVisible = true;
      let rendering = false;
      let animationFrame = 0;
      let lastFrame = 0;
      const render = (timestamp) => {
        if (!sceneVisible || document.hidden) {
          rendering = false;
          return;
        }
        if (timestamp - lastFrame < 33) {
          animationFrame = requestAnimationFrame(render);
          return;
        }
        lastFrame = timestamp;
        tick += 0.008 * (effectSpeed / 0.8);
        camera.position.x += (pointerX - camera.position.x * 0.08) * 0.018;
        camera.position.y += (-pointerY - camera.position.y * 0.08) * 0.018;
        camera.lookAt(0, 0, 0);
        objects.forEach(({ mesh, baseY, phase }, index) => {
          mesh.rotation.x += (0.0018 + index * 0.0002) * (effectSpeed / 0.8);
          mesh.rotation.y += (0.0023 + index * 0.0002) * (effectSpeed / 0.8);
          mesh.position.y = baseY + Math.sin(tick + phase) * 0.06;
        });
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(render);
      };
      const startRendering = () => {
        if (rendering || !sceneVisible || document.hidden) return;
        rendering = true;
        animationFrame = requestAnimationFrame(render);
      };
      const sceneObserver = new IntersectionObserver(([entry]) => {
        sceneVisible = entry.isIntersecting;
        if (sceneVisible) startRendering();
        else {
          cancelAnimationFrame(animationFrame);
          rendering = false;
        }
      }, { threshold: 0.01 });
      sceneObserver.observe(visual);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(animationFrame);
          rendering = false;
        } else startRendering();
      });
      const resize = () => {
        const width = visual.clientWidth;
        const height = visual.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      window.addEventListener("resize", resize, { passive: true });
      resize();
      startRendering();
    } catch {
      // The CSS geometry remains visible if WebGL or the Three.js module is unavailable.
      visual?.classList.add("webgl-fallback");
    }
  };

  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setupParticles();
        setupThreeScene();
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    if (hero) heroObserver.observe(hero);
  } else {
    setupParticles();
    setupThreeScene();
  }

  const commandLauncher = document.querySelector(".dock-launcher");
  const commandPanel = document.querySelector("#command-panel");
  const commandClose = document.querySelector(".command-close");
  const setCommandOpen = (open) => {
    if (!commandLauncher || !commandPanel) return;
    commandLauncher.setAttribute("aria-expanded", String(open));
    commandLauncher.setAttribute("aria-label", open ? "Close digital command center" : "Open digital command center");
    commandPanel.hidden = !open;
    if (open) commandPanel.querySelector("a")?.focus({ preventScroll: true });
    else commandLauncher.focus({ preventScroll: true });
  };
  commandLauncher?.addEventListener("click", () => setCommandOpen(commandLauncher.getAttribute("aria-expanded") !== "true"));
  commandClose?.addEventListener("click", () => setCommandOpen(false));
  commandPanel?.querySelectorAll(".command-links a").forEach((link) => link.addEventListener("click", () => setCommandOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && commandPanel && !commandPanel.hidden) setCommandOpen(false);
  });

  const particleControl = document.querySelector("#particle-control");
  const particleValue = document.querySelector("#particle-value");
  const updateRangeFill = (input) => {
    if (!input) return;
    const range = Number(input.max) - Number(input.min);
    const progress = range > 0 ? ((Number(input.value) - Number(input.min)) / range) * 100 : 0;
    input.style.setProperty("--range-progress", `${progress}%`);
  };
  [particleControl, document.querySelector("#motion-control")].forEach(updateRangeFill);
  particleControl?.addEventListener("input", () => {
    particleIntensity = Number(particleControl.value) / 100;
    if (particleValue) particleValue.value = `${particleControl.value}%`;
    updateRangeFill(particleControl);
    document.documentElement.style.setProperty("--particle-intensity", String(particleIntensity));
    rebuildParticles?.();
  });
  const motionControl = document.querySelector("#motion-control");
  const motionValue = document.querySelector("#motion-value");
  motionControl?.addEventListener("input", () => {
    effectSpeed = Number(motionControl.value) / 100;
    if (motionValue) motionValue.value = `${motionControl.value}%`;
    updateRangeFill(motionControl);
    document.documentElement.style.setProperty("--effect-speed", String(effectSpeed));
    document.documentElement.style.setProperty("--lab-float-duration", `${(10 / effectSpeed).toFixed(2)}s`);
    document.documentElement.style.setProperty("--lab-morph-duration", `${(15 / effectSpeed).toFixed(2)}s`);
    document.documentElement.style.setProperty("--lab-fast-duration", `${(5 / effectSpeed).toFixed(2)}s`);
    document.documentElement.style.setProperty("--reactor-bar-duration", `${(0.48 / effectSpeed).toFixed(2)}s`);
  });

  const journeyContent = {
    education: ["01", "Education", "12th pass, as listed in the about section."],
    practice: ["02", "Frontend development", "Two years building modern, interactive and responsive digital experiences."],
    now: ["03", "Ongoing practice", "Learning by building, one experience at a time."]
  };
  const journeyPanel = document.querySelector("#journey-detail");
  document.querySelectorAll("[data-journey]").forEach((tab, index, tabs) => {
    tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    const activate = () => {
      const item = journeyContent[tab.dataset.journey];
      if (!item || !journeyPanel) return;
      tabs.forEach((other) => {
        const active = other === tab;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-selected", String(active));
        other.tabIndex = active ? 0 : -1;
      });
      journeyPanel.innerHTML = `<span class="journey-detail__index">CHECKPOINT / ${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p>`;
      journeyPanel.animate?.([{ opacity: 0, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: reduceMotion ? 1 : 240, easing: "ease-out" });
    };
    tab.addEventListener("click", activate);
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = tabs[(index + 1) % tabs.length];
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (event.key === "Home") next = tabs[0];
      else if (event.key === "End") next = tabs[tabs.length - 1];
      if (!next) return;
      event.preventDefault();
      next.focus();
      next.click();
    });
  });

  const labStage = document.querySelector(".lab-stage");
  const labObject = document.querySelector(".lab-object");
  const labCore = document.querySelector(".lab-object__core");
  const labWrap = document.querySelector(".lab-object-wrap");
  const labShadow = document.querySelector(".lab-object-shadow");
  const labSceneLabel = document.querySelector(".lab-scene-label");
  const labCaption = document.querySelector(".lab-stage-caption");
  let labRotationX = 0;
  let labRotationY = 0;
  let labOffsetX = 0;
  let labOffsetY = 0;
  let labDrag = null;
  const applyLabRotation = () => {
    labStage?.style.setProperty("--lab-drag-x", `${labRotationX}deg`);
    labStage?.style.setProperty("--lab-drag-y", `${labRotationY}deg`);
    labStage?.style.setProperty("--lab-offset-x", `${labOffsetX}px`);
    labStage?.style.setProperty("--lab-offset-y", `${labOffsetY}px`);
    labStage?.style.setProperty("--lab-shadow-x", `${(labOffsetX * 0.22).toFixed(1)}px`);
    labStage?.style.setProperty("--lab-shadow-y", `${(labOffsetY * 0.1).toFixed(1)}px`);
    labShadow?.style.setProperty("--shadow-scale", `${Math.max(0.68, 1 - Math.abs(labOffsetY) * 0.0018 - Math.abs(labRotationX) * 0.001).toFixed(3)}`);
    labShadow?.style.setProperty("--shadow-opacity", `${Math.max(0.4, 0.82 - Math.abs(labOffsetY) * 0.002).toFixed(3)}`);
  };
  applyLabRotation();

  document.querySelectorAll("[data-shape-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const shape = button.dataset.shapeChoice;
      if (!labStage || !labObject || !shape) return;
      labStage.dataset.shape = shape;
      labObject.dataset.shape = shape;
      document.querySelectorAll("[data-shape-choice]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
  document.querySelectorAll("[data-material-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const material = button.dataset.materialChoice;
      if (!labStage || !material) return;
      labStage.dataset.material = material;
      document.querySelectorAll("[data-material-choice]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
  const galleryCopy = {
    orbit: ["ORBITAL STUDY", "A study in reflected light and slow motion."],
    caustic: ["CAUSTIC STUDY", "A softer field of refracted color and light."],
    portal: ["PORTAL STUDY", "A quiet threshold built from rings and depth."]
  };
  document.querySelectorAll("[data-gallery-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const gallery = button.dataset.galleryChoice;
      if (!labStage || !gallery) return;
      labStage.dataset.gallery = gallery;
      if (labSceneLabel) labSceneLabel.textContent = galleryCopy[gallery][0];
      if (labCaption) labCaption.textContent = galleryCopy[gallery][1];
      document.querySelectorAll("[data-gallery-choice]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
  labWrap?.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    labDrag = { id: event.pointerId, x: event.clientX, y: event.clientY, move: event.shiftKey };
    labWrap.setPointerCapture?.(event.pointerId);
  });
  labWrap?.addEventListener("pointermove", (event) => {
    if (labCore) {
      const bounds = labCore.getBoundingClientRect();
      const lightX = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
      const lightY = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
      labCore.style.setProperty("--core-light-x", `${lightX.toFixed(1)}%`);
      labCore.style.setProperty("--core-light-y", `${lightY.toFixed(1)}%`);
    }
    if (!labDrag || labDrag.id !== event.pointerId) return;
    const dx = event.clientX - labDrag.x;
    const dy = event.clientY - labDrag.y;
    if (labDrag.move) {
      labOffsetX = Math.max(-110, Math.min(110, labOffsetX + dx));
      labOffsetY = Math.max(-85, Math.min(85, labOffsetY + dy));
    } else {
      labRotationY += dx * 0.52;
      labRotationX = Math.max(-68, Math.min(68, labRotationX - dy * 0.42));
    }
    labDrag.x = event.clientX;
    labDrag.y = event.clientY;
    applyLabRotation();
  });
  labWrap?.addEventListener("pointerleave", () => {
    if (labDrag) return;
    labCore?.style.setProperty("--core-light-x", "28%");
    labCore?.style.setProperty("--core-light-y", "22%");
  });
  const stopLabDrag = (event) => {
    if (labDrag?.id === event.pointerId) labDrag = null;
  };
  labWrap?.addEventListener("pointerup", stopLabDrag);
  labWrap?.addEventListener("pointercancel", stopLabDrag);
  labWrap?.addEventListener("lostpointercapture", stopLabDrag);
  labWrap?.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 18 : 12;
    if (event.shiftKey && event.key === "ArrowLeft") labOffsetX = Math.max(-110, labOffsetX - step);
    else if (event.shiftKey && event.key === "ArrowRight") labOffsetX = Math.min(110, labOffsetX + step);
    else if (event.shiftKey && event.key === "ArrowUp") labOffsetY = Math.max(-85, labOffsetY - step);
    else if (event.shiftKey && event.key === "ArrowDown") labOffsetY = Math.min(85, labOffsetY + step);
    else if (event.key === "ArrowLeft") labRotationY -= step;
    else if (event.key === "ArrowRight") labRotationY += step;
    else if (event.key === "ArrowUp") labRotationX = Math.max(-68, labRotationX - step);
    else if (event.key === "ArrowDown") labRotationX = Math.min(68, labRotationX + step);
    else return;
    event.preventDefault();
    applyLabRotation();
  });
  document.querySelector(".lab-reset")?.addEventListener("click", () => {
    labRotationX = 0;
    labRotationY = 0;
    labOffsetX = 0;
    labOffsetY = 0;
    applyLabRotation();
  });

  const reactorButton = document.querySelector(".sound-reactor");
  const reactorCanvas = document.querySelector(".sound-reactor-canvas");
  const reactorContext = reactorCanvas?.getContext("2d", { alpha: true });
  let reactorFrame = 0;
  let reactorStart = 0;
  const resizeReactor = () => {
    if (!reactorCanvas || !reactorContext) return;
    const bounds = reactorCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    reactorCanvas.width = Math.max(1, Math.round(bounds.width * dpr));
    reactorCanvas.height = Math.max(1, Math.round(bounds.height * dpr));
    reactorContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const drawReactor = (timestamp = performance.now()) => {
    if (!reactorCanvas || !reactorContext) return;
    const width = reactorCanvas.clientWidth;
    const height = reactorCanvas.clientHeight;
    reactorContext.clearRect(0, 0, width, height);
    if (!reactorStart) reactorStart = timestamp;
    const elapsed = (timestamp - reactorStart) * 0.001 * effectSpeed;
    [0, 1, 2].forEach((wave) => {
      reactorContext.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const envelope = Math.sin((x / width) * Math.PI) * (9 - wave * 1.6);
        const y = height / 2 + Math.sin(x * (0.034 + wave * 0.008) + elapsed * (2.1 + wave * 0.65) + wave * 1.4) * envelope + Math.cos(x * 0.013 - elapsed * 1.1) * 4;
        if (x === 0) reactorContext.moveTo(x, y);
        else reactorContext.lineTo(x, y);
      }
      reactorContext.strokeStyle = ["rgba(167,184,61,.58)", "rgba(164,151,215,.38)", "rgba(139,151,159,.27)"][wave];
      reactorContext.lineWidth = wave === 0 ? 1.7 : 1;
      reactorContext.stroke();
    });
    if (!reduceMotion && reactorButton?.getAttribute("aria-pressed") === "true") reactorFrame = requestAnimationFrame(drawReactor);
  };
  reactorButton?.addEventListener("click", () => {
    const enabled = reactorButton.getAttribute("aria-pressed") !== "true";
    reactorButton.setAttribute("aria-pressed", String(enabled));
    reactorButton.querySelector("b").textContent = enabled ? "ON" : "OFF";
    reactorButton.querySelector("span:nth-child(2)").textContent = enabled ? "Visual sound reactor is awake" : "Wake the visual sound reactor";
    labStage?.classList.toggle("is-reactor-on", enabled);
    reactorCanvas?.classList.toggle("is-visible", enabled);
    if (enabled) setCommandOpen(false);
    cancelAnimationFrame(reactorFrame);
    if (enabled) {
      resizeReactor();
      reactorStart = 0;
      drawReactor(reduceMotion ? 0 : performance.now());
    } else if (reactorContext && reactorCanvas) {
      reactorContext.clearRect(0, 0, reactorCanvas.width, reactorCanvas.height);
    }
  });
  window.addEventListener("resize", () => {
    if (reactorButton?.getAttribute("aria-pressed") === "true") {
      cancelAnimationFrame(reactorFrame);
      resizeReactor();
      drawReactor();
    }
  }, { passive: true });

  const guideDialog = document.querySelector(".guide-dialog");
  const openGuide = () => {
    setCommandOpen(false);
    if (guideDialog?.showModal) guideDialog.showModal();
    else if (guideDialog) guideDialog.setAttribute("open", "");
    window.setTimeout(() => document.querySelector("#guide-input")?.focus(), 0);
  };
  document.querySelector(".guide-launch")?.addEventListener("click", openGuide);
  document.querySelectorAll(".guide-dialog .dialog-close").forEach((button) => button.addEventListener("click", () => guideDialog?.close?.()));
  guideDialog?.addEventListener("click", (event) => {
    if (event.target === guideDialog) guideDialog.close?.();
  });
  const guideMessages = document.querySelector(".guide-messages");
  const guideForm = document.querySelector(".guide-form");
  const guideInput = document.querySelector("#guide-input");
  const portfolioAnswers = [
    { match: /zezomart|project|e-?commerce/i, answer: "ZezoMart is the live e-commerce project featured here. You can explore its preview in the Work section or open the live site in a new tab." },
    { match: /technolog|toolkit|skill|stack/i, answer: "The toolkit listed on this page includes HTML5, CSS3, JavaScript, React.js, Next.js, TypeScript, Tailwind CSS, REST APIs, Git, and GitHub." },
    { match: /lab|shape|sculpt|scene|dimension/i, answer: "In the Dimension Lab, drag the sculpture to rotate it. The controls change its form, finish, and scene; the command center adjusts particle intensity and motion tempo." },
    { match: /about|who|ashok|experience/i, answer: "This portfolio introduces ASHU JANGID as a creative frontend developer with two years of experience building modern, interactive, responsive digital experiences." },
    { match: /contact|message|email/i, answer: "Use the contact form in the Get in Touch section to prepare a message addressed to ashokjangid023@gmail.com. Review it in your email app and send it there." }
  ];
  const answerFromPortfolio = (question) => portfolioAnswers.find(({ match }) => match.test(question))?.answer || "I can answer questions about ZezoMart, the listed toolkit, Ashok’s introduction, the interactive lab, and the contact form. Try one of those topics.";
  const askGuide = (question) => {
    if (!guideMessages || !question.trim()) return;
    const userBubble = document.createElement("p");
    userBubble.className = "guide-message guide-message--user";
    userBubble.textContent = question.trim();
    guideMessages.append(userBubble);
    const answerBubble = document.createElement("p");
    answerBubble.className = "guide-message guide-message--assistant guide-message--typing";
    answerBubble.setAttribute("aria-label", "Portfolio guide is preparing an answer");
    guideMessages.append(answerBubble);
    guideMessages.scrollTop = guideMessages.scrollHeight;
    window.setTimeout(() => {
      const answer = answerFromPortfolio(question);
      answerBubble.classList.remove("guide-message--typing");
      answerBubble.removeAttribute("aria-label");
      let index = 0;
      const reveal = () => {
        index = Math.min(answer.length, index + 4);
        answerBubble.textContent = answer.slice(0, index);
        guideMessages.scrollTop = guideMessages.scrollHeight;
        if (index < answer.length && !reduceMotion) window.setTimeout(reveal, 16);
      };
      reveal();
    }, reduceMotion ? 0 : 280);
  };
  guideForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!guideInput?.value.trim()) return;
    askGuide(guideInput.value);
    guideInput.value = "";
  });
  document.querySelectorAll(".guide-suggestions [data-question]").forEach((button) => button.addEventListener("click", () => askGuide(button.dataset.question || "")));

  const skillDetails = {
    HTML5: "Semantic page structure and accessible content are the foundation of the toolkit.",
    CSS3: "Responsive layouts, visual systems, and interface motion bring the presentation to life.",
    JavaScript: "Interaction and browser behavior make the experience respond to its visitor.",
    "React.js": "A component based library for building interactive user interfaces.",
    "Next.js": "A React framework for building full stack web applications.",
    TypeScript: "Typed JavaScript that helps describe data and catch mistakes while building.",
    "Tailwind CSS": "A utility first CSS framework for composing interface styles.",
    "REST APIs": "HTTP interfaces that let applications exchange structured data.",
    Git: "Version control for tracking and managing changes to code.",
    GitHub: "A place to host repositories and collaborate on software projects."
  };
  const skillDialog = document.querySelector(".skill-dialog");
  const skillDialogTitle = document.querySelector("#skill-dialog-title");
  const skillDialogCopy = document.querySelector("#skill-dialog-copy");
  document.querySelectorAll(".skill-card").forEach((card) => {
    const technology = card.querySelector("h3")?.textContent.trim() || "Technology";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `Learn about ${technology}`);
    const openSkill = () => {
      if (skillDialogTitle) skillDialogTitle.textContent = technology;
      if (skillDialogCopy) skillDialogCopy.textContent = skillDetails[technology] || "A technology in the portfolio toolkit.";
      const index = card.querySelector(".skill-index")?.textContent.slice(0, 2) || "00";
      const skillIndex = document.querySelector(".skill-dialog__index b");
      if (skillIndex) skillIndex.textContent = index;
      if (skillDialog?.showModal) skillDialog.showModal();
      else skillDialog?.setAttribute("open", "");
    };
    card.addEventListener("click", openSkill);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSkill();
      }
    });
  });
  document.querySelectorAll(".skill-dialog .dialog-close").forEach((button) => button.addEventListener("click", () => skillDialog?.close?.()));
  skillDialog?.addEventListener("click", (event) => {
    if (event.target === skillDialog) skillDialog.close?.();
  });

  let secretClicks = 0;
  let secretTimer = 0;
  document.querySelectorAll(".wordmark").forEach((mark) => {
    mark.addEventListener("click", (event) => {
      secretClicks += 1;
      window.clearTimeout(secretTimer);
      secretTimer = window.setTimeout(() => { secretClicks = 0; }, 1100);
      if (secretClicks === 3 && labStage) {
        event.preventDefault();
        secretClicks = 0;
        const portalButton = document.querySelector('[data-gallery-choice="portal"]');
        portalButton?.click();
        labStage.classList.add("is-secret-open");
        document.querySelector("#lab")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        if (labCaption) labCaption.textContent = "Hidden door found. The portal study is yours to explore.";
        window.setTimeout(() => labStage.classList.remove("is-secret-open"), 4200);
      }
    });
  });

  const form = document.querySelector("#contact-form");
  const feedback = document.querySelector("#form-feedback");
  const fields = [...(form?.querySelectorAll("input, textarea") || [])];
  const recipient = "ashokjangid023@gmail.com";

  const validateField = (field) => {
    const valid = field.checkValidity();
    field.setAttribute("aria-invalid", String(!valid));
    if (!valid && field.dataset.touched === "true") {
      field.setCustomValidity("");
    }
    return valid;
  };
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      field.dataset.touched = "true";
      validateField(field);
    });
    field.addEventListener("input", () => {
      if (field.dataset.touched === "true") validateField(field);
      feedback?.classList.remove("is-error", "is-success");
      if (feedback) feedback.textContent = "All fields are required. A valid email helps me reply.";
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = fields.map((field) => {
      field.dataset.touched = "true";
      return validateField(field);
    }).every(Boolean);
    if (!valid) {
      feedback?.classList.add("is-error");
      feedback?.classList.remove("is-success");
      if (feedback) feedback.textContent = "Please check your name, email and message before sending.";
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    if (!recipient) {
      feedback?.classList.add("is-error");
      feedback?.classList.remove("is-success");
      if (feedback) feedback.textContent = "The recipient address is not configured, so your message has not been sent.";
      return;
    }

    const values = new FormData(form);
    const subject = encodeURIComponent(`Portfolio message from ${values.get("name")}`);
    const body = encodeURIComponent(`Name: ${values.get("name")}\nEmail: ${values.get("email")}\n\n${values.get("message")}`);
    const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    feedback?.classList.remove("is-error");
    feedback?.classList.add("is-success");
    if (feedback) feedback.textContent = "Your email app is ready with the message. Review it and press send.";
  });
})();
