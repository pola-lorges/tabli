const CATEGORIES=[
  {id:"bieres",label:"Bières & Vins",icon:"🍺"},
  {id:"cocktails",label:"Cocktails",icon:"🍸"},
  {id:"softs",label:"Softs & Jus",icon:"🥤"},
  {id:"grillades",label:"Grillades",icon:"🍢"}
];

const MENU=[
    {id:1,cat:"bieres",name:"33 Export",desc:"Bière blonde camerounaise, légère et rafraîchissante",price:1000},
  {id:2,cat:"bieres",name:"Castel Beer",desc:"Bière blonde camerounaise, douce et maltée",price:1000},
  {id:3,cat:"bieres",name:"Beaufort Lager",desc:"Bière blonde premium, équilibrée et rafraîchissante",price:1000},
  {id:4,cat:"bieres",name:"Beaufort Light",desc:"Bière blonde légère et moins alcoolisée",price:1000},
  {id:5,cat:"bieres",name:"Beaufort Tango",desc:"Bière blonde aromatique et rafraîchissante",price:1000},
  {id:6,cat:"bieres",name:"Mützig",desc:"Bière blonde maltée au goût équilibré",price:1000},
  {id:7,cat:"bieres",name:"Isenbeck",desc:"Bière blonde allemande produite et commercialisée au Cameroun",price:1000},
  {id:8,cat:"bieres",name:"Amstel",desc:"Bière blonde premium au goût malté",price:1000},
  {id:9,cat:"bieres",name:"Doppel Munich",desc:"Bière blonde/maltée au caractère prononcé",price:1000},
  {id:10,cat:"bieres",name:"Kadji Beer",desc:"Bière blonde camerounaise",price:1000},
  {id:11,cat:"bieres",name:"King Beer",desc:"Bière blonde camerounaise légère",price:1000},
  {id:12,cat:"bieres",name:"Castle Milk Stout",desc:"Bière brune stout, riche et maltée",price:1200},
  {id:13,cat:"bieres",name:"Guinness",desc:"Bière brune stout, riche et crémeuse",price:1500},
  {id:14,cat:"bieres",name:"Guinness Smooth",desc:"Stout douce et onctueuse",price:1500},
  {id:15,cat:"bieres",name:"Harp",desc:"Bière blonde légère et rafraîchissante",price:1000},
  {id:16,cat:"bieres",name:"Heineken",desc:"Bière blonde premium internationale",price:1500},
  {id:17,cat:"bieres",name:"Beck's",desc:"Bière blonde premium allemande",price:1500},
  {id:18,cat:"bieres",name:"Kronenbourg 1664",desc:"Bière blonde premium française",price:1500},
  {id:19,cat:"bieres",name:"Kronenbourg 1664 Blanc",desc:"Bière blanche aromatique et fruitée",price:1500},
  {id:20,cat:"bieres",name:"Estrella",desc:"Bière blonde de type lager",price:1500},
  {id:21,cat:"bieres",name:"San Miguel",desc:"Bière blonde lager internationale",price:1500},
  {id:22,cat:"bieres",name:"Tuborg Green",desc:"Bière blonde lager internationale",price:1500},
  {id:23,cat:"bieres",name:"Budweiser",desc:"Bière blonde américaine premium",price:1500},
  {id:24,cat:"bieres",name:"Bavaria 0.0",desc:"Bière blonde sans alcool",price:1500},
  {id:25,cat:"bieres",name:"Manyan",desc:"Bière camerounaise, bière du pays",price:1000},
  {id:26,cat:"bieres",name:"Pelforth",desc:"Bière blonde premium",price:1500},
  {id:27,cat:"bieres",name:"Satzembrau",desc:"Bière blonde locale",price:1000},
  {id:28,cat:"bieres",name:"Cintra",desc:"Bière blonde lager",price:1000},
  {id:29,cat:"bieres",name:"66",desc:"Bière blonde lager en grand format",price:1000},
  {id:30,cat:"bieres",name:"K44",desc:"Bière blonde camerounaise",price:1000},
  {id:31,cat:"bieres",name:"Doppel Energy Malt",desc:"Boisson maltée énergisante",price:1000},
  {id:32,cat:"bieres",name:"Booster",desc:"Boisson alcoolisée aromatisée",price:1500}
];

