/* myprimarynp — demo assistant widget (Desert Dawn) */
(function(){
  var IS_PORTAL = /portal/.test(location.pathname);

  var css = ''+
  '.mpnp-chat-btn{position:fixed;bottom:26px;right:26px;z-index:900;width:60px;height:60px;border-radius:50%;background:#D96C4F;border:none;cursor:pointer;box-shadow:0 10px 26px rgba(46,42,38,.28);display:flex;align-items:center;justify-content:center;transition:transform .15s,background .15s}'+
  '.mpnp-chat-btn:hover{transform:translateY(-2px);background:#C25A3F}'+
  '.mpnp-panel{position:fixed;bottom:100px;right:26px;z-index:901;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 130px);background:#fff;border:1px solid #ECE3D4;border-radius:22px;box-shadow:0 24px 60px rgba(46,42,38,.25);display:none;flex-direction:column;overflow:hidden;font-family:"Work Sans",system-ui,sans-serif}'+
  '.mpnp-panel.open{display:flex}'+
  '.mpnp-head{background:#F7EFE3;padding:16px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #ECE3D4}'+
  '.mpnp-head .t{font-family:Outfit,sans-serif;font-weight:700;font-size:16px;color:#2E2A26}'+
  '.mpnp-head .s{font-family:"DM Mono",monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#8C6A3F}'+
  '.mpnp-close{margin-left:auto;background:none;border:none;font-size:20px;color:#8C7F6E;cursor:pointer;line-height:1}'+
  '.mpnp-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}'+
  '.mpnp-m{max-width:85%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5;color:#2E2A26}'+
  '.mpnp-m.bot{background:#F7EFE3;border-bottom-left-radius:4px;align-self:flex-start}'+
  '.mpnp-m.me{background:#FDEEE8;border-bottom-right-radius:4px;align-self:flex-end}'+
  '.mpnp-m.alert{background:#FDECEC;border:1px solid #E8B4B4}'+
  '.mpnp-m a{color:#C25A3F;font-weight:600}'+
  '.mpnp-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 10px}'+
  '.mpnp-chip{border:1.5px solid #ECE3D4;background:#fff;border-radius:999px;padding:7px 14px;font-size:13px;font-family:"Work Sans",sans-serif;color:#2E2A26;cursor:pointer;transition:border .15s}'+
  '.mpnp-chip:hover{border-color:#D96C4F;color:#C25A3F}'+
  '.mpnp-inrow{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #ECE3D4}'+
  '.mpnp-in{flex:1;border:1.5px solid #ECE3D4;border-radius:999px;padding:10px 16px;font-size:14px;font-family:"Work Sans",sans-serif;outline:none}'+
  '.mpnp-in:focus{border-color:#D96C4F}'+
  '.mpnp-send{background:#D96C4F;color:#fff;border:none;border-radius:999px;width:40px;height:40px;cursor:pointer;font-size:16px}'+
  '.mpnp-foot{font-family:"DM Mono",monospace;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:#8C7F6E;text-align:center;padding:0 14px 10px}'+
  '@media(max-width:480px){.mpnp-panel{right:16px;bottom:92px}.mpnp-chat-btn{right:16px;bottom:20px}}';

  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var SUN = '<svg width="26" height="26" viewBox="0 0 120 120"><g stroke="#FAF4EA" stroke-width="8" stroke-linecap="round"><line x1="60" y1="18" x2="60" y2="32"/><line x1="30" y1="30" x2="40" y2="40"/><line x1="90" y1="30" x2="80" y2="40"/></g><path d="M 33 80 A 27 27 0 0 1 87 80 Z" fill="#FAF4EA"/><rect x="22" y="86" width="76" height="7" rx="3.5" fill="#FAF4EA"/></svg>';

  var btn = document.createElement('button');
  btn.className='mpnp-chat-btn'; btn.setAttribute('aria-label','Open chat assistant'); btn.innerHTML=SUN;

  var panel = document.createElement('div');
  panel.className='mpnp-panel';
  panel.innerHTML =
    '<div class="mpnp-head"><div><div class="t">myprimarynp assistant</div><div class="s">Automated AI assistant &middot; not a clinician</div></div><button class="mpnp-close" aria-label="Close chat">&times;</button></div>'+
    '<div class="mpnp-msgs"></div>'+
    '<div class="mpnp-chips"></div>'+
    '<div class="mpnp-inrow"><input class="mpnp-in" type="text" placeholder="Type a question&hellip;" aria-label="Chat message"><button class="mpnp-send" aria-label="Send">&#8594;</button></div>'+
    '<div class="mpnp-foot">Demo widget &middot; production connects to a HIPAA-compliant AI service</div>';

  document.body.appendChild(btn); document.body.appendChild(panel);

  var msgs = panel.querySelector('.mpnp-msgs'),
      chipsRow = panel.querySelector('.mpnp-chips'),
      input = panel.querySelector('.mpnp-in'),
      send = panel.querySelector('.mpnp-send');

  function add(text, who, alert){
    var d = document.createElement('div');
    d.className = 'mpnp-m ' + (who||'bot') + (alert?' alert':'');
    d.innerHTML = text;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function bot(text, alert){ setTimeout(function(){ add(text,'bot',alert); }, 420); }

  var CHIPS = IS_PORTAL
    ? ['Reschedule my visit','Refill request','Message Ann','Billing question']
    : ['Pricing','Weight loss program','Book a visit','I have a medical question'];

  function chips(){
    chipsRow.innerHTML='';
    CHIPS.forEach(function(c){
      var b=document.createElement('button'); b.className='mpnp-chip'; b.textContent=c;
      b.onclick=function(){ add(c,'me'); reply(c); };
      chipsRow.appendChild(b);
    });
  }

  var EMERGENCY = /(chest pain|can'?t breathe|trouble breathing|suicid|overdose|stroke|unconscious|severe bleeding|emergency|911)/i;
  var MEDICAL = /(symptom|pain|hurt|sick|fever|dose|dosage|nausea|dizz|rash|infection|bleed|pregnan|side effect|should i take|is it safe|diagnos|prescri|medication|swelling|headache|vomit)/i;

  function reply(q){
    var t = q.toLowerCase();
    if (EMERGENCY.test(t)) {
      bot('<b>If this is a medical emergency, call 911 or go to your nearest emergency room now.</b> This chat cannot help with emergencies.', true);
      return;
    }
    if (IS_PORTAL) {
      if (/resched|appointment|visit|cancel/.test(t)) return bot('I can help with that — your next appointment is <b>Thu, Aug 20 · 2:15 PM</b> (demo). Want me to open rescheduling? In production this connects to the practice calendar.');
      if (/refill/.test(t)) return bot('I’ve started a refill request for your current medication and routed it to Ann for review (demo). You’ll get a message when it’s approved — usually within one business day.');
      if (/message|ann|question/.test(t) || MEDICAL.test(t)) return bot('I don’t answer medical questions myself — but I’ll route your message straight to <b>Ann</b>, who reviews portal messages daily. Type your message and it goes to her inbox (demo).');
      if (/bill|charge|payment|price/.test(t)) return bot('Your membership is <b>$129/mo</b> (weight loss) — last charge Aug 1 (demo). For anything that looks wrong, I’ll flag it for the practice — want me to?');
      return bot('I can help with appointments, refills, billing, or routing a message to Ann. What do you need?');
    }
    if (MEDICAL.test(t) || /medical question/.test(t)) {
      return bot('I’m an automated assistant, so I don’t give medical advice — that’s Ann’s job, and she’s good at it. You can <a href="book.html">book a video visit</a> (same-week), or if you’re already a patient, <a href="portal.html">message her in the portal</a>.<br><br><b>If this is an emergency, call 911.</b>');
    }
    if (/price|pricing|cost|how much|fee/.test(t)) return bot('Simple pricing, no surprises: <b>$49</b> per primary-care visit (quick visits from $35), chronic-care plans from <b>$35/mo</b>, concierge <b>$85/mo</b>, and the weight-loss program is <b>$129/mo</b> + medication. Details: <a href="primary-care.html">primary care</a> · <a href="weight-loss.html">weight loss</a>.');
    if (/weight|glp|wegovy|zepbound|semaglutide|tirzepatide|foundayo/.test(t)) return bot('Our flagship program: <b>$129/mo</b> with FDA-approved GLP-1 medications only (Wegovy®, Zepbound®, and oral options) — never compounded copies. Every patient starts with a live video visit with Ann. <a href="weight-loss.html">See the program →</a>');
    if (/book|appointment|schedule|visit/.test(t)) return bot('Easy — most patients get seen the same week. <a href="book.html">Pick a time here →</a>');
    if (/insurance|medicare|covered/.test(t)) return bot('Visits and memberships are self-pay (that’s how we keep prices honest), but we work with your insurance for <b>medication</b> — including prior authorizations and the Medicare $50/mo Bridge program for those who qualify.');
    if (/hour|open|when|available/.test(t)) return bot('We’re telehealth, so no waiting room and no office hours to work around — visits are scheduled at times that fit you, usually within the week. <a href="book.html">See available times →</a>');
    if (/nevada|vegas|state|location|where/.test(t)) return bot('We see patients who are physically located in <b>Nevada</b> at the time of their visit — location is verified at every appointment.');
    if (/portal|login|account/.test(t)) return bot('Existing patients can <a href="portal.html">log in to the client portal</a> to message Ann, see appointments, and view documents.');
    if (/human|person|someone|staff|call/.test(t)) return bot('You’re chatting with an automated assistant. For a human: message us through the <a href="portal.html">portal</a> if you’re a patient, or <a href="book.html">book a visit</a> — Ann personally handles every appointment. (Production: this hands off to the practice’s staffed inbox.)');
    return bot('Happy to help! I can answer questions about pricing, the weight-loss program, primary care, insurance, or booking. For anything medical, I’ll point you to Ann — she’s the clinician here.');
  }

  function submit(){
    var v = input.value.trim(); if(!v) return;
    add(v,'me'); input.value=''; reply(v);
  }
  send.onclick = submit;
  input.addEventListener('keydown', function(e){ if(e.key==='Enter') submit(); });

  var opened = false;
  btn.onclick = function(){
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && !opened) {
      opened = true;
      bot(IS_PORTAL
        ? 'Hi! I’m the practice assistant. I can help with <b>appointments, refills, and billing</b>, or route a message to Ann. I’m an AI — I don’t give medical advice; anything clinical goes to Ann.'
        : 'Hi! I’m the myprimarynp assistant — an AI, not a clinician. Ask me about <b>pricing, programs, or booking</b>. Medical questions go to Ann — I’ll show you the fastest way to reach her.');
      chips();
      input.focus();
    }
  };
  panel.querySelector('.mpnp-close').onclick = function(){ panel.classList.remove('open'); };
})();
