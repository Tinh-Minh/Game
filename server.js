/**
 * NRO Anti - Local Game Server
 * Ngọc Rồng Online 2D Local Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// Game sessions tracking
const activeSessions = {};
const onlinePlayers = {}; // { username: { data, lastUpdate } }

const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    
    // Multiplayer Sync API
    if (urlPath === '/api/sync') {
        const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const username = urlParams.get('username');
        const token = urlParams.get('token');

        // Verify session first
        if (activeSessions[username] !== token) {
            res.writeHead(403);
            res.end(JSON.stringify({ error: 'Invalid Session' }));
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                const playerData = JSON.parse(body);
                onlinePlayers[username] = {
                    data: playerData,
                    lastUpdate: Date.now(),
                    inboundDamage: onlinePlayers[username]?.inboundDamage || [],
                    inboundSocial: onlinePlayers[username]?.inboundSocial || []
                };

                // Xử lý Outgoing Damage (PVP)
                if (playerData.outgoingDamage && playerData.outgoingDamage.length > 0) {
                    for (const hit of playerData.outgoingDamage) {
                        const target = hit.targetUsername;
                        if (onlinePlayers[target]) {
                            onlinePlayers[target].inboundDamage = onlinePlayers[target].inboundDamage || [];
                            onlinePlayers[target].inboundDamage.push({
                                from: username,
                                dmg: hit.dmg
                            });
                        }
                    }
                }

                // Xử lý Outgoing Social (Requests)
                if (playerData.outgoingSocial && playerData.outgoingSocial.length > 0) {
                    for (const req of playerData.outgoingSocial) {
                        const target = req.targetUsername;
                        if (onlinePlayers[target]) {
                            onlinePlayers[target].inboundSocial = onlinePlayers[target].inboundSocial || [];
                            onlinePlayers[target].inboundSocial.push({
                                from: username,
                                type: req.type
                            });
                        }
                    }
                }

                // Remove ghost players (inactive for > 60s to handle tab throttling)
                const now = Date.now();
                for (const u in onlinePlayers) {
                    if (now - onlinePlayers[u].lastUpdate > 60000) {
                        delete onlinePlayers[u];
                    }
                }

                // Return all other players on the same map + Inbound Damage
                const others = Object.keys(onlinePlayers)
                    .filter(u => u !== username && onlinePlayers[u].data.mapId === playerData.mapId)
                    .map(u => onlinePlayers[u].data);

                const myInbound = [...onlinePlayers[username].inboundDamage];
                const mySocial = [...onlinePlayers[username].inboundSocial];
                
                onlinePlayers[username].inboundDamage = []; // Clear mailbox
                onlinePlayers[username].inboundSocial = []; // Clear social mailbox

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'ok', 
                    players: others,
                    inboundDamage: myInbound,
                    inboundSocial: mySocial
                }));
            });
            return;
        }
    }

    // Simple API for session management
    if (urlPath === '/api/session') {
        const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const username = urlParams.get('username');
        const token = urlParams.get('token');
        const action = urlParams.get('action'); // 'login' or 'check'

        if (!username) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Missing username' }));
            return;
        }

        if (action === 'login') {
            // New login: set current token
            activeSessions[username] = token;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', message: 'Logged in' }));
            console.log(`[Session] User ${username} logged in with token ${token}`);
            return;
        } else if (action === 'check') {
            // Check if still valid
            const isValid = activeSessions[username] === token;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ valid: isValid, currentToken: activeSessions[username] }));
            return;
        }
    }

    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.join(ROOT, urlPath);

    // Security: prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`404 - File not found: ${urlPath}`);
            } else {
                res.writeHead(500);
                res.end('Internal Server Error');
            }
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║     🐉 NGỌC RỒNG ONLINE 2D - LOCAL SERVER 🐉     ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  ✅ Server đang chạy tại:                        ║`);
    console.log(`║     http://localhost:${PORT}                        ║`);
    console.log('║                                                  ║');
    console.log('║  📖 Hướng dẫn:                                   ║');
    console.log('║  - Mở trình duyệt và truy cập địa chỉ trên      ║');
    console.log('║  - Nhấn Ctrl+C để dừng server                   ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('\n');

    // Try to open browser automatically
    const { exec } = require('child_process');
    const urls = {
        win32: `start http://localhost:${PORT}`,
        darwin: `open http://localhost:${PORT}`,
        linux: `xdg-open http://localhost:${PORT}`
    };
    const cmd = urls[process.platform];
    if (cmd) {
        exec(cmd, (err) => {
            if (!err) console.log('🌐 Đã tự động mở trình duyệt!');
        });
    }
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} đang được sử dụng!`);
        console.error(`   Thử dùng port khác hoặc đóng ứng dụng đang dùng port ${PORT}\n`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\n\n🛑 Server đã dừng. Hẹn gặp lại chiến binh!');
    process.exit(0);
});
