import { useState, useEffect, useRef } from "react";

// ── PALETTE: Purple-Pink Gradient, Soft & Cute ──────────────
const G = {
  bg:"linear-gradient(160deg,#0d0520 0%,#1a0835 45%,#0d0a2e 100%)",
  header:"linear-gradient(135deg,rgba(147,51,234,0.6),rgba(236,72,153,0.5))",
  card:"linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))",
  cardPink:"linear-gradient(145deg,rgba(236,72,153,0.2),rgba(147,51,234,0.15))",
  cardPurple:"linear-gradient(145deg,rgba(147,51,234,0.2),rgba(99,102,241,0.15))",
  pill:"linear-gradient(135deg,#9333ea,#ec4899)",
  pillSoft:"linear-gradient(135deg,rgba(147,51,234,0.3),rgba(236,72,153,0.3))",
  bar:"linear-gradient(90deg,#9333ea,#ec4899,#f97316)",
};
const C = {
  pink:"#f472b6", pinkL:"#fda4cf", pinkD:"#db2777",
  purple:"#c084fc", purpleL:"#e9d5ff", purpleD:"#9333ea",
  violet:"#818cf8", rose:"#fb7185",
  green:"#34d399", teal:"#2dd4bf",
  gold:"#fbbf24", orange:"#fb923c",
  white:"#fff0fa", muted:"#d8b4fe", faint:"#9d7fc3", dim:"#6b4e8a",
  border:"rgba(196,132,252,0.2)", borderB:"rgba(244,114,182,0.35)",
};
const r = (v) => `${v}px`;
const TODAY = new Date().toISOString().split("T")[0];
const uid = () => Math.random().toString(36).slice(2,9);
const LS = {
  get:(k,fb)=>{ try{ const v=localStorage.getItem(k); return v!==null?JSON.parse(v):fb; }catch{ return fb; } },
  set:(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} },
};
const GOALS = { kcal:1600, protein:145, carb:140, fat:50 };
const MILESTONES = [
  {date:"2026-08-01",weight:65,label:"🎯 ส.ค. 65 กก."},
  {date:"2026-11-08",weight:58,label:"🏅 แข่ง 8 พ.ย."},
  {date:"2026-12-01",weight:48,label:"🎯 ธ.ค. 48 กก."},
];
const DAY_PLANS = {
  1:{label:"วันที่ 1",sub:"Stairmaster + วิ่ง 3 กม. + มวย",color:C.pink,type:"run",
    items:[
      {id:"s1",ic:"🪜",title:"Stairmaster 45 นาที",detail:"Zone 2 · HR 119–139 · ระดับ 6–8",hr:"119–139"},
      {id:"r1",ic:"🏃",title:"วิ่ง 3 กม. Zone 2",detail:"HR 119–139 · speed 7–7.5",hr:"119–139",km:"3",speed:"7–7.5"},
      {id:"m1",ic:"🥊",title:"มวยไทย Project H",detail:"คลาสปกติ · Zone 2–4",hr:"119–178"},
    ]},
  2:{label:"วันที่ 2",sub:"Stairmaster + เวท Glute & Leg + มวย",color:C.purple,type:"weight",
    items:[
      {id:"s2",ic:"🪜",title:"Stairmaster 45 นาที",detail:"Zone 2 · HR 119–139 · ระดับ 6–8",hr:"119–139"},
      {id:"m2",ic:"🥊",title:"มวยไทย Project H",detail:"คลาสปกติ",hr:"119–178"},
    ],
    weight:{title:"เวท A — Glute & Leg",exercises:[
      {id:"ht",name:"Hip Thrust Machine",sets:4,reps:12,note:"บีบก้นค้างข้างบน 1 วิ"},
      {id:"ck",name:"Cable Kickback",sets:3,reps:15,note:"ขาละ ตึงก้นตลอด"},
      {id:"lp",name:"Leg Press (Sumo wide)",sets:4,reps:12,note:"เท้ากว้าง เน้น inner thigh"},
      {id:"ha",name:"Hip Abduction Machine",sets:3,reps:20,note:"ช่วยให้สะโพกกว้าง"},
      {id:"lc",name:"Leg Curl Machine",sets:3,reps:12,note:"คุม eccentric ช้าๆ"},
      {id:"cp",name:"Cable Pull-Through",sets:3,reps:15,note:"hinge สะโพก ไม่ใช่หลัง"},
    ]},
    optRun:{id:"or2",title:"วิ่งเบา 1–1.5 กม. (optional)",detail:"Zone 1 · speed 6 · ถ้าขาล้าข้ามได้"}},
  3:{label:"วันที่ 3",sub:"Stairmaster + วิ่ง 3 กม. + มวย",color:C.pink,type:"run",
    items:[
      {id:"s3",ic:"🪜",title:"Stairmaster 45 นาที",detail:"Zone 2 · HR 119–139 · ระดับ 6–8",hr:"119–139"},
      {id:"r3",ic:"🏃",title:"วิ่ง 3 กม. Zone 2",detail:"HR 119–139 · speed 7–7.5",hr:"119–139",km:"3",speed:"7–7.5"},
      {id:"m3",ic:"🥊",title:"มวยไทย Project H",detail:"คลาสปกติ",hr:"119–178"},
    ]},
  4:{label:"วันที่ 4",sub:"Stairmaster + เวท Core & Waist + มวย",color:C.purple,type:"weight",
    items:[
      {id:"s4",ic:"🪜",title:"Stairmaster 45 นาที",detail:"Zone 2 · HR 119–139 · ระดับ 6–8",hr:"119–139"},
      {id:"m4",ic:"🥊",title:"มวยไทย Project H",detail:"คลาสปกติ",hr:"119–178"},
    ],
    weight:{title:"เวท B — Core + Waist + Upper",exercises:[
      {id:"wc",name:"Cable Woodchop",sets:3,reps:15,note:"หมุนลำตัว ไม่ใช่แขน"},
      {id:"pp",name:"Pallof Press",sets:3,reps:12,note:"ต้านการหมุน เสริม core"},
      {id:"hl",name:"Hanging Leg Raise",sets:3,reps:12,note:"งอเข่าได้ถ้ายังไม่แข็งแรง"},
      {id:"cc",name:"Cable Crunch",sets:3,reps:15,note:"โค้งลงจาก cable ไม่ใช่ดึง"},
      {id:"lt",name:"Lat Pulldown",sets:3,reps:12,note:"ดึงลงหน้าอก"},
      {id:"sr",name:"Seated Cable Row",sets:3,reps:12,note:"บีบหลังทุกครั้ง"},
    ]},
    optRun:{id:"or4",title:"วิ่งเบา 1–1.5 กม. (optional)",detail:"Zone 1 · speed 6 · ถ้าขาล้าข้ามได้"}},
  5:{label:"วันที่ 5",sub:"Stairmaster + วิ่ง 3 กม. + มวย",color:C.pink,type:"run",
    items:[
      {id:"s5",ic:"🪜",title:"Stairmaster 45 นาที",detail:"Zone 2 · HR 119–139 · ระดับ 6–8",hr:"119–139"},
      {id:"r5",ic:"🏃",title:"วิ่ง 3 กม. Zone 2",detail:"HR 119–139 · speed 7–7.5",hr:"119–139",km:"3",speed:"7–7.5"},
      {id:"m5",ic:"🥊",title:"มวยไทย Project H",detail:"คลาสปกติ",hr:"119–178"},
    ]},
  6:{label:"วันที่ 6",sub:"Long run + Stairmaster 30 นาที + มวย",color:C.orange,type:"longrun",
    items:[
      {id:"lr6",ic:"🏃‍♀️",title:"Long run Zone 2",detail:"เริ่ม 4 กม. เพิ่มสัปดาห์ละ 0.5 กม. · speed 6.5–7",hr:"119–139",km:"4+",speed:"6.5–7"},
      {id:"s6",ic:"🪜",title:"Stairmaster 30 นาที",detail:"Zone 2 · เบาลง · ระดับ 5–7",hr:"119–139"},
      {id:"m6",ic:"🥊",title:"มวยไทย Project H",detail:"บอกโค้ชถ้าขาล้ามาก",hr:"119–178"},
    ]},
  7:{label:"วันที่ 7",sub:"Active Recovery · ทุกอย่างเบา",color:C.violet,type:"recovery",
    items:[
      {id:"s7",ic:"🪜",title:"Stairmaster 30 นาที เบา",detail:"Zone 1–2 · HR ไม่เกิน 130 · ระดับ 4–5",hr:"99–130"},
      {id:"r7",ic:"🏃",title:"วิ่งเบา 1.5 กม.",detail:"Zone 1 · speed 6 · แค่ขยับขา",hr:"99–119",km:"1.5",speed:"6"},
      {id:"m7",ic:"🥊",title:"มวยไทย Project H",detail:"คลาสปกติ",hr:"119–158"},
      {id:"st7",ic:"🧘",title:"ยืดเส้น + foam roll 15 นาที",detail:"เน้นขา น่อง สะโพก IT band"},
    ]},
  8:{label:"วันเวร 🏥",sub:"ไม่มีมวย · Stairmaster + วิ่ง",color:C.rose,type:"oncall",
    items:[
      {id:"s8",ic:"🪜",title:"Stairmaster 45 นาที",detail:"Zone 2 · HR 119–139 · ทดแทน calorie จากมวย",hr:"119–139"},
      {id:"r8",ic:"🏃",title:"วิ่ง 3 กม. Zone 2",detail:"HR 119–139 · speed 7",hr:"119–139",km:"3",speed:"7"},
      {id:"st8",ic:"🧘",title:"ยืดเส้น + foam roll 20 นาที",detail:"ร่างกายได้พักจากมวย"},
    ]},
};

