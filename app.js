(function(){
  var PHONE="919893997949";
  var bar=document.getElementById("bar"), nav=document.getElementById("nav"), bg=document.getElementById("heroBg");

  function onScroll(){
    var y=window.scrollY||0;
    var h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?(y/h)*100:0)+"%";
    nav.classList.toggle("solid", y>40);
    if(bg && y<900){ bg.style.transform="translate3d(0,"+(y*0.28)+"px,0) scale(1.04)"; }
  }
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    });
  },{threshold:.14,rootMargin:"0px 0px -60px 0px"});
  document.querySelectorAll(".reveal").forEach(function(el,i){
    el.style.transitionDelay=(i%3)*90+"ms"; io.observe(el);
  });

  var counted=false;
  var cio=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting||counted) return; counted=true;
      document.querySelectorAll("[data-count]").forEach(function(el){
        var target=parseFloat(el.dataset.count), dec=parseInt(el.dataset.dec||"0",10), t0=null;
        function step(ts){
          if(!t0) t0=ts;
          var p=Math.min((ts-t0)/1200,1), eased=1-Math.pow(1-p,3);
          var v=target*eased;
          el.textContent=dec? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN");
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    });
  },{threshold:.4});
  var stat=document.querySelector(".stat"); if(stat) cio.observe(stat);

  function toast(msg){
    var t=document.createElement("div"); t.className="toast"; t.textContent=msg;
    document.body.appendChild(t); requestAnimationFrame(function(){t.classList.add("show")});
    setTimeout(function(){ t.classList.remove("show"); setTimeout(function(){t.remove()},400); },2600);
  }
  function val(id){ var e=document.getElementById(id); return e? (e.value||"").trim() : ""; }
  function checked(id){ var e=document.getElementById(id); return e&&e.checked; }
  function open(text){
    var url="https://wa.me/"+PHONE+"?text="+encodeURIComponent(text);
    window.open(url,"_blank","noopener");
  }

  var navWa=document.getElementById("navWa"), footWa=document.getElementById("footWa");
  [navWa,footWa].forEach(function(a){
    if(!a) return;
    a.addEventListener("click",function(ev){
      ev.preventDefault();
      open("Hi, I found Flavours Of Jail online. I wanted to ask about ");
    });
  });

  var orderForm=document.getElementById("orderForm");
  orderForm.addEventListener("submit",function(ev){
    ev.preventDefault();
    var items=val("oItems"), name=val("oName"), phone=val("oPhone"), type=val("oType");
    if(!items){ toast("Write what you would like to order"); document.getElementById("oItems").focus(); return; }
    if(!name){ toast("Add your name so they can reply"); document.getElementById("oName").focus(); return; }
    open(["ORDER - Flavours Of Jail","","Items: "+items,"Type: "+type,"Name: "+name, phone? "Phone: "+phone : "", "",
          "Please confirm today's prices and how long it will take."].filter(Boolean).join("\n"));
    toast("Opening WhatsApp with your order");
  });

  var bookForm=document.getElementById("bookForm");
  bookForm.addEventListener("submit",function(ev){
    ev.preventDefault();
    var d=val("bDate"), tm=val("bTime"), g=val("bGuests"), seat=val("bSeat"), n=val("bName"), note=val("bNote");
    if(!d){ toast("Pick a date"); return; }
    if(!n){ toast("Add your name"); document.getElementById("bName").focus(); return; }
    open(["TABLE BOOKING - Flavours Of Jail","",
          "Date: "+d, "Time: "+tm, "Guests: "+g, "Seating: "+seat, "Name: "+n,
          note? "Note: "+note : "", "", "Please confirm the table."].filter(Boolean).join("\n"));
    toast("Opening WhatsApp with the booking");
  });

  var partyForm=document.getElementById("partyForm");
  partyForm.addEventListener("submit",function(ev){
    ev.preventDefault();
    var adds=[];
    if(checked("pCake")) adds.push("cake");
    if(checked("pBalloons")) adds.push("balloons");
    if(checked("pDecor")) adds.push("decoration");
    if(checked("pCabana")) adds.push("cabana block");
    var occ=val("pOccasion"), d=val("pDate"), g=val("pGuests"), budget=val("pBudget"),
        cakeMsg=val("pCakeMsg"), n=val("pName"), note=val("pNote");
    if(!d){ toast("Pick the party date"); return; }
    if(!n){ toast("Add your name"); document.getElementById("pName").focus(); return; }
    open(["PARTY ENQUIRY - Flavours Of Jail","",
          "Occasion: "+occ, "Date: "+d, "Guests: "+g,
          adds.length? "Add-ons: "+adds.join(", ") : "Add-ons: none selected",
          cakeMsg? "Cake message: "+cakeMsg : "",
          budget? "Budget per head: Rs "+budget : "",
          "Name: "+n, note? "Notes: "+note : "", "",
          "Please share availability and the price for the setup."].filter(Boolean).join("\n"));
    toast("Opening WhatsApp with the enquiry");
  });
})();
