(function(){
"use strict";
var d=document,b=d.body,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var raf=window.requestAnimationFrame||function(f){return setTimeout(f,16)};

/* ---- karnety na łuku (jak napis MAKAJUTO wokół anioła w logo) ---- */
var arc=$("#arc"),heroIn=$("#heroIn"),cards=arc?$$(".hc",arc):[],RATIO=600/415;
function place(){
  var W=arc.clientWidth,H=arc.clientHeight,desk=innerWidth>=900;
  if(!W||!H)return;
  var list,n,cw,ch,cx,cy,rx,ry,span;
  if(desk){
    list=cards;n=list.length;
    ch=Math.max(150,Math.min(H*0.27,330));cw=ch/RATIO;
    if(cw>W*0.105){cw=W*0.105;ch=cw*RATIO}
    cx=W/2;ry=H*0.62-ch*0.55;cy=H-ch*0.56-ry;rx=Math.min(W*0.43,W/2-cw*0.62);span=Math.PI/2+0.26;
    var hb=heroIn.offsetHeight,cTop=cy+ry-ch/2,top=Math.max(Math.min(cTop-28-hb,(cy+ry*0.15)-hb*0.45),H*0.05);
    heroIn.style.setProperty("--ty",Math.round(top)+"px");
  }else{
    list=W<520?cards.slice(3,8):cards.slice(2,9);n=list.length;
    ch=Math.min(H*0.74,228);cw=ch/RATIO;
    var cmax=Math.min(W*0.38,158);if(cw>cmax){cw=cmax;ch=cw*RATIO}
    span=1.0;cx=W/2;rx=W*0.50;ry=Math.max(20,Math.min((H-ch)*0.55,90));
    cy=H/2-ry*(1+Math.cos(span))/2;
  }
  cards.forEach(function(c){c.classList.toggle("off",list.indexOf(c)<0)});
  list.forEach(function(c,i){
    var s=n>1?(i/(n-1))*2-1:0,t=s*span,x=cx+rx*Math.sin(t),y=cy+ry*Math.cos(t);
    var rot=desk?(-t*180/Math.PI)*0.62:(-t*180/Math.PI)*0.42;
    c.style.setProperty("--cw",cw.toFixed(1)+"px");c.style.setProperty("--x",(x-cw/2).toFixed(1)+"px");
    c.style.setProperty("--y",(y-ch/2).toFixed(1)+"px");c.style.setProperty("--r",rot.toFixed(2)+"deg");
    c.style.zIndex=String(10-Math.round(Math.abs(s)*5));c.classList.add("on");
  });
}
if(arc){var pl=function(){raf(place)};pl();addEventListener("resize",function(){clearTimeout(place.t);place.t=setTimeout(pl,80)});if(d.fonts&&d.fonts.ready)d.fonts.ready.then(pl);addEventListener("load",pl)}

/* ---- menu mobilne ---- */
var burger=$("#burger");
function menu(open){b.classList.toggle("menu-open",open);burger.setAttribute("aria-expanded",open?"true":"false")}
if(burger){burger.addEventListener("click",function(){menu(!b.classList.contains("menu-open"))});
addEventListener("keydown",function(e){if(e.key==="Escape")menu(false)})}

/* ---- wszystkie kategorie (komputer) ---- */
var mmB=$("#mmBtn"),mm=$("#mm");
if(mmB&&mm){
  var mmSet=function(open){if(open)mm.removeAttribute("hidden");else mm.setAttribute("hidden","");mmB.setAttribute("aria-expanded",open?"true":"false")};
  var mmPick=function(i){$$(".mm-t",mm).forEach(function(t){t.classList.toggle("on",t.getAttribute("data-mm")===i)});$$(".mm-p",mm).forEach(function(p){if(p.getAttribute("data-mmp")===i)p.removeAttribute("hidden");else p.setAttribute("hidden","")})};
  mmB.addEventListener("click",function(e){e.stopPropagation();mmSet(mm.hasAttribute("hidden"))});
  $$(".mm-t",mm).forEach(function(t){var i=t.getAttribute("data-mm");
    t.addEventListener("mouseenter",function(){mmPick(i)});t.addEventListener("focus",function(){mmPick(i)});
    t.addEventListener("click",function(e){if(!t.classList.contains("on")){e.preventDefault();mmPick(i)}});
  });
  d.addEventListener("click",function(e){if(!mm.hasAttribute("hidden")&&!mm.contains(e.target))mmSet(false)});
  addEventListener("keydown",function(e){if(e.key==="Escape"&&!mm.hasAttribute("hidden")){mmSet(false);mmB.focus()}});
}

/* ---- wyszukiwarka na telefonie ---- */
var sb=$("#sbtn"),sr=$("#search");
if(sb&&sr)sb.addEventListener("click",function(){var on=!sr.classList.contains("on");sr.classList.toggle("on",on);sb.setAttribute("aria-expanded",on?"true":"false");if(on)$("input",sr).focus()});

/* ---- podgląd statyczny: wyszukiwarka z indeksu produktów ---- */
if(window.MK_PODGLAD){
  $$('form[role=search]').forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();var q=$("input[name=s]",f).value.trim();location.href=MK_PODGLAD+"szukaj/?q="+encodeURIComponent(q)})});
  $$("form").forEach(function(f){if(f.getAttribute("role")==="search")return;f.addEventListener("submit",function(e){e.preventDefault();toast("To wersja podglądowa: formularze, koszyk i zamówienia działają w sklepie testowym WordPress (sprawdzone, zrzuty w raporcie).")})});
  var wy=$("#mkWyniki");
  if(wy){var q=new URLSearchParams(location.search).get("q")||"";var h1=$("#mkQ");if(h1)h1.textContent=q;
    fetch(MK_PODGLAD+"szukaj.json").then(function(r){return r.json()}).then(function(L){
      var n=function(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ł/g,"l")};var sl=n(q).split(/\s+/).filter(Boolean);
      var r=L.filter(function(x){var t=n(x[0]+" "+x[4]);return sl.length&&sl.every(function(w){return t.indexOf(w)>=0})}).slice(0,120);
      var c=$("#mkIle");if(c)c.textContent=r.length+(r.length>=120?"+":"")+" wyników";
      wy.innerHTML=r.map(function(x){return '<article class="pc"><a class="pc-img" href="'+x[1]+'" tabindex="-1" aria-hidden="true">'+(x[3]?'<img src="'+x[3]+'" alt="" loading="lazy">':'')+'</a><h3 class="pc-t"><a href="'+x[1]+'">'+esc(x[0])+'</a></h3><div class="pc-b"><b class="pc-p">'+x[2]+'</b></div><a class="add" href="'+x[1]+'">Zobacz</a></article>'}).join("")||'<p>Brak wyników. Spróbuj innego słowa, np. „anioł”, „Biblia”, „kalendarz”.</p>';
    })}
}

