const STORAGE_KEY = 'rqrunning-mobile-settings';

const zones = [
  { code: 'D', name: '恢复跑', min: 0.50, max: 0.60, rq: '0.70-0.75', energy: '脂肪燃烧为主', paceOffset: 80, color: '#45ff95', prescription: '轻松跑 30-45 分钟，全程能完整说话，适合恢复日。' },
  { code: 'E', name: '有氧耐力', min: 0.60, max: 0.75, rq: '0.75-0.85', energy: '糖脂混合供能', paceOffset: 50, color: '#39d8ff', prescription: '有氧跑 45-75 分钟，保持稳定呼吸，不追配速。' },
  { code: 'M', name: '马拉松配速', min: 0.75, max: 0.84, rq: '0.85-0.90', energy: '糖脂混合供能', paceOffset: 25, color: '#ffd166', prescription: '热身 15 分钟 + 马拉松配速 30-60 分钟 + 放松 10 分钟。' },
  { code: 'T', name: '乳酸阈值', min: 0.84, max: 0.88, rq: '0.90-0.95', energy: '糖原供能为主', paceOffset: 5, color: '#ff9a4a', prescription: '热身 15 分钟 + 4 x 8 分钟节奏跑，组间慢跑 2 分钟 + 放松 10 分钟。' },
  { code: 'A', name: '有氧动力', min: 0.88, max: 0.95, rq: '0.95-1.00', energy: '糖原供能为主', paceOffset: -8, color: '#ff7a59', prescription: '热身充分后跑 5 x 1000 米，组间慢跑 2-3 分钟。' },
  { code: 'I', name: '无氧能力', min: 0.95, max: 1.00, rq: '1.00+', energy: '无氧糖酵解为主', paceOffset: -20, color: '#ff5c6c', prescription: '热身充分后跑 8-12 x 400 米，组间充分恢复；不建议连续多天进行。' }
];

const state = {
  maxHR: 190,
  restHR: 50,
  pbPace: '03:50',
  pbSeconds: 230,
  selectedZone: 'T'
};

const $ = selector => document.querySelector(selector);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getRangeValue(id, value) {
  const input = $(`#${id}`);
  return clamp(Number(value), Number(input.min), Number(input.max));
}

function parsePace(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  let minutes;
  let seconds;
  const colonMatch = text.match(/^(\d{1,2}):(\d{2})$/);
  if (colonMatch) {
    minutes = Number(colonMatch[1]);
    seconds = Number(colonMatch[2]);
  } else {
    const digits = text.replace(/\D/g, '');
    if (!/^\d{3,4}$/.test(digits)) return null;
    minutes = Number(digits.slice(0, -2));
    seconds = Number(digits.slice(-2));
  }

  if (seconds > 59) return null;
  const total = minutes * 60 + seconds;
  return total >= 120 && total <= 600 ? total : null;
}

function sanitizePaceInput(value) {
  const text = String(value || '').replace(/[^\d:]/g, '');
  const firstColon = text.indexOf(':');
  if (firstColon === -1) return text.slice(0, 4);
  return `${text.slice(0, firstColon).replace(/:/g, '').slice(0, 2)}:${text.slice(firstColon + 1).replace(/:/g, '').slice(0, 2)}`;
}

function formatPace(seconds) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const remain = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remain).padStart(2, '0')}`;
}

function formatDuration(seconds) {
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remain = total % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(remain).padStart(2, '0')}`;
  return `${minutes}:${String(remain).padStart(2, '0')}`;
}

function getSelectedZone() {
  return zones.find(zone => zone.code === state.selectedZone) || zones[3];
}

function getZoneHeartRate(zone) {
  const reserve = state.maxHR - state.restHR;
  return {
    min: Math.round(state.restHR + reserve * zone.min),
    max: Math.round(state.restHR + reserve * zone.max)
  };
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}

  const params = new URLSearchParams({
    max: state.maxHR,
    rest: state.restHR,
    pace: state.pbPace,
    zone: state.selectedZone
  });
  history.replaceState(null, '', `${location.pathname}?${params}`);
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (saved && typeof saved === 'object') {
      const max = Number(saved.maxHR);
      const rest = Number(saved.restHR);
      if (max >= 150 && max <= 210) state.maxHR = max;
      if (rest >= 40 && rest <= 90) state.restHR = rest;
      if (parsePace(saved.pbPace)) state.pbPace = saved.pbPace;
      if (zones.some(item => item.code === saved.selectedZone)) state.selectedZone = saved.selectedZone;
    }
  } catch {}

  const params = new URLSearchParams(location.search);
  const max = Number(params.get('max'));
  const rest = Number(params.get('rest'));
  const pace = params.get('pace');
  const zone = params.get('zone');

  if (max >= 150 && max <= 210) state.maxHR = max;
  if (rest >= 40 && rest <= 90) state.restHR = rest;
  if (parsePace(pace)) state.pbPace = pace;
  if (zones.some(item => item.code === zone)) state.selectedZone = zone;

  const parsed = parsePace(state.pbPace);
  if (parsed) state.pbSeconds = parsed;
}

