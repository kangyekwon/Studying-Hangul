// Guestbook - Local messages + Giscus community board
var GUESTBOOK_KEY = 'kpop_guestbook';

function getGuestbookMessages() {
  try { return JSON.parse(localStorage.getItem(GUESTBOOK_KEY) || '[]'); } catch(e) { return []; }
}

function saveGuestbookMessage(name, msg) {
  var messages = getGuestbookMessages();
  messages.unshift({ name: name || 'Anonymous', msg: msg, date: new Date().toLocaleString('ko-KR') });
  if (messages.length > 200) messages = messages.slice(0, 200);
  localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(messages));
}

function deleteGuestbookMessage(idx) {
  var messages = getGuestbookMessages();
  messages.splice(idx, 1);
  localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(messages));
  showGuestbook(document.getElementById('gameArea'));
}

function showGuestbook(c) {
  var messages = getGuestbookMessages();
  var h = '<h2 class="game-title">Guestbook</h2>';

  // Local message form
  h += '<div style="max-width:600px;margin:0 auto 20px;">';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px;">Leave a message!</p>';
  h += '<div style="display:flex;gap:10px;margin-bottom:10px;">';
  h += '<input type="text" id="gbName" placeholder="Nickname" maxlength="20" style="flex:1;padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;font-size:0.95rem;outline:none;">';
  h += '</div>';
  h += '<textarea id="gbMsg" placeholder="Write your message here..." maxlength="500" rows="3" style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;font-size:0.95rem;resize:vertical;outline:none;font-family:inherit;"></textarea>';
  h += '<div style="text-align:right;margin-top:8px;">';
  h += '<button class="game-btn" id="gbSubmit">Post</button>';
  h += '</div>';
  h += '</div>';

  // Messages list
  h += '<div style="max-width:600px;margin:0 auto;">';
  if (messages.length === 0) {
    h += '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:30px 0;">No messages yet. Be the first!</p>';
  } else {
    h += '<h3 style="text-align:center;color:var(--neon-cyan,#00f5d4);margin-bottom:15px;">Messages (' + messages.length + ')</h3>';
    for (var i = 0; i < messages.length; i++) {
      var m = messages[i];
      h += '<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px 16px;margin-bottom:10px;">';
      h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
      h += '<span style="font-weight:700;color:var(--neon-pink,#ff2d95);">' + escapeHTML(m.name) + '</span>';
      h += '<span style="font-size:0.75rem;color:rgba(255,255,255,0.4);">' + escapeHTML(m.date) + '</span>';
      h += '</div>';
      h += '<p style="color:rgba(255,255,255,0.85);line-height:1.5;word-break:break-word;">' + escapeHTML(m.msg) + '</p>';
      h += '<button class="gb-del-btn" data-idx="' + i + '" style="background:none;border:none;color:rgba(255,255,255,0.3);font-size:0.75rem;cursor:pointer;padding:4px 0;margin-top:4px;">Delete</button>';
      h += '</div>';
    }
  }
  h += '</div>';

  // Giscus community section
  h += '<div style="max-width:600px;margin:30px auto 0;border-top:1px solid rgba(255,255,255,0.1);padding-top:25px;">';
  h += '<h3 style="text-align:center;color:var(--neon-cyan,#00f5d4);margin-bottom:5px;">Community Board</h3>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.5);font-size:0.85rem;margin-bottom:15px;">GitHub login required</p>';
  h += '<div id="giscusContainer"></div>';
  h += '</div>';

  c.innerHTML = h;

  // Submit handler
  document.getElementById('gbSubmit').addEventListener('click', function() {
    var name = document.getElementById('gbName').value.trim();
    var msg = document.getElementById('gbMsg').value.trim();
    if (!msg) return;
    saveGuestbookMessage(name, msg);
    showGuestbook(c);
  });

  // Enter key in textarea (Ctrl+Enter to submit)
  document.getElementById('gbMsg').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      document.getElementById('gbSubmit').click();
    }
  });

  // Delete handlers
  var delBtns = c.querySelectorAll('.gb-del-btn');
  for (var d = 0; d < delBtns.length; d++) {
    delBtns[d].addEventListener('click', function() {
      var idx = parseInt(this.getAttribute('data-idx'));
      if (confirm('Delete this message?')) deleteGuestbookMessage(idx);
    });
  }

  // Load Giscus
  loadGiscus();
}

function loadGiscus() {
  var container = document.getElementById('giscusContainer');
  if (!container) return;
  container.innerHTML = '';
  var script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'kangyekwon/Studying-Hangul');
  script.setAttribute('data-repo-id', 'R_kgDORNb0PA');
  script.setAttribute('data-category', 'General');
  script.setAttribute('data-category-id', 'DIC_kwDORNb0PM4C4c0Y');
  script.setAttribute('data-mapping', 'specific');
  script.setAttribute('data-term', 'Guestbook');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', 'dark_tritanopia');
  script.setAttribute('data-lang', 'ko');
  script.setAttribute('data-loading', 'lazy');
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;
  container.appendChild(script);
}

function escapeHTML(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