/* ---- komunikat ---- */
var toastEl=$("#toast"),tt;
function toast(h){if(!toastEl)return;toastEl.innerHTML=h;toastEl.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove("on")},3200)}

/* ---- dodawanie do koszyka bez przeładowania ---- */
function doKoszyka(btn,id,qty){
  if(window.MK_PODGLAD){toast("To wersja podglądowa sklepu: koszyk i zamówienia działają w sklepie testowym WordPress. Tutaj zobaczysz wygląd i całą ofertę.");return true}
  if(!window.MK||btn.disabled)return false;
  btn.disabled=true;var txt=btn.textContent;btn.textContent="Dodaję...";
  var fd=new FormData();fd.append("product_id",id);fd.append("quantity",qty||1);
  fetch(MK.ajax.replace("%%endpoint%%","add_to_cart"),{method:"POST",body:fd,credentials:"same-origin"}).then(function(r){return r.json()}).then(function(r){
    btn.disabled=false;
    if(!r||r.error){btn.textContent=txt;if(r&&r.product_url){location.href=r.product_url}else toast("Nie udało się dodać produktu. Spróbuj ponownie.");return}
    if(r.fragments){Object.keys(r.fragments).forEach(function(k){var el=$(k);if(el)el.outerHTML=r.fragments[k]})}
    btn.classList.add("ok");btn.textContent="W koszyku";setTimeout(function(){btn.classList.remove("ok");btn.textContent=txt},1800);
    toast("Dodano do koszyka: <b>"+esc(btn.getAttribute("data-n")||"")+"</b> &nbsp;<a href=\""+MK.koszyk+"\">Przejdź do koszyka</a>");
  }).catch(function(){btn.disabled=false;btn.textContent=txt;toast("Brak połączenia. Spróbuj ponownie.")});
  return true;
}
d.addEventListener("click",function(e){var btn=e.target.closest("button.add[data-id]");if(!btn||btn.closest("form"))return;e.preventDefault();doKoszyka(btn,btn.getAttribute("data-id"),1)});
$$("form.mk-cart").forEach(function(f){f.addEventListener("submit",function(e){var btn=$("button.add",f),q=$("input[name=quantity]",f);if(doKoszyka(btn,btn.getAttribute("data-id"),q?q.value:1))e.preventDefault()})});