async function copyShareLink(button) {
  const text = location.href;
  try {
    if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    button.textContent = '已复制';
  } catch {
    window.prompt('复制下面的链接分享当前参数', text);
    button.textContent = '已生成';
  }

  setTimeout(() => { button.textContent = '复制链接'; }, 1200);
}

function renderZonePicker() {
  $('#zonePicker').innerHTML = zones.map(zone => {
    const hr = getZoneHeartRate(zone);
    const active = zone.code === state.selectedZone ? ' active' : '';
    return `<button class="zone-btn${active}" style="--zone-color: ${zone.color}" role="tab" aria-selected="${zone.code === state.selectedZone}" data-zone="${zone.code}">
      <strong>${zone.code} ${zone.name}</strong>
      <span>${hr.min}-${hr.max} bpm · ${formatPace(state.pbSeconds + zone.paceOffset)}/km</span>
    </button>`;
  }).join('');
}

function renderRaceGrid() {
  const races = [
    { name: '5km', distance: 5, paceOffset: -10 },
    { name: '10km', distance: 10, paceOffset: 0 },
    { name: '半马', distance: 21.0975, paceOffset: 10 },
    { name: '全马', distance: 42.195, paceOffset: 20 }
  ];

  $('#raceGrid').innerHTML = races.map(race => {
    const pace = state.pbSeconds + race.paceOffset;
    return `<div class="mini-card"><span>${race.name}</span><strong>${formatDuration(pace * race.distance)}</strong><span>${formatPace(pace)}/km</span></div>`;
  }).join('');
}

function renderWorkoutList() {
  const rows = [
    { title: '400 米间歇', detail: '8-12 组，充分恢复', offset: -30 },
    { title: '1000 米间歇', detail: '5-8 组，组间 2-3 分钟', offset: -10 },
    { title: '节奏跑', detail: '20-40 分钟连续跑', offset: 5 },
    { title: '长距离慢跑', detail: '90-150 分钟', offset: 70 }
  ];

  $('#workoutList').innerHTML = rows.map(row => `
    <div class="workout-card">
      <div><span>${row.title}</span><small>${row.detail}</small></div>
      <strong>${formatPace(state.pbSeconds + row.offset)}/km</strong>
    </div>`).join('');
}

function render() {
  if (state.maxHR <= state.restHR) state.maxHR = state.restHR + 10;

  $('#maxHR').value = state.maxHR;
  $('#restHR').value = state.restHR;
  $('#pbPace').value = state.pbPace;
  $('#maxHRValue').textContent = `${state.maxHR} bpm`;
  $('#restHRValue').textContent = `${state.restHR} bpm`;
  $('#reserveValue').textContent = `储备 ${state.maxHR - state.restHR} bpm`;

  const zone = getSelectedZone();
  const hr = getZoneHeartRate(zone);
  const pace = formatPace(state.pbSeconds + zone.paceOffset);

  $('#resultZone').textContent = `${zone.code} ${zone.name}`;
  $('#resultPace').textContent = `${pace}/km`;
  $('#resultHR').textContent = `${hr.min}-${hr.max} bpm`;
  $('#resultRQ').textContent = `RQ ${zone.rq} · ${zone.energy}`;
  $('#prescriptionText').textContent = zone.prescription;
  $('#stickyZone').textContent = `${zone.code} 区`;
  $('#stickyPace').textContent = `${pace}/km`;
  $('#stickyHR').textContent = `${hr.min}-${hr.max} bpm`;

  renderZonePicker();
  renderRaceGrid();
  renderWorkoutList();
  save();
}

function hapticFeedback(type = 'light') {
  if ('vibrate' in navigator) {
    const patterns = { light: 10, medium: 20, heavy: 30 };
    navigator.vibrate(patterns[type] || 10);
  }
}

