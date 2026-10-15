/* Shared MySpace demo records. Included by user and admin pages so both sides start from the same data. */
(() => {
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
  const users = [
    {id:'U-1001',name:'Sara Ahmad',email:'sara.ahmad@example.com',joined:'2026-10-02',projects:4,status:'Active',role:'Customer'},
    {id:'U-1002',name:'Omar Khalil',email:'omar.k@example.com',joined:'2026-10-04',projects:2,status:'Active',role:'Customer'},
    {id:'U-1003',name:'Lina Haddad',email:'lina.h@example.com',joined:'2026-10-06',projects:7,status:'Active',role:'Customer'},
    {id:'U-1004',name:'Yazan Saleh',email:'yazan.s@example.com',joined:'2026-10-08',projects:1,status:'Pending',role:'Customer'},
    {id:'U-1005',name:'Maya Naser',email:'maya.n@example.com',joined:'2026-10-10',projects:3,status:'Active',role:'Customer'}
  ];
  const existingUsers = read('myspace_users', []);
  if (!existingUsers.length) localStorage.setItem('myspace_users', JSON.stringify(users.map(u=>({...u,password:'MySpace2026!'}))));
  if (!localStorage.getItem('myspace_platform_data')) {
    localStorage.setItem('myspace_platform_data', JSON.stringify({
      users, providers:[], designers:[],
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
      ], reviews:[], complaints:[], content:[], notifications:[]
    }));
  }
})();