/* ---- ilość +/- ---- */
d.addEventListener("click",function(e){var bt=e.target.closest(".qm,.qp");if(!bt)return;var inp=$("input",bt.parentNode);if(!inp)return;var v=parseInt(inp.value,10)||1,mx=parseInt(inp.max,10)||9999;v=bt.classList.contains("qp")?Math.min(mx,v+1):Math.max(1,v-1);inp.value=v;inp.dispatchEvent(new Event("change",{bubbles:true}))});

/* ---- karuzele: palec, mysz, strzałki, pasek ---- */
$$("[data-track]").forEach(function(tr){
  var box=tr.parentNode,ctl=$(".ctl",box)||$(".ctl",box.parentNode),bar=box.querySelector(".bar i");
  var p=ctl&&$(".p",ctl),n=ctl&&$(".n",ctl),cw=300;
  function upd(){raf(function(){var sw=tr.scrollWidth,cl=tr.clientWidth,sl=tr.scrollLeft,max=sw-cl,c=tr.children[0];if(c)cw=c.offsetWidth+16;
    if(p)p.disabled=sl<4;if(n)n.disabled=sl>max-4;
    if(bar){var f=cl/sw;bar.style.width=(f*100)+"%";bar.style.transform="translateX("+(max>0?sl/max*(1/f-1)*100:0)+"%)"}})}
  if(p)p.addEventListener("click",function(){tr.scrollBy({left:-cw*2,behavior:"smooth"})});
  if(n)n.addEventListener("click",function(){tr.scrollBy({left:cw*2,behavior:"smooth"})});
  tr.addEventListener("scroll",upd,{passive:true});addEventListener("resize",upd);addEventListener("load",upd);upd();
  var down=false,sx=0,sl=0,moved=false;
  tr.addEventListener("pointerdown",function(e){if(e.pointerType!=="mouse")return;down=true;moved=false;sx=e.clientX;sl=tr.scrollLeft});
  addEventListener("pointermove",function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>6){moved=true;tr.classList.add("drag")}if(moved)tr.scrollLeft=sl-dx});
  addEventListener("pointerup",function(){if(!down)return;down=false;if(moved)setTimeout(function(){tr.classList.remove("drag")},30)});
  tr.addEventListener("click",function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  tr.addEventListener("dragstart",function(e){e.preventDefault()});
});

