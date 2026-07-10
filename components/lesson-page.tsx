"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { CourseDiagram } from "./diagram";
import { Icon } from "./icon";
import { useProgress } from "./progress";
import type { DiagramKind } from "../lib/course";

interface LessonView { id:string; slug:string; sequence:number; title:string; part:string; kind:string; description:string; html:string; minutes:number; wordCount:number; diagram:DiagramKind; concepts:string[]; headings:{id:string;label:string}[]; }
interface LinkView { slug:string; title:string; sequence:number; part:string; minutes:number; }

export function LessonPage({ lesson, previous, next, related }: { lesson: LessonView; previous?: LinkView; next?: LinkView; related: LinkView[] }) {
  const { state, visitLesson, toggleComplete, toggleBookmark, saveNote, toggleExercise } = useProgress();
  const complete = state.completed.includes(lesson.id);
  const bookmarked = state.bookmarked.includes(lesson.id);
  const exercises = useMemo(() => lesson.headings.filter((heading)=>/^(exercise|lab|recipe|study|workflow|day|card)/i.test(heading.label)), [lesson.headings]);
  const checked = state.exercises[lesson.id] || [];

  useEffect(() => visitLesson(lesson.id), [lesson.id, visitLesson]);

  return <div className="lesson-page page-pad">
    <nav className="breadcrumbs"><Link href="/course/">COURSE MAP</Link><span>/</span><span>{lesson.part}</span></nav>
    <header className="lesson-hero">
      <div className="lesson-number">{String(lesson.sequence).padStart(3,"0")}</div>
      <div><p className="eyebrow"><span>{lesson.kind} · {lesson.minutes} MIN</span><b>{lesson.part}</b></p><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="concept-tags">{lesson.concepts.map((concept)=><Link key={concept} href={`/glossary/?q=${encodeURIComponent(concept)}`}>{concept}</Link>)}</div></div>
      <div className="lesson-actions"><button className={bookmarked?"active":""} onClick={()=>toggleBookmark(lesson.id)}><Icon name="bookmark"/><span>{bookmarked?"SAVED":"SAVE"}</span></button><button className={`complete-button ${complete?"active":""}`} onClick={()=>toggleComplete(lesson.id)}><Icon name="check"/><span>{complete?"COMPLETED":"MARK COMPLETE"}</span></button></div>
    </header>

    {lesson.diagram && <CourseDiagram kind={lesson.diagram}/>} 

    <div className="lesson-layout">
      <article className="lesson-content" dangerouslySetInnerHTML={{__html:lesson.html}}/>
      <aside className="lesson-sidebar">
        <section><header>ON THIS PAGE</header><nav>{lesson.headings.slice(0,18).map((heading)=><a key={heading.id} href={`#${heading.id}`}>{heading.label}</a>)}</nav></section>
        {exercises.length>0 && <section className="exercise-tracker"><header>EXERCISE TRACKER</header>{exercises.map((exercise)=><label key={exercise.id}><input type="checkbox" checked={checked.includes(exercise.id)} onChange={()=>toggleExercise(lesson.id,exercise.id)}/><span>{exercise.label}</span></label>)}</section>}
        <section className="lesson-note"><header>YOUR NOTE</header><textarea value={state.notes[lesson.id]||""} onChange={(event)=>saveNote(lesson.id,event.target.value)} placeholder="What changed? What did you hear? What remains unresolved?"/><small>Saved automatically on this device.</small></section>
      </aside>
    </div>

    {related.length>0 && <section className="related-lessons"><div className="section-title"><span>CONNECTED LESSONS</span><b>FOLLOW THE CONCEPT</b></div><div>{related.map((item)=><Link key={item.slug} href={`/course/${item.slug}/`}><i>{String(item.sequence).padStart(3,"0")}</i><strong>{item.title}</strong><span>{item.part}</span><Icon name="arrow"/></Link>)}</div></section>}

    <nav className="lesson-pagination">{previous?<Link href={`/course/${previous.slug}/`}><small>PREVIOUS</small><strong>{previous.title}</strong></Link>:<span/>}{next?<Link href={`/course/${next.slug}/`}><small>NEXT</small><strong>{next.title}</strong><Icon name="arrow"/></Link>:<Link href="/course/"><small>COMPLETE</small><strong>Return to the course map</strong><Icon name="arrow"/></Link>}</nav>
  </div>;
}
