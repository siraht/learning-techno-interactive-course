import type { Metadata } from "next";
import { CourseMap } from "../../components/course-map";
import { parts } from "../../lib/course";
import { getSkillsForLesson } from "../../lib/skills";

export const metadata: Metadata = { title: "Course map" };

export default function CourseMapPage() {
  return <CourseMap parts={parts.map((part)=>({ title:part.title, slug:part.slug, minutes:part.minutes, lessons:part.lessons.map((lesson)=>({id:lesson.id,slug:lesson.slug,sequence:lesson.sequence,title:lesson.title,kind:lesson.kind,minutes:lesson.minutes,description:lesson.description,concepts:lesson.concepts,skills:getSkillsForLesson(lesson).map(({id,name})=>({id,name}))})) }))}/>;
}
