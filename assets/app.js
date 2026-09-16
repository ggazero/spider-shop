const won = n => n.toLocaleString('ko-KR') + '원';
const findProduct = id => PRODUCTS.find(p => p.id === id);
const qs = key => new URLSearchParams(location.search).get(key);
const Cart = {
  read() {
    try {
      const data = JSON.parse(localStorage.getItem('haru_cart') || '[]');
      return Array.isArray(data) ? data.filter(i => i && findProduct(i.id) && Number.isSafeInteger(i.qty) && i.qty > 0 && i.qty <= 999) : [];
    } catch { return []; }
  },
  write(items) { localStorage.setItem('haru_cart', JSON.stringify(items)); },
  add(id) { const items = this.read(), hit = items.find(i => i.id === id); if(hit) hit.qty = Math.min(999, hit.qty + 1); else items.push({id,qty:1}); this.write(items); },
  remove(id) { this.write(this.read().filter(i => i.id !== id)); },
  clear() { localStorage.removeItem('haru_cart'); },
  count() { return this.read().reduce((s,i) => s+i.qty,0); },
  total() { return this.read().reduce((s,i) => s+findProduct(i.id).price*i.qty,0); },
  shipping() { return this.count() && this.total()<50000 ? 3000 : 0; }
};
const spiderMark = "<svg class=\"spider-mark\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 16L10 11L8 4M16 19L6 16L2 10M16 23L6 25L2 32M17 26L11 31L9 38M23 16L30 11L32 4M24 19L34 16L38 10M24 23L34 25L38 32M23 26L29 31L31 38\"/></g><ellipse cx=\"20\" cy=\"23\" rx=\"5\" ry=\"8\" fill=\"currentColor\"/><circle cx=\"20\" cy=\"13\" r=\"4\" fill=\"currentColor\"/></svg>";
const drawings = {
 wrist:'<rect x="79" y="28" width="62" height="145" rx="15"/><rect x="56" y="65" width="108" height="76" rx="15"/><circle cx="110" cy="102" r="24"/><path d="M91 102h38M110 83v38M94 86l32 32M126 86l-32 32"/>',
 goggles:'<path d="M28 79Q110 45 192 79L180 131Q153 151 125 126L110 112L95 126Q67 151 40 131Z"/><path d="M44 87Q72 72 98 86L88 115Q68 134 50 117ZM122 86Q151 72 178 87L172 117Q150 134 132 115Z"/><path d="M10 86h20M190 86h20"/>',
 belt:'<path d="M24 85Q110 64 196 85V124Q110 144 24 124Z"/><rect x="87" y="76" width="47" height="57" rx="5"/><path d="M101 88h20v32h-20zM41 85v40M62 81v48M152 81v48M175 85v40"/>',
 light:'<path d="M86 80h48v91H86zM78 45h64v35H78zM92 28h36v17H92z"/><path d="M97 96v53M122 96v53M55 50L38 40M165 50l17-10M61 28L50 12M159 28l11-16"/>',
 battery:'<rect x="66" y="35" width="88" height="136" rx="15"/><path d="M94 49h32M116 76l-25 37h21l-9 28 27-40h-22zM92 157h5M108 157h5M124 157h5"/>',
 gloves:'<path d="M80 168L49 120Q43 109 54 102Q61 99 71 111L77 116L66 59Q64 47 74 46Q84 43 88 58L96 89L92 35Q92 22 102 23Q112 22 114 36L118 86L123 40Q125 28 135 31Q143 32 142 46L138 92L150 59Q154 49 162 53Q172 56 168 69L157 136L139 168Z"/><path d="M81 151h64M99 119l25 15 22-20"/>'
};
// Surface accents remain inside each equipment silhouette.
const techDetails = {
 wrist: '<path class="tech-red" d="M61 78h16M143 127h16M82 37h56"/><path class="tech-blue" d="M83 154h54M87 92l23-13 23 13v20l-23 13-23-13z"/>',
 goggles: '<path class="tech-blue" d="M49 91l20-8 23 6M131 89l22-6 20 8"/><path class="tech-red" d="M34 81l14-5M172 76l14 5"/><path class="tech-web" d="M68 88v31M53 103h32M56 92l26 23M82 92l-26 23M56 98l12-7 13 7v10l-13 8-12-8z"/>',
 belt: '<path class="tech-red" d="M28 92h50M143 117h48"/><path class="tech-blue" d="M28 117h49M143 91h48"/><path class="tech-web" d="M111 92v24M103 104h16M104 95l14 18M118 95l-14 18"/>',
 light: '<path class="tech-red" d="M81 53h58M90 163h40"/><path class="tech-blue" d="M96 32h28M102 88v64"/><path class="tech-web" d="M84 61h52M110 49v25M92 50l36 23M128 50L92 73"/>',
 battery: '<path class="tech-red" d="M73 57v30M147 119v30"/><path class="tech-blue" d="M80 42h59M80 149h59"/><path class="tech-web" d="M77 62l63 81M78 83l62 39M78 109l62-33M78 131l62-64M83 72l51 8 5 48-52 8z"/>',
 gloves: '<path class="tech-red" d="M85 160h52M100 39l5 41"/><path class="tech-blue" d="M129 44l-3 41M82 64l7 26"/><path class="tech-web" d="M95 102l44 41M141 100l-47 40M118 98v47M93 123h50M101 112l17-10 18 10v20l-18 11-17-11z"/>'
};
function thumb(p) { return `<div class="thumb"><span class="thumb-code">${p.code}</span><svg viewBox="0 0 220 200" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${drawings[p.kind]}${techDetails[p.kind]}</svg><span class="thumb-caption">FIELD EQUIPMENT <b>+ ${p.id.slice(1).padStart(2,'0')}</b></span></div>`; }
let briefingId=0;
function briefing(title, body) { const id='briefing-'+(++briefingId); return `<div class="briefing"><h3><button class="brief-toggle" aria-expanded="false" aria-controls="${id}"><span class="spider" aria-hidden="true">${spiderMark}</span><span>${title}</span><span class="toggle-sign" aria-hidden="true">+</span></button></h3><div class="brief-content" id="${id}" hidden><div class="brief-inner"><p>${body}</p></div></div></div>`; }
function paintChrome() {
 document.querySelectorAll('.cart-count').forEach(b=>b.textContent=Cart.count());
 const foot=document.querySelector('footer.site .wrap');
 if(foot) foot.innerHTML=`<div><strong>${SHOP.name}</strong><p>${SHOP.tagline}</p></div><div class="footer-meta">NYC · UNOFFICIAL SUPPORT NETWORK<br>가상 상점 / 실제 결제 및 후원 없음</div>`;
}
function paintList() {
 const box=document.querySelector('#product-list'); if(!box)return;
 box.innerHTML=PRODUCTS.map(p=>`<a class="card" href="product.html?id=${p.id}">${thumb(p)}<div class="card-body"><h3>${p.name}</h3><p class="sum">${p.summary}</p><div class="card-bottom"><span class="price">${won(p.price)}</span><span class="card-arrow" aria-hidden="true">↗</span></div></div></a>`).join('');
 document.querySelector('#support-briefing').innerHTML=briefing('주문은 어떻게 조용한 후원이 되나요?', '이 상점의 이야기 속에서 당신의 주문은 야간 보급과 장비 유지를 돕습니다. 작은 물건 하나로 다음 밤을 준비하는 마음. 현재는 실제 후원금이 전달되지 않는 모의 상점입니다.');
}
function paintDetail() {
 const box=document.querySelector('#product-detail'); if(!box)return;
 const p=findProduct(qs('id')); if(!p){box.innerHTML='<div class="empty"><h1>보급품을 찾을 수 없습니다.</h1><a class="btn" href="index.html#supplies">보급 목록 확인하기</a></div>';return;}
 document.title=p.name+' — '+SHOP.name;
 box.innerHTML=`${thumb(p)}<div><p class="eyebrow">${p.code} / SUPPORT GEAR</p><p class="status-tag">SUPPORT ONLY</p><h1>${p.name}</h1><p class="lead">${p.summary}</p><div class="price">${won(p.price)}</div><div class="prose"><p>${p.detail[0]}</p><h2>이런 밤에 필요합니다</h2><p>${p.detail[1]}</p></div>${briefing(p.detail[2],p.detail[3])}${briefing('보급 전달 및 교환 안내','상품 합계 50,000원 이상 무료 배송, 미만은 3,000원. 발송은 영업일 기준 2일 이내, 교환·반품은 수령 후 7일 이내입니다.')}<button class="btn" id="add-to-cart">후원 목록에 담기 ↗</button><p id="cart-status" role="status" class="micro">가상의 장비 콘셉트 · 모의 주문 가능</p></div>`;
 document.querySelector('#add-to-cart').addEventListener('click',e=>{try {Cart.add(p.id);
   // 데이터 영역이 아직 없을 때도 동작하도록 안전 초기화
   window.dataLayer = window.dataLayer || [];
   // 전체 상품 10% 할인 — 할인 후 상품 금액 (배송비 제외)
   const salePrice = p.price * 0.9;
   // 앞에서 넣은 상품 값 비우기
   window.dataLayer.push({ ecommerce: null });
   window.dataLayer.push({
     event: 'add_to_cart',
     ecommerce: {
       currency: 'KRW',
       value: salePrice,
       items: [{
         item_id: p.id,
         item_name: p.name,
         price: salePrice,
         quantity: 1
       }]
     }
   });
   e.currentTarget.disabled=true;location.href='cart.html';}catch {document.querySelector('#cart-status').textContent='목록을 저장할 수 없습니다. 브라우저의 저장소 설정을 확인해 주세요.';}});
}
function totals() {return `<div class="cost-lines"><p><span>보급품 금액</span><strong>${won(Cart.total())}</strong></p><p><span>전달 비용</span><strong>${Cart.shipping()?won(Cart.shipping()):'무료'}</strong></p></div>`;}
function paintCart() {
 const box=document.querySelector('#cart-box');if(!box)return;
 const items=Cart.read();if(!items.length){box.innerHTML='<div class="empty"><span class="eyebrow">AWAITING SUPPLIES</span><h2>아직 도착한 지원품이 없습니다.</h2><p>작은 준비 하나가 긴 밤을 바꿉니다.</p><a class="btn" href="index.html#supplies">야간 보급품 보기 ↗</a></div>';return;}
 box.innerHTML=`<div class="table-scroll"><table class="cart"><thead><tr><th scope="col">지원 물품</th><th scope="col">수량</th><th scope="col">금액</th><th scope="col">변경</th></tr></thead><tbody>${items.map(i=>{const p=findProduct(i.id);return `<tr><td><a href="product.html?id=${p.id}">${p.name}</a><small>${p.code}</small></td><td>${i.qty}</td><td>${won(p.price*i.qty)}</td><td><button class="btn ghost drop" data-id="${p.id}" aria-label="${p.name} 목록에서 빼기">빼기</button></td></tr>`;}).join('')}</tbody></table></div><div class="cart-summary">${totals()}<div class="total">이번 지원 합계 <span>${won(Cart.total()+Cart.shipping())}</span></div><div class="actions"><a class="text-link" href="index.html#supplies">계속 둘러보기</a><a class="btn" href="checkout.html">후원 정보 입력 →</a></div><p id="cart-error" role="status"></p></div>`;
 box.querySelectorAll('.drop').forEach(b=>b.addEventListener('click',()=>{try{Cart.remove(b.dataset.id);paintCart();paintChrome();}catch{document.querySelector('#cart-error').textContent='저장소에 접근할 수 없습니다. 브라우저 설정을 확인해 주세요.';}}));
}
function paintCheckout(){
 const form=document.querySelector('#pay-form');if(!form)return;
 if(!Cart.count()){form.innerHTML='<div class="empty"><p>먼저 후원 물품을 선택해 주세요.</p><a class="btn" href="index.html#supplies">보급품 고르기</a></div>';return;}
 document.querySelector('#checkout-summary').innerHTML=totals();
 document.querySelector('#pay-total').textContent=won(Cart.total()+Cart.shipping());
 form.addEventListener('submit',e=>{e.preventDefault();if(!Cart.count()){paintCheckout();return;}try{Cart.clear();form.querySelector('button').disabled=true;location.href='done.html';}catch{form.querySelector('button').textContent='저장소 설정을 확인하고 다시 접수하기';}});
}
function paintProse(){for(const [selector,key]of [['#about-body','about'],['#shipping-body','shipping']]){const box=document.querySelector(selector);if(box)box.innerHTML=SHOP[key].map(([title,body])=>briefing(title,body)).join('');}}
// Finish hiding only after the reverse animation; cancel stale timers on rapid clicks.
const briefingTimers = new WeakMap();
document.addEventListener('click', e => {
 const button = e.target.closest('.brief-toggle');
 if (!button) return;
 const panel = document.getElementById(button.getAttribute('aria-controls'));
 const briefing = button.closest('.briefing');
 const open = button.getAttribute('aria-expanded') !== 'true';
 clearTimeout(briefingTimers.get(panel));
 button.setAttribute('aria-expanded', String(open));
 button.querySelector('.toggle-sign').textContent = open ? '−' : '+';
 panel.setAttribute('aria-hidden', String(!open));
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Freeze the current rendered height before reversing an in-flight transition.
 const currentHeight = panel.hidden ? 0 : panel.getBoundingClientRect().height;
 panel.hidden = false;
 panel.style.height = currentHeight + 'px';
 void panel.offsetHeight;
 briefing.classList.toggle('is-open', open);
 // Measure normal-flow content, including wrapped lines and paragraph padding.
 panel.style.height = open ? panel.querySelector('.brief-inner').scrollHeight + 'px' : '0px';
 const finish = () => {
   panel.hidden = !open;
   // Once open, natural height tracks mobile wrapping and later font changes.
   panel.style.height = open ? 'auto' : '0px';
 };
 if (reduced) finish();
 else briefingTimers.set(panel, setTimeout(finish, 400));
});
document.addEventListener('DOMContentLoaded',()=>{paintChrome();paintList();paintDetail();paintCart();paintCheckout();paintProse();});
window.addEventListener('storage',()=>{paintChrome();paintCart();if(document.querySelector('#pay-form'))location.reload();});