// ── SHARED UI ────────────────────────────────────────────────
function Ring({value,max,size=88,stroke=11,color,label,sub}){
  const r=(size-stroke)/2,circ=2*Math.PI*r,pct=Math.max(0,Math.min(1,max>0?value/max:0)),over=value>max;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div style={{position:"relative",width:size,height:size}}>
        <div style={{position:"absolute",inset:-4,borderRadius:"50%",background:`radial-gradient(circle,${color}22 0%,transparent 70%)`}}/>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)",position:"relative",zIndex:1}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={over?"#fb7185":color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
            style={{transition:"stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)",filter:`drop-shadow(0 0 6px ${color}88)`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:2}}>
          <span style={{fontSize:size*0.21,fontWeight:900,color:over?"#fb7185":C.white,lineHeight:1}}>{Math.round(value)}</span>
          {max&&<span style={{fontSize:8,color:C.faint,fontWeight:700}}>/{max}</span>}
        </div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:800,color:over?"#fb7185":color,textShadow:`0 0 12px ${color}66`}}>{label}</div>
        {sub&&<div style={{fontSize:10,color:C.faint,fontWeight:600,marginTop:1}}>{sub}</div>}
      </div>
    </div>
  );
}

function Pill({children,color,onClick,active,big}){
  return <button onClick={onClick} style={{
    padding:big?"13px 22px":"9px 18px",
    borderRadius:999,
    background:active?`linear-gradient(135deg,${color},${color}bb)`:"rgba(255,255,255,0.06)",
    border:`1.5px solid ${active?color+"99":C.border}`,
    color:active?C.white:C.muted,
    fontWeight:active?800:600,
    fontSize:big?14:12,
    cursor:"pointer",
    fontFamily:"Nunito,sans-serif",
    boxShadow:active?`0 4px 20px ${color}44`:"none",
    transition:"all .2s",
    whiteSpace:"nowrap",
  }}>{children}</button>;
}

function Card({children,style={},gradient}){
  return <div style={{
    background:gradient||G.card,
    border:`1px solid ${C.border}`,
    borderRadius:28,
    padding:18,
    marginBottom:14,
    backdropFilter:"blur(16px)",
    boxShadow:"0 4px 24px rgba(0,0,0,0.3)",
    ...style,
  }}>{children}</div>;
}

function Lbl({children}){
  return <div style={{fontSize:12,color:C.muted,fontWeight:800,marginBottom:10,letterSpacing:.4}}>{children}</div>;
}

function Inp({style={},type="text",...rest}){
  return <input type={type} {...rest} style={{
    background:"rgba(255,255,255,0.07)",
    border:`1.5px solid ${C.border}`,
    borderRadius:18,
    color:C.white,
    padding:"13px 16px",
    fontSize:15,
    width:"100%",
    outline:"none",
    fontFamily:"Nunito,sans-serif",
    fontWeight:700,
    ...style,
  }}/>;
}

function Check({done,color,onClick,label,sublabel,size=24}){
  return <div onClick={onClick} style={{display:"flex",gap:12,padding:"11px 0",cursor:"pointer",alignItems:"flex-start"}}>
    <div style={{
      width:size,height:size,borderRadius:size/2.5,flexShrink:0,marginTop:1,
      background:done?`linear-gradient(135deg,${color},${color}bb)`:"rgba(255,255,255,0.07)",
      border:`2px solid ${done?color:C.border}`,
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"#fff",fontSize:size*0.55,fontWeight:900,
      boxShadow:done?`0 2px 12px ${color}55`:"none",
      transition:"all .2s",
    }}>{done?"✓":""}</div>
    <div style={{flex:1}}>
      <div style={{fontSize:15,color:done?C.faint:C.white,fontWeight:700,textDecoration:done?"line-through":"none",lineHeight:1.3}}>{label}</div>
      {!done&&sublabel&&<div style={{fontSize:12,color:C.muted,marginTop:3,fontWeight:600,lineHeight:1.5}}>{sublabel}</div>}
    </div>
  </div>;
}

