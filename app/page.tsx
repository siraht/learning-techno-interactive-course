import { Dashboard } from "../components/dashboard";
import { lessons, parts, totalMinutes } from "../lib/course";

export default function Home() {
  return <Dashboard
    lessons={lessons.map(({ id, slug, sequence, title, part, minutes, kind, description, diagram }) => ({ id, slug, sequence, title, part, minutes, kind, description, diagram }))}
    parts={parts.map((part) => ({ title: part.title, slug: part.slug, lessonIds: part.lessons.map((lesson) => lesson.id), minutes: part.minutes }))}
    totalMinutes={totalMinutes}
  />;
}
