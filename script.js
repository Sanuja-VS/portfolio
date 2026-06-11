document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const revealEls = document.querySelectorAll(".reveal");
  const backToTop = document.querySelector(".floating-top");
  const cursorGlow = document.querySelector(".cursor-glow");
  const typedRole = document.getElementById("typed-role");

  const phrases = [
    "responsive web interfaces",
    "clean UI design",
    "modern frontend experiences"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  // Typewriter effect used in the hero subtitle.
  const typeLoop = () => {
    if (!typedRole) return;

    const phrase = phrases[phraseIndex];
    typedRole.textContent = phrase.slice(0, charIndex);

    if (!deleting) {
      charIndex += 1;
      if (charIndex > phrase.length) {
        deleting = true;
        setTimeout(typeLoop, 1100);
        return;
      }
    } else {
      charIndex -= 1;
      if (charIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
      }
    }

    setTimeout(typeLoop, deleting ? 48 : 72);
  };

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => closeNav());
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealEls.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    revealObserver.observe(el);
  });

  // Keep the active navigation state synced with the section in view.
  const sectionIds = ["home", "about", "skills", "projects", "education", "contact"];
  const sectionMap = new Map(
    sectionIds.map((id) => [id, document.getElementById(id)]).filter((pair) => pair[1])
  );

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { threshold: 0.55, rootMargin: "-10% 0px -35% 0px" }
  );

  sectionMap.forEach((section) => navObserver.observe(section));

  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 450);
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    // Lightweight cursor glow for desktop devices only.
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let targetX = x;
    let targetY = y;
    let rafId = 0;

    const animateCursor = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      cursorGlow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorGlow.classList.add("is-active");
      cursorGlow.style.opacity = "1";
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      cursorGlow.classList.remove("is-active");
      cursorGlow.style.opacity = "0";
    });

    animateCursor();
    window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
  }

  window.addEventListener("load", () => {
    if (loader) {
      loader.classList.add("is-hidden");
      setTimeout(() => loader.remove(), 500);
    }
    typeLoop();
  }, { once: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const projectCards = document.querySelectorAll(".project-card, .skill-card, .contact-card");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => card.style.willChange = "transform");
    card.addEventListener("mouseleave", () => card.style.willChange = "auto");
  });
});