function bindEvents() {
  $('#maxHR').addEventListener('input', event => {
    state.maxHR = Number(event.target.value);
    render();
  });

  $('#restHR').addEventListener('input', event => {
    state.restHR = Number(event.target.value);
    render();
  });

  document.addEventListener('click', async event => {
    const stepButton = event.target.closest('.step-btn');
    if (stepButton) {
      hapticFeedback('light');
      const input = $(`#${stepButton.dataset.target}`);
      input.value = String(getRangeValue(stepButton.dataset.target, Number(input.value) + Number(stepButton.dataset.step)));
      state[stepButton.dataset.target] = Number(input.value);
      render();
      return;
    }

    const zoneButton = event.target.closest('.zone-btn');
    if (zoneButton) {
      hapticFeedback('medium');
      state.selectedZone = zoneButton.dataset.zone;
      render();
      return;
    }

    if (event.target.id === 'resetBtn') {
      hapticFeedback('heavy');
      Object.assign(state, { maxHR: 190, restHR: 50, pbPace: '03:50', pbSeconds: 230, selectedZone: 'T' });
      render();
      return;
    }

    if (event.target.id === 'shareBtn') {
      hapticFeedback('light');
      await copyShareLink(event.target);
    }

    if (event.target.id === 'installBtn') {
      hapticFeedback('medium');
    }

    const paceShortcutBtn = event.target.closest('.pace-shortcut-btn');
    if (paceShortcutBtn) {
      hapticFeedback('light');
      const pace = paceShortcutBtn.dataset.pace;
      const seconds = parsePace(pace);
      if (seconds !== null) {
        state.pbSeconds = seconds;
        state.pbPace = formatPace(seconds);
        $('#pbPace').value = state.pbPace;
        $('#pbPace').classList.remove('invalid');
        $('#paceHint').classList.remove('error');
        $('#paceHint').textContent = '输入 350、0350 或 03:50，自动整理为 mm:ss。';
        render();
      }
    }
  });

  $('#pbPace').addEventListener('input', event => {
    const input = event.target;
    const cleaned = sanitizePaceInput(input.value);
    if (input.value !== cleaned) input.value = cleaned;

    const seconds = parsePace(cleaned);
    const valid = seconds !== null;
    const colonSeconds = cleaned.includes(':') ? cleaned.split(':')[1] || '' : '';
    const shouldShowError = !valid && (cleaned.replace(/\D/g, '').length >= 4 || colonSeconds.length >= 2);
    input.classList.toggle('invalid', shouldShowError);
    $('#paceHint').classList.toggle('error', shouldShowError);
    $('#paceHint').textContent = valid || !shouldShowError ? '输入 350、0350 或 03:50，自动整理为 mm:ss。' : '请输入 02:00 到 10:00 之间的有效配速。';

    if (valid) {
      state.pbSeconds = seconds;
      state.pbPace = formatPace(seconds);
      render();
    }
  });

  $('#pbPace').addEventListener('blur', event => {
    const seconds = parsePace(event.target.value);
    if (seconds === null) {
      event.target.value = state.pbPace;
      event.target.classList.remove('invalid');
      $('#paceHint').classList.remove('error');
      $('#paceHint').textContent = '输入 350、0350 或 03:50，自动整理为 mm:ss。';
      return;
    }

    state.pbSeconds = seconds;
    state.pbPace = formatPace(seconds);
    render();
  });
}

function setupInstallPrompt() {
  let installPrompt = null;
  const button = $('#installBtn');

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    button.hidden = false;
  });

  button.addEventListener('click', async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    installPrompt = null;
    button.hidden = true;
  });
}

function setupOfflineIndicator() {
  function updateOnlineStatus() {
    const existing = document.querySelector('.offline-indicator');
    if (!navigator.onLine && !existing) {
      const indicator = document.createElement('div');
      indicator.className = 'offline-indicator';
      indicator.textContent = '离线模式';
      document.body.appendChild(indicator);
    } else if (navigator.onLine && existing) {
      existing.remove();
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

load();
bindEvents();
setupInstallPrompt();
setupOfflineIndicator();
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./sw.js', location.href))
      .then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(err => console.error('SW registration failed:', err));
  });
}

function showUpdateNotification() {
  const banner = document.createElement('div');
  banner.className = 'update-banner';
  banner.innerHTML = '<span>新版本已就绪</span><button class="ghost-btn" id="reloadBtn">刷新</button>';
  document.body.appendChild(banner);

  $('#reloadBtn').addEventListener('click', () => {
    window.location.reload();
  });
}
