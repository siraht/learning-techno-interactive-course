"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useProgress } from "./progress";
import { calculateSkillProgressById } from "../lib/skill-progress";
import type { SkillDefinition,SkillDomain } from "../lib/skills";

interface LessonLink {id:string;slug:string;title:string;sequence:number;}
const domainOrder:SkillDomain[]=["Rhythm","Sound design","Systems","Composition","Engineering"];
const ratingLabels=["Not claimed","Recognize it","Explain it","Apply it","Demonstrate it"];

export function SkillsDashboard({skills,skillLessonMap,lessons}:{skills:SkillDefinition[];skillLessonMap:Record<string,string[]>;lessons:LessonLink[]}){
  const {state,setSkillEvidence}=useProgress();
  const [domain,setDomain]=useState<"All"|SkillDomain>("All");
  const [expanded,setExpanded]=useState<string|null>(null);
  const lessonById=useMemo(()=>new Map(lessons.map(lesson=>[lesson.id,lesson])),[lessons]);
  const progress=useMemo(()=>Object.fromEntries(skills.map(skill=>[skill.id,calculateSkillProgressById(skill.id,skillLessonMap[skill.id]||[],state)])),[skills,skillLessonMap,state]);
  const domainScores=useMemo(()=>domainOrder.map(name=>{const values=skills.filter(skill=>skill.domain===name).map(skill=>progress[skill.id].score);return{name,score:Math.round(values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length))};}),[skills,progress]);
  const shown=domain==="All"?skills:skills.filter(skill=>skill.domain===domain);

  return <div className="skills-page page-pad">
    <header className="page-heading"><div><p className="eyebrow"><span>CAPABILITY, NOT JUST COMPLETION</span><b>SKILLS</b></p><h1>WHAT YOU<br/>CAN ACTUALLY DO</h1><p>Course sections tell you what you have moved through. This map tells you what capabilities you have encountered, studied, practiced, and demonstrated—and which lessons contributed to each one.</p></div><div className="skill-level-key" aria-label="Skill level definitions">{ratingLabels.map((label,index)=><div key={label}><b>{index}</b><span>{label}</span></div>)}</div></header>
    <section className="skill-method" aria-labelledby="skill-method-title"><h2 id="skill-method-title">HOW THE SIGNAL IS CALCULATED</h2><div><article><b>15%</b><strong>ENCOUNTER</strong><p>You opened a linked lesson. Exposure is not mastery, but it is the beginning of a mental map.</p></article><article><b>45%</b><strong>STUDY</strong><p>You marked linked lessons complete. Completion measures coverage, not proof of ability.</p></article><article><b>25%</b><strong>PRACTICE</strong><p>You checked exercises in linked lessons. Repeated application moves knowledge into action.</p></article><article><b>15%</b><strong>EVIDENCE</strong><p>You rated the strongest level you can honestly demonstrate and recorded what proves it.</p></article></div></section>
    <section className="domain-signal"><div className="section-title"><span>DOMAIN SIGNAL</span><b>AGGREGATED SKILL PROGRESS</b></div><div>{domainScores.map(item=><button key={item.name} onClick={()=>setDomain(domain===item.name?"All":item.name)} className={domain===item.name?"active":""} aria-pressed={domain===item.name}><span>{item.name}</span><strong>{item.score}%</strong><i><em style={{width:`${item.score}%`}}/></i></button>)}</div></section>
    <div className="skill-filter" role="group" aria-label="Filter skills by domain"><button className={domain==="All"?"active":""} onClick={()=>setDomain("All")}>ALL SKILLS</button>{domainOrder.map(name=><button key={name} className={domain===name?"active":""} onClick={()=>setDomain(name)}>{name}</button>)}</div>
    <section className="skill-grid" aria-label={`${domain} skill progress`}>
      {shown.map((skill)=>{const item=progress[skill.id],linked=(skillLessonMap[skill.id]||[]).map(id=>lessonById.get(id)).filter(Boolean) as LessonLink[],evidence=state.skillEvidence[skill.id]||{rating:0,note:""};return <article id={`skill-${skill.id}`} key={skill.id} className={`skill-card stage-${item.stage.toLowerCase().replace(" ","-")}`}>
        <header><i>{String(skills.indexOf(skill)+1).padStart(2,"0")}</i><span>{skill.domain}</span><b>{item.stage}</b></header>
        <h2>{skill.name}</h2><p>{skill.description}</p>
        <div className="skill-meter" role="progressbar" aria-label={`${skill.name}: ${item.score}% worked`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.score}><i><em style={{width:`${item.score}%`}}/></i><strong>{item.score}%</strong></div>
        <dl><div><dt>ENCOUNTERED</dt><dd>{item.visited}/{item.lessonTotal}</dd></div><div><dt>STUDIED</dt><dd>{item.completed}/{item.lessonTotal}</dd></div><div><dt>PRACTICE CHECKS</dt><dd>{item.practice}</dd></div><div><dt>SELF-EVIDENCE</dt><dd>{item.rating}/4</dd></div></dl>
        <button className="skill-expand" onClick={()=>setExpanded(expanded===skill.id?null:skill.id)} aria-expanded={expanded===skill.id} aria-controls={`skill-detail-${skill.id}`}>{expanded===skill.id?"HIDE DETAILS":"OPEN SKILL MAP"}</button>
        {expanded===skill.id&&<div className="skill-detail" id={`skill-detail-${skill.id}`}>
          <section><h3>WHY IT MATTERS</h3><p>{skill.why}</p><h3>DEMONSTRATION STANDARD</h3><p>{skill.evidence}</p></section>
          {skill.prerequisites.length>0&&<section><h3>PREREQUISITES</h3><div className="prereq-links">{skill.prerequisites.map(id=>{const prerequisite=skills.find(item=>item.id===id);return prerequisite?<a key={id} href={`#skill-${id}`} onClick={()=>{setDomain("All");setExpanded(id)}}>{prerequisite.name}</a>:null})}</div></section>}
          <section><h3>LINKED LESSONS</h3><div className="skill-lessons">{linked.map(lesson=><Link key={lesson.id} href={`/course/${lesson.slug}/`}><i>{String(lesson.sequence).padStart(3,"0")}</i><span>{lesson.title}</span><b>{state.completed.includes(lesson.id)?"COMPLETE":"OPEN"}</b></Link>)}</div></section>
          <section className="evidence-form"><h3>YOUR EVIDENCE</h3><fieldset><legend>Strongest level you can honestly support</legend>{ratingLabels.map((label,rating)=><label key={label}><input type="radio" name={`rating-${skill.id}`} checked={evidence.rating===rating} onChange={()=>setSkillEvidence(skill.id,rating,evidence.note)}/><span><b>{rating}</b>{label}</span></label>)}</fieldset><label>Evidence note<textarea value={evidence.note} onChange={event=>setSkillEvidence(skill.id,evidence.rating,event.target.value)} placeholder="Name the export, exercise, or repeatable action that proves this level."/></label></section>
        </div>}
      </article>})}
    </section>
  </div>;
}
