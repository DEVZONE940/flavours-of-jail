// Digital menu engine. All content comes from menu.json; nothing is hardcoded here.
var MENU = [], CART = {}, ACTIVE = "All";
var WA = "919893997949";

function money(n){ return "\u20b9" + n.toLocaleString("en-IN"); }

fetch("menu.json").then(function(r){ return r.json(); }).then(function(d){
  MENU = d.categories || [];
  var chips = ["All"].concat(MENU.map(function(c){ return c.name; }));
  document.getElementById("chips").innerHTML = chips.map(function(c){
    return '<button class="chip'+(c===ACTIVE?" on":"")+'" data-cat="'+c+'">'+c+'</button>';
  }).join("");
  render();
}).catch(function(){
  document.getElementById("list").innerHTML = '<p style="padding:40px 0;color:var(--ink-soft)">Menu data could not be loaded.</p>';
});

function visible(){
  var q = (document.getElementById("search").value || "").toLowerCase().trim();
  var out = [];
  MENU.forEach(function(cat){
    if (ACTIVE !== "All" && cat.name !== ACTIVE) return;
    cat.items.forEach(function(it){
      if (q && (it.item + " " + (it.description||"")).toLowerCase().indexOf(q) === -1) return;
      out.push({ cat: cat.name, item: it.item, price: it.price, desc: it.description || "" });
    });
  });
  return out;
}

function render(){
  var rows = visible();
  var host = document.getElementById("list");
  if (!rows.length){
    host.innerHTML = '<p style="padding:48px 0;color:var(--ink-soft)">Nothing matches that. Try another word.</p>';
    return;
  }
  var byCat = {};
  rows.forEach(function(r){ (byCat[r.cat] = byCat[r.cat] || []).push(r); });
  host.innerHTML = Object.keys(byCat).map(function(cat){
    return '<h2 class="mcat">'+cat+'</h2><div class="mgrid">' + byCat[cat].map(function(r){
      var k = r.cat + "|" + r.item, qty = CART[k] || 0;
      return '<div class="mitem"><div><div class="mname">'+r.item+'</div>'+
        (r.desc ? '<div class="mdesc">'+r.desc+'</div>' : '')+'</div>'+
        '<div class="mright"><div class="mprice">'+money(r.price)+'</div>'+
        '<div class="mstep"><button data-dec="'+k+'">-</button><span>'+(qty||0)+'</span><button data-inc="'+k+'">+</button></div></div></div>';
    }).join("") + '</div>';
  }).join("");
  paint();
}

function totals(){
  var n = 0, sum = 0;
  Object.keys(CART).forEach(function(k){ n += CART[k]; sum += CART[k] * priceOf(k); });
  return { n: n, sum: sum };
}
function priceOf(k){
  var parts = k.split("|"), cat = parts[0], name = parts[1];
  for (var i=0;i<MENU.length;i++){
    if (MENU[i].name !== cat) continue;
    for (var j=0;j<MENU[i].items.length;j++){
      if (MENU[i].items[j].item === name) return MENU[i].items[j].price || 0;
    }
  }
  return 0;
}
function paint(){
  var t = totals(), bar = document.getElementById("bar");
  if (t.n){ bar.style.transform = "translateY(0)"; document.getElementById("bcount").textContent = t.n + (t.n===1?" item":" items"); document.getElementById("bsum").textContent = money(t.sum); }
  else { bar.style.transform = "translateY(140%)"; }
}
document.addEventListener("click", function(e){
  var inc = e.target.getAttribute("data-inc"), dec = e.target.getAttribute("data-dec"), chip = e.target.getAttribute("data-cat");
  if (inc){ CART[inc] = (CART[inc]||0) + 1; render(); }
  if (dec){ CART[dec] = Math.max(0,(CART[dec]||0) - 1); if(!CART[dec]) delete CART[dec]; render(); }
  if (chip){ ACTIVE = chip; document.querySelectorAll(".chip").forEach(function(c){ c.classList.toggle("on", c.getAttribute("data-cat")===ACTIVE); }); render(); }
  if (e.target.id === "send") send();
});
document.getElementById("search").addEventListener("input", render);

function send(){
  var t = totals();
  if (!t.n){ return; }
  var lines = ["ORDER - Flavours Of Jail", ""];
  Object.keys(CART).forEach(function(k){
    var p = k.split("|");
    lines.push(CART[k] + " x " + p[1] + " (" + p[0] + ") - " + money(CART[k]*priceOf(k)));
  });
  lines.push("", "Items total: " + money(t.sum), "", "Please confirm prices and tell me how long it will take.");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
}
