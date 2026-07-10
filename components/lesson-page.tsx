"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { CourseDiagram } from "./diagram";
import { Icon } from "./icon";
import { useProgress } from "./progress";
import type { DiagramKind } from "../lib/course";

interface LessonView { id:string; slug:string; sequence:number; title:string; part:string; kind:string; description:string; html:string; minutes:number; wordCount:number; diagram:DiagramKind; concepts:string[]; headings:{id:string;label:string}[]; }
interface LinkView { slug:string; title:string; sequence:number; part:string; minutes:number; }
interface SkillView {id:string;name:string;domain:string;description:string;why:string;evidence:string;prerequisites:{id:string;name:string}[];}

const newcomerGuidance:Record<string,string>={foundation:"Read the ordinary-language model first. You do not need to memorize the terminology before trying the example.",rhythm:"Slow the tempo, count aloud, and use only kick plus one short sound until the relationship is physically obvious.",sound:"Use the stock-device recipe exactly once. Exaggerate the control range so you can hear the dimension, then reduce it.",systems:"Verify one signal or control boundary at a time. Do not assemble several untested routing stages and diagnose them as one problem.",arrangement:"Use an existing loop and subtraction before adding transition effects or new instruments.",practice:"Reduce the quantity target, not the variable being trained. Save one piece of audible evidence.",reference:"Analyze one audible relationship. Do not guess the artist’s hidden equipment or attempt an exact preset match."};

export function LessonPage({ lesson, previous, next, related, skills }: { lesson: LessonView; previous?: LinkView; next?: LinkView; related: LinkView[]; skills:SkillView[] }) {
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
      <div className="lesson-actions"><button aria-pressed={bookmarked} className={bookmarked?"active":""} onClick={()=>toggleBookmark(lesson.id)}><Icon name="bookmark"/><span>{bookmarked?"SAVED":"SAVE"}</span></button><button aria-pressed={complete} className={`complete-button ${complete?"active":""}`} onClick={()=>toggleComplete(lesson.id)}><Icon name="check"/><span>{complete?"COMPLETED":"MARK COMPLETE"}</span></button><span className="sr-only" aria-live="polite">{complete?"Lesson marked complete":"Lesson not yet complete"}</span></div>
    </header>

    <section className="lesson-orientation" aria-labelledby="lesson-route-title">
      <div className="section-title"><span id="lesson-route-title">HOW TO USE THIS LESSON</span><b>UNDERSTAND → HEAR → DO → PROVE</b></div>
      <div>
        <article><i>01</i><h2>UNDERSTAND</h2><p>{lesson.description}</p></article>
        <article><i>02</i><h2>HEAR</h2><p>{skills[0]?.why||"Exaggerate the contrast until the relevant change becomes perceptually obvious."}</p></article>
        <article><i>03</i><h2>DO</h2><p>{exercises.length?`This lesson contains ${exercises.length} trackable ${exercises.length===1?"exercise":"exercises"}. Complete the minimum version before any stretch variation.`:"Make one controlled comparison and save the version that best demonstrates the lesson’s variable."}</p></article>
        <article><i>04</i><h2>PROVE</h2><p>{skills[0]?.evidence||"Explain what changed, why it changed, and whether the result improved the musical function."}</p></article>
      </div>
      <aside><strong>IF YOU ARE NEW TO PRODUCTION</strong><p>{newcomerGuidance[lesson.kind]||newcomerGuidance.foundation}</p></aside>
    </section>

    <section className="lesson-skills" aria-labelledby="lesson-skills-title"><div className="section-title"><span id="lesson-skills-title">SKILLS WORKED HERE</span><b>{skills.length} LINKED CAPABILITIES</b></div><div>{skills.map((skill,index)=><Link key={skill.id} href={`/skills/#skill-${skill.id}`}><i>{String(index+1).padStart(2,"0")}</i><span><small>{skill.domain}</small><strong>{skill.name}</strong><em>{skill.description}</em></span><Icon name="arrow"/></Link>)}</div></section>

    {lesson.diagram && <CourseDiagram kind={lesson.diagram}/>} 

    <div className="lesson-layout">
      <article className="lesson-content" dangerouslySetInnerHTML={{__html:lesson.html}}/>
      <aside className="lesson-sidebar">
        <section><header>ON THIS PAGE</header><nav>{lesson.headings.slice(0,18).map((heading)=><a key={heading.id} href={`#${heading.id}`}>{heading.label}</a>)}</nav></section>
        <section className="sidebar-skills"><header>SKILLS WORKED</header>{skills.map(skill=><Link key={skill.id} href={`/skills/#skill-${skill.id}`}><span>{skill.name}</span><small>{skill.domain}</small></Link>)}</section>
        {exercises.length>0 && <section className="exercise-tracker"><header>EXERCISE TRACKER</header>{exercises.map((exercise)=><label key={exercise.id}><input type="checkbox" checked={checked.includes(exercise.id)} onChange={()=>toggleExercise(lesson.id,exercise.id)}/><span>{exercise.label}</span></label>)}</section>}
        <section className="lesson-note"><header>YOUR NOTE</header><textarea value={state.notes[lesson.id]||""} onChange={(event)=>saveNote(lesson.id,event.target.value)} placeholder="What changed? What did you hear? What remains unresolved?"/><small>Saved automatically on this device.</small></section>
      </aside>
    </div>

    {related.length>0 && <section className="related-lessons"><div className="section-title"><span>CONNECTED LESSONS</span><b>FOLLOW THE CONCEPT</b></div><div>{related.map((item)=><Link key={item.slug} href={`/course/${item.slug}/`}><i>{String(item.sequence).padStart(3,"0")}</i><strong>{item.title}</strong><span>{item.part}</span><Icon name="arrow"/></Link>)}</div></section>}

    <nav className="lesson-pagination">{previous?<Link href={`/course/${previous.slug}/`}><small>PREVIOUS</small><strong>{previous.title}</strong></Link>:<span/>}{next?<Link href={`/course/${next.slug}/`}><small>NEXT</small><strong>{next.title}</strong><Icon name="arrow"/></Link>:<Link href="/course/"><small>COMPLETE</small><strong>Return to the course map</strong><Icon name="arrow"/></Link>}</nav>
  </div>;
}
