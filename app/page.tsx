import { Dashboard } from "../components/dashboard";
import { lessons, parts, totalMinutes } from "../lib/course";
import { skills,skillLessonMap } from "../lib/skills";

export default function Home() {
  return <Dashboard
    lessons={lessons.map(({ id, slug, sequence, title, part, minutes, kind, description, diagram }) => ({ id, slug, sequence, title, part, minutes, kind, description, diagram }))}
    parts={parts.map((part) => ({ title: part.title, slug: part.slug, lessonIds: part.lessons.map((lesson) => lesson.id), minutes: part.minutes }))}
    totalMinutes={totalMinutes}
    skills={skills.map(({id,name,domain})=>({id,name,domain,lessonIds:skillLessonMap[id]||[]}))}
  />;
}