const STATUS_FLOW=["nouvelle","préparation","prête","servie"];
const STATUS_LABEL={nouvelle:"Nouvelle","préparation":"En préparation","prête":"Prête",servie:"Servie"};
const STATUS_COLOR={nouvelle:"#ff6452","préparation":"#f2a93b","prête":"#6bbf8c",servie:"#5b6472"};

// Variable pour stocker toutes les commandes
let commandes = [];

function fcfa(n){return n.toLocaleString("fr-FR")+" FCFA"}
function formatDateTime(ts){
  const d=new Date(ts);
  const h=String(d.getHours()).padStart(2,'0');
  const m=String(d.getMinutes()).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  const month=String(d.getMonth()+1).padStart(2,'0');
  const year=d.getFullYear();
  return`${day}/${month}/${year} ${h}:${m}`;
}
function timeAgo(ts){
  const mins=Math.max(0,Math.round((Date.now()-ts)/60000));
  if(mins<1)return"à l'instant";
  if(mins<60)return`il y a ${mins} min`;
  return`il y a ${Math.round(mins/60)} h`;
}
function seedOrders(){
  const now=Date.now();
  const mk=(id,label,items,status,minsAgo,source="client")=>({
    id,label,status,source,time:now-minsAgo*60000,paid:status==="servie"?true:false,
    items:items.map(x=>({...x})),
    total:items.reduce((s,x)=>s+x.price*x.qty,0)
  });
  return[
    mk("C-101","Table 3",[{...MENU[0],qty:2},{...MENU[11],qty:1}],"servie",210),
    mk("C-102","Table 5",[{...MENU[4],qty:2}],"servie",190),
    mk("C-103","Table 2",[{...MENU[8],qty:3},{...MENU[12],qty:1}],"servie",160),
    mk("C-104","Table 7",[{...MENU[1],qty:4}],"servie",140),
    mk("C-105","Achille (comptoir)",[{...MENU[6],qty:1},{...MENU[13],qty:1}],"servie",95,"registre"),
    mk("C-106","Table 4",[{...MENU[2],qty:2},{...MENU[14],qty:2}],"servie",60),
    mk("C-107","Table 6",[{...MENU[5],qty:2}],"servie",35)
  ];
}

let state={
  role:"registre",
  orders:commandes,
  orderCounter:108,
  registerCat:"bieres",
  registerDraft:{},
  registerName:"",
  editingId:null,
  registerError:"",
  registerModalOpen:false
};

function saveState(){
  commandes = state.orders;
  localStorage.setItem("tabli_orders",JSON.stringify(commandes));
  localStorage.setItem("tabli_orderCounter",String(state.orderCounter));
}
function loadState(){
  try{
    const saved=localStorage.getItem("tabli_orders");
    if(saved){commandes=JSON.parse(saved);state.orders=commandes}
    const counter=localStorage.getItem("tabli_orderCounter");
    if(counter){state.orderCounter=Number(counter)}
  }catch(e){console.error("Erreur de chargement:",e)}
}

function nextId(){
  return`C-${state.orderCounter++}`;
}
function itemsFromDraft(draft){return Object.values(draft)}
function draftTotal(draft){return itemsFromDraft(draft).reduce((s,x)=>s+x.price*x.qty,0)}
function addToDraft(draft,item){
  const old=draft[item.id];
  return{...draft,[item.id]:{...item,qty:(old?.qty||0)+1}};
}
function removeFromDraft(draft,item){
  const old=draft[item.id];
  if(!old)return draft;
  if(old.qty<=1){const copy={...draft};delete copy[item.id];return copy}
  return{...draft,[item.id]:{...old,qty:old.qty-1}};
}

