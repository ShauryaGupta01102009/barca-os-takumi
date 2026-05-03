/*
 * Barca OS - FC Barcelona Edition
 * For the fans. For the culture.
 * Visca el Barca!
 */

// === STATE ===
let zTop = 250;
let wins = {};
let openCount = 0;
let startTime = Date.now();

// === THEME TOGGLE ===
function toggleTheme() {
    let html = document.documentElement;
    let current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

// === SPAWN ===
function spawn(fid, label, emoji) {
    if (wins[fid + '_pending']) return;
    wins[fid + '_pending'] = true;

    if (wins[fid]) {
        toFront(fid);
        delete wins[fid + '_pending'];
        return;
    }

    openCount++;
    let w = document.createElement('div');
    w.className = 'win';
    w.id = 'w-' + fid;
    w.style.left = (40 + openCount * 25) + 'px';
    w.style.top = (40 + openCount * 25) + 'px';
    w.style.width = fid === 'browser' ? '700px' : fid === 'chess' ? '340px' : fid === 'snake' ? '400px' : '500px';
    w.style.height = fid === 'browser' ? '500px' : fid === 'chess' ? '420px' : fid === 'snake' ? '440px' : '350px';
    w.style.zIndex = ++zTop;

    w.innerHTML = `
        <div class="winHead" onmousedown="startDrag(event, '${fid}')">
            <span class="winIcon">${emoji}</span>
            <span class="winTitle">${label}</span>
            <div class="winBtns">
                <button class="winBtn btnMin" onclick="event.stopPropagation(); hideWin('${fid}', event)" title="Minimize">−</button>
                <button class="winBtn btnMax" onclick="event.stopPropagation(); toggleFull('${fid}', event)" title="Maximize">□</button>
                <button class="winBtn btnX" onclick="event.stopPropagation(); closeWin('${fid}', event)" title="Close">×</button>
            </div>
        </div>
        <div class="winBody" id="bod-${fid}">
            ${getAppBody(fid)}
        </div>
    `;

    w.onclick = () => toFront(fid);
    document.body.appendChild(w);
    wins[fid] = w;

    addTab(fid, emoji, label);
    delete wins[fid + '_pending'];

    if (fid === 'calc') initCalc();
    if (fid === 'chess') initChess();
    if (fid === 'snake') initSnake();
}

// === APP BODIES ===
function getAppBody(fid) {
    if (fid === 'term') {
        return `<div id="term-box">
            <div id="term-out"></div>
            <div class="term-input-line">
                <span style="color:#fbbf24;">root@barca</span><span style="color:#60a5fa;">:~$</span>
                <input type="text" class="term-input" id="term-in" spellcheck="false" autocomplete="off">
                <span class="blink">_</span>
            </div>
        </div>`;
    }
    if (fid === 'note') {
        return `<textarea id="note-area" style="width:100%;height:100%;background:transparent;color:var(--fg);border:none;resize:none;outline:none;font-family:monospace;font-size:13px;" placeholder="Type here... auto-saves"></textarea>`;
    }
    if (fid === 'calc') {
        return `<div id="calc-display">0</div>
        <div class="calc-grid">
            <button class="calc-btn clear" onclick="calcClear()">C</button>
            <button class="calc-btn" onclick="calcAppend('(')">(</button>
            <button class="calc-btn" onclick="calcAppend(')')">)</button>
            <button class="calc-btn op" onclick="calcAppend('/')">÷</button>
            <button class="calc-btn" onclick="calcAppend('7')">7</button>
            <button class="calc-btn" onclick="calcAppend('8')">8</button>
            <button class="calc-btn" onclick="calcAppend('9')">9</button>
            <button class="calc-btn op" onclick="calcAppend('*')">×</button>
            <button class="calc-btn" onclick="calcAppend('4')">4</button>
            <button class="calc-btn" onclick="calcAppend('5')">5</button>
            <button class="calc-btn" onclick="calcAppend('6')">6</button>
            <button class="calc-btn op" onclick="calcAppend('-')">−</button>
            <button class="calc-btn" onclick="calcAppend('1')">1</button>
            <button class="calc-btn" onclick="calcAppend('2')">2</button>
            <button class="calc-btn" onclick="calcAppend('3')">3</button>
            <button class="calc-btn op" onclick="calcAppend('+')">+</button>
            <button class="calc-btn" onclick="calcAppend('0')" style="grid-column:span 2;">0</button>
            <button class="calc-btn" onclick="calcAppend('.')">.</button>
            <button class="calc-btn eq" onclick="calcSolve()">=</button>
        </div>`;
    }
    if (fid === 'browser') {
        return `<div class="browser-bar">
            <input type="text" id="url-bar" placeholder="Enter URL (e.g., https://example.com)" value="https://example.com" onkeydown="if(event.key==='Enter') { event.preventDefault(); navigateBrowser(); }">
            <button onclick="navigateBrowser()">Go</button>
        </div>
        <div class="browser-frame">
            <iframe id="browser-frame" src="https://example.com"></iframe>
        </div>`;
    }
    if (fid === 'chess') {
        return `<div id="chess-board" class="chess-board"></div>
        <div style="text-align:center;margin-top:10px;color:var(--muted);font-size:12px;">
            Click piece, then click destination. White moves first.
        </div>`;
    }
    if (fid === 'snake') {
        return `<canvas id="snake-canvas" width="360" height="360"></canvas>
        <div class="game-controls">
            Use Arrow Keys to move | Space to pause | Score: <span id="snake-score">0</span>
        </div>`;
    }
    if (fid === 'settings') {
        return `<div style="padding:20px; overflow-y:auto; height:100%;">
            <h3 style="color:#EDBB00; margin-bottom:15px;">Wallpaper Settings</h3>
            <label style="display:block; margin-bottom:10px;">Custom Wallpaper URL:</label>
            <input type="text" id="wallpaper-url" placeholder="https://example.com/image.jpg" style="width:100%; padding:8px; border:1px solid #666; border-radius:4px; background:transparent; color:inherit; margin-bottom:10px;">
            <button onclick="setCustomWallpaper()" style="background:#004D98; color:white; padding:8px 16px; border:none; border-radius:4px; cursor:pointer; width:100%; margin-bottom:15px;">Apply Wallpaper</button>
            <hr style="border:1px solid #666; margin:15px 0;">
            <h3 style="color:#EDBB00; margin-bottom:15px;">Presets:</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <button onclick="setWallpaper('https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=2560')" style="background:#A50044; color:white; padding:8px; border:none; border-radius:4px; cursor:pointer;">Dark City</button>
                <button onclick="setWallpaper('https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=2560')" style="background:#004D98; color:white; padding:8px; border:none; border-radius:4px; cursor:pointer;">Ocean Waves</button>
                <button onclick="setWallpaper('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=2560')" style="background:#EDBB00; color:black; padding:8px; border:none; border-radius:4px; cursor:pointer;">Mountain</button>
            </div>
        </div>`;
    }
    return '<div style="color:var(--muted);font-size:12px;">Loading...</div>';
}

// === WINDOW OPS ===
function toFront(fid) {
    if (!wins[fid]) return;
    wins[fid].style.zIndex = ++zTop;
    document.querySelectorAll('.barTab').forEach(t => t.classList.remove('live'));
    let tab = document.getElementById('tab-' + fid);
    if (tab) tab.classList.add('live');
}

function closeWin(fid, e) {
    e.stopPropagation();
    if (!wins[fid]) return;
    wins[fid].remove();
    delete wins[fid];
    let tab = document.getElementById('tab-' + fid);
    if (tab) tab.remove();
}

function hideWin(fid, e) {
    e.stopPropagation();
    if (!wins[fid]) return;
    wins[fid].style.display = 'none';
    let tab = document.getElementById('tab-' + fid);
    if (tab) {
        tab.classList.remove('live');
        tab.classList.add('hidden');
    }
}

function toggleFull(fid, e) {
    e.stopPropagation();
    let w = wins[fid];
    if (!w) return;
    let isMaxed = w.dataset.expanded === 'true';
    if (isMaxed) {
        w.style.left = w.dataset.px;
        w.style.top = w.dataset.py;
        w.style.width = w.dataset.pw;
        w.style.height = w.dataset.ph;
        w.dataset.expanded = 'false';
    } else {
        w.dataset.px = w.style.left;
        w.dataset.py = w.style.top;
        w.dataset.pw = w.style.width;
        w.dataset.ph = w.style.height;
        w.style.left = '0';
        w.style.top = '0';
        w.style.width = '100%';
        w.style.height = 'calc(100vh - 42px)';
        w.dataset.expanded = 'true';
    }
}

function addTab(fid, emoji, label) {
    let box = document.getElementById('barca-apps');
    let tab = document.createElement('div');
    tab.className = 'barTab live';
    tab.id = 'tab-' + fid;
    tab.innerHTML = emoji + ' ' + label;
    tab.onclick = () => {
        let w = wins[fid];
        if (!w) return;
        if (w.style.display === 'none') {
            w.style.display = 'flex';
            tab.classList.remove('hidden');
        }
        toFront(fid);
    };
    box.appendChild(tab);
}

// === DRAG ===
let drag = null;
function startDrag(e, fid) {
    let w = wins[fid];
    if (w.dataset.expanded === 'true') return;
    drag = { fid: fid, ox: e.clientX - w.offsetLeft, oy: e.clientY - w.offsetTop };
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
}
function onDrag(e) {
    if (!drag) return;
    let w = wins[drag.fid];
    w.style.left = (e.clientX - drag.ox) + 'px';
    w.style.top = (e.clientY - drag.oy) + 'px';
}
function endDrag() {
    drag = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
}

// === CONTEXT MENU ===
let deskMenu = document.getElementById('deskMenu');
document.getElementById('desk').oncontextmenu = function(e) {
    e.preventDefault();
    deskMenu.style.display = 'block';
    deskMenu.style.left = Math.min(e.clientX, window.innerWidth - 170) + 'px';
    deskMenu.style.top = Math.min(e.clientY, window.innerHeight - 130) + 'px';
};
document.onclick = (e) => {
    if (!e.target.closest('#deskMenu')) deskMenu.style.display = 'none';
};

// === WALLPAPER ===
let walls = [
    'radial-gradient(ellipse at 30% 20%, #1a1a4e 0%, #0a0a1a 100%)',
    'radial-gradient(ellipse at 70% 80%, #4a1a1a 0%, #0a0a1a 100%)',
    'radial-gradient(ellipse at 50% 0%, #1a3a4a 0%, #0a0a1a 100%)',
    'radial-gradient(ellipse at 0% 100%, #2a1a4a 0%, #0a0a1a 100%)',
    'radial-gradient(ellipse at 100% 0%, #3a1a2a 0%, #0a0a1a 100%)'
];
let widx = 0;
function cycleWall() {
    widx = (widx + 1) % walls.length;
    document.getElementById('desk').style.background = walls[widx];
}

function setWallpaper(url) {
    document.getElementById('desk').style.background = `url('${url}') center/cover no-repeat`;
    localStorage.setItem('barcaOSWallpaper', url);
}

function setCustomWallpaper() {
    let url = document.getElementById('wallpaper-url').value.trim();
    if (url) {
        setWallpaper(url);
    }
}

// Load saved wallpaper on startup
const savedWallpaper = localStorage.getItem('barcaOSWallpaper');
if (savedWallpaper) {
    document.getElementById('desk').style.background = `url('${savedWallpaper}') center/cover no-repeat`;
}

// === BROWSER ===
function navigateBrowser() {
    let url = document.getElementById('url-bar').value.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    document.getElementById('browser-frame').src = url;
    document.getElementById('url-bar').value = url;
}

// === CLOCK ===
function updateClock() {
    document.getElementById('time').textContent =
        new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// ===== TERMINAL =====
document.addEventListener('keydown', function(e) {
    let inp = document.activeElement;
    if (!inp || inp.id !== 'term-in') return;
    let out = document.getElementById('term-out');
    if (!out) return;

    if (e.key === 'Enter') {
        let cmd = inp.value.trim();
        inp.value = '';
        let line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span style="color:#fbbf24;">root@barca</span>:<span style="color:#60a5fa;">~</span>$ ${esc(cmd)}`;
        out.appendChild(line);

        let resp = execCmd(cmd);
        if (resp) {
            let r = document.createElement('div');
            r.className = 'term-line';
            r.innerHTML = resp;
            out.appendChild(r);
        }
        out.scrollTop = out.scrollHeight;
    }
});

function esc(t) {
    let d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
}

function execCmd(cmd) {
    let p = cmd.split(' ');
    let b = p[0].toLowerCase();
    switch(b) {
        case 'help': return `Commands:
  help clear whoami date neofetch ls pwd echo hack barca`;
        case 'clear': document.getElementById('term-out').innerHTML = ''; return null;
        case 'whoami': return 'root@barca';
        case 'date': return new Date().toString();
        case 'neofetch': return `<span style="color:#004D98;">  ██████╗ </span>  <span style="color:#A50044;">OS:</span> Barca OS v1.0
<span style="color:#004D98;">  ██╔══██╗</span>  <span style="color:#A50044;">Club:</span> FC Barcelona
<span style="color:#004D98;">  ██████╔╝</span>  <span style="color:#A50044;">Motto:</span> Mes Que Un Club
<span style="color:#004D98;">  ██╔══██╗</span>  <span style="color:#A50044;">Uptime:</span> ${Math.floor((Date.now()-startTime)/1000)}s
<span style="color:#004D98;">  ██████╔╝</span>  <span style="color:#A50044;">Shell:</span> barca-sh
<span style="color:#004D98;">  ╚═════╝ </span>  <span style="color:#A50044;">Fan:</span> True`;
        case 'ls': return 'Camp_Nou  La_Masia  Trophies  Messi_Goals  Xavi_Passes';
        case 'pwd': return '/home/culer';
        case 'echo': return p.slice(1).join(' ') || '';
        case 'hack': return `<span style="color:#ff5f57;">[HACKING BARCA DATABASE...]</span>
<span style="color:#febc2e;">Bypassing security...</span> <span style="color:#28c840;">DONE</span>
<span style="color:#febc2e;">Accessing trophy room...</span> <span style="color:#28c840;">DONE</span>
<span style="color:#ff5f57;">5 CHAMPIONS LEAGUES FOUND. VISCa BARCA!</span>`;
        case 'barca': return `<span style="color:#004D98;">FC BARCELONA</span>
<span style="color:#A50044;">Founded: 1899 | Camp Nou | Catalonia</span>
<span style="color:#EDBB00;">⭐ 5 Champions League | 27 La Liga | 31 Copa del Rey</span>`;
        case '': return null;
        default: return `<span style="color:#ff5f57;">${esc(b)}: command not found</span>`;
    }
}

// ===== CALCULATOR =====
let calcExpr = '';
function initCalc() { calcExpr = ''; updateCalc(); }
function calcAppend(v) { calcExpr += v; updateCalc(); }
function calcClear() { calcExpr = ''; updateCalc(); }
function calcBack() { calcExpr = calcExpr.slice(0,-1); updateCalc(); }
function calcSolve() {
    try { calcExpr = String(Function('"use strict";return('+calcExpr+')')()); }
    catch(e) { calcExpr = 'Error'; }
    updateCalc();
}
function updateCalc() {
    let d = document.getElementById('calc-display');
    if(d) d.textContent = calcExpr || '0';
}

// ===== BROWSER =====
function navigateBrowser() {
    let url = document.getElementById('url-bar').value;
    if (!url.startsWith('http')) url = 'https://' + url;
    document.getElementById('browser-frame').src = url;
}

// ===== NOTEPAD =====
document.addEventListener('input', function(e) {
    if (e.target.id === 'note-area') localStorage.setItem('barca-note', e.target.value);
});

// ===== CHESS =====
let chessBoard, chessSelected = null, chessTurn = 'white';
const chessPieces = {
    white: { r:'♖', n:'♘', b:'♗', q:'♕', k:'♔', p:'♙' },
    black: { r:'♜', n:'♞', b:'♝', q:'♛', k:'♚', p:'♟' }
};
const chessSetup = [
    'rnbqkbnr','pppppppp','........','........',
    '........','........','PPPPPPPP','RNBQKBNR'
];

function initChess() {
    chessBoard = document.getElementById('chess-board');
    if (!chessBoard) return;
    renderChess();
}

function renderChess() {
    chessBoard.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let sq = document.createElement('div');
            sq.className = 'chess-square ' + ((r+c)%2 ? 'dark' : 'light');
            sq.dataset.r = r; sq.dataset.c = c;
            let p = chessSetup[r][c];
            if (p !== '.') {
                let color = r < 2 ? 'black' : 'white';
                sq.textContent = chessPieces[color][p.toLowerCase()];
            }
            sq.onclick = () => clickSquare(r, c, sq);
            chessBoard.appendChild(sq);
        }
    }
}

function clickSquare(r, c, sq) {
    if (chessSelected) {
        let sr = chessSelected.r, sc = chessSelected.c;
        chessSetup[r] = chessSetup[r].substring(0,c) + chessSetup[sr][sc] + chessSetup[r].substring(c+1);
        chessSetup[sr] = chessSetup[sr].substring(0,sc) + '.' + chessSetup[sr].substring(sc+1);
        chessSelected = null;
        chessTurn = chessTurn === 'white' ? 'black' : 'white';
        renderChess();
    } else if (sq.textContent && ((chessTurn === 'white' && r > 3) || (chessTurn === 'black' && r < 4))) {
        chessSelected = {r, c};
        sq.classList.add('selected');
    }
}

// ===== SNAKE =====
let snakeCtx, snakeGame, snakeInterval;
const SNAKE_SIZE = 20;
const SNAKE_GRID = 18;

function initSnake() {
    let canvas = document.getElementById('snake-canvas');
    if (!canvas) return;
    snakeCtx = canvas.getContext('2d');
    startSnake();
}

function startSnake() {
    snakeGame = {
        snake: [{x: 9, y: 9}],
        dir: {x: 0, y: -1},
        food: randomFood(),
        score: 0,
        paused: false,
        over: false
    };
    if (snakeInterval) clearInterval(snakeInterval);
    snakeInterval = setInterval(snakeLoop, 150);
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * SNAKE_GRID),
        y: Math.floor(Math.random() * SNAKE_GRID)
    };
}

function snakeLoop() {
    if (snakeGame.paused || snakeGame.over) return;
    let head = {...snakeGame.snake[0]};
    head.x += snakeGame.dir.x;
    head.y += snakeGame.dir.y;

    if (head.x < 0 || head.x >= SNAKE_GRID || head.y < 0 || head.y >= SNAKE_GRID ||
        snakeGame.snake.some(s => s.x === head.x && s.y === head.y)) {
        snakeGame.over = true;
        snakeCtx.fillStyle = 'rgba(0,0,0,0.7)';
        snakeCtx.fillRect(0, 0, 360, 360);
        snakeCtx.fillStyle = '#ff5f57';
        snakeCtx.font = '24px sans-serif';
        snakeCtx.textAlign = 'center';
        snakeCtx.fillText('GAME OVER', 180, 180);
        snakeCtx.font = '14px sans-serif';
        snakeCtx.fillStyle = '#fff';
        snakeCtx.fillText('Press R to restart', 180, 210);
        return;
    }

    snakeGame.snake.unshift(head);
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score += 10;
        snakeGame.food = randomFood();
        document.getElementById('snake-score').textContent = snakeGame.score;
    } else {
        snakeGame.snake.pop();
    }

    drawSnake();
}

function drawSnake() {
    snakeCtx.fillStyle = '#0a0a1a';
    snakeCtx.fillRect(0, 0, 360, 360);

    snakeCtx.fillStyle = '#ff5f57';
    snakeCtx.beginPath();
    snakeCtx.arc(
        snakeGame.food.x * SNAKE_SIZE + SNAKE_SIZE/2,
        snakeGame.food.y * SNAKE_SIZE + SNAKE_SIZE/2,
        SNAKE_SIZE/2 - 2, 0, Math.PI * 2
    );
    snakeCtx.fill();

    snakeGame.snake.forEach((s, i) => {
        snakeCtx.fillStyle = i === 0 ? '#28c840' : '#34d399';
        snakeCtx.fillRect(
            s.x * SNAKE_SIZE + 1,
            s.y * SNAKE_SIZE + 1,
            SNAKE_SIZE - 2, SNAKE_SIZE - 2
        );
    });
}
document.documentElement.style.setProperty('--desktop-bg', "url('https://wallpapercave.com/messi-camp-nou-wallpapers')");
document.addEventListener('keydown', function(e) {
    if (!snakeGame || snakeGame.over) {
        if (e.key === 'r' || e.key === 'R') startSnake();
        return;
    }
    switch(e.key) {
        case 'ArrowUp': if (snakeGame.dir.y !== 1) snakeGame.dir = {x:0, y:-1}; break;
        case 'ArrowDown': if (snakeGame.dir.y !== -1) snakeGame.dir = {x:0, y:1}; break;
        case 'ArrowLeft': if (snakeGame.dir.x !== 1) snakeGame.dir = {x:-1, y:0}; break;
        case 'ArrowRight': if (snakeGame.dir.x !== -1) snakeGame.dir = {x:1, y:0}; break;
        case ' ': snakeGame.paused = !snakeGame.paused; break;
    }
});