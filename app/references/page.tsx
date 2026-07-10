import type { Metadata } from "next";
import Link from "next/link";

export const metadata:Metadata={title:"Reference library"};

const artists=[
  ["Rødhåd","Depth + pressure","Long pressure arcs, melancholy, low-end hierarchy, filtered returns."],
  ["DVS1","Authority + economy","How few distinct roles can create complete physical authority."],
  ["Alarico","Raw propulsion","Short elements, sharp decay grammar, fast interlocking motion."],
  ["Ignez","Subtle disruption","Unequal cycles and restrained changes inside a deep repeating structure."],
  ["Prince of Denmark","Murk + identity","Imperfection, saturation, filtered space, fragile tonal gravity."],
  ["Sicion","Psychedelic rhythm","Complex crossing patterns and abstract texture held by a stable pulse."],
  ["Marco Zenker","Broken continuity","Bass-informed and broken rhythmic language inside techno form."],
  ["Quelza","Perspective + rupture","Organic material, gaps, abrupt camera changes, cinematic momentum."],
  ["Marco Bailey","Direct rolling form","A functional percussion engine that survives a long mix."],
  ["Marcal","Polyrhythmic hypnosis","Tribal detail, timeline cells, call-response, support probability."],
  ["Feral","Ritual depth","Synthesized material voices, dub space, long-cycle resonance."],
  ["Luigi Tozzi","Immersive restraint","Tubular objects, band-limited motion, minimal tonal gravity."],
  ["Moon Boots","Harmony that dances","Chord voicing by register, bass–kick conversation, elegant warmth."],
  ["Disclosure","One grid, two gaits","UK swing, clipped chords, vocal rhythm, 2-step/four-floor translation."],
  ["Leon Vynehall","Place + memory","Field recording, tape-like patina, organic drums, narrative form."],
  ["Maya Jane Coles","Dark house intimacy","Dusky texture, skipping rhythm, low-end weight, restrained foreground."],
  ["Midland","DJ-form continuity","Understated transitions across house, techno, breaks, disco, and ambience."],
  ["Floorplan","Minimal uplift","Machine discipline opened by gospel/disco color and ecstatic repetition."],
  ["Alex Albrecht","Environmental pulse","Patient ambience, soft transients, field perspective, long breath."],
  ["Ricardo Villalobos","Long conversation","Microtiming, tiny events, negative space, organic unequal cycles."],
  ["Fabe","Compact play","Minimal-house bass/drum dialogue, small gestures, functional swing."],
  ["JJ Selects","Personal reference","Verify the exact release; transcribe bounce, economy, and DJ utility."],
  ["Papa Nugs","Hybrid handoffs","Garage, breaks, house, and rave rhythm connected without pasted seams."],
  ["LB Honne","Evidence first","Verify the exact release and document the traits that put it in your map."],
];

const sources=[
  ["Ableton Live 12 Manual — Grooves","https://www.ableton.com/en/manual/using-grooves/","TECHNICAL"],
  ["Ableton — Learning Synths","https://learningsynths.ableton.com/","INTERACTIVE"],
  ["Ableton — Making Music","https://makingmusic.ableton.com/","PRACTICE"],
  ["Maschine MK3 — Routing and Macros","https://www.native-instruments.com/ni-tech-manuals/maschine-mk3-manual/en/audio-routing%2C-remote-control%2C-and-macro-controls","TECHNICAL"],
  ["DJ Babatr and raptor house","https://djmag.com/dj-babatr-roar-raptor-house-interview-caracas","CONTEXT"],
  ["Berklee — Dembow explained","https://www.berklee.edu/berklee-now/news/what-is-dembow-tracing-the-roots-of-a-global-phenomenon","CONTEXT"],
  ["Disclosure — production and musical background","https://www.gq.com/story/disclosure-caracal-electronic-dance-interview","ARTIST"],
  ["Leon Vynehall — Envelopes","https://pitchfork.com/reviews/tracks/leon-vynehall-envelopes-chapter-vi/","ARTIST"],
  ["Maya Jane Coles — Take Flight","https://pitchfork.com/reviews/albums/maya-jane-coles-take-flight/","ARTIST"],
  ["Midland — Fabriclive 94","https://pitchfork.com/reviews/albums/midland-fabriclive-94/","ARTIST"],
  ["Robert Hood — Paradygm Shift","https://pitchfork.com/reviews/albums/23380-paradygm-shift/","ARTIST"],
  ["Papa Nugs — Resident Advisor profile","https://ra.co/dj/papanugs","ARTIST"],
];

export default function ReferencesPage(){return <div className="references-page page-pad">
  <header className="page-heading"><div><p className="eyebrow"><span>LISTEN FOR RELATIONSHIPS</span><b>REF</b></p><h1>REFERENCE<br/>WITHOUT IMITATION</h1><p>Each artist is a perceptual question, not a preset category. Analyze one audible relationship, translate it with your own material, and distinguish evidence from guesses about equipment.</p></div><div className="reference-rule"><strong>01</strong><span>HEAR</span><strong>02</strong><span>NAME</span><strong>03</strong><span>TRANSLATE</span></div></header>
  <section className="artist-grid">{artists.map(([name,pole,prompt],index)=><article key={name}><header><i>{String(index+1).padStart(2,"0")}</i><b>{pole}</b></header><h2>{name}</h2><p>{prompt}</p><Link href={`/course/?q=${encodeURIComponent(name)}`}>FIND IN COURSE →</Link></article>)}</section>
  <section className="attribution-note"><b>ATTRIBUTION CHECK</b><p>For LB Honne and JJ Selects, record the exact track, release, label or platform link, and geographic/label context before attaching a fixed profile. Poor indexing is a reason to study the intended audio more carefully—not a reason to invent certainty.</p></section>
  <section className="source-library"><div className="section-title"><span>OUTSIDE MATERIALS</span><b>CURATED STARTING POINTS</b></div><div>{sources.map(([title,href,type],index)=><a key={href} href={href} target="_blank" rel="noreferrer"><i>{String(index+1).padStart(2,"0")}</i><strong>{title}</strong><span>{type}</span><b>↗</b></a>)}</div></section>
</div>}
