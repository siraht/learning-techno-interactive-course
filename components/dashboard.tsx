"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "./icon";
import { calculateStreak, useProgress } from "./progress";
import { CourseDiagram } from "./diagram";
import type { DiagramKind } from "../lib/course";
import { calculateSkillProgressById } from "../lib/skill-progress";

interface LessonSummary { id: string; slug: string; sequence: number; title: string; part: string; minutes: number; kind: string; description: string; diagram: DiagramKind; }
interface PartSummary { title: string; slug: string; lessonIds: string[]; minutes: number; }
interface SkillSummary {id:string;name:string;domain:string;lessonIds:string[];}

export function Dashboard({ lessons, parts, totalMinutes, skills }: { lessons: LessonSummary[]; parts: PartSummary[]; totalMinutes: number;skills:SkillSummary[] }) {
  const { state, toggleComplete } = useProgress();
  const completed = useMemo(() => new Set(state.completed), [state.completed]);
  const next = lessons.find((lesson) => !completed.has(lesson.id)) || lessons[lessons.length - 1];
  const last = lessons.find((lesson) => lesson.id === state.lastVisited);
  const current = last && !completed.has(last.id) ? last : next;
  const percent = Math.round((state.completed.length / lessons.length) * 100);
  const completeMinutes = lessons.filter((lesson) => completed.has(lesson.id)).reduce((sum, lesson) => sum + lesson.minutes, 0);
  const remaining = Math.max(0, totalMinutes - completeMinutes);
  const streak = calculateStreak(state.activeDays);
  const weekly = lessons.filter((lesson) => !completed.has(lesson.id)).slice(0, 5);
  const activePart = parts.find((part) => part.lessonIds.includes(current.id)) || parts[0];
  const partProgress = useMemo(() => parts.map((part) => ({ ...part, done: part.lessonIds.filter((id) => completed.has(id)).length })), [parts, completed]);
  const skillProgress=useMemo(()=>skills.map(skill=>({...skill,progress:calculateSkillProgressById(skill.id,skill.lessonIds,state)})),[skills,state]);
  const domainProgress=useMemo(()=>Array.from(new Set(skills.map(skill=>skill.domain))).map(domain=>{const values=skillProgress.filter(skill=>skill.domain===domain);return{domain,score:Math.round(values.reduce((sum,item)=>sum+item.progress.score,0)/Math.max(1,values.length))};}),[skills,skillProgress]);
  const nextSkill=[...skillProgress].filter(item=>item.progress.score<100).sort((a,b)=>a.progress.score-b.progress.score)[0];

  return <div className="dashboard-page page-pad">
    <section className="dashboard-hero">
      <div className="hero-copy">
        <p className="eyebrow"><span>SELF-DIRECTED COURSE</span><b>001</b></p>
        <h1>LIVING<br/>TECHNO</h1>
        <p className="hero-deck">Rhythm, sound design, groove, and living systems.</p>
        <div className="hero-progress"><strong>{percent}% <span>COMPLETE</span></strong><div className="step-progress">{Array.from({ length: 16 }, (_, i) => <i key={i} className={i < Math.round(percent / 6.25) ? "filled" : ""}><small>{i + 1}</small></i>)}</div></div>
        <Link className="primary-cta" href={`/course/${current.slug}/`}><Icon name="arrow" size={28}/><span>{state.lastVisited ? "CONTINUE LEARNING" : "BEGIN THE COURSE"}</span></Link>
      </div>
      <article className="current-lesson-card ruled-card">
        <header><span>CURRENT LESSON</span><b>{String(current.sequence).padStart(3,"0")}</b></header>
        <div className="current-body"><strong className="module-number">{String(current.sequence).padStart(2,"0")}</strong><div><small>{current.part}</small><h2>{current.title}</h2><p>{current.description}</p></div></div>
        <footer><span><small>EST. TIME</small>{current.minutes} min</span><span><small>LESSON TYPE</small>{current.kind}</span><span><small>ACTIVE PART</small>{activePart.title.replace(/^Part [^—]+—\s*/, "")}</span></footer>
      </article>
    </section>

    <section className="dashboard-grid">
      <article className="ruled-card weekly-card"><header><span>UP NEXT</span><b>02</b></header><div className="task-list">{weekly.map((lesson) => <label key={lesson.id}><input type="checkbox" checked={completed.has(lesson.id)} onChange={() => toggleComplete(lesson.id)}/><span><Link href={`/course/${lesson.slug}/`}>{lesson.title}</Link><small>{lesson.minutes} min · {lesson.kind}</small></span></label>)}</div><footer>{Math.min(weekly.filter((lesson)=>completed.has(lesson.id)).length,5)} / 5 TASKS DONE</footer></article>
      <article className="ruled-card visual-card"><header><span>RHYTHM PLATE</span><b>03</b></header><CourseDiagram kind={current.diagram || "step-grid"} compact/><footer><Link href={`/course/${current.slug}/`}>OPEN CURRENT CONCEPT <Icon name="arrow"/></Link></footer></article>
      <article className="ruled-card streak-card"><header><span>PRACTICE STREAK</span><b>04</b></header><div className="streak-main"><strong>{streak}</strong><span>DAY{streak === 1 ? "" : "S"}</span></div><div className="activity-dots">{Array.from({length:28},(_,i)=>{const date=new Date();date.setDate(date.getDate()-(27-i));const on=state.activeDays.includes(date.toISOString().slice(0,10));return <i key={i} className={on?"on":""}/>})}</div><p>Consistency builds feel. A short, diagnosed session counts.</p><footer><Link href="/practice/">LOG A SESSION <Icon name="arrow"/></Link></footer></article>
      <article className="ruled-card metrics-card"><header><span>COURSE SIGNAL</span><b>05</b></header><dl><div><dt>LESSONS</dt><dd>{state.completed.length}<span>/{lessons.length}</span></dd></div><div><dt>TIME LEFT</dt><dd>{Math.floor(remaining/60)}h <span>{remaining%60}m</span></dd></div><div><dt>NOTES</dt><dd>{Object.values(state.notes).filter(Boolean).length}</dd></div><div><dt>SAVED</dt><dd>{state.bookmarked.length}</dd></div></dl><footer>LOCAL · PRIVATE · EXPORTABLE</footer></article>
    </section>

    <section className="dashboard-skill-signal ruled-card"><header><span>SKILL SIGNAL</span><b>06</b></header><div className="domain-bars">{domainProgress.map(item=><div key={item.domain}><span>{item.domain}</span><i role="progressbar" aria-label={`${item.domain} skill progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.score}><em style={{width:`${item.score}%`}}/></i><strong>{item.score}%</strong></div>)}</div>{nextSkill&&<Link className="next-skill" href={`/skills/#skill-${nextSkill.id}`}><small>NEXT LOWEST SIGNAL</small><strong>{nextSkill.name}</strong><span>{nextSkill.progress.stage} · {nextSkill.progress.score}% worked</span><Icon name="arrow"/></Link>}<footer><Link href="/skills/">OPEN THE COMPLETE SKILLS MAP <Icon name="arrow"/></Link></footer></section>

    <section className="part-signal ruled-card"><header><span>COURSE MAP</span><b>07</b></header><div className="part-strip">{partProgress.map((part, index)=><Link key={part.slug} href={`/course/#${part.slug}`} className={part.done===part.lessonIds.length?"complete":part.lessonIds.includes(current.id)?"current":""}><i>{String(index+1).padStart(2,"0")}</i><span>{part.title.replace(/^Part [^—]+—\s*/,"")}</span><em>{part.done}/{part.lessonIds.length}</em></Link>)}</div></section>
  </div>;
}
