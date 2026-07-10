import type { Metadata } from "next";
import { SkillsDashboard } from "../../components/skills-dashboard";
import { lessons } from "../../lib/course";
import { skills,skillLessonMap } from "../../lib/skills";
export const metadata:Metadata={title:"Skills map",description:"Track capability across rhythm, sound design, systems, composition, and engineering."};
export default function SkillsPage(){return <SkillsDashboard skills={skills} skillLessonMap={skillLessonMap} lessons={lessons.map(({id,slug,title,sequence})=>({id,slug,title,sequence}))}/>;}
