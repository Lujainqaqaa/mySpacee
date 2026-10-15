/* MySpace Admin data layer: shared localStorage records, live dashboard and role permissions.
   Demo only: use a backend for production authentication and authorization. */
(() => {
  const KEYS = { users:'myspace_users', platform:'myspace_platform_data', session:'myspace_admin_session', rooms:'myspace_rooms', furniture:'mySpaceFurniturePosts', furnitureRequests:'mySpaceFurnitureRequests', bookings:'mySpaceServiceRequests' };
  const read = (key, fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const current = (location.pathname.split('/').pop() || 'admin-dashboard.html').toLowerCase();
  const admin = read(KEYS.session, null);
  if (!admin && current !== 'admin-login.html') { location.replace('admin-login.html'); return; }
  if (!admin) return;

  const seedUsers = [
    {id:'U-1001',name:'Sara Ahmad',email:'sara.ahmad@example.com',joined:'2026-10-02',projects:4,status:'Active',role:'Customer'},
    {id:'U-1002',name:'Omar Khalil',email:'omar.k@example.com',joined:'2026-10-04',projects:2,status:'Active',role:'Customer'},
    {id:'U-1003',name:'Lina Haddad',email:'lina.h@example.com',joined:'2026-10-06',projects:7,status:'Active',role:'Customer'},
    {id:'U-1004',name:'Yazan Saleh',email:'yazan.s@example.com',joined:'2026-10-08',projects:1,status:'Pending',role:'Customer'},
    {id:'U-1005',name:'Maya Naser',email:'maya.n@example.com',joined:'2026-10-10',projects:3,status:'Active',role:'Customer'}
  ];
  // Seed the existing login system only when it has no users; same names appear in the admin panel.
  const authUsers = read(KEYS.users, []);
  if (!authUsers.length) write(KEYS.users, seedUsers.map((u,i)=>({name:u.name,email:u.email,password:'MySpace2026!',role:'Customer',id:u.id,joined:u.joined,projects:u.projects,status:u.status})));

  const seed = {
    users: seedUsers,
    providers:[
      {id:'PR-01',name:'Olive Home Services',service:'Home styling',location:'Amman',requests:28,status:'Verified',price:45},
      {id:'PR-02',name:'Craft & Care',service:'Furniture assembly',location:'Irbid',requests:16,status:'Verified',price:30},
      {id:'PR-03',name:'BrightFix',service:'Painting',location:'Amman',requests:12,status:'Pending',price:75},
      {id:'PR-04',name:'Green Nest',service:'Home plants',location:'Zarqa',requests:9,status:'Review',price:25}
    ],
    designers:[
      {id:'D-01',name:'Nour Design Studio',specialty:'Modern interiors',location:'Amman',rating:'4.9 / 5',status:'Active'},
      {id:'D-02',name:'Rana Odeh',specialty:'Scandinavian',location:'Irbid',rating:'4.8 / 5',status:'Active'},
      {id:'D-03',name:'Studio Terra',specialty:'Warm minimalism',location:'Amman',rating:'4.7 / 5',status:'Review'},
      {id:'D-04',name:'Mira Interiors',specialty:'Contemporary',location:'Zarqa',rating:'4.6 / 5',status:'Active'}
    ],
    projects:[
      {id:'PJ-1001',name:'Soft Neutral Living',owner:'Sara Ahmad',room:'Living Room',budget:850,status:'In Progress',date:'2026-10-05'},
      {id:'PJ-1002',name:'Calm Bedroom',owner:'Omar Khalil',room:'Bedroom',budget:620,status:'Completed',date:'2026-10-06'},
      {id:'PJ-1003',name:'Warm Family Home',owner:'Lina Haddad',room:'Living Room',budget:1450,status:'In Progress',date:'2026-10-08'},
      {id:'PJ-1004',name:'Compact Kitchen',owner:'Maya Naser',room:'Kitchen',budget:720,status:'Review',date:'2026-10-10'}
    ],
    bookings:[
      {id:'BK-1042',customer:'Sara Ahmad',service:'Designer consultation',date:'2026-10-16',price:35,status:'Confirmed'},
      {id:'BK-1043',customer:'Omar Khalil',service:'Furniture assembly',date:'2026-10-17',price:30,status:'Pending'},
      {id:'BK-1044',customer:'Lina Haddad',service:'Room styling',date:'2026-10-18',price:55,status:'Confirmed'},
      {id:'BK-1045',customer:'Maya Naser',service:'Painting service',date:'2026-10-19',price:75,status:'Pending'}
    ],
    furniture:[
      {id:'FU-01',name:'Oak coffee table',owner:'Sara Ahmad',category:'Tables',condition:'Good',price:45,status:'Pending',date:'2026-10-06'},
      {id:'FU-02',name:'Beige accent chair',owner:'Omar Khalil',category:'Seating',condition:'Very good',price:65,status:'Approved',date:'2026-10-07'},
      {id:'FU-03',name:'Floor lamp',owner:'Maya Naser',category:'Lighting',condition:'Good',price:20,status:'Approved',date:'2026-10-09'},
      {id:'FU-04',name:'Two-seat sofa',owner:'Yazan Saleh',category:'Sofas',condition:'Used',price:180,status:'Review',date:'2026-10-11'}
    ],
    reviews:[
      {id:'RV-01',customer:'Sara Ahmad',for:'Nour Design Studio',rating:'5 / 5',review:'Beautiful, thoughtful design',status:'Published'},
      {id:'RV-02',customer:'Omar Khalil',for:'Craft & Care',rating:'4 / 5',review:'Quick and professional',status:'Published'},
      {id:'RV-03',customer:'Lina Haddad',for:'Studio Terra',rating:'3 / 5',review:'Good ideas, late delivery',status:'Pending'},
      {id:'RV-04',customer:'Maya Naser',for:'Olive Home Services',rating:'5 / 5',review:'Very helpful team',status:'Published'}
    ],
    complaints:[
      {id:'CS-208',customer:'Yazan Saleh',issue:'Booking reschedule',opened:'2026-10-12',status:'Open'},
      {id:'CS-209',customer:'Maya Naser',issue:'Furniture listing',opened:'2026-10-13',status:'In Review'},
      {id:'CS-210',customer:'Omar Khalil',issue:'Payment question',opened:'2026-10-11',status:'Resolved'},
      {id:'CS-211',customer:'Sara Ahmad',issue:'Provider response',opened:'2026-10-12',status:'Open'}
    ],
    content:[
      {id:'CT-01',title:'Small Living Room Ideas',type:'Article',updated:'2026-10-12',visibility:'Published'},
      {id:'CT-02',title:'Warm Minimalism Guide',type:'Guide',updated:'2026-10-10',visibility:'Published'},
      {id:'CT-03',title:'Reuse Before You Buy',type:'Campaign',updated:'2026-10-09',visibility:'Draft'},
      {id:'CT-04',title:'Autumn Color Palette',type:'Inspiration',updated:'2026-10-08',visibility:'Published'}
    ],
    notifications:[
      {id:'NT-01',notification:'New reuse furniture collection',audience:'All users',sent:'2026-10-14',type:'Announcement',status:'Sent'},
      {id:'NT-02',notification:'Designer verification reminder',audience:'Designers',sent:'2026-10-13',type:'Reminder',status:'Sent'},
      {id:'NT-03',notification:'Platform maintenance notice',audience:'All users',sent:'2026-10-10',type:'System',status:'Scheduled'},
      {id:'NT-04',notification:'Booking update',audience:'Customers',sent:'2026-10-09',type:'Service',status:'Sent'}
    ]
  };
  let data = read(KEYS.platform, null);
  if (!data) data=seed;
  else Object.keys(seed).forEach(key=>{
    if(!Array.isArray(data[key]) || data[key].length===0) data[key]=seed[key];
  });
  write(KEYS.platform,data);
  // Keep the Admin Users page in sync with the exact accounts used by Login/Sign Up.
  // The authentication list is the source of truth; preserve extra admin metadata when available.
  const storedUsers=read(KEYS.users,[]);
  const existingAdminUsers=Array.isArray(data.users)?data.users:[];
  const normalizedEmail=value=>(value||'').trim().toLowerCase();
  const today=()=>new Date().toISOString().slice(0,10);
  data.users=storedUsers.map((account,index)=>{
    const email=normalizedEmail(account.email);
    const prior=existingAdminUsers.find(u=>normalizedEmail(u.email)===email)||{};
    const projectCount=(data.projects||[]).filter(p=>normalizedEmail(p.owner)===normalizedEmail(account.name)||normalizedEmail(p.ownerEmail)===email).length;
    return {
      ...prior,
      ...account,
      id:account.id||prior.id||('U-'+String(1000+index+1)),
      name:account.name||prior.name||email.split('@')[0]||'User',
      email:account.email||prior.email||'',
      joined:account.joined||prior.joined||today(),
      projects:account.projects!==undefined?account.projects:(prior.projects!==undefined?prior.projects:projectCount),
      role:account.role||prior.role||'Customer',
      status:account.status||prior.status||'Active'
    };
  }).filter(u=>u.email);
  const saveData=()=>write(KEYS.platform,data);
  saveData();

  const role = (admin.role || 'admin').toLowerCase();
  const permissions = {
    admin: ['*'],
    moderator: ['admin-dashboard.html','admin-projects.html','admin-bookings.html','admin-reuse.html','admin-reviews.html','admin-content.html','admin-notifications.html','admin-reports.html'],
    support: ['admin-dashboard.html','admin-users.html','admin-bookings.html','admin-complaints.html','admin-reports.html']
  };
  const allowed = permissions[role] || permissions.support;
  document.querySelectorAll('.side-nav a').forEach(a=>{
    const file=(a.getAttribute('href')||'').toLowerCase();
    if(!allowed.includes('*')&&!allowed.includes(file)) a.hidden=true;
  });
  if(!allowed.includes('*') && !allowed.includes(current)) { location.replace('admin-dashboard.html'); return; }
  const displayName=admin.name||'Admin';
  const avatar=document.getElementById('adminAvatar');
  if(avatar){avatar.textContent=displayName.trim().charAt(0).toUpperCase()||'A';avatar.title=displayName+' · '+role;avatar.addEventListener('click',()=>{if(allowed.includes('*'))location.href='admin-settings.html';});}
  const sideBottom=document.querySelector('.side-bottom');
  if(sideBottom){sideBottom.innerHTML='MySpace Platform<br>'+role.charAt(0).toUpperCase()+role.slice(1)+' access<br><button id="adminLogoutSide" style="margin-top:12px;border:0;background:transparent;color:#4d0e13;padding:0;font-size:12px;text-decoration:underline">Log out</button>';document.getElementById('adminLogoutSide').addEventListener('click',logout);}
  function logout(){localStorage.removeItem(KEYS.session);location.href='admin-login.html';}
  const fmtDate=v=>{if(!v)return '—'; const d=new Date(v+'T12:00:00'); return Number.isNaN(d.getTime())?v:d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});};
  const money=v=>'JD '+Number(v||0).toLocaleString('en-JO',{minimumFractionDigits:0,maximumFractionDigits:2});
  const content=document.getElementById('adminPageContent');
  const configs={
    'admin-users.html':{key:'users',title:'accounts',headers:['Name','Email','Joined','Projects','Role','Status'],fields:['name','email','joined','projects','role','status']},
    'admin-providers.html':{key:'providers',title:'providers',headers:['Provider','Service','Location','Requests','Price','Status'],fields:['name','service','location','requests','price','status']},
    'admin-designers.html':{key:'designers',title:'designers',headers:['Designer','Specialty','Location','Rating','Status'],fields:['name','specialty','location','rating','status']},
    'admin-projects.html':{key:'projects',title:'projects',headers:['Project','Owner','Room','Budget (JD)','Date','Status'],fields:['name','owner','room','budget','date','status']},
    'admin-bookings.html':{key:'bookings',title:'bookings',headers:['Booking ID','Customer','Service','Date','Price (JD)','Status'],fields:['id','customer','service','date','price','status']},
    'admin-reuse.html':{key:'furniture',title:'furniture listings',headers:['Furniture item','Owner','Category','Condition','Price (JD)','Date','Status'],fields:['name','owner','category','condition','price','date','status']},
    'admin-reviews.html':{key:'reviews',title:'reviews',headers:['Customer','For','Rating','Review','Status'],fields:['customer','for','rating','review','status']},
    'admin-complaints.html':{key:'complaints',title:'complaints',headers:['Ticket','Customer','Issue','Opened','Status'],fields:['id','customer','issue','opened','status']},
    'admin-content.html':{key:'content',title:'content items',headers:['Content title','Type','Updated','Visibility'],fields:['title','type','updated','visibility']},
    'admin-notifications.html':{key:'notifications',title:'notifications',headers:['Notification','Audience','Sent','Type','Status'],fields:['notification','audience','sent','type','status']},
    'admin-reports.html':{key:'reports',title:'reports',headers:['Metric','Value'],fields:['metric','value']}
  };
  function renderTable(){
    if(!content||!configs[current])return;
    const cfg=configs[current];
    let rows=data[cfg.key]||[];
    if(cfg.key==='designers' && rows.length===0){ rows=seed.designers.slice(); data.designers=rows; saveData(); }
    if(cfg.key==='users'){
      const auth=read(KEYS.users,[]);
      rows.forEach(u=>{const a=auth.find(x=>(x.email||'').toLowerCase()===u.email.toLowerCase());if(a){u.name=a.name||u.name;u.status=a.status||u.status;u.role=a.role||u.role;}});
    }
    if(cfg.key==='reports') rows=[
      {metric:'Active users',value:rowsCount('users')},{metric:'Projects',value:rowsCount('projects')},{metric:'Bookings',value:rowsCount('bookings')},{metric:'Approved furniture listings',value:(data.furniture||[]).filter(x=>x.status==='Approved').length},{metric:'Booking value',value:money((data.bookings||[]).reduce((s,x)=>s+Number(x.price||0),0))},{metric:'Project budget total',value:money((data.projects||[]).reduce((s,x)=>s+Number(x.budget||0),0))}
    ];
    const reviewStatuses=['Pending','Review','Open','In Review','Rejected'];
    const statusField=rows.some(r=>r.status!==undefined)?'status':(rows.some(r=>r.visibility!==undefined)?'visibility':null);
    const activeCount=statusField?rows.filter(r=>['Active','Approved','Verified','Completed','Confirmed','Published','Resolved','Sent'].includes(String(r[statusField]))).length:rows.length;
    const reviewCount=statusField?rows.filter(r=>reviewStatuses.includes(String(r[statusField]))).length:0;
    const progress=rows.length?Math.round(activeCount/rows.length*100):0;
    const ringStyle='background:conic-gradient(#500d13 '+progress+'%, #eaded2 0)';
    const analytics='<section class="admin-metrics"><article class="metric-card"><div class="metric-icon">▦</div><span>Total records</span><strong>'+rows.length.toLocaleString()+'</strong><small>Saved in this browser</small></article><article class="metric-card"><div class="metric-icon">↗</div><span>Active / completed</span><strong>'+activeCount.toLocaleString()+'</strong><small>Based on current record status</small></article><article class="metric-card"><div class="metric-icon">◷</div><span>Needs attention</span><strong>'+reviewCount.toLocaleString()+'</strong><small>Pending, review, or open</small></article><article class="metric-card metric-progress"><div class="progress-ring" style="'+ringStyle+'"><span>'+progress+'%</span></div><div><span>Current progress</span><strong>'+progress+'%</strong><small>Active / completed share</small></div></article></section>';
    const distribution=statusField?Object.entries(rows.reduce((acc,r)=>{const st=String(r[statusField]||'Unspecified');acc[st]=(acc[st]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,5):[];
    const chart=distribution.length?'<section class="panel analytics-panel"><div class="analytics-heading"><div><h2>Status overview</h2><p>Distribution calculated from current saved records</p></div><span class="live-pill"><i></i> Live data</span></div><div class="status-bars">'+distribution.map(([name,count])=>'<div class="status-bar-row"><div><span>'+esc(name)+'</span><b>'+count+'</b></div><div class="bar-track"><span style="width:'+Math.round(count/Math.max(rows.length,1)*100)+'%"></span></div></div>').join('')+'</div></section>':'';
    content.innerHTML=analytics+chart+'<section class="table-panel"><div class="table-head"><h2>'+rows.length+' '+cfg.title+'</h2><input id="tableSearch" type="search" placeholder="Search records..." aria-label="Search records"></div><div class="table-wrap"><table><thead><tr>'+cfg.headers.map(h=>'<th>'+h+'</th>').join('')+'<th>Action</th></tr></thead><tbody>'+rows.map((r,i)=>'<tr data-index="'+i+'">'+cfg.fields.map(field=>{let val=r[field]??'—';if(['budget','price'].includes(field))val=money(val);else if(['joined','date','opened','updated','sent'].includes(field))val=fmtDate(val);return '<td>'+(field==='status'||field==='visibility'?'<span class="status">'+esc(val)+'</span>':esc(val))+'</td>';}).join('')+'<td>'+(canEdit(cfg.key)?'<button class="row-actions" data-row="'+i+'">Update</button>':'<span>View only</span>')+'</td></tr>').join('')+'</tbody></table></div><p class="notice">Shared demo records saved in this browser. Changes are reflected in admin metrics and connected pages where applicable.</p></section>';
    const search=document.getElementById('tableSearch');search.addEventListener('input',()=>{const q=search.value.toLowerCase();content.querySelectorAll('tbody tr').forEach(tr=>tr.hidden=!tr.innerText.toLowerCase().includes(q));});
    content.querySelectorAll('[data-row]').forEach(btn=>btn.addEventListener('click',()=>{
      const i=Number(btn.dataset.row), record=rows[i]; if(!record)return;
      const field=record.status!==undefined?'status':record.visibility!==undefined?'visibility':null;
      if(!field){btn.textContent=btn.textContent==='Update'?'Viewed':'Update';return;}
      const cycles={Pending:['Approved','Rejected'],Open:['In Review','Resolved'],'In Review':['Resolved','Open'],Review:['Verified','Rejected'],Draft:['Published','Draft'],Scheduled:['Sent','Scheduled'],Active:['Suspended','Active'],Verified:['Suspended','Verified'],Published:['Hidden','Published'],Confirmed:['Completed','Cancelled'],'In Progress':['Completed','In Progress'],Completed:['In Progress','Completed'],Approved:['Hidden','Approved'],Rejected:['Pending','Rejected'],Suspended:['Active','Suspended'],Hidden:['Published','Hidden'],Sent:['Read','Sent'],Resolved:['Open','Resolved']};
      const options=cycles[record[field]]||['Updated',record[field]];record[field]=options[0];
      if(cfg.key==='users'){
        const auth=read(KEYS.users,[]);const u=auth.find(x=>(x.email||'').toLowerCase()===record.email.toLowerCase());if(u)u.status=record.status;write(KEYS.users,auth);
      }
      saveData();renderTable();
    }));
  }
  function canEdit(key){if(role==='admin')return true;if(role==='moderator')return ['projects','bookings','furniture','reviews','content','notifications'].includes(key);if(role==='support')return ['users','bookings','complaints'].includes(key);return false;}
  function rowsCount(key){return (data[key]||[]).length;}
  function esc(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function renderDashboard(){
    if(current!=='admin-dashboard.html')return;
    const roomProjects=read(KEYS.rooms,[]); const furnitureRequests=read(KEYS.furnitureRequests,[]); const userRequests=read(KEYS.bookings,[]);
    const stats=[rowsCount('users'),rowsCount('providers'),rowsCount('projects')+roomProjects.length,rowsCount('bookings')+furnitureRequests.length+userRequests.length,(data.bookings||[]).reduce((s,x)=>s+Number(x.price||0),0)];
    const cards=document.querySelectorAll('.stats-grid .stat-card strong');
    stats.forEach((v,i)=>{if(cards[i])cards[i].textContent=i===4?money(v):Number(v).toLocaleString('en-US');});
    const activities=[];
    if(data.users.length)activities.push('User account created');if(data.providers.length)activities.push('Provider registration');if(roomProjects.length||data.projects.length)activities.push('Project updated');if(data.furniture.length||furnitureRequests.length)activities.push('Furniture listing activity');if(data.bookings.length||userRequests.length)activities.push('Booking request');
    document.querySelectorAll('.activity-row span').forEach((el,i)=>{if(activities[i])el.textContent=activities[i];});
    document.querySelectorAll('.activity-row small').forEach(el=>el.textContent='2026');
    const statusRows=document.querySelectorAll('.dashboard-grid .status-row strong');if(statusRows[0])statusRows[0].textContent=rowsCount('users')+' accounts';if(statusRows[1])statusRows[1].textContent=(data.providers||[]).filter(x=>x.status==='Verified').length+' verified';if(statusRows[2])statusRows[2].textContent=roomProjects.length+rowsCount('projects')+' projects';if(statusRows[3])statusRows[3].textContent=(data.complaints||[]).filter(x=>x.status==='Open').length+' open';
    const buckets=[['Users',rowsCount('users')],['Providers',rowsCount('providers')],['Designers',rowsCount('designers')],['Projects',rowsCount('projects')+roomProjects.length],['Bookings',rowsCount('bookings')+furnitureRequests.length+userRequests.length],['Furniture',rowsCount('furniture')]];
    const maxBucket=Math.max(1,...buckets.map(x=>x[1]));
    const areaChart=document.getElementById('areaChart');if(areaChart)areaChart.innerHTML=buckets.map(([label,value])=>'<div class="area-row"><div><span>'+label+'</span><b>'+value+'</b></div><div class="bar-track"><span style="width:'+Math.round(value/maxBucket*100)+'%"></span></div></div>').join('');
    const statusSets=[...(data.projects||[]),...(data.bookings||[]),...(data.furniture||[]),...(data.providers||[])];
    const good=statusSets.filter(x=>['Active','Approved','Verified','Completed','Confirmed','Published','Resolved'].includes(x.status)).length;
    const health=statusSets.length?Math.round(good/statusSets.length*100):0;
    const ring=document.getElementById('healthRing');if(ring)ring.style.background='conic-gradient(#500d13 '+health+'%, #eaded2 0)';
    const hp=document.getElementById('healthPercent');if(hp)hp.textContent=health+'%';
    const ht=document.getElementById('healthTitle');if(ht)ht.textContent=good+' of '+statusSets.length+' records active';
    const hd=document.getElementById('healthDescription');if(hd)hd.textContent=statusSets.length?'Calculated from current provider, project, booking and furniture statuses.':'No records available yet.';
  }
  if(current==='admin-settings.html'&&content){
    if(role!=='admin'){location.replace('admin-dashboard.html');return;}
    content.innerHTML='<section class="admin-metrics"><article class="metric-card"><div class="metric-icon">♙</div><span>User accounts</span><strong>'+rowsCount('users')+'</strong><small>Saved platform accounts</small></article><article class="metric-card"><div class="metric-icon">⌂</div><span>Projects</span><strong>'+rowsCount('projects')+'</strong><small>Current project records</small></article><article class="metric-card"><div class="metric-icon">◷</div><span>Bookings</span><strong>'+rowsCount('bookings')+'</strong><small>Current booking records</small></article><article class="metric-card metric-progress"><div class="progress-ring" style="background:conic-gradient(#500d13 100%, #eaded2 0)"><span>100%</span></div><div><span>Session</span><strong>Secure area</strong><small>Admin preferences</small></div></article></section><section class="table-panel"><h2>Admin account settings</h2><form class="settings-form" id="settingsForm"><label>Admin display name<input id="settingName" value="'+esc(displayName)+'" required></label><label>Admin email<input value="'+esc(admin.email||'admin@myspace.com')+'" type="email" disabled></label><label>Role<input value="'+esc(role)+'" disabled></label><label>Default currency<input value="Jordanian Dinar (JD)" disabled></label><button class="primary-btn" type="submit">Save settings</button></form><p class="notice" id="settingsMessage">Changes are saved to this browser demo session.</p><button class="primary-btn" id="adminLogout" style="margin-top:16px;background:#4d0e13;color:white">Log out</button></section>';
    document.getElementById('settingsForm').addEventListener('submit',e=>{e.preventDefault();admin.name=document.getElementById('settingName').value.trim()||'Admin';write(KEYS.session,admin);const av=document.getElementById('adminAvatar');if(av)av.textContent=admin.name.charAt(0).toUpperCase();document.getElementById('settingsMessage').textContent='Settings saved successfully.';});document.getElementById('adminLogout').addEventListener('click',logout);
  }
  renderTable();renderDashboard();
  window.addEventListener('storage',()=>location.reload());
})();