/* ---- galeria karty produktu ---- */
var stage=$("#stage");
if(stage){
  var sts=$$(".st",stage),ths=$$(".th");
  var pick=function(i){sts.forEach(function(s,j){s.classList.toggle("on",j===i)});ths.forEach(function(t,j){t.classList.toggle("on",j===i)})};
  ths.forEach(function(t){t.addEventListener("click",function(){pick(+t.getAttribute("data-i"))})});
  var sx2=0;stage.addEventListener("touchstart",function(e){sx2=e.touches[0].clientX},{passive:true});
  stage.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-sx2;if(Math.abs(dx)<40||sts.length<2)return;var cur=sts.findIndex(function(s){return s.classList.contains("on")});pick((cur+(dx<0?1:-1)+sts.length)%sts.length);stage.dataset.sw="1";setTimeout(function(){delete stage.dataset.sw},350)},{passive:true});
  // wariant ze zdjęciem: pokaż jego zdjęcie
  var vf=$(".variations_form");
  if(vf&&window.jQuery){jQuery(vf).on("found_variation",function(e,v){if(v&&v.image_id){var i=sts.findIndex(function(s){return +s.getAttribute("data-aid")===v.image_id});if(i>=0)pick(i)}var pr=$("#ppP");if(pr&&v.price_html)pr.innerHTML=v.price_html;var av=$("#ppAv");if(av)av.innerHTML=v.is_in_stock?(v.max_qty?'<span class="av">dostępne: '+v.max_qty+' szt.</span>':'<span class="av av0">na zamówienie</span>'):'<span class="av av0">chwilowo niedostępny</span>'})}
}
/* warianty jako przyciski zamiast list rozwijanych */
$$(".variations select").forEach(function(sel){
  var wrap=d.createElement("div");wrap.className="vbtn";
  $$("option",sel).forEach(function(o){if(!o.value)return;var bt=d.createElement("button");bt.type="button";bt.textContent=o.textContent;bt.setAttribute("data-v",o.value);bt.setAttribute("aria-pressed","false");
    bt.addEventListener("click",function(){sel.value=o.value;if(window.jQuery)jQuery(sel).trigger("change");else sel.dispatchEvent(new Event("change",{bubbles:true}));$$("button",wrap).forEach(function(x){x.setAttribute("aria-pressed",x===bt?"true":"false")})});wrap.appendChild(bt)});
  sel.parentNode.insertBefore(wrap,sel);sel.classList.add("vsel");
  if(sel.value)$$("button",wrap).forEach(function(x){if(x.getAttribute("data-v")===sel.value)x.setAttribute("aria-pressed","true")});
  if(window.jQuery)jQuery(sel).closest("form").on("woocommerce_update_variation_values",function(){$$("button",wrap).forEach(function(x){var o=sel.querySelector('option[value="'+x.getAttribute("data-v").replace(/"/g,'\\"')+'"]');x.disabled=!o||o.disabled})});
  if(window.jQuery)jQuery(sel).on("change",function(){$$("button",wrap).forEach(function(x){x.setAttribute("aria-pressed",x.getAttribute("data-v")===sel.value?"true":"false")})});
});

/* ---- lightbox ---- */
var lb=$("#lb");
if(lb){
var li=$("img",lb),lc=$(".cap",lb),ln=$(".cnt",lb),grp=[],gi=0,last=null;
var show=function(i){gi=(i+grp.length)%grp.length;var el=grp[gi],fw=+el.getAttribute("data-fw")||800,fh=+el.getAttribute("data-fh")||800;li.src=el.getAttribute("data-full");li.width=fw;li.height=fh;li.style.maxWidth="min(calc(100vw - 24px),"+fw+"px)";li.style.maxHeight="min(calc(100svh - 130px),"+fh+"px)";li.alt=el.getAttribute("data-cap")||"";lc.textContent=el.getAttribute("data-cap")||"";ln.textContent=grp.length>1?(gi+1)+" / "+grp.length:"";var one=grp.length<2;$(".pv",lb).style.display=one?"none":"";$(".nx",lb).style.display=one?"none":""};
var open=function(el){var g=el.getAttribute("data-lb");grp=$$('[data-lb="'+g+'"]');last=el;show(grp.indexOf(el));lb.classList.add("on");b.style.overflow="hidden";$(".x",lb).focus()};
var close=function(){lb.classList.remove("on");b.style.overflow="";if(last)last.focus({preventScroll:true})};
d.addEventListener("click",function(e){var el=e.target.closest("[data-lb]");if(el&&!lb.contains(el)){if(stage&&stage.dataset.sw)return;e.preventDefault();open(el)}});
$(".x",lb).addEventListener("click",close);$(".pv",lb).addEventListener("click",function(){show(gi-1)});$(".nx",lb).addEventListener("click",function(){show(gi+1)});
lb.addEventListener("click",function(e){if(e.target===lb)close()});
addEventListener("keydown",function(e){if(!lb.classList.contains("on"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")show(gi-1);if(e.key==="ArrowRight")show(gi+1)});
var tx=0;lb.addEventListener("touchstart",function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)show(gi+(dx<0?1:-1))},{passive:true});
}

/* ---- faktura: pokaż firmę i NIP po zaznaczeniu ---- */
var fk=$("#mk_faktura");
if(fk){var fp=function(){["#billing_company_field","#billing_nip_field"].forEach(function(s){var el=$(s);if(el)el.style.display=fk.checked?"":"none"})};fk.addEventListener("change",fp);fp()}

/* ---- baner cookies ---- */
var ck=$("#ck");
function zgody(s,m){try{localStorage.setItem("mk_zgody",JSON.stringify({s:s,m:m,t:Date.now()}))}catch(e){}
  if(window.gtag)gtag("consent","update",{analytics_storage:s?"granted":"denied",ad_storage:m?"granted":"denied",ad_user_data:m?"granted":"denied",ad_personalization:m?"granted":"denied"});if(ck)ck.hidden=true}
d.addEventListener("click",function(e){var bt=e.target.closest("[data-ck]");if(!bt||!ck)return;var a=bt.getAttribute("data-ck");
  if(a==="all")zgody(1,1);else if(a==="min")zgody(0,0);else if(a==="save")zgody($("#ckS").checked?1:0,$("#ckM").checked?1:0);
  else if(a==="set"){$(".ck-o",ck).hidden=false;$('[data-ck="save"]',ck).hidden=false;bt.hidden=true}
  else if(a==="open"){ck.hidden=false;$(".ck-o",ck).hidden=false;$('[data-ck="save"]',ck).hidden=false;$('[data-ck="set"]',ck).hidden=true}});
})();

/* ---- karuzela banerów: kropki, strzałki, co 6 s ---- */
(function(){
var tr=document.getElementById("bsTr"),dw=document.getElementById("bsD");if(!tr||!dw)return;
var sl=Array.prototype.slice.call(tr.children),n=sl.length,cur=0,t=null,stop=false,w=0;
var red=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var dots=sl.map(function(s,i){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Baner "+(i+1));b.addEventListener("click",function(){go(i);run()});dw.appendChild(b);return b});
function mark(i){cur=i;dots.forEach(function(b,j){b.setAttribute("aria-current",j===i?"true":"false")})}
function go(i){i=(i+n)%n;requestAnimationFrame(function(){w=tr.clientWidth;tr.scrollTo({left:i*w,behavior:red?"auto":"smooth"})});mark(i)}
function run(){clearInterval(t);if(!red)t=setInterval(function(){if(!stop&&!document.hidden&&tr.offsetParent)go(cur+1)},6000)}
var rf=0;tr.addEventListener("scroll",function(){cancelAnimationFrame(rf);rf=requestAnimationFrame(function(){var i=Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth));if(i!==cur)mark(i)})},{passive:true});
var box=tr.parentNode,l=box.querySelector(".bs-ar.l"),r=box.querySelector(".bs-ar.r");
if(l)l.addEventListener("click",function(){go(cur-1);run()});if(r)r.addEventListener("click",function(){go(cur+1);run()});
box.addEventListener("mouseenter",function(){stop=true});box.addEventListener("mouseleave",function(){stop=false});
box.addEventListener("focusin",function(){stop=true});box.addEventListener("focusout",function(){stop=false});
mark(0);run();
})();
