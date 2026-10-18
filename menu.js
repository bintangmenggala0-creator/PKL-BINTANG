const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
    }
    const closeBtn = nav.querySelector('.nav-close');
    const setOpen = (open) => {
        nav.classList.toggle('is-open', open);
        overlay.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
        overlay.setAttribute('aria-hidden', String(!open));
    };
    toggle.addEventListener('click', () => {
        setOpen(!nav.classList.contains('is-open'));
    });
    if (closeBtn) {
        closeBtn.addEventListener('click', () => setOpen(false));
    }
    overlay.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });
}
