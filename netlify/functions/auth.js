'use strict';

let generatedUsers = [];
try {
    generatedUsers = require('./generated-users').users || [];
} catch (_) {
    generatedUsers = [];
}

/**
 * POST /.netlify/functions/auth
 * Body: { username, password, remember }
 *
 * Credentials are stored in Netlify environment variables — never in source.
 * Required env vars:
 *   USER_ADMIN, PASS_ADMIN
 *   USER_ADMIN2, PASS_ADMIN2
 *   USER_INSPECTOR, PASS_INSPECTOR
 *   USER_VIEWER, PASS_VIEWER
 */
exports.handler = async (event) => {
    const CORS = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
    };

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS, body: JSON.stringify({ ok: false }) };
    }

    let username, password, remember;
    try {
        const body = JSON.parse(event.body || '{}');
        username = String(body.username || '').trim();
        password = String(body.password || '');
        remember = Boolean(body.remember);
    } catch (_) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ ok: false }) };
    }

    if (!username || !password) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ ok: false }) };
    }

    const envUsers = [
        { id: 1, username: process.env.USER_ADMIN,     password: process.env.PASS_ADMIN,     role: 'admin',     name: 'System Administrator', avatar: 'A' },
        { id: 2, username: process.env.USER_INSPECTOR, password: process.env.PASS_INSPECTOR, role: 'inspector', name: 'Weld Inspector',        avatar: 'I' },
        { id: 3, username: process.env.USER_VIEWER,    password: process.env.PASS_VIEWER,    role: 'viewer',    name: 'Quality Viewer',        avatar: 'V' },
        { id: 4, username: process.env.USER_ADMIN2,    password: process.env.PASS_ADMIN2,    role: 'admin',     name: 'Nawapun W.',            avatar: 'N' },
    ];
    const USERS = generatedUsers.length ? generatedUsers : envUsers;

    const lookup = username.toLowerCase();
    const user = USERS.find(u =>
        u.username &&
        u.status !== 'disabled' &&
        String(u.username).toLowerCase() === lookup &&
        u.password === password
    );

    // Constant-time delay to prevent timing-based user enumeration
    await new Promise(r => setTimeout(r, 180 + Math.random() * 120));

    if (!user) {
        return { statusCode: 401, headers: CORS, body: JSON.stringify({ ok: false }) };
    }

    const TTL_SHORT = 2 * 60 * 60 * 1000;      // 2 hours
    const TTL_LONG  = 7 * 24 * 60 * 60 * 1000; // 7 days

    const session = {
        userId:   user.id,
        username: user.username,
        name:     user.name,
        role:     user.role,
        avatar:   user.avatar,
        expiry:   Date.now() + (remember ? TTL_LONG : TTL_SHORT),
        remember,
    };

    return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ ok: true, session }),
    };
};
