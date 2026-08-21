(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const LIN = [2, 5, 9, 1, 7];
  const BIN = [3, 4, 6, 7, 11];

  const LIN_CODE = [
    'Hairetsu = [2, 5, 9, 1, 7]',
    'tansakuchi = 【探す値を入力】',
    'i を 0 から 4 まで 1 ずつ増やしながら繰り返す:',
    '│ もし Hairetsu[i] == tansakuchi ならば:',
    '└ └ 表示する(i)'
  ];
  const BIN_CODE = [
    'Hairetsu = [3, 4, 6, 7, 11]',
    'tansakuchi = 【探す値を入力】',
    'hajime = 0',
    'owari = 4',
    'hajime <= owari の間繰り返す:',
    '│ kijun = (hajime + owari) ÷ 2',
    '│ もし Hairetsu[kijun] == tansakuchi ならば:',
    '│ │ 表示する(kijun)',
    '│ │ プログラムを終了する',
    '│ そうでなくもし Hairetsu[kijun] < tansakuchi ならば:',
    '│ │ hajime = kijun + 1',
    '│ そうでなければ:',
    '└ └ owari = kijun - 1'
  ];

  /* ---------- 線形探索の手順 ---------- */
  function linFrames(a, t) {
    const fr = [];
    fr.push({ now: -1, checked: [], found: -1, line: 2, cnt: 0,
      msg: '探す値は <strong>' + t + '</strong>。先頭（添字0）から順に見ていきます。' });
    for (let i = 0; i < a.length; i++) {
      fr.push({ now: i, checked: fr[fr.length - 1].checked.slice(), found: -1, line: 4, cnt: i + 1,
        msg: 'Hairetsu[' + i + ']＝' + a[i] + ' と ' + t + ' を比べます。' });
      if (a[i] === t) {
        fr.push({ now: i, checked: fr[fr.length - 1].checked.slice(), found: i, line: 5, cnt: i + 1,
          msg: '<strong>見つかりました。</strong>添字 <strong>' + i + '</strong> を表示します（' + (i + 1) + '回目で発見）。' });
        return fr;
      }
      const ck = fr[fr.length - 1].checked.slice(); ck.push(i);
      fr.push({ now: -1, checked: ck, found: -1, line: 3, cnt: i + 1,
        msg: 'ちがうので、次へ進みます。' });
    }
    fr.push({ now: -1, checked: a.map((_, i) => i), found: -2, line: 3, cnt: a.length,
      msg: '<strong>最後まで調べましたが見つかりませんでした。</strong>線形探索では、ない値のときは必ず ' + a.length + ' 回かかります。' });
    return fr;
  }

  /* ---------- 二分探索の手順 ---------- */
  function binFrames(a, t) {
    const fr = [];
    let lo = 0, hi = a.length - 1, cnt = 0;
    fr.push({ lo: lo, hi: hi, mid: -1, found: -1, line: 4, cnt: 0,
      msg: '探す値は <strong>' + t + '</strong>。hajime＝0、owari＝' + hi + ' から始めます。' });
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      cnt++;
      fr.push({ lo: lo, hi: hi, mid: mid, found: -1, line: 6, cnt: cnt,
        msg: 'kijun ＝ (' + lo + ' ＋ ' + hi + ') ÷ 2 ＝ <strong>' + mid + '</strong>。真ん中は Hairetsu[' + mid + ']＝' + a[mid] + ' です。' });
      if (a[mid] === t) {
        fr.push({ lo: lo, hi: hi, mid: mid, found: mid, line: 8, cnt: cnt,
          msg: '<strong>一致しました。</strong>添字 <strong>' + mid + '</strong> を表示して終了します（' + cnt + '回目で発見）。' });
        return fr;
      }
      if (a[mid] < t) {
        lo = mid + 1;
        fr.push({ lo: lo, hi: hi, mid: mid, found: -1, line: 11, cnt: cnt,
          msg: '真ん中のほうが小さいので、探す値は<strong>右側</strong>にあります。hajime ＝ kijun ＋ 1 ＝ <strong>' + lo + '</strong> として、左半分を捨てます。' });
      } else {
        hi = mid - 1;
        fr.push({ lo: lo, hi: hi, mid: mid, found: -1, line: 13, cnt: cnt,
          msg: '真ん中のほうが大きいので、探す値は<strong>左側</strong>にあります。owari ＝ kijun − 1 ＝ <strong>' + hi + '</strong> として、右半分を捨てます。' });
      }
    }
    fr.push({ lo: lo, hi: hi, mid: -1, found: -2, line: 5, cnt: cnt,
      msg: '<strong>hajime が owari を追いこしたので終了。</strong>この値は配列にありませんでした（' + cnt + '回で判明）。' });
    return fr;
  }

  /* ---------- 描画 ---------- */
  function drawLin(a, frames, idx, t) {
    const f = frames[idx];
    $('lCells').innerHTML = a.map((v, k) => {
      let c = '';
      if (f.found === k) c = 'hit';
      else if (f.now === k) c = 'now';
      else if (f.checked.indexOf(k) >= 0) c = 'miss';
      return '<div class="c ' + c + '">' + v + '<em>[' + k + ']</em></div>';
    }).join('');
    $('lVars').innerHTML = (f.now >= 0 ? '<span class="v">i ＝ <b>' + f.now + '</b></span>' : '') +
      '<span class="v">tansakuchi ＝ <b>' + t + '</b></span>' +
      '<span class="v">調べた回数 <b>' + f.cnt + '</b></span>';
    $('lCnt').textContent = f.cnt;
    $('lCode').innerHTML = LIN_CODE.map((s, k) =>
      '<span class="ln' + (k + 1 === f.line ? ' on' : '') + '">(' + String(k + 1).padStart(2, '0') + ') ' +
      s.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>').join('');
    const n = $('lNote');
    n.className = 'note ' + (f.found >= 0 ? 'ok' : (f.found === -2 ? 'ng' : 'info'));
    n.innerHTML = f.msg;
    $('lProg').textContent = (idx + 1) + ' / ' + frames.length;
  }
  function drawBin(a, frames, idx, t) {
    const f = frames[idx];
    $('bCells').innerHTML = a.map((v, k) => {
      let c = '';
      if (f.found === k) c = 'hit';
      else if (k < f.lo || k > f.hi) c = 'out';
      else if (f.mid === k) c = 'mid';
      else c = 'range';
      return '<div class="c ' + c + '">' + v + '<em>[' + k + ']</em></div>';
    }).join('');
    $('bVars').innerHTML =
      '<span class="v">hajime ＝ <b>' + f.lo + '</b></span>' +
      '<span class="v">owari ＝ <b>' + f.hi + '</b></span>' +
      (f.mid >= 0 ? '<span class="v">kijun ＝ <b>' + f.mid + '</b></span>' : '') +
      '<span class="v">tansakuchi ＝ <b>' + t + '</b></span>';
    $('bCnt').textContent = f.cnt;
    $('bLeft').textContent = Math.max(0, f.hi - f.lo + 1) + ' 個';
    $('bCode').innerHTML = BIN_CODE.map((s, k) =>
      '<span class="ln' + (k + 1 === f.line ? ' on' : '') + '">(' + String(k + 1).padStart(2, '0') + ') ' +
      s.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>').join('');
    const n = $('bNote');
    n.className = 'note ' + (f.found >= 0 ? 'ok' : (f.found === -2 ? 'ng' : 'info'));
    n.innerHTML = f.msg;
    $('bProg').textContent = (idx + 1) + ' / ' + frames.length;
  }

  function runner(pre, build, draw, arr, initTarget) {
    let target = initTarget, frames = build(arr, target), i = 0, timer = null;
    function show() { draw(arr, frames, i, target); $(pre + 'Step').disabled = i >= frames.length - 1; }
    function reset(t) { if (t !== undefined) target = t; frames = build(arr, target); i = 0; stop(); show(); }
    function stop() { if (timer) clearInterval(timer); timer = null; $(pre + 'Play').textContent = '自動で動かす'; }
    $(pre + 'Step').addEventListener('click', () => { if (i < frames.length - 1) { i++; show(); } });
    $(pre + 'Reset').addEventListener('click', () => reset());
    $(pre + 'Play').addEventListener('click', () => {
      if (timer) { stop(); return; }
      $(pre + 'Play').textContent = '止める';
      timer = setInterval(() => { if (i >= frames.length - 1) { stop(); return; } i++; show(); }, 750);
    });
    show();
    return reset;
  }

  /* ---------- STEP 3 ---------- */
  const SIZES = [10, 100, 500, 1000, 10000, 100000, 1000000];
  function drawCmp() {
    const n = SIZES[+$('nSize').value - 1];
    $('nSizeV').textContent = n.toLocaleString();
    const b = Math.floor(Math.log2(n)) + 1;
    $('linMax').textContent = n.toLocaleString() + ' 回';
    $('binMax').textContent = b + ' 回';
    $('ratio').textContent = '約 ' + Math.round(n / b).toLocaleString() + ' 分の1';
    const nt = $('cmpNote');
    nt.className = 'note ok';
    nt.innerHTML = '要素数 ' + n.toLocaleString() + ' 個のとき、線形探索は最悪 <strong>' + n.toLocaleString() +
      ' 回</strong>調べますが、二分探索は <strong>' + b + ' 回</strong>で済みます。' +
      '<br>二分探索の回数は、<strong>2を何回かければ n を超えるか</strong>で決まります（' + n.toLocaleString() +
      ' なら 2<sup>' + b + '</sup> ＝ ' + Math.pow(2, b).toLocaleString() + ' なので ' + b + ' 回）。';
  }
  function bench() {
    const n = SIZES[+$('nSize').value - 1], cap = Math.min(n, 200000);
    const a = []; for (let k = 0; k < cap; k++) a.push(k * 2);
    let ls = 0, bs = 0;
    for (let r = 0; r < 100; r++) {
      const t = a[Math.floor(Math.random() * cap)];
      let c = 0; for (let k = 0; k < cap; k++) { c++; if (a[k] === t) break; } ls += c;
      let lo = 0, hi = cap - 1, c2 = 0;
      while (lo <= hi) { const m = Math.floor((lo + hi) / 2); c2++; if (a[m] === t) break; if (a[m] < t) lo = m + 1; else hi = m - 1; }
      bs += c2;
    }
    $('benchTable').innerHTML = '<thead><tr><th></th><th>平均の回数</th><th>最悪の回数</th></tr></thead><tbody>' +
      '<tr><td>線形探索</td><td class="mono">' + Math.round(ls / 100).toLocaleString() + ' 回</td><td class="mono">' + cap.toLocaleString() + ' 回</td></tr>' +
      '<tr><td>二分探索</td><td class="mono">' + (bs / 100).toFixed(1) + ' 回</td><td class="mono">' + (Math.floor(Math.log2(cap)) + 1) + ' 回</td></tr></tbody>' +
      (cap < n ? '<caption class="small" style="caption-side:bottom;color:var(--muted);text-align:left">※ 実測は ' + cap.toLocaleString() + ' 個で行いました</caption>' : '');
  }


  /* ===================== 数当てゲーム（1〜100） ===================== */
  const G = { mode: 'you', lo: 1, hi: 100, n: 0, secret: 0, log: [], over: false, ask: 0 };

  function gBar() {
    const w = 100, box = $('gBar');
    let h = '';
    for (let t = 10; t < 100; t += 10) h += '<span class="tick" style="left:' + t + '%"></span>';
    h += '<span class="lab" style="left:4px">1</span><span class="lab" style="right:4px">100</span>';
    const left = (G.lo - 1) / w * 100, width = (G.hi - G.lo + 1) / w * 100;
    h += '<span class="live" style="left:' + left + '%;width:' + width + '%"></span>';
    G.log.forEach(function (r) {
      h += '<span class="say" style="left:' + ((r.g - 0.5) / w * 100) + '%;height:' + (r.ok ? 38 : 20) + 'px"></span>';
    });
    h += '<span class="cap">候補 ' + G.lo + ' 〜 ' + G.hi + '</span>';
    box.innerHTML = h;
    $('gCnt').textContent = G.n;
    $('gLeft').textContent = (G.hi - G.lo + 1) + ' 個';
    $('gIdeal').textContent = Math.ceil(Math.log2(100)) + ' 回';
  }

  function gLog() {
    if (!G.log.length) { $('gLog').innerHTML = ''; return; }
    $('gLog').innerHTML = '<thead><tr><th>回</th><th>言った数</th><th>返事</th><th>そのとき残っていた候補</th>' +
      '<th>半分にできた？</th></tr></thead><tbody>' + G.log.map(function (r, i) {
        const half = r.before / 2, good = r.after <= Math.ceil(half);
        return '<tr><td>' + (i + 1) + '</td><td class="mono">' + r.g + '</td><td>' + r.msg + '</td>' +
          '<td class="mono">' + r.before + ' → ' + r.after + '</td>' +
          '<td class="' + (good ? 'near' : 'far') + '">' + (r.ok ? '—' : (good ? 'できた' : 'できていない')) + '</td></tr>';
      }).join('') + '</tbody>';
  }

  function gStart(mode) {
    G.mode = mode || G.mode; G.lo = 1; G.hi = 100; G.n = 0; G.log = []; G.over = false;
    G.secret = 1 + Math.floor(Math.random() * 100);
    $('gYou').hidden = G.mode !== 'you';
    $('gCpu').hidden = G.mode !== 'cpu';
    document.querySelectorAll('[data-mode]').forEach(b =>
      b.classList.toggle('primary', b.dataset.mode === G.mode));
    if ($('gIn')) $('gIn').value = '';
    const n = $('gNote'); n.className = 'note info';
    n.innerHTML = G.mode === 'you'
      ? 'コンピュータが 1〜100 の数を決めました。<strong>何回で当てられるか</strong>試してください。'
      : '1〜100 の数を心の中で決めて、コンピュータの質問に「もっと大きい／もっと小さい／当たり！」で答えてください。';
    if (G.mode === 'cpu') gCpuAsk();
    gBar(); gLog();
  }

  function gCpuAsk() {
    G.ask = Math.floor((G.lo + G.hi) / 2);
    $('gAsk').innerHTML = 'あなたの数は <strong>' + G.ask + '</strong> ですか？';
  }

  function gSay() {
    if (G.over) return;
    const g = Number($('gIn').value);
    if (!g || g < 1 || g > 100) {
      const n = $('gNote'); n.className = 'note warn';
      n.textContent = '1〜100 の数を入れてください。'; return;
    }
    const before = G.hi - G.lo + 1;
    G.n++;
    let msg, ok = false;
    if (g === G.secret) { ok = true; msg = '<strong>当たり！</strong>'; G.over = true; G.lo = G.hi = g; }
    else if (g < G.secret) { msg = 'もっと大きい'; G.lo = Math.max(G.lo, g + 1); }
    else { msg = 'もっと小さい'; G.hi = Math.min(G.hi, g - 1); }
    G.log.push({ g: g, msg: msg, ok: ok, before: before, after: G.hi - G.lo + 1 });
    gBar(); gLog();
    const n = $('gNote');
    if (ok) {
      const ideal = Math.ceil(Math.log2(100));
      n.className = 'note ' + (G.n <= ideal ? 'ok' : 'warn');
      n.innerHTML = '<strong>' + G.n + ' 回で当たりました。</strong>' +
        (G.n <= ideal
          ? '二分探索の最大 ' + ideal + ' 回以内です。毎回まん中を言えていたということです。'
          : '二分探索なら <strong>最大 ' + ideal + ' 回</strong>で必ず当たります。表の「半分にできた？」を見て、どの回でむだが出たか確かめましょう。') +
        '<br>100 → 50 → 25 → 13 → 7 → 4 → 2 → 1 と、<strong>7回で候補が1個になる</strong>のが二分探索です。';
    } else {
      n.className = 'note info';
      n.innerHTML = '答えは「' + msg + '」。候補は <strong>' + before + ' 個 → ' + (G.hi - G.lo + 1) + ' 個</strong>になりました。' +
        '次に言うとよい数は、いまの候補のまん中 <strong>' + Math.floor((G.lo + G.hi) / 2) + '</strong> です。';
    }
    $('gIn').value = '';
  }

  function gAnswer(kind) {
    if (G.over) return;
    const before = G.hi - G.lo + 1;
    G.n++;
    let msg, ok = false;
    if (kind === 'eq') { ok = true; msg = '<strong>当たり！</strong>'; G.over = true; G.lo = G.hi = G.ask; }
    else if (kind === 'hi') { msg = 'もっと大きい'; G.lo = G.ask + 1; }
    else { msg = 'もっと小さい'; G.hi = G.ask - 1; }
    G.log.push({ g: G.ask, msg: msg, ok: ok, before: before, after: G.hi - G.lo + 1 });
    gBar(); gLog();
    const n = $('gNote');
    if (ok) {
      n.className = 'note ok';
      n.innerHTML = '<strong>' + G.n + ' 回で当てました。</strong>コンピュータは毎回、残っている候補の<strong>まん中</strong>を聞いています。' +
        '候補が 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1 と半分ずつ減るので、<strong>どんな数でも7回以内</strong>で必ず当たります。' +
        'これが二分探索の強さです。';
    } else if (G.lo > G.hi) {
      n.className = 'note ng';
      n.innerHTML = '候補がなくなりました。<strong>途中の返事がどこかで食いちがっています。</strong>' +
        '二分探索は「返事が正しい」ことが前提です。「はじめから」でもう一度どうぞ。';
      G.over = true;
    } else {
      n.className = 'note info';
      n.innerHTML = '候補は <strong>' + before + ' 個 → ' + (G.hi - G.lo + 1) + ' 個</strong>。あと <strong>' +
        Math.ceil(Math.log2(G.hi - G.lo + 1)) + ' 回以内</strong>で必ず当たります。';
      gCpuAsk();
    }
  }

  /* ===================== 実験：並んでいないデータに二分探索 ===================== */
  const BAD = { sorted: [3, 5, 7, 9, 11, 15, 21], unsorted: [15, 9, 21, 3, 5, 11, 7] };
  function runBad(kind) {
    const a = BAD[kind].slice(), t = 7;
    let lo = 0, hi = a.length - 1, seen = [], found = -1;
    while (lo <= hi) {
      const m = Math.floor((lo + hi) / 2);
      seen.push(m);
      if (a[m] === t) { found = m; break; }
      if (a[m] < t) lo = m + 1; else hi = m - 1;
    }
    $('badCells').innerHTML = a.map(function (v, i) {
      const c = i === found ? 'hit' : (seen.indexOf(i) >= 0 ? 'miss' : '');
      return '<div class="c ' + c + '">' + v + '<em>[' + i + ']</em></div>';
    }).join('');
    const n = $('badNote');
    const at = a.indexOf(t);
    if (found >= 0) {
      n.className = 'note ok';
      n.innerHTML = '<strong>' + seen.length + ' 回で見つかりました（添字 ' + found + '）。</strong>' +
        '小さい順に並んでいるので、「まん中より大きい／小さい」でどちら側を捨てるか正しく決められます。';
    } else {
      n.className = 'note ng';
      n.innerHTML = '<strong>7 は配列の中（添字 ' + at + '）にあるのに、「見つかりません」で終わりました。</strong>' +
        '調べたのは添字 ' + seen.join(' → ') + ' の ' + seen.length +' か所だけ。' +
        '並んでいないと「まん中より大きいから右側にあるはず」という判断が成り立たず、' +
        '<strong>正しい側をまるごと捨ててしまいます</strong>。二分探索は必ず<strong>整列してから</strong>使います。';
    }
  }

  function init() {
    const lReset = runner('l', linFrames, drawLin, LIN, 9);
    const bReset = runner('b', binFrames, drawBin, BIN, 11);
    document.querySelectorAll('[data-lt]').forEach(b => b.addEventListener('click', () => lReset(+b.dataset.lt)));
    document.querySelectorAll('[data-bt]').forEach(b => b.addEventListener('click', () => bReset(+b.dataset.bt)));
    $('nSize').addEventListener('input', drawCmp);
    $('bench').addEventListener('click', bench);
    drawCmp(); bench();

    gStart('you');
    document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => gStart(b.dataset.mode)));
    $('gReset').addEventListener('click', () => gStart());
    $('gSay').addEventListener('click', gSay);
    $('gIn').addEventListener('keydown', e => { if (e.key === 'Enter') gSay(); });
    document.querySelectorAll('[data-ans]').forEach(b => b.addEventListener('click', () => gAnswer(b.dataset.ans)));
    document.querySelectorAll('[data-bad]').forEach(b => b.addEventListener('click', () => runBad(b.dataset.bad)));

    Quiz.choice('q10Box', 'q10Note', [
      { k: 'ア', q: '線形探索の特徴として最も適当なものは。',
        ch: ['整列されていないデータに対しても実行することができ、他の探索アルゴリズムに比べ、大規模なデータの探索に適している',
             '整列されていないデータに対しても実行することができ、他の探索アルゴリズムに比べ、処理が単純でわかりやすい',
             '整列されていないデータに対して実行することはできないが、他の探索アルゴリズムに比べ、大規模なデータの探索に適している',
             '整列されていないデータに対して実行することはできないが、他の探索アルゴリズムに比べ、処理が単純でわかりやすい'], a: 1,
        why: '線形探索は<strong>並んでいなくても使えます</strong>。ただし STEP 3 のとおり、大規模なデータには向きません。「並んでいる必要がある」のは二分探索のほうです。' },
      { k: 'イ', q: '[2, 5, 9, 1, 7] の線形探索で、i はどこからどこまで繰り返すか。',
        ch: ['0から4', '0から5', '1から4', '1から5'], a: 0,
        why: '添字は0から始まり、要素数5なので<strong>末尾の添字は4</strong>。0から4までです。' },
      { k: 'ウ', q: '(04)行目の条件は。',
        ch: ['i == tansakuchi', 'i != tansakuchi', 'Hairetsu[i] == tansakuchi', 'Hairetsu[i] != tansakuchi'], a: 2,
        why: '比べるのは<strong>添字 i ではなく中身 Hairetsu[i]</strong>です。ここを取り違えるミスが多いので注意。' }
    ], '本文の答えは【ア】①　【イ】⓪　【ウ】② です。');

    Quiz.choice('q11Box', 'q11Note', [
      { k: 'ア', q: '二分探索は、探索範囲のどの要素の値を基準にするか。',
        ch: ['先頭の', '中央の', '末尾の', 'ランダムな'], a: 1,
        why: '真ん中と比べるからこそ、1回で範囲を半分にできます。STEP 2 で確かめられます。' },
      { k: 'イ', q: '(06)行目：kijun ＝ ？',
        ch: ['hajime', 'owari', '(hajime + owari) ÷ 2', 'owari ÷ 2'], a: 2,
        why: '探索範囲の真ん中なので、両端の平均です。<span class="mono">owari ÷ 2</span> だと範囲がずれたときに真ん中になりません。' },
      { k: 'ウ', q: '(11)行目：真ん中より探す値が大きいとき。',
        ch: ['hajime = hajime + 1', 'hajime = kijun + 1', 'owari = owari − 1', 'owari = kijun − 1'], a: 1,
        why: '探す値は<strong>右側</strong>にあるので、左半分をまとめて捨てます。1つずつ動かす <span class="mono">hajime + 1</span> では半分に減りません。' },
      { k: 'エ', q: '(13)行目：真ん中より探す値が小さいとき。',
        ch: ['hajime = hajime + 1', 'hajime = kijun + 1', 'owari = owari − 1', 'owari = kijun − 1'], a: 3,
        why: '探す値は<strong>左側</strong>にあるので、右半分をまとめて捨てます。' }
    ], '本文の答えは【ア】①　【イ】②　【ウ】①　【エ】③ です。');

    window.Terms.glossary($('glossBox'), ['アルゴリズム', '線形探索', '二分探索', '配列', '添字', '変数', '整列', 'トレース']);
    window.Terms.attach();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