function render(){
  const app=document.getElementById("app");
  app.innerHTML=`<div class="app">
    ${header()}
    <main class="body">${state.role==="registre"?registerView():gerantView()}</main>
  </div>`;
  bindEvents();
  saveState();
}

function header(){
  const tabs=[["registre","Registre"],["gerant","Gérant"]];
  return`<header class="header">
    <div class="brand">
      <div class="brand-mark">T</div>
      <div><div class="brand-name">Tabli</div><div class="brand-sub">Commandes de bar, sans friction</div></div>
    </div>
    <nav class="tab-row">
      ${tabs.map(([id,label])=>`<button class="tab-btn" data-role="${id}" style="color:${state.role===id?"#12151c":"#c7cdd6"};background:${state.role===id?"#f2a93b":"transparent"}">${label}</button>`).join("")}
    </nav>
  </header>`;
}

function categoryPicker(cat,scope){
  return`<div class="cat-row">${CATEGORIES.map(c=>`
    <button class="cat-btn" data-action="category" data-scope="${scope}" data-cat="${c.id}" style="border-color:${c.id===cat?"#f2a93b":"#2c333f"};color:${c.id===cat?"#f2a93b":"#97a0ac"}">
      <span>${c.icon}</span>${c.label}
    </button>`).join("")}</div>`;
}

function itemPicker(cat,draft,scope){
  const items=MENU.filter(x=>x.cat===cat);
  return categoryPicker(cat,scope)+`<div class="item-list">${items.map(item=>{
    const qty=draft[item.id]?.qty||0;
    return`<div class="item-row">
      <div class="item-main"><div class="item-name">${item.name}</div><div class="item-desc">${item.desc}</div><div class="item-price">${fcfa(item.price)}</div></div>
      ${qty===0?`<button class="add-btn" data-action="add" data-scope="${scope}" data-id="${item.id}">+</button>`:
      `<div class="stepper"><button class="step-btn" data-action="remove" data-scope="${scope}" data-id="${item.id}">−</button><span class="step-qty">${qty}</span><button class="step-btn" data-action="add" data-scope="${scope}" data-id="${item.id}">+</button></div>`}
    </div>`;
  }).join("")}</div>`;
}

function registerView(){
  const orders=state.orders.filter(o=>o.source==="registre");
  const total=orders.reduce((s,o)=>s+o.total,0);
  return`<div>
    <div class="section-label">📋 Commandes du comptoir</div>
    ${orders.length>0?`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:12px">
      <div class="list-header"><span>${orders.length} commande${orders.length>1?"s":""}</span><span class="mono" style="color:#f2a93b">${fcfa(total)}</span></div>
      <button class="primary-btn" style="width:auto;padding:10px 16px;font-size:13px" data-action="open-register-modal">+ Nouvelle commande</button>
    </div>`:`<div style="display:flex;justify-content:center;margin-bottom:20px"><button class="primary-btn" style="padding:12px 20px" data-action="open-register-modal">+ Ajouter une commande</button></div>`}
    ${orders.length>0?`<div class="order-list">${orders.map(o=>`<div class="order-card" style="border-color:${state.editingId===o.id?"#f2a93b":"#232a35"}">
      <div class="order-card-head"><div><div class="order-client">${o.label}</div><div class="order-time"><span style="color:#97a0ac;font-size:12px">${formatDateTime(o.time)}</span> · <span style="font-size:12px;color:${STATUS_COLOR[o.status]}">${STATUS_LABEL[o.status]}</span></div></div>
      <div style="display:flex;gap:6px;align-items:center"><button class="status-btn" data-action="toggle-paid" data-id="${o.id}" style="background:${o.paid?"#6bbf8c33":"#ff645233"};color:${o.paid?"#6bbf8c":"#ff6452"};border:1px solid ${o.paid?"#6bbf8c55":"#ff645255"};padding:6px 10px;border-radius:4px;font-size:12px;font-weight:500;cursor:pointer">${o.paid?"✓ Payé":"⊘ Non payé"}</button><button class="edit-btn" data-action="edit" data-id="${o.id}">✏️</button><button class="delete-btn" data-action="delete" data-id="${o.id}">🗑️</button></div></div>
      <div class="order-items">${o.items.map(it=>`<div style="font-size:13px;color:#c7cdd6;padding:2px 0"><span style="display:inline-block;width:26px;color:#f2a93b" class="mono">${it.qty}×</span>${it.name}</div>`).join("")}</div>
      <div class="order-total">${fcfa(o.total)}</div>
    </div>`).join("")}</div>`:`<div class="empty-state">Aucune commande enregistrée pour l'instant. Crée ta première !</div>`}
    ${state.registerModalOpen?registerFormModal():""}
  </div>`;
}

function registerFormModal(){
  const items=itemsFromDraft(state.registerDraft);
  return`<div class="modal-overlay" data-action="close-register-modal">
    <div class="modal-sheet" onclick="event.stopPropagation()">
      <div class="modal-header"><div class="title" style="font-size:18px">${state.editingId?"✏️ Modifier la commande":"➕ Nouvelle commande"}</div><button class="icon-btn" data-action="close-register-modal">✕</button></div>
      <div class="form-actions"><button class="primary-btn" data-action="submit-register">${state.editingId?"✏️ Mettre à jour la commande":"+ Ajouter la commande"}</button>${state.editingId?`<button class="cancel-btn" data-action="cancel-edit">✕ Annuler</button>`:""}</div>
      <label class="label" style="margin-top:16px">Nom du client</label>
      <div class="name-row"><span style="color:#5b6472">👤</span><input id="client-name" class="name-input" value="${escapeHtml(state.registerName)}" placeholder="Ex : Achille" autofocus></div>
      <label class="label" style="margin-top:16px">Articles</label>
      ${itemPicker(state.registerCat,state.registerDraft,"register")}
      ${items.length>0?`<div class="ticket">${items.map(it=>`<div class="ticket-row"><span class="mono" style="color:#97a0ac;width:24px;font-size:12px">${it.qty}×</span><span class="flex-1" style="font-size:13px">${it.name}</span><span class="mono" style="color:#c7cdd6;font-size:12px">${fcfa(it.price*it.qty)}</span></div>`).join("")}<div class="ticket-divider"></div><div class="ticket-total"><span>Total</span><span class="mono">${fcfa(draftTotal(state.registerDraft))}</span></div></div>`:""}
      ${state.registerError?`<div class="error-text">${state.registerError}</div>`:""}
    </div>
  </div>`;
}

function gerantView(){
  const revenue=commandes.reduce((s,o)=>s+o.total,0),count=commandes.length,avg=count?Math.round(revenue/count):0;
  const paid=commandes.filter(o=>o.paid).reduce((s,o)=>s+o.total,0);
  const byCat={},byItem={};
  commandes.forEach(o=>o.items.forEach(it=>{
    const m=MENU.find(x=>x.id===it.id),cat=m?.cat||"autre";
    byCat[cat]=(byCat[cat]||0)+it.price*it.qty;
    byItem[it.name]=(byItem[it.name]||0)+it.qty;
  }));
  const catChart=CATEGORIES.map(c=>({name:c.label,value:byCat[c.id]||0}));
  const topItems=Object.entries(byItem).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxCat=Math.max(1,...catChart.map(x=>x.value)),maxTop=topItems[0]?.[1]||1;
  return`<div class="gerant-wrap">
    <div class="stat-grid">
      ${statCard("Chiffre d'affaires (jour)",fcfa(revenue),"📈")}
      ${statCard("Commandes",count,"🧾")}
      ${statCard("Panier moyen",fcfa(avg),"🛒")}
      ${statCard("Montant encaissé",fcfa(paid),"💰")}
    </div>
    <div class="panel"><div class="panel-title">Ventes par catégorie</div>${catChart.map(c=>`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:13px;color:#c7cdd6;margin-bottom:4px"><span>${c.name}</span><span class="mono">${fcfa(c.value)}</span></div><div class="bar-track"><div class="bar-fill" style="width:${c.value/maxCat*100}%"></div></div></div>`).join("")}</div>
    <div class="panel"><div class="panel-title">Produits les plus commandés</div>${topItems.map(([name,qty])=>`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:13px;color:#c7cdd6;margin-bottom:4px"><span>${name}</span><span class="mono">${qty}</span></div><div class="bar-track"><div class="bar-fill" style="width:${qty/maxTop*100}%"></div></div></div>`).join("")}</div>
  </div>`;
}
function statCard(label,value,icon){return`<div class="stat-card"><span style="font-size:16px">${icon}</span><div class="title" style="font-size:19px;margin-top:8px">${value}</div><div style="font-size:12px;color:#97a0ac;margin-top:2px">${label}</div></div>`}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function bindEvents(){
  document.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{state.role=b.dataset.role;render()});
  document.querySelectorAll("[data-action]").forEach(el=>{
    el.addEventListener("click",e=>{
      const a=el.dataset.action, id=Number(el.dataset.id);
      if(a==="category"){
        state.registerCat=el.dataset.cat;
        render();
      }
      if(a==="add"||a==="remove"){
        const item=MENU.find(x=>x.id===id);
        state.registerDraft=a==="add"?addToDraft(state.registerDraft,item):removeFromDraft(state.registerDraft,item);
        render();
      }
      if(a==="open-register-modal"){state.registerModalOpen=true;state.editingId=null;state.registerName="";state.registerDraft={};state.registerError="";render()}
      if(a==="close-register-modal"){state.registerModalOpen=false;state.editingId=null;state.registerName="";state.registerDraft={};state.registerError="";render()}
      if(a==="edit"){
        const o=state.orders.find(x=>x.id===el.dataset.id);if(!o)return;
        state.editingId=o.id;state.registerName=o.label;state.registerDraft={};o.items.forEach(it=>state.registerDraft[it.id]={...it});state.registerError="";state.registerModalOpen=true;render();
      }
      if(a==="delete"){
        state.orders=state.orders.filter(o=>o.id!==el.dataset.id);
        if(state.editingId===el.dataset.id){state.editingId=null;state.registerName="";state.registerDraft={}}
        render();
      }
      if(a==="toggle-paid"){
        state.orders=state.orders.map(o=>o.id===el.dataset.id?{...o,paid:!o.paid}:o);render();
      }
      if(a==="cancel-edit"){state.editingId=null;state.registerName="";state.registerDraft={};state.registerError="";state.registerModalOpen=false;render()}
      if(a==="submit-register"){
        state.registerName=document.getElementById("client-name")?.value||"";
        const items=itemsFromDraft(state.registerDraft);
        if(!state.registerName.trim()){state.registerError="Indique le nom du client.";render();return}
        if(!items.length){state.registerError="Ajoute au moins un article à la commande.";render();return}
        const total=draftTotal(state.registerDraft);
        if(state.editingId){
          state.orders=state.orders.map(o=>o.id===state.editingId?{...o,label:state.registerName.trim(),items,total}:o);
          state.editingId=null;
        }else{
          state.orders.unshift({id:nextId(),label:state.registerName.trim(),source:"registre",items,total,status:"nouvelle",time:Date.now(),paid:false});
        }
        state.registerName="";state.registerDraft={};state.registerError="";state.registerModalOpen=false;render();
      }
    });
  });
}

document.addEventListener("input",e=>{
  if(e.target.id==="client-name")state.registerName=e.target.value;
});
loadState();
render();
