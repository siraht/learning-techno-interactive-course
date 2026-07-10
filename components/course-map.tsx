"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "./icon";
import { useProgress } from "./progress";

interface LessonItem { id: string; slug: string; sequence: number; title: string; kind: string; minutes: number; description: string; concepts: string[]; }
interface PartItem { title: string; slug: string; minutes: number; lessons: LessonItem[]; }

export function CourseMap({ parts }: { parts: PartItem[] }) {
  const { state } = useProgress();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const completed = new Set(state.completed);
  const total = parts.reduce((sum, part) => sum + part.lessons.length, 0);
  const types = ["all", "foundation", "rhythm", "sound", "systems", "arrangement", "practice", "reference"];
  useEffect(()=>{const value=new URLSearchParams(window.location.search).get("q");if(value)queueMicrotask(()=>setQuery(value));},[]);
  const visible = useMemo(() => parts.map((part) => ({ ...part, lessons: part.lessons.filter((lesson) => (filter === "all" || lesson.kind === filter) && `${lesson.title} ${lesson.description} ${lesson.concepts.join(" ")}`.toLowerCase().includes(query.toLowerCase())) })).filter((part) => part.lessons.length), [parts, filter, query]);

  return <div className="course-map-page page-pad">
    <header className="page-heading"><div><p className="eyebrow"><span>FULL CURRICULUM</span><b>MAP</b></p><h1>THE COURSE<br/>AS A SYSTEM</h1><p>Every section of the curriculum is preserved as a trackable lesson. Filter by skill family, follow the designed sequence, or jump through related concepts.</p></div><div className="map-summary"><strong>{state.completed.length}<span>/{total}</span></strong><small>LESSONS COMPLETE</small><div className="meter"><i style={{width:`${Math.round(state.completed.length/total*100)}%`}}/></div></div></header>
    <section className="filter-bar"><label><Icon name="search"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Filter lesson titles and concepts"/></label><div>{types.map((type)=><button key={type} className={filter===type?"active":""} onClick={()=>setFilter(type)}>{type}</button>)}</div></section>
    <div className="parts-stack">
      {visible.map((part) => { const done = part.lessons.filter((lesson)=>completed.has(lesson.id)).length; return <section className="part-block" id={part.slug} key={part.slug}>
        <header><div><b>{String(parts.findIndex((item)=>item.slug===part.slug)+1).padStart(2,"0")}</b><h2>{part.title}</h2></div><span>{done}/{part.lessons.length} COMPLETE · {Math.floor(part.minutes/60)}H {part.minutes%60}M</span></header>
        <div className="lesson-list">{part.lessons.map((lesson)=><Link key={lesson.id} href={`/course/${lesson.slug}/`} className={`lesson-row ${completed.has(lesson.id)?"complete":""}`}><i>{completed.has(lesson.id)?<Icon name="check"/>:String(lesson.sequence).padStart(3,"0")}</i><span><strong>{lesson.title}</strong><small>{lesson.description}</small><em>{lesson.concepts.map((concept)=><b key={concept}>{concept}</b>)}</em></span><dl><div><dt>TYPE</dt><dd>{lesson.kind}</dd></div><div><dt>TIME</dt><dd>{lesson.minutes} min</dd></div></dl><Icon name="arrow"/></Link>)}</div>
      </section>})}
      {!visible.length && <div className="empty-state">No lessons match this filter. Remove a category or shorten the search phrase.</div>}
    </div>
  </div>;
}