// ── ROOT ────────────────────────────────────────────────────
export default function Tracker(){
  const [tab,setTab] = useState("today");
  const [date,setDate] = useState(TODAY);
  const [logs,setLogs] = useState(()=>LS.get("mt_logs",{}));
  const [dayChoice,setDayChoice] = useState(()=>LS.get("mt_daychoice",{}));
  const [weightHistory,setWeightHistory] = useState(()=>LS.get("mt_weights",[{date:TODAY,weight:75.4}]));
  const [foodMessages,setFoodMessages] = useState(()=>LS.get("mt_food_msgs",{}));
  const [allNutr,setAllNutr] = useState(()=>LS.get("mt_nutrition",{}));
  const [garminLogs,setGarminLogs] = useState(()=>LS.get("mt_garmin",{}));

  useEffect(()=>LS.set("mt_logs",logs),[logs]);
  useEffect(()=>LS.set("mt_daychoice",dayChoice),[dayChoice]);
  useEffect(()=>LS.set("mt_weights",weightHistory),[weightHistory]);
  useEffect(()=>LS.set("mt_food_msgs",foodMessages),[foodMessages]);
  useEffect(()=>LS.set("mt_nutrition",allNutr),[allNutr]);
  useEffect(()=>LS.set("mt_garmin",garminLogs),[garminLogs]);

  const day=logs[date]||{checked:{},runs:[],notes:""};
  const patch=fn=>setLogs(p=>({...p,[date]:fn(p[date]||{checked:{},runs:[],notes:""})}));
  const todayMsgs=foodMessages[date]||[];
  const setTodayMsgs=fn=>setFoodMessages(p=>({...p,[date]:typeof fn==="function"?fn(p[date]||[]):fn}));
  const todayNutr=allNutr[date]||{kcal:0,protein:0,carb:0,fat:0};
  const setTodayNutr=v=>setAllNutr(p=>({...p,[date]:v}));

  const sortedW=[...weightHistory].sort((a,b)=>b.date.localeCompare(a.date));
  const latestW=sortedW[0]?.weight||75.4;
  const pctTo65=Math.max(0,Math.min(100,((75.4-latestW)/(75.4-65))*100));
  const daysToRace=Math.max(0,Math.round((new Date("2026-11-08").getTime()-Date.now())/86400000));
  const plan=dayChoice[date]?DAY_PLANS[dayChoice[date]]:null;
  const pc=plan?.color||C.pinkD;

  const NAV=[["today","วันนี้","📊"],["calendar","ปฏิทิน","📅"],["food","อาหาร","🍱"],["progress","Progress","📈"]];

  return(
    <div style={{minHeight:"100vh",background:G.bg,color:C.white,fontFamily:"Nunito,sans-serif",fontWeight:600,paddingBottom:100,WebkitTapHighlightColor:"transparent"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        button:active{transform:scale(.95);opacity:.85}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25)}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(.8) brightness(2) hue-rotate(270deg)}
        ::-webkit-scrollbar{width:0}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:G.header,backdropFilter:"blur(24px)",padding:"max(env(safe-area-inset-top),20px) 18px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(236,72,153,0.2)",filter:"blur(40px)"}}/>
        <div style={{position:"absolute",bottom:-30,left:-30,width:120,height:120,borderRadius:"50%",background:"rgba(147,51,234,0.25)",filter:"blur(30px)"}}/>
        <div style={{maxWidth:480,margin:"0 auto",position:"relative"}}>
          <div style={{fontSize:11,letterSpacing:2,color:C.pinkL,fontWeight:800,marginBottom:6}}>🏃‍♀️ MARATHON TRACKER · 8 พ.ย. 2026</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:42,fontWeight:900,color:C.white,lineHeight:1,textShadow:"0 2px 20px rgba(244,114,182,0.5)"}}>{latestW.toFixed(1)}<span style={{fontSize:16,color:C.muted,fontWeight:600}}> กก.</span></div>
              <div style={{fontSize:12,color:C.pinkL,fontWeight:700,marginTop:2}}>{(75.4-latestW).toFixed(1)} กก. ลงแล้ว 💪</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"10px 16px",backdropFilter:"blur(8px)"}}>
                <div style={{fontSize:32,fontWeight:900,color:C.white,lineHeight:1}}>{daysToRace}</div>
                <div style={{fontSize:11,color:C.purpleL,fontWeight:700}}>วัน เหลืออีก</div>
              </div>
            </div>
          </div>
          <div style={{marginTop:12,background:"rgba(255,255,255,0.1)",borderRadius:20,height:8,overflow:"hidden"}}>
            <div style={{width:`${pctTo65}%`,height:"100%",background:G.bar,borderRadius:20,boxShadow:"0 0 16px rgba(236,72,153,0.6)",transition:"width .8s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:5,fontWeight:700}}>
            <span>75.4 กก.</span>
            <span style={{color:C.gold,fontWeight:800}}>→ 65 กก. (ส.ค.) 🎯</span>
            <span>48 กก. (ธ.ค.)</span>
          </div>
        </div>
      </div>

      {/* ── NAV ── */}
      <div style={{display:"flex",background:"rgba(13,5,32,0.92)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:30,maxWidth:480,margin:"0 auto",padding:"8px 12px",gap:6}}>
        {NAV.map(([id,lb,ic])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1,padding:"9px 2px",borderRadius:999,
            background:tab===id?G.pillSoft:"transparent",
            border:tab===id?`1.5px solid ${C.borderB}`:"1.5px solid transparent",
            cursor:"pointer",fontFamily:"Nunito,sans-serif",
            fontSize:10,fontWeight:tab===id?800:600,
            color:tab===id?C.pinkL:C.faint,
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,
            transition:"all .2s",
          }}>
            <span style={{fontSize:16}}>{ic}</span>{lb}
          </button>
        ))}
      </div>

      <div style={{maxWidth:480,margin:"0 auto",padding:"0 16px"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",margin:"14px 0 6px"}}>
          <Inp type="date" value={date} onChange={e=>setDate(e.target.value)} style={{flex:1,fontSize:13,padding:"10px 14px"}}/>
          {date!==TODAY&&<Pill color={C.pink} active onClick={()=>setDate(TODAY)}>วันนี้</Pill>}
        </div>

        {tab==="today"&&<TodayTab day={day} patch={patch} date={date} plan={plan} dayChoice={dayChoice} setDayChoice={setDayChoice} weightHistory={weightHistory} setWeightHistory={setWeightHistory} pc={pc}/>}
        {tab==="calendar"&&<CalendarTab date={date} setDate={setDate} logs={logs} dayChoice={dayChoice}/>}
        {tab==="food"&&<FoodTab messages={todayMsgs} setMessages={setTodayMsgs} nutr={todayNutr} setNutr={setTodayNutr} date={date} garminLogs={garminLogs} setGarminLogs={setGarminLogs} allNutr={allNutr}/>}
        {tab==="progress"&&<ProgressTab weightHistory={weightHistory} setWeightHistory={setWeightHistory} logs={logs} latestW={latestW} pctTo65={pctTo65} garminLogs={garminLogs} allNutr={allNutr}/>}
      </div>
    </div>
  );
}

// ── TODAY ────────────────────────────────────────────────────
function TodayTab({day,patch,date,plan,dayChoice,setDayChoice,weightHistory,setWeightHistory,pc}){
  const [logModal,setLogModal]=useState(false);
  const allIds=[...(plan?.items||[]).map(i=>i.id),...(plan?.weight?.exercises||[]).map(e=>e.id),...(plan?.optRun?[plan.optRun.id]:[])];
  const done=allIds.filter(id=>day.checked?.[id]).length;
  const pct=allIds.length>0?Math.round((done/allIds.length)*100):0;
  const stars=[done>0,pct>=60,!!weightHistory.find(w=>w.date===date),(day.notes||"").length>0].filter(Boolean).length;
  const [wv,setWv]=useState("");
  const exW=weightHistory.find(w=>w.date===date);
  const saveW=()=>{const w=parseFloat(wv);if(w>=30&&w<=200){setWeightHistory(p=>[...p.filter(x=>x.date!==date),{date,weight:w}].sort((a,b)=>a.date.localeCompare(b.date)));setWv("");}};
  const selectDay=n=>{setDayChoice(p=>({...p,[date]:n}));patch(d=>({...d,checked:{}}));};

  const DayBubble=({n,col,label,short})=>{
    const sel=dayChoice[date]===n;
    return <div onClick={()=>selectDay(n)} style={{
      aspectRatio:"1",borderRadius:"50%",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",cursor:"pointer",
      background:sel?`linear-gradient(135deg,${col},${col}bb)`:"rgba(255,255,255,0.07)",
      border:`2px solid ${sel?col:C.border}`,
      boxShadow:sel?`0 4px 20px ${col}55`:"none",
      transition:"all .2s",
    }}>
      <div style={{fontSize:15,fontWeight:900,color:sel?C.white:C.muted}}>{label}</div>
      <div style={{fontSize:8,color:sel?C.white+"cc":C.faint,fontWeight:700}}>{short}</div>
    </div>;
  };

  return <>
    {/* STARS CARD */}
    <Card gradient="linear-gradient(135deg,rgba(147,51,234,0.25),rgba(236,72,153,0.2))" style={{borderColor:C.borderB,marginTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,color:C.pinkL,fontWeight:800,marginBottom:6,letterSpacing:.5}}>✨ วันนี้</div>
          <div style={{fontSize:26,letterSpacing:4}}>{[1,2,3,4].map(i=>i<=stars?"⭐":"🌑")}</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{
            width:70,height:70,borderRadius:"50%",
            background:`conic-gradient(${C.pink} ${pct}%,rgba(255,255,255,0.08) 0)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 0 20px ${C.pink}44`,
          }}>
            <div style={{width:54,height:54,borderRadius:"50%",background:"#0d0520",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:18,fontWeight:900,color:C.white}}>{pct}<span style={{fontSize:10}}>%</span></span>
            </div>
          </div>
        </div>
      </div>
      {stars===4&&<div style={{fontSize:13,color:C.gold,fontWeight:900,textAlign:"center",marginTop:10}}>🎉 วันนี้ครบสมบูรณ์! เก่งมากเลย!</div>}
    </Card>

    {/* WEIGHT */}
    <Card>
      <Lbl>⚖️ น้ำหนักวันนี้</Lbl>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {exW&&<div style={{fontSize:30,fontWeight:900,color:C.white,lineHeight:1,flexShrink:0}}>{exW.weight}<span style={{fontSize:13,color:C.muted}}> กก.</span></div>}
        <Inp type="number" step="0.1" placeholder={exW?`แก้ไข (${exW.weight})`:"กรอก กก. 🌸"} value={wv} onChange={e=>setWv(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveW()} style={{flex:1,padding:"11px 14px"}}/>
        <button onClick={saveW} style={{padding:"11px 18px",borderRadius:999,background:G.pill,border:"none",color:C.white,fontWeight:900,cursor:"pointer",fontFamily:"Nunito,sans-serif",fontSize:14,boxShadow:"0 4px 16px rgba(147,51,234,0.4)",flexShrink:0}}>✓</button>
      </div>
    </Card>

    {/* DAY PICKER */}
    <Card>
      <Lbl>📅 วันนี้ทำตารางวันไหน?</Lbl>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
        <DayBubble n={1} col={C.pink} label="1" short="วิ่ง"/>
        <DayBubble n={2} col={C.purple} label="2" short="เวท A"/>
        <DayBubble n={3} col={C.pink} label="3" short="วิ่ง"/>
        <DayBubble n={4} col={C.purple} label="4" short="เวท B"/>
        <DayBubble n={5} col={C.pink} label="5" short="วิ่ง"/>
        <DayBubble n={6} col={C.orange} label="6" short="Long"/>
        <DayBubble n={7} col={C.violet} label="7" short="พัก"/>
        <DayBubble n={8} col={C.rose} label="🏥" short="เวร"/>
      </div>
      {plan&&<div style={{textAlign:"center",padding:"8px 14px",borderRadius:999,background:G.pillSoft,border:`1.5px solid ${plan.color}66`,fontSize:12,color:plan.color,fontWeight:800}}>{plan.label} · {plan.sub}</div>}
    </Card>

    {/* WORKOUT */}
    {!plan&&<Card style={{textAlign:"center",padding:"32px 16px"}}>
      <div style={{fontSize:44,marginBottom:10}}>👆</div>
      <div style={{fontSize:16,fontWeight:800,color:C.white}}>เลือกตารางวันนี้ก่อนเลย!</div>
      <div style={{fontSize:13,color:C.muted,marginTop:4}}>กดวงกลมด้านบน</div>
    </Card>}

    {plan&&<Card style={{borderColor:`${plan.color}44`}}>
      <div style={{fontSize:16,fontWeight:900,color:plan.color,marginBottom:14,textShadow:`0 0 16px ${plan.color}55`}}>{plan.label} 💪</div>
      {plan.items.map((item,i)=>{
        const dn=!!day.checked?.[item.id];
        return <div key={item.id} style={{borderBottom:i<plan.items.length-1?`1px solid ${C.border}`:"none"}}>
          <Check done={dn} color={plan.color} onClick={()=>patch(d=>({...d,checked:{...(d.checked||{}),[item.id]:!d.checked?.[item.id]}}))}
            label={`${item.ic} ${item.title}`}
            sublabel={item.detail+(item.hr?` · 💓 ${item.hr} bpm`:"")+(item.km?` · 📏 ${item.km} กม.`:"")}/>
        </div>;
      })}

      {plan.weight&&<>
        <div style={{fontSize:13,fontWeight:900,color:C.purple,margin:"12px 0 6px",padding:"8px 14px",background:"rgba(192,132,252,0.12)",borderRadius:14}}>🏋️ {plan.weight.title}</div>
        {plan.weight.exercises.map((ex,i)=>{
          const dn=!!day.checked?.[ex.id];
          return <div key={ex.id} style={{borderBottom:i<plan.weight.exercises.length-1?`1px solid ${C.border}`:"none"}}>
            <Check done={dn} color={C.purple} size={22} onClick={()=>patch(d=>({...d,checked:{...(d.checked||{}),[ex.id]:!d.checked?.[ex.id]}}))}
              label={`🔧 ${ex.name}  ${ex.sets}×${ex.reps}`}
              sublabel={`💡 ${ex.note}`}/>
          </div>;
        })}
        <div style={{fontSize:12,color:C.purple,fontWeight:700,textAlign:"right",marginTop:6}}>
          {plan.weight.exercises.filter(e=>day.checked?.[e.id]).length}/{plan.weight.exercises.length} ท่า ✅
        </div>
      </>}

      {plan.optRun&&(()=>{const dn=!!day.checked?.[plan.optRun.id];return(
        <div style={{borderTop:`1px solid ${C.border}`,marginTop:4}}>
          <Check done={dn} color={C.violet} onClick={()=>patch(d=>({...d,checked:{...(d.checked||{}),[plan.optRun.id]:!d.checked?.[plan.optRun.id]}}))}
            label={`🏃 ${plan.optRun.title}`} sublabel={plan.optRun.detail}/>
        </div>
      );})()}

      {(plan.type==="run"||plan.type==="longrun"||plan.type==="oncall")&&(
        <button onClick={()=>setLogModal(true)} style={{width:"100%",marginTop:12,padding:"14px",borderRadius:999,background:G.pillSoft,border:`1.5px solid ${plan.color}66`,color:plan.color,fontWeight:800,cursor:"pointer",fontFamily:"Nunito,sans-serif",fontSize:14}}>
          📊 บันทึกผลการวิ่ง
        </button>
      )}
      {day.runs?.length>0&&<div style={{marginTop:8,padding:"10px 14px",background:"rgba(255,255,255,0.06)",borderRadius:16,fontSize:13,color:C.muted,fontWeight:700}}>
        ✅ {day.runs[0].km} กม. {day.runs[0].hr?`· HR ${day.runs[0].hr} bpm`:""}
      </div>}
    </Card>}

    {/* NOTES */}
    <Card>
      <Lbl>📝 โน้ตวันนี้</Lbl>
      <textarea value={day.notes||""} onChange={e=>patch(d=>({...d,notes:e.target.value}))} placeholder="รู้สึกยังไง วันนี้เป็นยังไงบ้าง 🌸" style={{background:"rgba(255,255,255,0.07)",border:`1.5px solid ${C.border}`,borderRadius:18,color:C.white,padding:"13px 16px",fontSize:14,width:"100%",outline:"none",fontFamily:"Nunito,sans-serif",fontWeight:600,minHeight:70,resize:"none"}}/>
    </Card>

    {logModal&&<div style={{position:"fixed",inset:0,background:"rgba(13,5,32,0.92)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={e=>e.target===e.currentTarget&&setLogModal(false)}>
      <div style={{background:"linear-gradient(160deg,#1a0835,#0d0a2e)",borderRadius:"28px 28px 0 0",border:`1px solid ${C.borderB}`,width:"100%",maxWidth:480,padding:24,paddingBottom:"max(24px,env(safe-area-inset-bottom))"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,alignItems:"center"}}>
          <span style={{fontSize:18,fontWeight:900,color:C.white}}>📊 บันทึกผลวิ่ง</span>
          <button onClick={()=>setLogModal(false)} style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:C.muted,fontSize:20,cursor:"pointer",fontWeight:800}}>×</button>
        </div>
        <RunLogForm patch={patch} close={()=>setLogModal(false)}/>
      </div>
    </div>}
  </>;
}

function RunLogForm({patch,close}){
  const [km,setKm]=useState(""); const [hr,setHr]=useState(""); const [note,setNote]=useState("");
  return <div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div><Lbl>ระยะ (กม.)</Lbl><Inp type="number" step="0.01" placeholder="3.0" value={km} onChange={e=>setKm(e.target.value)}/></div>
    <div><Lbl>HR เฉลี่ย (bpm)</Lbl><Inp type="number" placeholder="130" value={hr} onChange={e=>setHr(e.target.value)}/></div>
    <div><Lbl>โน้ต</Lbl><Inp placeholder="รู้สึกยังไง..." value={note} onChange={e=>setNote(e.target.value)}/></div>
    <button onClick={()=>{patch(d=>({...d,runs:[{id:uid(),km,hr:hr?+hr:null,note}]}));close();}} style={{padding:"14px",borderRadius:999,background:G.pill,border:"none",color:C.white,fontWeight:900,cursor:"pointer",fontFamily:"Nunito,sans-serif",fontSize:15,boxShadow:"0 4px 20px rgba(147,51,234,0.4)"}}>💾 บันทึกเลย!</button>
  </div>;
}

// ── CALENDAR ─────────────────────────────────────────────────
function CalendarTab({date,setDate,logs,dayChoice}){
  const [y,setY]=useState(()=>parseInt(date.slice(0,4)));
  const [m,setM]=useState(()=>parseInt(date.slice(5,7)));
  const firstDay=new Date(y,m-1,1).getDay();
  const dim=new Date(y,m,0).getDate();
  const mnames=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  return <>
    <Card style={{marginTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <button onClick={()=>m===1?(setY(y=>y-1),setM(12)):setM(m=>m-1)} style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:`1px solid ${C.border}`,color:C.white,fontSize:20,cursor:"pointer",fontWeight:900}}>‹</button>
        <div style={{fontSize:17,fontWeight:900,color:C.white}}>{mnames[m-1]} {y}</div>
        <button onClick={()=>m===12?(setY(y=>y+1),setM(1)):setM(m=>m+1)} style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:`1px solid ${C.border}`,color:C.white,fontSize:20,cursor:"pointer",fontWeight:900}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:6}}>
        {["อา","จ","อ","พ","พฤ","ศ","ส"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:10,color:C.faint,fontWeight:800,padding:"3px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:dim},(_,i)=>i+1).map(d=>{
          const ds=`${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const dn=dayChoice[ds]; const p=dn?DAY_PLANS[dn]:null;
          const col=p?.color||C.dim;
          const isSel=ds===date,isT=ds===TODAY,hasLog=!!logs[ds];
          return <div key={d} onClick={()=>setDate(ds)} style={{
            aspectRatio:"1",borderRadius:"50%",display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center",cursor:"pointer",
            background:isSel?`linear-gradient(135deg,${col},${col}bb)`:isT?"rgba(255,255,255,0.1)":"transparent",
            border:`1.5px solid ${isSel?col:isT?C.borderB:C.border}`,
            boxShadow:isSel?`0 2px 12px ${col}55`:"none",
          }}>
            <div style={{fontSize:11,fontWeight:800,color:isSel?C.white:isT?C.pinkL:C.muted}}>{d}</div>
            {dn&&!isSel&&<div style={{fontSize:6,color:col,fontWeight:800}}>D{dn}</div>}
            {hasLog&&!isSel&&<div style={{width:3,height:3,borderRadius:"50%",background:C.green}}/>}
          </div>;
        })}
      </div>
    </Card>
    {dayChoice[date]&&(()=>{const p=DAY_PLANS[dayChoice[date]];return(
      <Card style={{borderColor:`${p.color}55`}}>
        <div style={{fontSize:15,fontWeight:900,color:p.color,marginBottom:8}}>{p.label} 🌸</div>
        {p.items.map(item=><div key={item.id} style={{fontSize:13,color:C.muted,padding:"4px 0"}}>{item.ic} {item.title}</div>)}
        {p.weight&&<div style={{fontSize:13,color:C.purple,padding:"4px 0"}}>🏋️ {p.weight.title}</div>}
      </Card>
    );})()}
  </>;
}

// ── FOOD ─────────────────────────────────────────────────────
function FoodTab({messages,setMessages,nutr,setNutr,date,garminLogs,setGarminLogs,allNutr}){
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [pendingNutr,setPendingNutr]=useState(null);
  const [garminV,setGarminV]=useState((garminLogs||{})[date]?.toString()||"");
  const bottomRef=useRef(null);

  useEffect(()=>{setGarminV((garminLogs||{})[date]?.toString()||"");},[date,garminLogs]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[messages,loading]);

  const garmin=parseFloat(garminV)||0;
  const deficit=garmin>0&&(nutr.kcal||0)>0?garmin-(nutr.kcal||0):null;

  const macros=[
    {key:"protein",label:"โปรตีน 🥩",val:nutr.protein||0,goal:GOALS.protein,color:C.pink},
    {key:"carb",label:"คาร์บ 🍚",val:nutr.carb||0,goal:GOALS.carb,color:C.violet},
    {key:"fat",label:"ไขมัน 🫒",val:nutr.fat||0,goal:GOALS.fat,color:C.orange},
  ];

  const SYSTEM=`คุณคือโค้ชโภชนาการ track อาหารวันที่ ${date}
ผู้ใช้: หญิง อายุ 22 สูง 159 ซม. น้ำหนัก ~75 กก. เป้า 65 กก.
เป้าวัน: kcal 1600 · protein 145g · carb 140g · fat 50g
ออกกำลังกาย: Stairmaster + วิ่ง + เวท + มวยไทย

ตอบเป็น 2 ส่วนคั่นด้วย |||JSON|||
ส่วน 1: ภาษาไทย สั้น มิตร emoji ประเมิน + สะสมทั้งวัน + แนะนำมื้อถัดไป
ถ้าจะ update ยอดสะสม ถามก่อน "อัพเดทวงกลมเลยมั้ย? 🔄"
ส่วน 2: JSON {"kcal":n,"protein":n,"carb":n,"fat":n} หรือ null`;

  const send=async()=>{
    if(!input.trim()||loading)return;
    const userMsg={role:"user",content:input.trim(),time:new Date().toTimeString().slice(0,5)};
    const newMsgs=[...messages,userMsg];
    setMessages(newMsgs);setInput("");setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:SYSTEM,messages:newMsgs.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      const raw=(data.content||[]).map(c=>c.text||"").join("");
      const parts=raw.split("|||JSON|||");
      const text=parts[0].trim();
      const json=parts[1]?.trim();
      if(json&&json!=="null"){try{const n=JSON.parse(json.match(/\{[\s\S]*\}/)?.[0]||"{}");if(n.kcal!==undefined)setPendingNutr({kcal:Math.round(n.kcal||0),protein:+((n.protein||0)).toFixed(1),carb:+((n.carb||0)).toFixed(1),fat:+((n.fat||0)).toFixed(1)});}catch(_){}}
      setMessages(p=>[...p,{role:"assistant",content:text,time:new Date().toTimeString().slice(0,5)}]);
    }catch{setMessages(p=>[...p,{role:"assistant",content:"⚠️ เชื่อมต่อไม่ได้ ลองใหม่นะ",time:new Date().toTimeString().slice(0,5)}]);}
    finally{setLoading(false);}
  };

  return <div style={{display:"flex",flexDirection:"column",marginTop:14}}>
    {/* CONFIRM MODAL */}
    {pendingNutr&&<div style={{position:"fixed",inset:0,background:"rgba(13,5,32,0.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)"}}>
      <Card style={{maxWidth:340,width:"100%",margin:0,background:"linear-gradient(160deg,#1a0835,#0d0a2e)",borderColor:C.borderB}}>
        <div style={{fontSize:16,fontWeight:900,color:C.white,marginBottom:12}}>🔄 อัพเดทวงกลมมั้ย?</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[["แคล",pendingNutr.kcal,"kcal",C.gold],["โปรตีน",pendingNutr.protein,"g",C.pink],["คาร์บ",pendingNutr.carb,"g",C.violet],["ไขมัน",pendingNutr.fat,"g",C.orange]].map(([l,v,u,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.07)",borderRadius:18,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:c,textShadow:`0 0 12px ${c}66`}}>{v}<span style={{fontSize:11}}>{u}</span></div>
              <div style={{fontSize:11,color:C.faint,fontWeight:700,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <button onClick={()=>setPendingNutr(null)} style={{padding:"12px",borderRadius:999,background:"rgba(255,255,255,0.08)",border:`1px solid ${C.border}`,color:C.muted,fontWeight:800,cursor:"pointer",fontFamily:"Nunito,sans-serif",fontSize:14}}>ยกเลิก</button>
          <button onClick={()=>{setNutr(pendingNutr);setPendingNutr(null);}} style={{padding:"12px",borderRadius:999,background:G.pill,border:"none",color:C.white,fontWeight:900,cursor:"pointer",fontFamily:"Nunito,sans-serif",fontSize:14,boxShadow:"0 4px 16px rgba(147,51,234,0.4)"}}>✓ อัพเดทเลย</button>
        </div>
      </Card>
    </div>}

    {/* NUTRITION RINGS */}
    <Card gradient={G.cardPink} style={{borderColor:C.borderB}}>
      <div style={{fontSize:12,color:C.pinkL,fontWeight:800,marginBottom:14,letterSpacing:.5}}>🍽️ สารอาหารวันนี้</div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
        <Ring value={nutr.kcal||0} max={GOALS.kcal} color={C.gold} label="แคล" sub={`เหลือ ${Math.max(0,GOALS.kcal-(nutr.kcal||0))}`} size={90} stroke={11}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
          {macros.map(m=>{
            const pct=Math.min(100,((m.val||0)/m.goal)*100);
            return <div key={m.key}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:4}}>
                <span style={{color:m.color}}>{m.label}</span>
                <span style={{color:C.white}}>{m.val||0}<span style={{color:C.faint,fontSize:10}}>/{m.goal}g</span></span>
              </div>
              <div style={{background:"rgba(255,255,255,0.08)",borderRadius:999,height:9,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${m.color}aa,${m.color})`,borderRadius:999,boxShadow:`0 0 8px ${m.color}66`,transition:"width .6s ease"}}/>
              </div>
              <div style={{fontSize:9,color:C.faint,marginTop:2}}>เหลือ {Math.max(0,Math.round(m.goal-(m.val||0)))}g</div>
            </div>;
          })}
        </div>
      </div>
      <div style={{padding:"10px 14px",background:"rgba(255,255,255,0.06)",borderRadius:18,fontSize:13,color:C.muted,lineHeight:1.6}}>
        {(nutr.kcal||0)===0?<span style={{color:C.faint}}>ยังไม่มีรายการ · บอกนายว่ากินอะไรได้เลย 👇</span>
          :GOALS.kcal-(nutr.kcal||0)>0?<>เหลืออีก <b style={{color:C.gold}}>{GOALS.kcal-(nutr.kcal||0)} kcal</b> · โปรตีนอีก <b style={{color:C.pink}}>{Math.max(0,Math.round(GOALS.protein-(nutr.protein||0)))}g</b></>
          :<span style={{color:C.rose}}>⚠️ เกินเป้า {Math.abs(GOALS.kcal-(nutr.kcal||0))} kcal</span>}
      </div>
    </Card>

    {/* GARMIN */}
    <Card>
      <Lbl>⌚ Garmin Calorie เผาวันนี้</Lbl>
      <div style={{display:"flex",gap:8,marginBottom:garmin>0?12:0}}>
        <Inp type="number" placeholder="กรอก kcal จาก Garmin 🏃" value={garminV} style={{flex:1,padding:"11px 14px"}}
          onChange={e=>{setGarminV(e.target.value);setGarminLogs(p=>({...p,[date]:parseFloat(e.target.value)||0}));}}/>
        {garmin>0&&<div style={{fontSize:12,color:C.gold,fontWeight:800,flexShrink:0,display:"flex",alignItems:"center"}}>{garmin}</div>}
      </div>
      {garmin>0&&<div style={{background:"rgba(255,255,255,0.05)",borderRadius:18,padding:"12px 14px",fontSize:13,lineHeight:2}}>
        <div style={{color:C.faint,fontSize:11,marginBottom:4}}>💡 Garmin คลาดเคลื่อน ±10–15%</div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted}}>เผาจริง (range)</span><span style={{color:C.white,fontWeight:800}}>{Math.round(garmin*0.9)}–{Math.round(garmin*1.15)} kcal</span></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted}}>กินวันนี้</span><span style={{color:C.white,fontWeight:800}}>{nutr.kcal||0} kcal</span></div>
        <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${C.border}`,marginTop:6,paddingTop:6}}>
          <span style={{fontWeight:800,color:C.white}}>Deficit วันนี้</span>
          <span style={{fontWeight:900,color:deficit>0?C.green:C.rose,textShadow:`0 0 10px ${deficit>0?C.green:C.rose}66`}}>{deficit>0?"+":""}{deficit} kcal {deficit>300?"🔥":deficit>0?"✓":"⚠️"}</span>
        </div>
      </div>}
    </Card>

    {/* HINT */}
    <Card gradient={G.cardPurple} style={{padding:"12px 16px",marginBottom:10}}>
      <div style={{fontSize:12,color:C.purpleL,fontWeight:800,marginBottom:3}}>💬 บอกนายว่ากินอะไรวันนี้</div>
      <div style={{fontSize:12,color:C.muted}}>เช่น "กินข้าวกล้อง 1 ทัพพี อกไก่ 150g" · นายจะถามก่อนอัพเดทวงกลม ✨</div>
    </Card>

    {/* CHAT */}
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12,minHeight:120}}>
      {messages.length===0&&<div style={{textAlign:"center",padding:"28px 16px",color:C.faint}}>
        <div style={{fontSize:40,marginBottom:10}}>🥗</div>
        <div style={{fontSize:15,fontWeight:700,color:C.muted}}>บอกนายว่ากินอะไรบ้างวันนี้</div>
      </div>}
      {messages.map((msg,i)=>(
        <div key={i} style={{display:"flex",flexDirection:"column",alignItems:msg.role==="user"?"flex-end":"flex-start"}}>
          <div style={{maxWidth:"85%",padding:"12px 16px",borderRadius:msg.role==="user"?"22px 22px 6px 22px":"22px 22px 22px 6px",background:msg.role==="user"?G.pillSoft:"rgba(255,255,255,0.07)",border:`1px solid ${msg.role==="user"?C.borderB:C.border}`,fontSize:14,color:C.white,lineHeight:1.75,fontWeight:600,whiteSpace:"pre-wrap"}}>{msg.content}</div>
          <div style={{fontSize:9,color:C.faint,marginTop:3,padding:"0 4px",fontWeight:700}}>{msg.time}</div>
        </div>
      ))}
      {loading&&<div style={{display:"flex"}}>
        <div style={{padding:"12px 18px",borderRadius:"22px 22px 22px 6px",background:"rgba(255,255,255,0.07)",border:`1px solid ${C.border}`,fontSize:20,color:C.purple,letterSpacing:6,animation:"pulse 1.2s infinite"}}>···</div>
      </div>}
      <div ref={bottomRef}/>
    </div>

    <div style={{position:"sticky",bottom:0,background:"rgba(13,5,32,0.95)",backdropFilter:"blur(16px)",paddingTop:10,paddingBottom:`max(10px,env(safe-area-inset-bottom))`}}>
      <div style={{display:"flex",gap:8}}>
        <Inp value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="บอกว่ากินอะไร หรือถามอะไรก็ได้ 🌸" style={{flex:1}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{padding:"13px 18px",borderRadius:999,background:G.pill,border:"none",color:C.white,fontWeight:900,cursor:"pointer",fontFamily:"Nunito,sans-serif",fontSize:18,boxShadow:"0 4px 16px rgba(147,51,234,0.4)",opacity:loading||!input.trim()?.4:1,flexShrink:0}}>↑</button>
      </div>
      {messages.length>0&&<button onClick={()=>{setMessages([]);setNutr({kcal:0,protein:0,carb:0,fat:0});}} style={{background:"transparent",border:"none",color:C.faint,fontSize:12,fontWeight:700,cursor:"pointer",padding:"6px 4px"}}>🗑️ ล้างวันนี้</button>}
    </div>
  </div>;
}

// ── PROGRESS ─────────────────────────────────────────────────
function ProgressTab({weightHistory,setWeightHistory,logs,latestW,pctTo65,garminLogs,allNutr}){
  const sorted=[...weightHistory].sort((a,b)=>a.date.localeCompare(b.date));
  const recent7=sorted.slice(-7);
  const allRuns=Object.values(logs).filter(l=>l.runs?.length>0).flatMap(l=>l.runs.map(r=>({...r,date:l.date})));
  const totalKm=allRuns.reduce((s,r)=>s+(parseFloat(r.km)||0),0);
  const last7=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return d.toISOString().split("T")[0];}).reverse();
  const weeklyData=last7.map(d=>({date:d,garmin:(garminLogs||{})[d]||0,eaten:(allNutr||{})[d]?.kcal||0})).map(d=>({...d,deficit:d.garmin>0&&d.eaten>0?d.garmin-d.eaten:null}));
  const totalDef=weeklyData.reduce((s,d)=>s+(d.deficit||0),0);
  const daysLog=weeklyData.filter(d=>d.deficit!==null).length;
  const fatG=totalDef>0?(totalDef/7700*1000).toFixed(0):0;

  return <>
    {/* WEIGHT HERO */}
    <Card gradient={G.cardPink} style={{marginTop:14,borderColor:C.borderB}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <div style={{fontSize:44,fontWeight:900,color:C.white,lineHeight:1,textShadow:"0 2px 20px rgba(244,114,182,0.5)"}}>{latestW.toFixed(1)}<span style={{fontSize:16,color:C.muted}}> กก.</span></div>
          <div style={{fontSize:13,color:C.pinkL,fontWeight:700,marginTop:4}}>{(75.4-latestW).toFixed(1)} กก. ลงแล้ว 🔥</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{
            width:72,height:72,borderRadius:"50%",
            background:`conic-gradient(${C.pink} ${pctTo65}%,rgba(255,255,255,0.08) 0)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 0 24px ${C.pink}44`,
          }}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"#0d0520",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:17,fontWeight:900,color:C.white}}>{pctTo65.toFixed(0)}<span style={{fontSize:9}}>%</span></span>
            </div>
          </div>
        </div>
      </div>
      <div style={{background:"rgba(255,255,255,0.08)",borderRadius:999,height:10,overflow:"hidden"}}>
        <div style={{width:`${pctTo65}%`,height:"100%",background:G.bar,borderRadius:999,boxShadow:"0 0 16px rgba(236,72,153,0.5)",transition:"width .8s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:5,fontWeight:700}}>
        <span>75.4 กก.</span><span style={{color:C.gold}}>→ 65 กก. (ส.ค.)</span><span>48 กก. (ธ.ค.)</span>
      </div>
    </Card>

    {/* WEEKLY DEFICIT */}
    <Card gradient="linear-gradient(145deg,rgba(52,211,153,0.15),rgba(96,165,250,0.1))" style={{borderColor:"rgba(52,211,153,0.3)"}}>
      <div style={{fontSize:12,color:C.green,fontWeight:800,marginBottom:12,letterSpacing:.5}}>🔥 Total Deficit สัปดาห์นี้</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14}}>
        <div>
          <div style={{fontSize:36,fontWeight:900,color:totalDef>0?C.green:C.rose,lineHeight:1,textShadow:`0 0 20px ${totalDef>0?C.green:C.rose}55`}}>{totalDef>0?"+":""}{totalDef.toLocaleString()}</div>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,marginTop:2}}>{daysLog}/7 วันที่บันทึก Garmin</div>
        </div>
        <div style={{textAlign:"right",background:"rgba(251,191,36,0.15)",borderRadius:16,padding:"10px 14px"}}>
          <div style={{fontSize:24,fontWeight:900,color:C.gold}}>{fatG}<span style={{fontSize:12}}> g</span></div>
          <div style={{fontSize:10,color:C.faint,fontWeight:700}}>ไขมันที่เผา (ประมาณ)</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
        {weeklyData.map((d,i)=>{
          const pct=d.deficit!==null?Math.max(0,Math.min(100,(d.deficit/800)*100)):0;
          const isT=d.date===TODAY;
          return <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:"100%",height:40,background:"rgba(255,255,255,0.05)",borderRadius:8,overflow:"hidden",display:"flex",alignItems:"flex-end"}}>
              <div style={{width:"100%",height:`${pct}%`,minHeight:d.deficit!==null?2:0,background:d.deficit>400?C.green:d.deficit>0?C.gold:C.dim,borderRadius:8,transition:"height .5s"}}/>
            </div>
            <div style={{fontSize:8,color:isT?C.white:C.faint,fontWeight:isT?900:600}}>{d.date.slice(8)}</div>
            {d.deficit!==null&&<div style={{fontSize:7.5,color:d.deficit>0?C.green:C.rose,fontWeight:800}}>{d.deficit>0?"+":""}{d.deficit}</div>}
          </div>;
        })}
      </div>
      {daysLog===0&&<div style={{fontSize:12,color:C.faint,textAlign:"center",marginTop:10}}>กรอก Garmin kcal ในหน้าอาหาร 👆</div>}
    </Card>

    {/* STATS */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      {[["🏃 วิ่งรวม",`${totalKm.toFixed(1)} กม.`,C.violet],["บันทึกวิ่ง",`${allRuns.length} ครั้ง`,C.green]].map(([l,v,c])=>(
        <Card key={l} style={{textAlign:"center",padding:"16px 10px",margin:0}}>
          <div style={{fontSize:22,fontWeight:900,color:c,textShadow:`0 0 12px ${c}55`}}>{v}</div>
          <div style={{fontSize:11,color:C.faint,fontWeight:700,marginTop:4}}>{l}</div>
        </Card>
      ))}
    </div>

    {/* CHART */}
    {sorted.length>=2&&<Card><Lbl>📈 กราฟน้ำหนัก</Lbl><WChart data={sorted}/></Card>}

    {/* RECENT 7 */}
    {recent7.length>0&&<Card><Lbl>📅 7 วันล่าสุด</Lbl>
      {recent7.slice().reverse().map((w,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:13,color:C.muted,fontWeight:700}}>{w.date}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:16,fontWeight:900,color:C.white}}>{w.weight} กก.</div>
            <button onClick={()=>setWeightHistory(p=>p.filter(x=>x.date!==w.date))} style={{background:"rgba(251,113,133,0.15)",border:"none",color:C.rose,cursor:"pointer",fontSize:14,padding:"4px 8px",borderRadius:999}}>×</button>
          </div>
        </div>
      ))}
    </Card>}

    {/* MILESTONES */}
    <Card><Lbl>🎯 Milestones</Lbl>
      {MILESTONES.map((m,i)=>{
        const reached=latestW<=m.weight;
        return <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:22,opacity:reached?1:.25,filter:reached?`drop-shadow(0 0 8px ${C.gold})`:"none"}}>{reached?"✅":"⭕"}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:800,color:reached?C.green:C.white}}>{m.label}</div>
            <div style={{fontSize:11,color:C.faint,fontWeight:600,marginTop:2}}>{m.date} · เป้า {m.weight} กก.</div>
          </div>
          {!reached&&<div style={{fontSize:12,fontWeight:800,color:C.muted,background:"rgba(255,255,255,0.07)",padding:"4px 10px",borderRadius:999}}>-{(latestW-m.weight).toFixed(1)} กก.</div>}
        </div>;
      })}
    </Card>
  </>;
}

function WChart({data}){
  const W=320,H=90,p=12,ws=data.map(d=>d.weight),mn=Math.min(...ws)-1,mx=Math.max(...ws)+1;
  const xs=i=>p+(i/(Math.max(data.length-1,1)))*(W-p*2);
  const ys=w=>p+((mx-w)/(mx-mn))*(H-p*2);
  const ln=data.map((d,i)=>`${xs(i)},${ys(d.weight)}`).join(" ");
  const gY=ys(65);
  return <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%"}}>
    <defs>
      <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={C.pink} stopOpacity=".4"/>
        <stop offset="100%" stopColor={C.pink} stopOpacity="0"/>
      </linearGradient>
    </defs>
    {data.length>1&&<polygon points={`${xs(0)},${H-p} ${ln} ${xs(data.length-1)},${H-p}`} fill="url(#wg)"/>}
    {gY>p&&gY<H-p&&<>
      <line x1={p} x2={W-p} y1={gY} y2={gY} stroke={C.green} strokeWidth="1.5" strokeDasharray="6,4" opacity=".6"/>
      <text x={W-p} y={gY-4} fontSize="9" fill={C.green} textAnchor="end" fontWeight="700">65 กก.</text>
    </>}
    {data.length>1&&<polyline points={ln} fill="none" stroke={C.pink} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" style={{filter:`drop-shadow(0 0 6px ${C.pink}88)`}}/>}
    {data.map((d,i)=><circle key={i} cx={xs(i)} cy={ys(d.weight)} r="4" fill={C.pinkL} style={{filter:`drop-shadow(0 0 4px ${C.pink})`}}/>)}
  </svg>;
}
