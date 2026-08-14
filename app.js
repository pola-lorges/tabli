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
const SUPABASE_URL="https://hzncqnmqfoxugyjbxntz.supabase.co";
const SUPABASE_KEY="sb_publishable_F7AgzGSaAjfx5FWFSwisnQ_kQU2Dp-D";
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

// Variable pour stocker toutes les commandes
let commandes = [];

// Stockage des utilisateurs (normalement dans une vraie base de données)
let users = {};

// Charger les utilisateurs depuis localStorage
function loadUsers(){
  users = {};
}
function defaultMenu(){return MENU.map(item=>({...item}))}
function normalizeProductName(name){
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().replace(/\s+/g," ").toLowerCase();
}

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
const STAT_PERIODS={day:"Jour",week:"Semaine",month:"Mois",year:"Année"};
function dateToInputValue(ts=Date.now()){
  const date=new Date(ts);
  return`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function isInStatsPeriod(ts,period,reference=new Date()){
  const date=new Date(ts);
  const selected=reference instanceof Date?new Date(reference):new Date(`${reference}T00:00:00`);
  if(period==="year")return date.getFullYear()===selected.getFullYear();
  if(period==="month")return date.getFullYear()===selected.getFullYear()&&date.getMonth()===selected.getMonth();
  if(period==="week"){
    selected.setHours(0,0,0,0);
    const mondayOffset=(selected.getDay()+6)%7;
    const monday=new Date(selected);
    monday.setDate(selected.getDate()-mondayOffset);
    const nextMonday=new Date(monday);
    nextMonday.setDate(monday.getDate()+7);
    return date>=monday&&date<nextMonday;
  }
  return date.getFullYear()===selected.getFullYear()&&date.getMonth()===selected.getMonth()&&date.getDate()===selected.getDate();
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
  // Auth
  loggedIn:false,
  currentUser:null,
  authError:"",
  authUsername:"",
  authPassword:"",
  authPasswordVisible:false,
  
  // App
  role:"registre",
  orders:commandes,
  orderCounter:108,
  registerCat:"bieres",
  registerDraft:{},
  registerName:"",
  editingId:null,
  registerError:"",
  registerModalOpen:false,
  statsPeriod:"day",
  statsDate:dateToInputValue(),
  menu:defaultMenu(),
  priceError:"",
  newProductOpen:false
};

async function loadState(){
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session)return;
  state.loggedIn=true;
  state.currentUser=session.user.email;
  state.userId=session.user.id;
  const {data:profile,error:profileError}=await supabaseClient.from("profiles").select("bar_name,menu").eq("id",session.user.id).maybeSingle();
  if(profileError)throw profileError;
  if(!profile){
    const barName=session.user.user_metadata?.bar_name||session.user.email.split("@")[0];
    const {data:createdProfile,error:createError}=await supabaseClient.rpc("ensure_my_profile",{profile_bar_name:barName,profile_menu:defaultMenu()});
    if(createError)throw createError;
    state.profile=Array.isArray(createdProfile)?createdProfile[0]:createdProfile;
  }else{
    state.profile=profile;
  }
  state.menu=state.profile.menu?.length?state.profile.menu:defaultMenu();
  const {data:orders,error:ordersError}=await supabaseClient.from("orders").select("*").eq("bar_id",session.user.id).order("created_at",{ascending:false});
  if(ordersError)throw ordersError;
  state.orders=(orders||[]).map(order=>({...order,id:String(order.id),time:new Date(order.created_at).getTime()}));
  commandes=state.orders;
}
function saveState(){commandes=state.orders}
async function saveProfileMenu(){
  const {error}=await supabaseClient.from("profiles").update({menu:state.menu}).eq("id",state.userId);
  if(error)throw error;
}
async function saveOrder(order){
  const {data,error}=await supabaseClient.from("orders").insert({bar_id:state.userId,label:order.label,source:order.source,status:order.status,paid:order.paid,items:order.items,total:order.total}).select().single();
  if(error)throw error;
  return {...data,id:String(data.id),time:new Date(data.created_at).getTime()};
}
async function updateOrder(id,changes){
  const {data,error}=await supabaseClient.from("orders").update(changes).eq("id",id).select().single();
  if(error)throw error;
  return {...data,id:String(data.id),time:new Date(data.created_at).getTime()};
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
  // Sauvegarder la position du scroll du modal si elle existe
  const modalSheet = document.querySelector(".modal-sheet");
  const modalScroll = modalSheet ? modalSheet.scrollTop : 0;
  
  if(!state.loggedIn){
    app.innerHTML=loginView();
  }else{
    app.innerHTML=`<div class="app">
      ${header()}
      <main class="body">${state.role==="registre"?registerView():state.role==="prix"?prixView():gerantView()}</main>
    </div>`;
  }
  bindEvents();
  
  // Restaurer la position du scroll du modal si elle existe
  setTimeout(() => {
    const newModalSheet = document.querySelector(".modal-sheet");
    if(newModalSheet && modalScroll > 0) {
      newModalSheet.scrollTop = modalScroll;
    }
  }, 0);
  
  saveState();
}

function header(){
  const tabs=[["registre","Registre"],["gerant","Gérant"],["prix","Prix"]];
  return`<header class="header">
    <div class="brand">
      <div class="brand-mark">T</div>
      <div><div class="brand-name">Tabli</div><div class="brand-sub" style="font-size:11px">🍺 ${state.currentUser}</div></div>
    </div>
    <nav class="tab-row">
      ${tabs.map(([id,label])=>`<button class="tab-btn" data-role="${id}" style="color:${state.role===id?"#12151c":"#c7cdd6"};background:${state.role===id?"#f2a93b":"transparent"}">${label}</button>`).join("")}
      <button class="tab-btn" data-action="logout" style="color:#ff6452;background:transparent;margin-left:auto">Déconnexion</button>
    </nav>
  </header>`;
}

function prixView(){
  const items=(state.menu||MENU).filter(item=>item.cat===state.registerCat);
  return`<div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap"><div class="section-label" style="margin-bottom:0">💰 Modifier les prix</div><button class="primary-btn" style="width:auto;padding:10px 14px;font-size:13px" data-action="toggle-new-product">+ Nouveau produit</button></div>
    <div class="panel"><div class="panel-title">Tarifs de ton bar</div>
      <div style="font-size:12px;color:#97a0ac;margin-bottom:14px">Les prix sont enregistrés uniquement pour ton compte.</div>
      ${state.newProductOpen?`<div style="background:#12151c;border:1px solid #2c333f;border-radius:10px;padding:12px;margin-bottom:14px"><div class="panel-title" style="font-size:14px">Nouveau produit</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px"><input id="new-product-name" type="text" placeholder="Nom du produit" style="min-width:0;padding:9px;background:#1b2029;border:1px solid #2c333f;border-radius:7px;color:#f4efe6"><input id="new-product-price" type="number" min="1" step="50" placeholder="Prix en FCFA" style="min-width:0;padding:9px;background:#1b2029;border:1px solid #2c333f;border-radius:7px;color:#f4efe6"></div><select id="new-product-cat" style="width:100%;padding:9px;background:#1b2029;border:1px solid #2c333f;border-radius:7px;color:#f4efe6;margin-bottom:8px">${CATEGORIES.map(category=>`<option value="${category.id}" ${category.id===state.registerCat?"selected":""}>${category.icon} ${category.label}</option>`).join("")}</select>${state.priceError?`<div class="error-text">${state.priceError}</div>`:""}<div style="display:flex;gap:8px"><button class="primary-btn" data-action="add-product">Ajouter le produit</button><button class="cancel-btn" data-action="toggle-new-product">Annuler</button></div></div>`:""}
      ${categoryPicker(state.registerCat,"prices")}
      <div class="item-list">${items.map(item=>`<div class="item-row"><div class="item-main"><div class="item-name">${item.name}</div><div class="item-desc">${item.desc}</div></div><div style="display:flex;align-items:center;gap:6px"><input class="price-input" data-price-id="${item.id}" type="number" min="0" step="50" value="${item.price}" aria-label="Prix de ${item.name}" style="width:100px;padding:8px;background:#12151c;border:1px solid #2c333f;border-radius:7px;color:#f4efe6;text-align:right;font-family:'IBM Plex Mono'"><span style="font-size:11px;color:#97a0ac">FCFA</span><button class="delete-btn" data-action="delete-product" data-id="${item.id}" aria-label="Supprimer ${item.name}" title="Supprimer le produit">🗑️</button></div></div>`).join("")}</div>
      <button class="primary-btn" style="margin-top:16px" data-action="save-prices">Enregistrer les prix</button>
    </div>
  </div>`;
}

function loginView(){
  return`<div style="min-height:100vh;background:#12151c;display:flex;align-items:center;justify-content:center;padding:20px">
    <div style="width:100%;max-width:400px">
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:48px;margin-bottom:12px">🍺</div>
        <div style="font-size:28px;font-weight:700;color:#f4efe6;font-family:Fraunces">Tabli</div>
        <div style="font-size:14px;color:#97a0ac;margin-top:4px">Gestion de commandes de bar</div>
      </div>
      
      <div style="background:#1a1f2a;border:1px solid #232a35;border-radius:8px;padding:24px">
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:12px;color:#97a0ac;margin-bottom:8px;font-weight:600">E-mail du bar</label>
          <input id="auth-username" type="email" placeholder="bar@exemple.com" value="${state.authUsername}" style="width:100%;padding:10px;background:#12151c;border:1px solid #2c333f;border-radius:4px;color:#f4efe6;box-sizing:border-box;font-family:Inter">
        </div>
        
        <div style="margin-bottom:24px">
          <label style="display:block;font-size:12px;color:#97a0ac;margin-bottom:8px;font-weight:600">Mot de passe</label>
          <div style="display:flex;gap:8px;align-items:center">
            <input id="auth-password" type="${state.authPasswordVisible?"text":"password"}" placeholder="••••••••" value="${state.authPassword}" style="flex:1;padding:10px;background:#12151c;border:1px solid #2c333f;border-radius:4px;color:#f4efe6;box-sizing:border-box;font-family:Inter">
            <button data-action="toggle-password-visibility" style="width:40px;height:40px;background:#232a35;border:1px solid #2c333f;border-radius:4px;color:#f4efe6;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">${state.authPasswordVisible?"👁️":"🙈"}</button>
          </div>
        </div>
        
        ${state.authError?`<div style="background:#ff645233;border:1px solid #ff645255;color:#ff6452;padding:10px;border-radius:4px;font-size:13px;margin-bottom:16px">${state.authError}</div>`:""}
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button data-action="register" style="padding:12px;background:#f2a93b;color:#12151c;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:14px">Créer</button>
          <button data-action="login" style="padding:12px;background:#232a35;color:#f4efe6;border:1px solid #2c333f;border-radius:4px;font-weight:600;cursor:pointer;font-size:14px">Connexion</button>
        </div>
      </div>
      
      <div style="text-align:center;color:#5b6472;font-size:12px;margin-top:20px">Les données sont synchronisées avec Supabase</div>
    </div>
  </div>`;
}

function categoryPicker(cat,scope){
  return`<div class="cat-row">${CATEGORIES.map(c=>`
    <button class="cat-btn" data-action="category" data-scope="${scope}" data-cat="${c.id}" style="border-color:${c.id===cat?"#f2a93b":"#2c333f"};color:${c.id===cat?"#f2a93b":"#97a0ac"}">
      <span>${c.icon}</span>${c.label}
    </button>`).join("")}</div>`;
}

function itemPicker(cat,draft,scope){
  const items=(state.menu||MENU).filter(x=>x.cat===cat);
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
      <div class="order-items">${o.items.map(it=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:13px;color:#c7cdd6;padding:4px 0"><span style="min-width:0"><span style="display:inline-block;width:26px;color:#f2a93b" class="mono">${it.qty}×</span>${it.name}</span><span class="mono" style="color:#97a0ac;font-size:11px;white-space:nowrap">${fcfa(it.price)} × ${it.qty} = <strong style="color:#f2a93b">${fcfa(it.price*it.qty)}</strong></span></div>`).join("")}</div>
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
      ${state.registerError?`<div class="error-text">${state.registerError}</div>`:""}
      ${items.length>0?`<div class="ticket">${items.map(it=>`<div class="ticket-row"><span class="mono" style="color:#97a0ac;width:24px;font-size:12px">${it.qty}×</span><span class="flex-1" style="font-size:13px">${it.name}</span><span class="mono" style="color:#c7cdd6;font-size:12px">${fcfa(it.price*it.qty)}</span></div>`).join("")}<div class="ticket-divider"></div><div class="ticket-total"><span>Total</span><span class="mono">${fcfa(draftTotal(state.registerDraft))}</span></div></div>`:""}
      <label class="label" style="margin-top:16px">Articles</label>
      ${itemPicker(state.registerCat,state.registerDraft,"register")}
    </div>
  </div>`;
}

function gerantView(){
  const period=state.statsPeriod||"day";
  const statsDate=state.statsDate||dateToInputValue();
  const periodOrders=commandes.filter(o=>isInStatsPeriod(o.time,period,statsDate));
  const revenue=periodOrders.reduce((s,o)=>s+o.total,0),count=periodOrders.length,avg=count?Math.round(revenue/count):0;
  const paid=periodOrders.filter(o=>o.paid).reduce((s,o)=>s+o.total,0);
  const byItem={};
  periodOrders.forEach(o=>o.items.forEach(it=>{
    byItem[it.name]=(byItem[it.name]||0)+it.qty;
  }));
  const topItems=Object.entries(byItem).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxTop=topItems[0]?.[1]||1;
  return`<div class="gerant-wrap">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px">
      <div class="section-label" style="margin-bottom:0">📊 Statistiques</div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <label for="stats-date" style="font-size:12px;color:#97a0ac">Date</label>
        <input id="stats-date" type="date" value="${statsDate}" style="padding:7px 9px;background:#1b2029;border:1px solid #2c333f;border-radius:7px;color:#f4efe6;font-family:Inter;font-size:12px">
      <div style="display:flex;gap:6px;background:#1b2029;padding:4px;border-radius:10px">
        ${Object.entries(STAT_PERIODS).map(([id,label])=>`<button data-action="stats-period" data-period="${id}" style="border:none;border-radius:7px;padding:7px 12px;background:${period===id?"#f2a93b":"transparent"};color:${period===id?"#12151c":"#c7cdd6"};font-size:12px;font-weight:600">${label}</button>`).join("")}
      </div>
      </div>
    </div>
    <div class="stat-grid">
      ${statCard(`Chiffre d'affaires (${STAT_PERIODS[period].toLowerCase()})`,fcfa(revenue),"📈")}
      ${statCard("Commandes",count,"🧾")}
      ${statCard("Panier moyen",fcfa(avg),"🛒")}
      ${statCard("Montant encaissé",fcfa(paid),"💰")}
    </div>
    <div class="panel"><div class="panel-title">Produits les plus commandés</div>${topItems.map(([name,qty])=>`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:13px;color:#c7cdd6;margin-bottom:4px"><span>${name}</span><span class="mono">${qty}</span></div><div class="bar-track"><div class="bar-fill" style="width:${qty/maxTop*100}%"></div></div></div>`).join("")}</div>
  </div>`;
}
function statCard(label,value,icon){return`<div class="stat-card"><span style="font-size:16px">${icon}</span><div class="title" style="font-size:19px;margin-top:8px">${value}</div><div style="font-size:12px;color:#97a0ac;margin-top:2px">${label}</div></div>`}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function bindEvents(){
  document.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{state.role=b.dataset.role;render()});
  document.querySelectorAll("[data-action]").forEach(el=>{
    el.addEventListener("click",async e=>{
      const a=el.dataset.action, id=Number(el.dataset.id);
      
      // Auth actions
      if(a==="login"){
        const username = document.getElementById("auth-username")?.value || "";
        const password = document.getElementById("auth-password")?.value || "";
        if(!username.trim()){state.authError="Indique l'e-mail du bar.";render();return}
        if(!password.trim()){state.authError="Indique un mot de passe.";render();return}
        const {error}=await supabaseClient.auth.signInWithPassword({email:username.trim(),password});
        if(error){state.authError="E-mail ou mot de passe incorrect.";render();return}
        state.authError="";
        try{await loadState();render()}catch(error){state.loggedIn=false;state.authError=error.message||"Erreur de chargement Supabase.";render()}
      }
      if(a==="register"){
        const username = document.getElementById("auth-username")?.value || "";
        const password = document.getElementById("auth-password")?.value || "";
        if(!username.trim()){state.authError="Indique l'e-mail du bar.";render();return}
        if(!password.trim()){state.authError="Indique un mot de passe.";render();return}
        const {data,error}=await supabaseClient.auth.signUp({email:username.trim(),password,options:{data:{bar_name:username.trim().split("@")[0]}}});
        if(error){state.authError=error.message;render();return}
        if(!data.session){state.authError="Compte créé. Vérifie ton e-mail avant de te connecter.";render();return}
        try{await loadState();render()}catch(loadError){state.loggedIn=false;state.authError=loadError.message||"Erreur de chargement Supabase.";render()}
      }
      if(a==="logout"){
        await supabaseClient.auth.signOut();
        state.loggedIn=false;
        state.currentUser=null;
        state.authError="";
        state.authUsername="";
        state.authPassword="";
        state.authPasswordVisible=false;
        commandes=[];
        state.orders=[];
        state.menu=defaultMenu();
        state.role="registre";
        state.priceError="";
        render();
      }
      if(a==="toggle-password-visibility"){
        state.authPasswordVisible=!state.authPasswordVisible;
        render();
      }
      
      if(a==="category"){
        state.registerCat=el.dataset.cat;
        state.priceError="";
        render();
      }
      if(a==="toggle-new-product"){
        state.newProductOpen=!state.newProductOpen;
        state.priceError="";
        render();
      }
      if(a==="add-product"){
        const name=document.getElementById("new-product-name")?.value.trim()||"";
        const price=Number(document.getElementById("new-product-price")?.value);
        const cat=document.getElementById("new-product-cat")?.value||state.registerCat;
        if(!name){state.priceError="Indique le nom du produit.";render();return}
        if(!Number.isFinite(price)||price<=0){state.priceError="Indique un prix supérieur à 0 FCFA.";render();return}
        const nextMenu=state.menu||defaultMenu();
        if(nextMenu.some(item=>normalizeProductName(item.name)===normalizeProductName(name))){state.priceError="Ce produit existe déjà dans ton menu.";render();return}
        const nextId=Math.max(0,...nextMenu.map(item=>Number(item.id)||0))+1;
        state.menu=[...nextMenu,{id:nextId,cat,name,desc:"Produit ajouté par le bar",price}];
        await saveProfileMenu();
        state.registerCat=cat;
        state.newProductOpen=false;
        state.priceError="";
        render();
      }
      if(a==="delete-product"){
        const product=(state.menu||MENU).find(item=>Number(item.id)===id);
        if(!product)return;
        if(!window.confirm(`Supprimer le produit « ${product.name} » ?`))return;
        state.menu=(state.menu||MENU).filter(item=>Number(item.id)!==id);
        delete state.registerDraft[id];
        await saveProfileMenu();
        render();
      }
      if(a==="save-prices"){
        const updatedMenu=(state.menu||MENU).map(item=>{
          const input=document.querySelector(`[data-price-id="${item.id}"]`);
          return input?{...item,price:Number(input.value)}:item;
        });
        if(updatedMenu.some(item=>!Number.isFinite(item.price)||item.price<0)){
          state.priceError="Chaque prix doit être un nombre positif.";
          render();
          return;
        }
        state.menu=updatedMenu;
        await saveProfileMenu();
        state.priceError="";
        render();
      }
      if(a==="stats-period"){
        state.statsPeriod=el.dataset.period;
        render();
      }
      if(a==="add"||a==="remove"){
        const item=(state.menu||MENU).find(x=>x.id===id);
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
        const {error}=await supabaseClient.from("orders").delete().eq("id",el.dataset.id);
        if(error){state.registerError="Impossible de supprimer la commande.";render();return}
        state.orders=state.orders.filter(o=>o.id!==el.dataset.id);
        if(state.editingId===el.dataset.id){state.editingId=null;state.registerName="";state.registerDraft={}}
        render();
      }
      if(a==="toggle-paid"){
        const order=state.orders.find(o=>o.id===el.dataset.id);if(!order)return;
        const updated=await updateOrder(el.dataset.id,{paid:!order.paid});
        state.orders=state.orders.map(o=>o.id===el.dataset.id?updated:o);render();
      }
      if(a==="cancel-edit"){state.editingId=null;state.registerName="";state.registerDraft={};state.registerError="";state.registerModalOpen=false;render()}
      if(a==="submit-register"){
        state.registerName=document.getElementById("client-name")?.value||"";
        const items=itemsFromDraft(state.registerDraft);
        if(!state.registerName.trim()){state.registerError="Le nom du client est obligatoire pour enregistrer la commande.";render();return}
        if(!items.length){state.registerError="Ajoute au moins un article à la commande.";render();return}
        const total=draftTotal(state.registerDraft);
        if(state.editingId){
          const updated=await updateOrder(state.editingId,{label:state.registerName.trim(),items,total});
          state.orders=state.orders.map(o=>o.id===state.editingId?updated:o);
          state.editingId=null;
        }else{
          const created=await saveOrder({label:state.registerName.trim(),source:"registre",items,total,status:"nouvelle",paid:false});
          state.orders.unshift(created);
        }
        state.registerName="";state.registerDraft={};state.registerError="";state.registerModalOpen=false;render();
      }
    });
  });
  
  // Input listeners
  const authUsername = document.getElementById("auth-username");
  const authPassword = document.getElementById("auth-password");
  const clientName = document.getElementById("client-name");
  const statsDate = document.getElementById("stats-date");
  if(authUsername) authUsername.addEventListener("input", e => state.authUsername = e.target.value);
  if(authPassword) authPassword.addEventListener("input", e => state.authPassword = e.target.value);
  if(clientName) clientName.addEventListener("input", e => state.registerName = e.target.value);
  if(statsDate) statsDate.addEventListener("change", e => {
    state.statsDate=e.target.value||dateToInputValue();
    render();
  });
}
loadState().then(()=>render()).catch(error=>{
  console.error("Erreur Supabase:",error);
  state.authError="Impossible de charger les données Supabase.";
  render();
});
