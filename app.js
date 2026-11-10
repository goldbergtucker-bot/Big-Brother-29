const DEFAULT_NAMES = [
  ["Antonio Ricciardi","Male"],["Tucker Anderson","Male"],["TJ Scanlan","Male"],["Jake Randall","Male"],
  ["Joe Cappadonna","Male"],["Zach Anson","Male"],["Logan Salvi","Male"],["Nick Stawczyk","Male"],
  ["Liz Sicard","Female"],["Gracie O'Leary","Female"],["Molly Kueter","Female"],["Aly Cipro","Female"],
  ["Stella Benedetto","Female"],["Grace Pimental","Female"],["Becca Fisher","Female"],["Riley Korengel","Female"]
];
const STAT_KEYS = ["General","Physical","Mental","Social","Strategic"];
const REL_KEYS = ["Friendship","Trust","Loyalty","Rivalry","Respect","Attraction"];
const makeId = () => "hg_" + Math.random().toString(36).slice(2,10);
const initialCast = DEFAULT_NAMES.map(([name,gender],i)=>({id:makeId(),name,gender,portrait:"",bio:"",stats:{General:50,Physical:50,Mental:50,Social:50,Strategic:50},number:i+1}));
const season = {
  title:"Big Brother 29: BB House Party", startDate:"2026-06-11", endDate:"2026-09-16", days:97,
  cast:initialCast, relationships:{}, activeFilter:"all",
  twists:[
    {week:"Week 1",name:"Party Host",desc:"All 16 draw cards: 15 Guests and one Host. The Host is safe for Week 1, cannot compete in the first HOH or POV, and may still vote at eviction. The Host chooses four HGs to compete in the first HOH and separately chooses two additional HGs to receive Week 1 safety." ,rule:"Host is guaranteed safe. The two additional safety selections are separate from the four HOH participants."},
    {week:"Weeks 1–3",name:"Snag & Grab",desc:"America awards one power to one houseguest each week. Recipients may keep the power secret or reveal/hint at it, but may not mislead other HGs.",rule:"Week 1 Nomination Voider (valid through Week 6); Week 2 Veto Redraw (valid through Week 6); Week 3 Veto Upgrade (valid through Week 6, and can only activate if its holder personally wins POV)."},
    {week:"Weeks 3–5",name:"Roommates",desc:"14 eligible HGs are divided into four rooms of three (12 HGs) and two Lobby HGs. Rooms share sleeping quarters. If a roommate wins HOH, their two roommates are safe for that week.",rule:"Week 3 Lobby HGs are immune from nomination, cannot play POV, and cannot vote. In Week 4, each Lobby HG joins a room: one joins the room whose member was evicted; the other chooses any room. Twist ends after Week 5."},
    {week:"Week 7",name:"America's Invitation",desc:"America chooses one HG to invite three competitors (including themself if desired) to the Caged Eggs safety competition.",rule:"Winner is safe; second place receives a cash prize; third place is automatically nominated before the regular nomination ceremony."},
    {week:"Week 10",name:"Jury Battle Back",desc:"The first four jurors compete in Spinning Disk Mania alongside the current HGs.",rule:"Last juror standing returns to the game. If that juror is also the last HG standing, they additionally win HOH; otherwise the last current HG standing wins HOH."}
  ],
  weeks:[
    {week:1,events:[["HOH","Build The Disco","Mental"],["POV","Stackem and Rackem","Physical"],["Twist","Party Host + Snag & Grab","Special"]]},
    {week:2,events:[["HOH","Spin the Bottle","Skill"],["POV","Houseguestsonly.com","Mental"],["Twist","Snag & Grab: Veto Redraw","Special"]]},
    {week:3,events:[["HOH","Piñata Fun Time","Physical / Endurance"],["POV","Take It Off","Skill / Physical"],["Twist","Roommates + Lobby safety","Special"]]},
    {week:4,events:[["HOH","Match Your Card","Mental"],["POV","Mount Pool","Physical"],["Twist","Lobby HGs join rooms","Special"]]},
    {week:5,events:[["HOH","Party Wall","Physical / Endurance"],["POV","Drop The Bomb","Skill"],["Twist","Final week of Roommates","Special"]]},
    {week:6,events:[["HOH","Fun House","Skill"],["POV","OTEV: The Party Lion","Physical / Mental"],["Power","Week 1–3 Snag & Grab powers expire after Week 6","Rule"]]},
    {week:7,events:[["HOH","Punch A Mia","Physical / Endurance"],["POV","Hide and Go Veto","Skill"],["Safety","America's Invitation: Caged Eggs","Mental / Skill"]]},
    {week:8,events:[["HOH","Candy Crush","Skill"],["POV","Cheeseburger In Paradise","Physical"],["Format","Traditional weekly cycle","Rule"]]},
    {week:9,events:[["HOH","Laser Shot","Physical / Mental"],["POV","Bake It","Mental"],["Format","Traditional weekly cycle","Rule"]]},
    {week:10,events:[["HOH / Battle Back","Spinning Disk Mania","Physical / Endurance"],["POV","Guitar Hero","Skill"],["Twist","First four jurors compete; one returns","Special"]]},
    {week:11,events:[["DE HOH 1","Pinball Wizard","Skill"],["DE POV 1","Cold As Ice","Skill"],["DE HOH 2","What The Bleep","Mental"],["DE POV 2","Big Top Drop","Skill"],["Format","Double eviction: Final 7 to Final 5","Special"]]},
    {week:12,events:[["HOH","BB Flix & Chill","Mental"],["POV","BB Comics","Mental"],["Format","Traditional weekly cycle","Rule"]]},
    {week:13,events:[["HOH","Mixed Strings","Physical / Mental / Skill"],["POV","Mark Your Calendar","Mental"],["Format","Final 4 week","Rule"]]},
    {week:14,events:[["Final HOH Part 1","Sky High","Physical / Endurance"],["Final HOH Part 2","Memory Daze","Mental"],["Final HOH Part 3","Jury Statements","Mental"],["Finale","Final 2; jury votes for winner","Special"]]}
  ]
};
let activePage="overview";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function save(){localStorage.setItem("bb29HouseParty",JSON.stringify(season));toast("Season saved in this browser.");}
function load(){try{const raw=localStorage.getItem("bb29HouseParty");if(raw){const parsed=JSON.parse(raw);Object.assign(season,parsed);}}catch(e){console.warn(e)}}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function initials(name){return name.split(/\s+/).map(x=>x[0]||"").slice(0,2).join("").toUpperCase()}
function showPage(page){activePage=page;$$(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));$$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===page));if(page==="relationships")renderRelationshipSelects()}
$$(".nav").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.goto)));
function renderOverview(){const customized=season.cast.filter(h=>h.bio||h.portrait||STAT_KEYS.some(k=>h.stats[k]!==50)).length;$("#profileCount").textContent=`${customized} / ${season.cast.length}`;$("#profileProgress").style.width=(season.cast.length?customized/season.cast.length*100:0)+"%";$("#countHG").textContent=season.cast.length;$("#allCount").textContent=season.cast.length;$("#maleCount").textContent=season.cast.filter(h=>h.gender==="Male").length;$("#femaleCount").textContent=season.cast.filter(h=>h.gender==="Female").length}
function renderCast(){const q=$("#castSearch").value.toLowerCase();const filter=season.activeFilter||"all";const people=season.cast.filter(h=>(filter==="all"||h.gender===filter)&&h.name.toLowerCase().includes(q));$("#castGrid").innerHTML=people.map(h=>`<article class="cast-card"><div class="portrait">${h.portrait?`<img src="${escapeHtml(h.portrait)}" alt="${escapeHtml(h.name)}" onerror="this.remove()">`:`<span class="initials">${escapeHtml(initials(h.name))}</span>`}<span class="gender-tag">${escapeHtml(h.gender)}</span></div><div class="card-body"><div class="card-name">${escapeHtml(h.name)}</div><div class="card-sub">${escapeHtml(h.bio||"No biography added")}</div><div class="card-stats">${["General","Physical","Mental"].map(k=>`<div class="mini-stat"><b>${h.stats[k]??50}</b><span>${k}</span></div>`).join("")}</div><button class="edit-btn" data-edit="${h.id}">EDIT PROFILE</button></div></article>`).join("")||'<div class="panel">No houseguests match your search.</div>';$$("[data-edit]").forEach(b=>b.addEventListener("click",()=>openHG(b.dataset.edit)));renderOverview()}
$$(".filter").forEach(b=>b.addEventListener("click",()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");season.activeFilter=b.dataset.filter;renderCast()}));
$("#castSearch").addEventListener("input",renderCast);
function openHG(id){const h=season.cast.find(x=>x.id===id);$("#hgId").value=h?.id||"";$("#dialogTitle").textContent=h?"Edit "+h.name:"Add Houseguest";$("#hgName").value=h?.name||"";$("#hgGender").value=h?.gender||"Male";$("#hgPortrait").value=h?.portrait||"";$("#hgBio").value=h?.bio||"";$("#statFields").innerHTML=STAT_KEYS.map(k=>`<label class="stat-input"><span>${k}</span><input type="range" min="0" max="100" value="${h?.stats[k]??50}" data-stat="${k}"><b>${h?.stats[k]??50}</b></label>`).join("");$$("[data-stat]").forEach(input=>input.addEventListener("input",()=>input.nextElementSibling.textContent=input.value));$("#hgDialog").showModal()}
$("#addHG").addEventListener("click",()=>openHG(null));$("#cancelHG").addEventListener("click",()=>$("#hgDialog").close());
$("#hgForm").addEventListener("submit",e=>{e.preventDefault();const id=$("#hgId").value;const stats={};$$("[data-stat]").forEach(x=>stats[x.dataset.stat]=Number(x.value));const data={id:id||makeId(),name:$("#hgName").value.trim(),gender:$("#hgGender").value,portrait:$("#hgPortrait").value.trim(),bio:$("#hgBio").value.trim(),stats};if(!data.name)return;if(id){const i=season.cast.findIndex(x=>x.id===id);season.cast[i]={...season.cast[i],...data}}else season.cast.push(data);$("#hgDialog").close();renderCast();renderRelationshipSelects();toast("Houseguest profile updated.")});
function renderRelationshipSelects(){const a=$("#relA"),b=$("#relB");if(!a)return;const oldA=a.value,oldB=b.value;const opts=season.cast.map(h=>`<option value="${h.id}">${escapeHtml(h.name)}</option>`).join("");a.innerHTML=opts;b.innerHTML=opts;if(oldA)a.value=oldA;if(oldB)b.value=oldB;if(a.value===b.value&&season.cast.length>1)b.selectedIndex=1;renderRelationshipEditor()}
function relKey(a,b){return [a,b].sort().join("__")}
function renderRelationshipEditor(){const a=$("#relA").value,b=$("#relB").value,el=$("#relationshipEditor");if(!a||!b||a===b){el.innerHTML='<div class="heart-mark">♡</div><h3>Choose two different houseguests</h3><p>Select a different person in each list.</p>';return}const key=relKey(a,b);season.relationships[key] ||= Object.fromEntries(REL_KEYS.map(k=>[k,50]));const vals=season.relationships[key];el.innerHTML=`<h3>${escapeHtml(season.cast.find(h=>h.id===a)?.name)} & ${escapeHtml(season.cast.find(h=>h.id===b)?.name)}</h3><p>Adjust the starting relationship between this pair.</p><div class="relationship-fields">${REL_KEYS.map(k=>`<label class="range-row"><span>${k}</span><input type="range" min="0" max="100" value="${vals[k]}" data-rel="${k}"><b>${vals[k]}</b></label>`).join("")}</div>`;$$("[data-rel]").forEach(x=>x.addEventListener("input",()=>{vals[x.dataset.rel]=Number(x.value);x.nextElementSibling.textContent=x.value}))}
$("#relA").addEventListener("change",renderRelationshipEditor);$("#relB").addEventListener("change",renderRelationshipEditor);
function renderSchedule(){$("#scheduleList").innerHTML=season.weeks.map(w=>`<article class="week-card"><div class="week-head"><b>WEEK ${w.week}</b><span>${w.week===11?"DOUBLE EVICTION":w.week===14?"FINAL HOH & FINALE":"BB HOUSE PARTY"}</span></div><div class="week-events">${w.events.map(e=>`<div class="event"><strong>${escapeHtml(e[0])}: ${escapeHtml(e[1])}</strong><small class="type">${escapeHtml(e[2])}</small></div>`).join("")}</div></article>`).join("")}
function renderTwists(){$("#twistList").innerHTML=season.twists.map(t=>`<article class="twist-card"><div class="twist-week">${escapeHtml(t.week)}</div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.desc)}</p><div class="rule">${escapeHtml(t.rule)}</div></article>`).join("")}
$("#saveBtn").addEventListener("click",save);
$("#exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(season,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="BB29-House-Party-season.json";a.click();URL.revokeObjectURL(a.href);toast("Season data exported.")});
$("#importFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!Array.isArray(data.cast)||!Array.isArray(data.weeks))throw Error("Invalid BB29 season file");Object.assign(season,data);renderAll();save();toast("Season imported.")}catch(err){toast("Could not import that JSON file.")}e.target.value=""});
$("#resetBtn").addEventListener("click",()=>{if(confirm("Reset BB29 to its original cast and season setup? This replaces the saved season in this browser.")){localStorage.removeItem("bb29HouseParty");location.reload()}});
function renderAll(){renderOverview();renderCast();renderRelationshipSelects();renderSchedule();renderTwists()}
load();renderAll();
