'use strict';

(function () {
    // Electron/file and local preview use local credentials.
    // Production web deployments use the Netlify serverless auth function.
    const host = window.location.hostname;
    const IS_LOCAL_PREVIEW =
        window.location.protocol === 'file:' ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '';
    const IS_WEB = window.location.protocol.startsWith('http') && !IS_LOCAL_PREVIEW;

    // Local credentials - used only in Electron/local preview mode.
    // Web deployments authenticate via /.netlify/functions/auth (env-var backed).
    const DEMO_USERS = [
        { id: 1, username: 'admin',     password: 'pro3s@admin', role: 'admin',     name: 'System Administrator', avatar: 'A' },
        { id: 2, username: 'inspector', password: 'weld@2024',   role: 'inspector', name: 'Weld Inspector',        avatar: 'I' },
        { id: 3, username: 'viewer',    password: 'view@2024',   role: 'viewer',    name: 'Quality Viewer',        avatar: 'V' },
    ];
    const USERS = Array.isArray(window.WQIS_USERS) && window.WQIS_USERS.length
        ? window.WQIS_USERS
        : DEMO_USERS;

    const SESSION_KEY = 'wqis_session';
    const TTL_SHORT   = 2  * 60 * 60 * 1000;      // 2 h
    const TTL_LONG    = 7  * 24 * 60 * 60 * 1000; // 7 d

    window.Auth = {
        async login(username, password, remember) {
            if (IS_WEB) {
                // Web: validate server-side (credentials never leave the server)
                try {
                    const res = await fetch('/.netlify/functions/auth', {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({ username, password, remember }),
                    });
                    if (res.status === 401) return { ok: false };
                    if (!res.ok) throw new Error(`Auth service error (${res.status})`);
                    const data = await res.json();
                    if (data.ok && data.session) {
                        try { localStorage.setItem(SESSION_KEY, JSON.stringify(data.session)); } catch (_) {}
                    }
                    return data;
                } catch (err) {
                    return { ok: false, error: err.message };
                }
            }

            // Electron: local check
            const lookup = username.toLowerCase();
            const u = USERS.find(x =>
                x.status !== 'disabled' &&
                String(x.username || '').toLowerCase() === lookup &&
                x.password === password
            );
            if (!u) return { ok: false };
            const session = {
                userId: u.id, username: u.username,
                name: u.name, role: u.role, avatar: u.avatar,
                expiry: Date.now() + (remember ? TTL_LONG : TTL_SHORT),
                remember,
            };
            try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (_) {}
            return { ok: true, session };
        },

        logout() {
            try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
            window.location.replace('login.html');
        },

        getSession() {
            try {
                const raw = localStorage.getItem(SESSION_KEY);
                if (!raw) return null;
                const s = JSON.parse(raw);
                if (Date.now() > s.expiry) {
                    localStorage.removeItem(SESSION_KEY);
                    return null;
                }
                return s;
            } catch (_) { return null; }
        },

        isAuthenticated() { return this.getSession() !== null; },

        requireAuth() {
            const s = this.getSession();
            if (!s) { window.location.replace('login.html'); return null; }
            return s;
        },

        ROLE_META: {
            admin:     { label: 'Administrator', color: '#4f8ef7', bg: 'rgba(79,142,247,0.14)'  },
            inspector: { label: 'Inspector',     color: '#34d399', bg: 'rgba(52,211,153,0.13)'  },
            viewer:    { label: 'Viewer',        color: '#a78bfa', bg: 'rgba(167,139,250,0.14)' },
        },

        ROLE_ORDER: { viewer: 0, inspector: 1, admin: 2 },

        can(role, action) {
            const perms = {
                admin:     ['view', 'inspect', 'edit', 'delete', 'settings', 'export'],
                inspector: ['view', 'inspect', 'edit', 'export'],
                viewer:    ['view'],
            };
            return (perms[role] || []).includes(action);
        },
    };
})();
