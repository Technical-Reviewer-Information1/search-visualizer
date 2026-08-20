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

  function init() {
    const lReset = runner('l', linFrames, drawLin, LIN, 9);
    const bReset = runner('b', binFrames, drawBin, BIN, 11);
    document.querySelectorAll('[data-lt]').forEach(b => b.addEventListener('click', () => lReset(+b.dataset.lt)));
    document.querySelectorAll('[data-bt]').forEach(b => b.addEventListener('click', () => bReset(+b.dataset.bt)));
    $('nSize').addEventListener('input', drawCmp);
    $('bench').addEventListener('click', bench);
    drawCmp(); bench();

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
