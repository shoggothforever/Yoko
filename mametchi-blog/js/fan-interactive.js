/**
 * まめっちポータル — インタラクティブ機能
 * リンクナビ + HUDカウンター + Ghost対話ウィジェット
 */
(function() {
'use strict';

// ============================================================
// 1. リンクデータ
// ============================================================
const LINKS = {
  official: [
    { title: 'たまごっち公式サイト', url: 'https://toy.bandai.co.jp/series/tamagotchi/', desc: 'バンダイ公式のたまごっち総合ページ' },
    { title: 'Tamagotchi Official (海外)', url: 'https://tamagotchi-official.com/', desc: '海外向け公式サイト — What is Tamagotchi?' },
    { title: 'バンダイ公式', url: 'https://www.bandai.co.jp/', desc: 'バンダイナムコグループ公式' },
    { title: 'テレビアニメ情報', url: 'https://www.tv-tokyo.co.jp/anime/tamagotchi/', desc: 'テレビ東京系で放送されたたまごっちアニメ' },
  ],
  games: [
    { title: 'Tamagotchi Uni 公式', url: 'https://toy.bandai.co.jp/series/tamagotchi/', desc: '最新たまごっちデバイス — Wi-Fi対応！' },
    { title: 'My Tamagotchi Forever', url: 'https://en.bandainamcoent.eu/tamagotchi/my-tamagotchi-forever', desc: 'スマホ向け無料たまごっちゲーム' },
    { title: 'Tamagotchi Plaza (Switch)', url: 'https://en.bandainamcoent.eu/tamagotchi/tamagotchi-plaza', desc: 'Nintendo Switch向けたまごっちゲーム' },
  ],
  shop: [
    { title: 'プレミアムバンダイ', url: 'https://p-bandai.jp/', desc: '限定版たまごっちグッズが買える公式通販' },
    { title: 'Premium Bandai (海外)', url: 'https://p-bandai.com/us/', desc: '海外向けプレミアムバンダイ' },
    { title: 'Amazon たまごっち', url: 'https://www.amazon.co.jp/', desc: 'たまごっちデバイス・関連商品' },
  ],
  wiki: [
    { title: 'Tamagotchi Wiki (Fandom)', url: 'https://tamagotchi.fandom.com/', desc: '世界最大のたまごっち情報Wiki' },
    { title: 'Wikipedia たまごっち', url: 'https://ja.wikipedia.org/wiki/たまごっち', desc: '日本語Wikipedia — たまごっちの歴史' },
    { title: 'Mimitchi.com', url: 'https://mimitchi.com/', desc: 'たまごっちファンサイト — 育成ガイド' },
  ],
  sns: [
    { title: 'たまごっち公式X (@TMGC_net)', url: 'https://twitter.com/TMGC_net', desc: '最新ニュース・イベント情報' },
    { title: 'Instagram (tamagotchi_jp)', url: 'https://www.instagram.com/tamagotchi_jp/', desc: '公式ビジュアル・グッズ紹介' },
    { title: 'YouTube たまごっち', url: 'https://www.youtube.com/@tamagotchi_official', desc: '公式動画チャンネル' },
    { title: 'Reddit r/tamagotchi', url: 'https://www.reddit.com/r/tamagotchi/', desc: '英語圏最大のたまごっちコミュニティ' },
    { title: 'TamaTalk', url: 'https://www.tamatalk.com/', desc: '歴史あるたまごっちフォーラム' },
  ],
  guide: [
    { title: 'Fandom 進化ガイド', url: 'https://tamagotchi.fandom.com/wiki/Mametchi', desc: 'まめっちの詳細キャラクター情報' },
    { title: 'キャラクター一覧', url: 'https://tamagotchi.fandom.com/wiki/Category:Characters', desc: '全たまごっちキャラクター図鑑' },
    { title: 'Wikipedia 登場キャラクター', url: 'https://ja.wikipedia.org/wiki/たまごっちの登場キャラクター', desc: '日本語の包括的なキャラクター解説' },
  ]
};

// ============================================================
// 2. リンクグリッド描画
// ============================================================
function renderLinks(cat) {
  const grid = document.getElementById('link-grid');
  if (!grid) return;
  grid.innerHTML = (LINKS[cat] || []).map(l => `
    <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="link-card">
      <div class="link-card-title">${l.title}</div>
      <div class="link-card-desc">${l.desc}</div>
      <span class="link-card-arrow">→</span>
    </a>
  `).join('');
}

function initLinkTabs() {
  const tabs = document.getElementById('link-tabs');
  if (!tabs) return;
  tabs.addEventListener('click', function(e) {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderLinks(btn.dataset.cat);
  });
  renderLinks('official');
}

// ============================================================
// 3. HUD カウントアップアニメーション
// ============================================================
function initHUD() {
  const stats = document.querySelectorAll('.hud-stat');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target) || 0;
        const valueEl = el.querySelector('.hud-value');
        if (!valueEl || valueEl.dataset.counted) return;
        valueEl.dataset.counted = 'true';
        animateCount(valueEl, 0, target, 1500);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
}

function animateCount(el, start, end, duration) {
  const startTime = performance.now();
  function update(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(start + (end - start) * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ============================================================
// 4. タイプライター効果
// ============================================================
function initTypewriter() {
  const el = document.getElementById('hero-motto');
  if (!el) return;
  const text = '成为最棒的発明家，让大家都幸福！ わくわく♪';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 800);
}

// ============================================================
// 5a. Ghost 語音再生
// ============================================================
let ghostMsgCount = 0;
let currentAudio = null;

function pickVoiceClip(content) {
  if (/やぁ|こんにちは|你好|えへへ/.test(content)) return 'greeting';
  if (/なるほど|すごい|その通り|同意/.test(content)) return 'agree';
  if (/えっ|まさか|予想外|爆/.test(content)) return 'surprise';
  if (/頑張|任せ|大丈夫|きっと/.test(content)) return 'encourage';
  return 'thinking';
}

function playGhostVoice(content) {
  const clip = pickVoiceClip(content);
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  currentAudio = new Audio(`/audio/${clip}.mp3`);
  currentAudio.play().catch(() => {});
}

// ============================================================
// 5b. Ghost チャットウィジェット
// ============================================================
const GHOST_ID = 'mametchi';
let chatOpen = false, chatBusy = false;

window.toggleGhostChat = function() {
  const widget = document.getElementById('ghost-chat-widget');
  const toggle = document.getElementById('ghost-chat-toggle');
  if (!widget) return;
  chatOpen = !chatOpen;
  widget.classList.toggle('hidden', !chatOpen);
  if (toggle) toggle.classList.toggle('active', chatOpen);
  if (chatOpen) document.getElementById('ghost-chat-input')?.focus();
};

function addChatMessage(content, type) {
  const c = document.getElementById('ghost-chat-messages');
  if (!c) return;
  const div = document.createElement('div');
  div.className = `ghost-msg ghost-msg-${type}`;
  div.innerHTML = content;
  c.appendChild(div);
  c.scrollTop = c.scrollHeight;
}

async function sendChatMessage() {
  if (chatBusy) return;
  const input = document.getElementById('ghost-chat-input');
  if (!input || !input.value.trim()) return;
  const message = input.value.trim();
  input.value = '';
  chatBusy = true;
  addChatMessage(message, 'user');
  addChatMessage('<span class="typing-dots">●●●</span>', 'ghost-typing');

  try {
    const data = await directChat(GHOST_ID, message);
    document.querySelector('.ghost-msg-ghost-typing')?.remove();
    ghostMsgCount++;
    const voiceBtn = `<button class="ghost-voice-btn" onclick="playGhostVoice(this.dataset.content)" data-content="${data.content.replace(/"/g, '&quot;')}">🔈</button>`;
    addChatMessage(`<strong>${data.ghost_name||'まめっち'}</strong>${voiceBtn}<br>${formatMD(data.content)}`, 'ghost');
    if (ghostMsgCount === 1) playGhostVoice(data.content);
  } catch (e) {
    document.querySelector('.ghost-msg-ghost-typing')?.remove();
    addChatMessage('まめっちは実験中...あとでまた来てね 🥚💤', 'system');
  } finally {
    chatBusy = false;
  }
}

function formatMD(t) { return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/\n/g,'<br>'); }

function initGhostChat() {
  document.getElementById('ghost-chat-toggle')?.addEventListener('click', window.toggleGhostChat);
  document.getElementById('ghost-chat-send')?.addEventListener('click', sendChatMessage);
  document.getElementById('ghost-chat-input')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
  });
}

// ============================================================
// 6. ピクセルパーティクル
// ============================================================
function initParticles() {
  const c = document.getElementById('hero-particles');
  if (!c) return;
  const chars = ['⬜', '🟦', '⬜', '🟦', '✨', '🔧', '⚡'];
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.textContent = chars[Math.floor(Math.random() * chars.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.animationDuration = (8 + Math.random() * 8) + 's';
    p.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';
    c.appendChild(p);
  }
}

// ============================================================
// 7. スムーズスクロール
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  initLinkTabs();
  initHUD();
  initTypewriter();
  initGhostChat();
  initParticles();
  initSmoothScroll();
});

})();
