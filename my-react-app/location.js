(() => {
  const section = document.querySelector("#location");
  const canvas = section?.querySelector(".location-globe");
  const fallback = section?.querySelector(".location-map-fallback");
  const scene = section?.querySelector(".location-explorer");
  if (!section || !canvas || !fallback || !scene) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileView = window.matchMedia("(max-width: 700px)");
  const coords = { lat: 24.75361, lon: 71.77139 };
  const india = [
    [74.6, 35.3], [76.5, 34.5], [77.8, 32.6], [79.2, 31.3], [80.2, 29.8], [82.8, 29.4], [85.2, 28.3], [88.1, 27.9], [89.8, 26.7],
    [92.4, 26.8], [94.2, 25.2], [94.5, 23.1], [92.8, 22.1], [91.5, 23.1], [89.8, 22.2], [88.1, 21.8], [87.2, 21.5], [86.4, 20.2],
    [85.2, 19.3], [84.8, 17.7], [83.8, 16.4], [82.4, 15.1], [81.1, 13.5], [80.3, 11.8], [79.7, 10.1], [78.3, 8.4], [77.2, 8.1],
    [76.4, 9.8], [75.8, 11.4], [75.2, 13.5], [74.1, 15.1], [73.6, 17.1], [72.9, 18.7], [72.6, 20.2], [70.8, 21.5], [69.6, 22.3],
    [68.2, 23.6], [68.6, 24.5], [69.7, 24.8], [70.2, 26.1], [69.5, 27.1], [70.5, 28.1], [71.6, 28.4], [72.2, 29.5], [73.7, 30.1],
    [74.8, 31.5], [74.6, 33.1]
  ];
  const rajasthan = [
    [73.9, 29.9], [74.7, 29.7], [75.1, 29.2], [75.7, 28.8], [76.2, 28.2], [76.3, 27.5], [77.2, 27.1], [77.1, 26.5], [76.9, 25.7],
    [76.4, 25.3], [76.5, 24.6], [75.9, 24.1], [75.6, 23.4], [74.9, 23.1], [74.3, 23.4], [73.5, 23.2], [72.8, 23.6], [72.2, 23.9],
    [71.4, 24.3], [70.8, 25], [70.9, 25.7], [70.5, 26.4], [70.7, 27.3], [70.6, 28.2], [71.2, 28.6], [72, 29.1], [72.6, 29.6], [73.4, 29.8]
  ];
  const land = [
    [[-168, 65], [-150, 70], [-134, 59], [-127, 50], [-124, 42], [-117, 33], [-109, 27], [-103, 20], [-96, 18], [-90, 20], [-85, 25], [-81, 25], [-80, 32], [-75, 36], [-71, 42], [-67, 47], [-59, 52], [-61, 59], [-75, 62], [-83, 68], [-98, 72], [-116, 76], [-137, 72], [-153, 72]],
    [[-81, 12], [-74, 10], [-68, 6], [-62, 3], [-50, 1], [-47, -7], [-51, -16], [-54, -24], [-59, -34], [-66, -46], [-72, -54], [-76, -42], [-78, -29], [-80, -14]],
    [[-11, 72], [5, 71], [22, 68], [37, 60], [51, 55], [61, 49], [72, 48], [83, 53], [96, 55], [108, 51], [122, 53], [137, 48], [151, 59], [166, 60], [178, 53], [168, 44], [156, 40], [145, 44], [135, 35], [128, 31], [121, 22], [112, 18], [107, 9], [99, 8], [96, 17], [90, 21], [87, 22], [82, 8], [79, 9], [76, 20], [69, 24], [63, 29], [56, 26], [50, 30], [45, 39], [38, 44], [31, 46], [25, 42], [18, 40], [12, 44], [6, 44], [0, 50], [-7, 55]],
    [[-17, 36], [-5, 37], [10, 34], [22, 32], [33, 30], [41, 18], [50, 11], [49, 2], [43, -11], [40, -19], [32, -29], [22, -35], [17, -28], [12, -18], [9, -7], [4, 4], [-2, 6], [-7, 14], [-13, 22]],
    [[112, -11], [127, -12], [141, -17], [153, -25], [150, -38], [137, -43], [124, -34], [115, -26]],
    [[-52, 60], [-43, 60], [-39, 67], [-44, 82], [-54, 84], [-61, 77], [-60, 68]]
  ];

  const polygonPath = (points) => points.map(([lon, lat], index) => {
    const x = (lon - 66) / 27 * 800;
    const y = (37 - lat) / 19 * 480;
    return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + "Z";
  fallback.querySelector(".map-india-shape")?.setAttribute("d", polygonPath(india));
  fallback.querySelector(".map-rajasthan-shape")?.setAttribute("d", polygonPath(rajasthan));
  const cityX = (coords.lon - 66) / 27 * 800;
  const cityY = (37 - coords.lat) / 19 * 480;
  fallback.querySelector(".map-city-marker")?.setAttribute("transform", `translate(${cityX.toFixed(1)} ${cityY.toFixed(1)})`);
  fallback.querySelector(".map-city-leader")?.setAttribute("d", `M${(cityX + 8).toFixed(1)} ${(cityY - 5).toFixed(1)} L${(cityX + 58).toFixed(1)} ${(cityY - 39).toFixed(1)}`);
  const fallbackLabel = fallback.querySelector(".map-city-label");
  fallbackLabel?.setAttribute("transform", `translate(${(cityX + 65).toFixed(1)} ${(cityY - 42).toFixed(1)})`);

  const context = canvas.getContext("2d", { alpha: true });
  let fallbackActive = !context || mobileView.matches;
  let visible = false;
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let dragging = false;
  let dragPoint = null;
  let hasEntered = false;
  let camera = { lat: 20.5, lon: 78.5, zoom: 0.94 };
  let target = { lat: coords.lat, lon: coords.lon, zoom: 1.14 };
  let flight = null;
  const pointerFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const companions = section.querySelector(".location-companions");
  const characterToggle = section.querySelector(".location-character-toggle");
  const characterMessage = section.querySelector(".character-message");
  const nova = section.querySelector(".nova-character");
  const pixel = section.querySelector(".pixel-character");
  const reactionCounts = { nova: 0, pixel: 0 };
  const reactionTimers = new WeakMap();

  function setCharacterMessage(message, react = false) {
    if (characterMessage) characterMessage.textContent = message;
    nova?.classList.toggle("nova-character--react", react);
  }

  function reactToCharacter(character) {
    const isNova = character === nova;
    const characterKey = isNova ? "nova" : "pixel";
    const reactions = isNova
      ? [
          ["NOVA: Coordinates locked. Welcome to Sanchore.", "is-greeting"],
          ["NOVA: You found the marker. Nice work.", "is-curious"],
          ["NOVA: Ready when you are.", "is-delighted"]
        ]
      : [
          ["PIXEL found the bright spot. That's home!", "is-spark"],
          ["PIXEL spotted a little more light.", "is-curious"],
          ["PIXEL says: one more orbit!", "is-dance"]
        ];
    const [message, mood] = reactions[reactionCounts[characterKey] % reactions.length];
    reactionCounts[characterKey] += 1;
    setCharacterMessage(message, true);
    ["is-excited", "is-greeting", "is-curious", "is-delighted", "is-spark", "is-dance"].forEach((state) => character?.classList.remove(state));
    requestAnimationFrame(() => {
      character?.classList.add("is-excited", mood);
    });
    window.clearTimeout(reactionTimers.get(character));
    reactionTimers.set(character, window.setTimeout(() => {
      character?.classList.remove("is-excited", mood);
    }, 1500));
  }

  [nova, pixel].forEach((character) => {
    character?.addEventListener("click", () => reactToCharacter(character));
    character?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        reactToCharacter(character);
      }
    });
  });

  characterToggle?.addEventListener("click", () => {
    const show = characterToggle.getAttribute("aria-pressed") !== "true";
    characterToggle.setAttribute("aria-pressed", String(show));
    characterToggle.querySelector("i")?.classList.toggle("is-off", !show);
    characterToggle.querySelector("span").textContent = show ? "HIDE COMPANIONS" : "SHOW COMPANIONS";
    companions?.classList.toggle("is-hidden", !show);
    companions?.setAttribute("aria-hidden", String(!show));
    [nova, pixel].forEach((character) => {
      if (character) character.tabIndex = show ? 0 : -1;
    });
  });

  if (pointerFine) {
    [nova, pixel].forEach((character) => {
      character?.addEventListener("pointerenter", () => character.classList.add("is-watching"));
      character?.addEventListener("pointerleave", () => character.classList.remove("is-watching"));
    });
    scene.addEventListener("pointermove", (event) => {
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      nova?.style.setProperty("--look-x", `${x * 4}px`);
      nova?.style.setProperty("--look-y", `${y * 2}px`);
      pixel?.style.setProperty("--follow-x", `${x * 15}px`);
      pixel?.style.setProperty("--follow-y", `${y * 7}px`);
    }, { passive: true });
    scene.addEventListener("pointerleave", () => {
      nova?.style.setProperty("--look-x", "0px");
      nova?.style.setProperty("--look-y", "0px");
      pixel?.style.setProperty("--follow-x", "0px");
      pixel?.style.setProperty("--follow-y", "0px");
    }, { passive: true });
    canvas.addEventListener("pointerenter", () => setCharacterMessage("The world is big. Start where you are.", true));
    canvas.addEventListener("pointerleave", () => setCharacterMessage("Sanchore, Rajasthan — a small point on a very big world."));
  }

  function showFallback(active) {
    fallbackActive = active;
    canvas.hidden = active;
    fallback.classList.toggle("is-visible", active);
    scene.classList.toggle("is-2d-fallback", active);
    if (active && frame) cancelAnimationFrame(frame);
    if (!active && visible) requestDraw();
  }

  function resize() {
    showFallback(mobileView.matches || !context);
    if (fallbackActive) return;
    const bounds = scene.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    requestDraw();
  }

  function easeCamera() {
    if (flight) {
      const progress = Math.min(1, (performance.now() - flight.started) / flight.duration);
      const eased = progress * progress * (3 - 2 * progress);
      target.lat = flight.from.lat + (flight.to.lat - flight.from.lat) * eased;
      target.lon = flight.from.lon + (flight.to.lon - flight.from.lon) * eased;
      target.zoom = flight.from.zoom + (flight.to.zoom - flight.from.zoom) * eased;
      if (progress === 1) flight = null;
    }
    if (reduceMotion.matches) {
      camera = { ...target };
      return;
    }
    camera.lat += (target.lat - camera.lat) * 0.075;
    let lonDelta = target.lon - camera.lon;
    lonDelta = ((lonDelta + 540) % 360) - 180;
    camera.lon += lonDelta * 0.075;
    camera.zoom += (target.zoom - camera.zoom) * 0.075;
  }

  function projection(lon, lat, cx, cy, radius) {
    const radians = Math.PI / 180;
    const phi = lat * radians;
    const phi0 = camera.lat * radians;
    const delta = (lon - camera.lon) * radians;
    const depth = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(delta);
    return {
      x: cx + radius * Math.cos(phi) * Math.sin(delta),
      y: cy - radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(delta)),
      depth
    };
  }

  function traceGeoPath(points, cx, cy, radius, closeSegments = true) {
    let open = false;
    context.beginPath();
    points.forEach(([lon, lat]) => {
      const point = projection(lon, lat, cx, cy, radius);
      if (point.depth > -0.04) {
        if (!open) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
        open = true;
      } else {
        if (open && closeSegments) context.closePath();
        open = false;
      }
    });
    if (open && closeSegments) context.closePath();
  }

  function drawGraticule(cx, cy, radius) {
    context.lineWidth = 0.7;
    context.strokeStyle = "rgba(115, 115, 115, .12)";
    for (let lat = -75; lat <= 75; lat += 15) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 4) points.push([lon, lat]);
      traceGeoPath(points, cx, cy, radius, false);
      context.stroke();
    }
    for (let lon = -180; lon < 180; lon += 20) {
      const points = [];
      for (let lat = -88; lat <= 88; lat += 3) points.push([lon, lat]);
      traceGeoPath(points, cx, cy, radius, false);
      context.stroke();
    }
  }

  function drawLand(cx, cy, radius) {
    land.forEach((points) => {
      traceGeoPath(points, cx, cy, radius);
      context.fillStyle = "rgba(200, 205, 210, .48)";
      context.fill();
      context.strokeStyle = "rgba(115, 115, 115, .22)";
      context.lineWidth = 0.8;
      context.stroke();
    });
    traceGeoPath(india, cx, cy, radius);
    context.fillStyle = "rgba(200, 205, 210, .74)";
    context.fill();
    context.strokeStyle = "rgba(115, 115, 115, .52)";
    context.lineWidth = 1.15;
    context.stroke();
    traceGeoPath(rajasthan, cx, cy, radius);
    context.fillStyle = "rgba(184, 164, 255, .36)";
    context.fill();
    context.strokeStyle = "rgba(130, 113, 202, .8)";
    context.lineWidth = 1.35;
    context.stroke();
  }

  function drawMarker(cx, cy, radius) {
    const point = projection(coords.lon, coords.lat, cx, cy, radius);
    if (point.depth <= 0) return;
    const pulse = reduceMotion.matches ? 0 : (Math.sin(elapsed * 2.2) + 1) / 2;
    const glow = context.createRadialGradient(point.x, point.y, 1, point.x, point.y, 24 + pulse * 10);
    glow.addColorStop(0, "rgba(215, 255, 0, .65)");
    glow.addColorStop(.26, "rgba(184, 164, 255, .24)");
    glow.addColorStop(1, "rgba(184, 164, 255, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(point.x, point.y, 34 + pulse * 8, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = `rgba(132, 155, 0, ${.48 - pulse * .2})`;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(point.x, point.y, 10 + pulse * 8, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = "#a8c600";
    context.shadowColor = "#d7ff00";
    context.shadowBlur = 14;
    context.beginPath();
    context.arc(point.x, point.y, 3.1, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
  }

  function drawGlobe() {
    if (!context || fallbackActive || !width || !height) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    easeCamera();
    const radius = Math.min(height * 0.43, width * 0.28) * camera.zoom;
    const cx = width * 0.69;
    const cy = height * 0.51;

    const aura = context.createRadialGradient(cx, cy, radius * .82, cx, cy, radius * 1.42);
    aura.addColorStop(0, "rgba(200, 205, 210, .22)");
    aura.addColorStop(.38, "rgba(184, 164, 255, .09)");
    aura.addColorStop(1, "rgba(184, 164, 255, 0)");
    context.fillStyle = aura;
    context.beginPath();
    context.arc(cx, cy, radius * 1.42, 0, Math.PI * 2);
    context.fill();

    const ocean = context.createRadialGradient(cx - radius * .35, cy - radius * .42, radius * .04, cx, cy, radius * 1.06);
    ocean.addColorStop(0, "#ffffff");
    ocean.addColorStop(.58, "#f1f3f5");
    ocean.addColorStop(1, "#dfe3e7");
    context.fillStyle = ocean;
    context.shadowColor = "rgba(115, 115, 115, .15)";
    context.shadowBlur = 28;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
    context.save();
    context.beginPath();
    context.arc(cx, cy, radius - .5, 0, Math.PI * 2);
    context.clip();
    drawGraticule(cx, cy, radius);
    drawLand(cx, cy, radius);
    drawMarker(cx, cy, radius);
    const shade = context.createRadialGradient(cx - radius * .5, cy - radius * .55, radius * .08, cx, cy, radius * 1.12);
    shade.addColorStop(0, "rgba(255, 255, 255, .4)");
    shade.addColorStop(.68, "rgba(115, 115, 115, 0)");
    shade.addColorStop(1, "rgba(115, 115, 115, .11)");
    context.fillStyle = shade;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
    context.strokeStyle = "rgba(115, 115, 115, .24)";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.stroke();

    elapsed += reduceMotion.matches ? 0 : 1 / 30;
  }

  function requestDraw(timestamp) {
    if (!visible || fallbackActive || frame) return;
    if (reduceMotion.matches) {
      drawGlobe();
      return;
    }
    frame = requestAnimationFrame((time) => {
      frame = 0;
      if (time - lastFrame < 32) {
        requestDraw(time);
        return;
      }
      lastFrame = time;
      drawGlobe();
      requestDraw(time);
    });
  }

  function focusSanchore(duration = 1500) {
    flight = {
      started: performance.now(), duration,
      from: { ...camera },
      to: { lat: coords.lat, lon: coords.lon, zoom: 1.14 }
    };
    target = { ...flight.to };
    if (reduceMotion.matches) {
      flight = null;
      camera = { ...target };
    }
    requestDraw();
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (fallbackActive) return;
    dragging = true;
    dragPoint = { x: event.clientX, y: event.clientY };
    flight = null;
    canvas.classList.add("is-dragging");
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!dragging || !dragPoint) return;
    const scale = Math.max(150, Math.min(height * .43, width * .28) * camera.zoom);
    target.lon -= (event.clientX - dragPoint.x) / scale * 35;
    target.lat += (event.clientY - dragPoint.y) / scale * 35;
    target.lat = Math.max(-78, Math.min(78, target.lat));
    camera.lon = target.lon;
    camera.lat = target.lat;
    dragPoint = { x: event.clientX, y: event.clientY };
    requestDraw();
  }, { passive: true });
  const stopDrag = () => {
    dragging = false;
    dragPoint = null;
    canvas.classList.remove("is-dragging");
  };
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);
  canvas.addEventListener("lostpointercapture", stopDrag);
  canvas.addEventListener("wheel", (event) => {
    if (fallbackActive) return;
    event.preventDefault();
    target.zoom = Math.max(.78, Math.min(1.52, target.zoom * (event.deltaY < 0 ? 1.07 : .93)));
    requestDraw();
  }, { passive: false });
  section.querySelector(".location-recenter")?.addEventListener("click", () => {
    focusSanchore();
    setCharacterMessage("Right here — Sanchore, Rajasthan.", true);
  });
  section.querySelector(".location-zoom-in")?.addEventListener("click", () => {
    target.zoom = Math.min(1.52, target.zoom + .1);
    requestDraw();
  });
  section.querySelector(".location-zoom-out")?.addEventListener("click", () => {
    target.zoom = Math.max(.78, target.zoom - .1);
    requestDraw();
  });

  const enterScene = (isVisible) => {
    visible = isVisible;
    if (!visible) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    if (!hasEntered && !fallbackActive) {
      hasEntered = true;
      if (reduceMotion.matches) {
        camera = { ...target };
      } else {
        flight = { started: performance.now(), duration: 2200, from: { ...camera }, to: { ...target } };
      }
    }
    requestDraw();
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => enterScene(entry.isIntersecting), { threshold: .08 });
    observer.observe(section);
  } else {
    enterScene(true);
  }

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(scene);
  } else {
    window.addEventListener("resize", resize, { passive: true });
  }
  mobileView.addEventListener("change", resize);
  reduceMotion.addEventListener?.("change", () => requestDraw());
  resize();
  if (pointerFine) canvas.style.cursor = "grab";
})();
