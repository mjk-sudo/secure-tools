/**
 * SecureTools — Shared Utilities
 */

const TOOLS = [
    { href: 'index.html', label: 'Dashboard' },
    { href: 'converter.html', label: 'Converter' },
    { href: 'urlencoder.html', label: 'Encoder' },
    { href: 'passwordstrength.html', label: 'Passwords' },
    { href: 'crytotools.html', label: 'Ciphers' },
    { href: 'md5hash.html', label: 'Hashing' },
    { href: 'rsa.html', label: 'RSA Suite' },
    { href: 'steganography.html', label: 'Steganography' },
];

document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    setupCharCounters();
    setupAudioListeners();
    initScrollReveal();
});

/* ── Scroll-Triggered Reveal (Intersection Observer) ── */
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
}

/* ── Header ── */
function injectHeader() {
    let header = document.querySelector('.header') || document.querySelector('header');
    const page = location.pathname.split('/').pop() || 'index.html';
    const audioOn = localStorage.getItem('st_audio') !== 'false';

    const links = TOOLS.map(t =>
        `<a href="${t.href}" class="${page === t.href ? 'active' : ''}">${t.label}</a>`
    ).join('');

    const html = `
        <a href="index.html" class="brand">
            <div class="brand-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
            </div>
            SecureTools
        </a>
        <nav class="menu">${links}</nav>
        <label class="audio-toggle-container">
            <input type="checkbox" id="audio-toggle" ${audioOn ? 'checked' : ''} onchange="toggleAudio(this.checked)">
            <span>Sound</span>
        </label>
    `;

    if (header) { header.className = 'header'; header.innerHTML = html; }
    else {
        const el = document.createElement('div');
        el.className = 'header';
        el.innerHTML = html;
        document.body.insertBefore(el, document.body.firstChild);
    }
}

/* ── Footer ── */
function injectFooter() {
    let footer = document.querySelector('.footer') || document.querySelector('footer');
    const html = `<p>&copy; ${new Date().getFullYear()} SecureTools &middot; 100% Client-Side &middot; Zero Server Dependencies</p>`;
    if (footer) { footer.className = 'footer'; footer.innerHTML = html; }
    else {
        const el = document.createElement('div');
        el.className = 'footer';
        el.innerHTML = html;
        document.body.appendChild(el);
    }
}

/* ── Char Counters ── */
function setupCharCounters() {
    document.querySelectorAll('textarea:not([readonly])').forEach(ta => {
        const h3 = ta.parentElement?.querySelector('h3');
        if (!h3 || h3.querySelector('.char-counter')) return;
        const s = document.createElement('span');
        s.className = 'char-counter';
        s.style.cssText = 'font-size:11px;color:var(--text-tertiary);font-weight:400;';
        s.textContent = '0 chars';
        h3.appendChild(s);
        ta.addEventListener('input', () => { s.textContent = ta.value.length + ' chars'; });
    });
}

/* ── Audio Feedback ── */
let _actx = null;
function toggleAudio(on) { localStorage.setItem('st_audio', on ? 'true' : 'false'); }

function playTick(freq, dur) {
    if (localStorage.getItem('st_audio') === 'false') return;
    try {
        if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
        if (_actx.state === 'suspended') _actx.resume();
        const o = _actx.createOscillator(), g = _actx.createGain();
        o.connect(g); g.connect(_actx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, _actx.currentTime);
        g.gain.setValueAtTime(0.012, _actx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.00001, _actx.currentTime + dur);
        o.start(_actx.currentTime);
        o.stop(_actx.currentTime + dur);
    } catch (_) {}
}

function setupAudioListeners() {
    document.addEventListener('click', e => {
        if (e.target.closest('button, a, .checkbox-container')) playTick(700, 0.025);
    });
    document.addEventListener('keydown', e => {
        const t = e.target;
        if (t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && !['checkbox','radio','range'].includes(t.type)))
            playTick(900 + (e.keyCode % 20) * 15, 0.006);
    });
}

/* ── Toast ── */
function showToast(message, isError) {
    let c = document.getElementById('toast-container');
    if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
    const t = document.createElement('div');
    t.className = 'toast' + (isError ? ' toast-error' : '');
    t.textContent = message;
    c.appendChild(t);
    if (isError) playTick(150, 0.12); else playTick(1600, 0.06);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(20px)'; t.style.transition = '.2s ease'; setTimeout(() => t.remove(), 200); }, 3000);
}

/* ── Clipboard ── */
function copyToClipboard(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = (el.value || el.textContent || '').trim();
    if (!text) { showToast('Nothing to copy', true); return; }
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard')).catch(() => showToast('Copy failed', true));
}

/* ── Action Log ── */
function logAction(type, detail) {
    try {
        let logs = JSON.parse(localStorage.getItem('st_history')) || [];
        logs.unshift({
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
            type,
            details: detail.length > 70 ? detail.slice(0, 67) + '...' : detail,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
        logs = logs.slice(0, 50);
        localStorage.setItem('st_history', JSON.stringify(logs));
        if (typeof renderHistoryLog === 'function') renderHistoryLog();
        if (typeof updateStats === 'function') updateStats();
    } catch (_) {}
}
