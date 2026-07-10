import type { DiagramKind } from "../lib/course";

function StepGrid() {
  const active = [0, 4, 8, 12];
  const ghosts = [2, 6, 10, 14];
  return <svg viewBox="0 0 640 240" role="img" aria-label="Sixteen-step rhythm grid showing quarter-note anchors and offbeat events">
    <g className="grid-lines">{Array.from({ length: 17 }, (_, i) => <line key={`v${i}`} x1={48 + i * 34} y1="42" x2={48 + i * 34} y2="196"/>)}{[42, 94, 146, 196].map((y) => <line key={y} x1="48" y1={y} x2="592" y2={y}/>)}</g>
    {active.map((i) => <rect className="signal-fill" key={i} x={53 + i * 34} y="99" width="24" height="42"/>)}
    {ghosts.map((i) => <rect className="warning-fill" key={i} x={57 + i * 34} y="61" width="16" height="18"/>)}
    <text x="48" y="224">1 e &amp; a · 2 e &amp; a · 3 e &amp; a · 4 e &amp; a</text>
  </svg>;
}

function FourFour() {
  const points = [[320,38],[510,120],[320,202],[130,120]];
  return <svg viewBox="0 0 640 240" role="img" aria-label="Four-beat meter orbit showing arrival, answer, renewal, and preparation">
    <rect x="70" y="20" width="500" height="200" className="diagram-frame"/><path d="M130 120Q185 16 320 38Q455 16 510 120Q455 224 320 202Q185 224 130 120Z" className="signal-line"/>
    {points.map(([x,y], i) => <g key={i}><circle cx={x} cy={y} r={i === 0 ? 17 : 12} className={i === 0 ? "signal-fill" : "node"}/><text x={x} y={y+4} textAnchor="middle" className={i === 0 ? "node-dark" : "node-text"}>{i+1}</text></g>)}
    <text x="320" y="109" textAnchor="middle">METER IS THE ROOM</text><text x="320" y="132" textAnchor="middle" className="soft-text">THE KICK IS ONE WAY TO LIGHT IT</text>
  </svg>;
}

function SignalFlow() { const nodes = [[45,"SOURCE"],[210,"ENVELOPE"],[375,"COLOR"],[540,"SPACE"]]; return <svg viewBox="0 0 680 240" role="img" aria-label="Signal flowing from source through envelope, color, and space"><path d="M82 120H600" className="signal-line"/><path d="m592 110 14 10-14 10" className="signal-line"/>{nodes.map(([x,label], i)=><g key={String(label)} transform={`translate(${x} 80)`}><rect width="112" height="80" className={i===1?"signal-node":"diagram-frame"}/><text x="56" y="45" textAnchor="middle" className={i===1?"node-dark":"node-text"}>{label}</text></g>)}</svg>; }
function Envelope() { return <svg viewBox="0 0 640 240" role="img" aria-label="Amplitude envelope with attack, decay, body, and tail"><g className="grid-lines">{[60,120,180].map(y=><line key={y} x1="50" y1={y} x2="590" y2={y}/>)}</g><path d="M50 188L112 45L240 104L400 104L560 188" className="signal-line strong"/>{[['ATTACK',80],['DECAY',175],['BODY',320],['TAIL',500]].map(([label,x])=><text key={label} x={x} y="218" textAnchor="middle">{label}</text>)}<circle cx="112" cy="45" r="7" className="warning-fill"/></svg>; }
function Machines() { const items = [[40,"STEP","16 CELLS"],[190,"PADS","TOUCH"],[340,"LOCKS","PER STEP"],[490,"DAW","OVERVIEW"]]; return <svg viewBox="0 0 640 240" role="img" aria-label="Comparison of step, pad, parameter-lock, and DAW mindsets">{items.map(([x,label,sub],i)=><g key={label} transform={`translate(${x} 54)`}><rect width="110" height="130" className={i===1?"signal-node":"diagram-frame"}/><text x="55" y="50" textAnchor="middle" className={i===1?"node-dark":"node-text"}>{label}</text><text x="55" y="78" textAnchor="middle" className={i===1?"node-dark":"soft-text"}>{sub}</text>{Array.from({length:4},(_,n)=><rect key={n} x={13+n*23} y="96" width="14" height="14" className={n===i%4?"warning-fill":"node"}/>)}</g>)}</svg>; }
function Energy() { const curves=["M45 180C140 180 150 90 240 100S350 170 430 95S520 35 595 55","M45 155C130 100 180 150 260 125S390 55 470 110S545 160 595 92","M45 195C155 190 185 155 285 165S400 130 470 140S550 95 595 105"];return <svg viewBox="0 0 640 240" role="img" aria-label="Arrangement energy axes over time"><g className="grid-lines">{[55,105,155,205].map(y=><line key={y} x1="45" y1={y} x2="595" y2={y}/>)}</g>{curves.map((d,i)=><path key={d} d={d} className={i===0?"signal-line strong":i===1?"warning-line":"muted-line"}/>)}<text x="45" y="224">ORIENTATION</text><text x="595" y="224" textAnchor="end">RE-ENTRY / EXIT</text></svg>; }
function Modulation() { const nodes=[[105,65,"LFO"],[105,175,"FOLLOW"],[320,120,"MACRO"],[530,65,"FILTER"],[530,175,"SPACE"]];return <svg viewBox="0 0 640 240" role="img" aria-label="Modulation sources routed through a macro to musical destinations"><path d="M150 65 280 110M150 175 280 130M360 110 485 70M360 130 485 170" className="signal-line"/>{nodes.map(([x,y,label],i)=><g key={label} transform={`translate(${x} ${y})`}><circle r={i===2?38:29} className={i===2?"signal-fill":"node"}/><text y="4" textAnchor="middle" className={i===2?"node-dark":"node-text"}>{label}</text></g>)}</svg>; }
function Spectrum() { return <svg viewBox="0 0 640 240" role="img" aria-label="Frequency spectrum from sub through air"><path d="M45 185C100 184 120 58 190 80S260 165 330 130S430 50 595 95" className="signal-line strong"/><path d="M45 190H595" className="muted-line"/>{[['SUB',60],['BODY',210],['PRESENCE',400],['AIR',570]].map(([label,x])=><text key={label} x={x} y="220" textAnchor="middle">{label}</text>)}</svg>; }

export function CourseDiagram({ kind, compact = false }: { kind: DiagramKind; compact?: boolean }) {
  const Component = kind === "four-four" ? FourFour : kind === "signal-flow" ? SignalFlow : kind === "envelope" ? Envelope : kind === "machines" ? Machines : kind === "energy" ? Energy : kind === "modulation" ? Modulation : kind === "spectrum" ? Spectrum : StepGrid;
  return <div className={`course-diagram ${compact ? "is-compact" : ""}`}><div className="diagram-label"><span>CONCEPT PLATE</span><b>{kind?.replace("-", " ").toUpperCase() || "RHYTHM GRID"}</b></div><Component/></div>;
}
