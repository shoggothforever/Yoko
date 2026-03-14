/**
 * うさぎポータル — インタラクティブ機能
 * リンクナビ + Ghost対話ウィジェット
 */
(function() {
'use strict';

// ============================================================
// 1. リンクデータ
// ============================================================
const LINKS = {
  official: [
    { title: 'ちいかわ公式Twitter（@ngnchiikawa）', url: 'https://twitter.com/ngnchiikawa', desc: 'ナガノ先生による原作マンガ連載アカウント' },
    { title: 'ちいかわアニメ公式サイト', url: 'https://anime-chiikawa.jp/', desc: 'フジテレビ系列放送中のアニメ公式ページ' },
    { title: 'ちいかわインフォ', url: 'https://chiikawa-info.jp/', desc: 'イベント・コラボ・グッズなど全公式情報' },
    { title: 'TVer — 見逃し配信', url: 'https://tver.jp/', desc: '放送終了後の無料見逃し配信' },
    { title: 'FOD（フジテレビオンデマンド）', url: 'https://fod.fujitv.co.jp/', desc: '1週間限定見逃し配信' },
    { title: 'YouTube公式チャンネル', url: 'https://www.youtube.com/@ChiikawaVibe', desc: '最新エピソードを無料公開中' },
  ],
  manga: [
    { title: '講談社コミックス情報', url: 'https://kc.kodansha.co.jp/', desc: '単行本（通常版・特装版）の最新刊情報' },
    { title: 'Twitter原作連載', url: 'https://twitter.com/ngnchiikawa', desc: '原作マンガを毎日無料で読める' },
    { title: 'Amazon Kindle版', url: 'https://www.amazon.co.jp/', desc: '電子書籍版コミックスが購入可能' },
  ],
  games: [
    { title: 'ちいかわぽけっと（iOS）', url: 'https://apps.apple.com/app/chiikawa-pocket/id6714473917', desc: '公式スマホゲーム！お世話・着せ替え・おでかけ' },
    { title: 'ちいかわぽけっと（Android）', url: 'https://play.google.com/store/apps/details?id=jp.co.and.factory.chiikawa', desc: 'Android版の公式アプリ' },
  ],
  shop: [
    { title: 'ちいかわマーケット', url: 'https://chiikawamarket.jp/', desc: '公式WEBショップ — ぬいぐるみ・文具など' },
    { title: 'ちいかわらんど', url: 'https://chiikawa-info.jp/', desc: '東京・大阪など各地の公式ショップ' },
    { title: 'ナガノマーケット', url: 'https://nagano-market.jp/', desc: 'ナガノ先生作品全般の公式グッズ' },
  ],
  wiki: [
    { title: 'Chiikawa Wiki (Fandom)', url: 'https://chiikawa.fandom.com/', desc: '英語圏最大のちいかわ情報Wiki' },
    { title: 'ニコニコ大百科', url: 'https://dic.nicovideo.jp/a/ちいかわ', desc: '日本語の詳細な作品解説・考察' },
    { title: 'ピクシブ百科事典', url: 'https://dic.pixiv.net/a/ちいかわ', desc: 'pixivコミュニティによるキャラクター解説' },
  ],
  community: [
    { title: '#ちいかわ（Twitter）', url: 'https://twitter.com/hashtag/ちいかわ', desc: 'ファンアート・感想が毎日投稿される場' },
    { title: '#chiikawa（国際）', url: 'https://twitter.com/hashtag/chiikawa', desc: '海外ファンによるイラスト・翻訳' },
    { title: 'pixiv「ちいかわ」タグ', url: 'https://www.pixiv.net/tags/ちいかわ', desc: '高品質なファンアートの宝庫' },
    { title: 'Reddit r/chiikawa', url: 'https://www.reddit.com/r/chiikawa/', desc: '英語圏のディスカッションコミュニティ' },
  ]
};

// ============================================================
// 2. リンクグリッド描画
// ============================================================
function renderLinks(category) {
  const grid = document.getElementById('link-grid');
  if (!grid) return;
  const items = LINKS[category] || [];
  grid.innerHTML = items.map(link => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card">
      <div class="link-card-title">${link.title}</div>
      <div class="link-card-desc">${link.desc}</div>
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
// 3. Ghost チャットウィジェット
// ============================================================
const GHOST_ID = 'usagi';
let chatOpen = false;
let chatBusy = false;

window.toggleGhostChat = function() {
  const widget = document.getElementById('ghost-chat-widget');
  const toggle = document.getElementById('ghost-chat-toggle');
  if (!widget) return;
  chatOpen = !chatOpen;
  widget.classList.toggle('hidden', !chatOpen);
  if (toggle) toggle.classList.toggle('active', chatOpen);
  if (chatOpen) {
    document.getElementById('ghost-chat-input')?.focus();
  }
};

function addChatMessage(content, type) {
  const container = document.getElementById('ghost-chat-messages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `ghost-msg ghost-msg-${type}`;
  div.innerHTML = content;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
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
    const typing = document.querySelector('.ghost-msg-ghost-typing');
    if (typing) typing.remove();
    addChatMessage(`<strong>${data.ghost_name || 'うさぎ'}</strong><br>${formatMarkdown(data.content)}`, 'ghost');
  } catch (err) {
    const typing = document.querySelector('.ghost-msg-ghost-typing');
    if (typing) typing.remove();
    addChatMessage('うさぎは今お昼寝中...あとでまた来てね 🐰💤', 'system');
  } finally {
    chatBusy = false;
  }
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function initGhostChat() {
  const toggle = document.getElementById('ghost-chat-toggle');
  if (toggle) toggle.addEventListener('click', window.toggleGhostChat);

  const sendBtn = document.getElementById('ghost-chat-send');
  const input = document.getElementById('ghost-chat-input');
  if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);
  if (input) input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

// ============================================================
// 4. 草葉パーティクル
// ============================================================
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const emojis = ['🌿', '🍃', '🌸', '🍀', '✨'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 8 + 's';
    p.style.animationDuration = (6 + Math.random() * 6) + 's';
    p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    container.appendChild(p);
  }
}

// ============================================================
// 5. スムーズスクロール
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  initLinkTabs();
  initGhostChat();
  initParticles();
  initSmoothScroll();
});

})();
