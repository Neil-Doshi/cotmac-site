(function () {
  const header = document.querySelector('[data-site-header]');
  const nav = document.querySelector('[data-site-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const dropdownParents = Array.from(document.querySelectorAll('.nav-item.has-dropdown'));
  const isPanelShopPage = window.location.pathname.toLowerCase().endsWith('panel-shop.html');
  const panelShopTargets = [
    ['overview', 'Panel Shop Overview', 'Built right. Delivered on time.'],
    ['capabilities', 'UL 508A & UL 891', 'Certified manufacturing capability'],
    ['testing', 'Testing & Quality', 'Point-to-point and powered testing'],
    ['process', 'Manufacturing Process', 'From quote to shipment'],
    ['about-shop', 'About Panel Shop', 'How the shop supports project delivery'],
    ['team', 'Meet the Team', 'The people behind the build quality']
  ];

  function handleScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  document.querySelectorAll('.brand-mark').forEach((item) => {
    if (!item.querySelector('.brand-logo')) {
      item.innerHTML = '<img class="brand-logo" src="assets/images/cotmac-logo-clean.png" alt="Cotmac logo" />';
    }
  });

  function closeDropdowns(exceptItem) {
    dropdownParents.forEach((item) => {
      if (item === exceptItem) return;
      item.classList.remove('open');
      const button = item.querySelector('.nav-subtoggle');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  }

  function ensurePanelShopLinks(dropdown) {
    if (!dropdown) return;

    panelShopTargets.forEach(([target, title, copy]) => {
      const href = isPanelShopPage ? `#${target}` : `panel-shop.html#${target}`;
      let link = Array.from(dropdown.querySelectorAll('a')).find((item) => {
        const value = item.getAttribute('href');
        return value === href || value === `#${target}` || value === `panel-shop.html#${target}`;
      });

      if (!link) {
        link = document.createElement('a');
        dropdown.appendChild(link);
      }

      link.setAttribute('href', href);
      link.innerHTML = `${title}<span>${copy}</span>`;
    });
  }

  dropdownParents.forEach((item) => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');

    if (!link || !dropdown) return;

    if (link.getAttribute('href') === 'panel-shop.html') {
      ensurePanelShopLinks(dropdown);
    }

    if (!item.querySelector('.nav-subtoggle')) {
      const button = document.createElement('button');
      button.className = 'nav-subtoggle';
      button.type = 'button';
      button.setAttribute('aria-label', `Toggle ${link.textContent.trim()} menu`);
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = '<span></span>';
      link.insertAdjacentElement('afterend', button);
    }

    const button = item.querySelector('.nav-subtoggle');

    link.addEventListener('click', function (event) {
      if (!window.matchMedia('(max-width: 1024px)').matches) return;
      if (item.classList.contains('open')) return;

      event.preventDefault();
      closeDropdowns(item);
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    });

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      const willOpen = !item.classList.contains('open');
      closeDropdowns(item);
      item.classList.toggle('open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });

    item.addEventListener('mouseleave', function () {
      if (window.innerWidth > 1024) {
        item.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      }
    });
  });

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) closeDropdowns();
    });
  }

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.site-header')) {
      closeDropdowns();
      if (nav) nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 1024px)').matches) {
        closeDropdowns();
        if (nav) nav.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = (index % 6) * 60 + 'ms';
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
})();
