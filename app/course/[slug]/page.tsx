import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPage } from "../../../components/lesson-page";
import { getAdjacentLesson, getLesson, getRelatedLessons, lessons } from "../../../lib/course";

export function generateStaticParams() { return lessons.map((lesson)=>({slug:lesson.slug})); }

export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return lesson ? { title: lesson.title, description: lesson.description } : {};
}

export default async function LessonRoute({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const previous = getAdjacentLesson(slug,-1);
  const next = getAdjacentLesson(slug,1);
  const related = getRelatedLessons(lesson);
  const summary = (item: typeof lesson) => ({slug:item.slug,title:item.title,sequence:item.sequence,part:item.part,minutes:item.minutes});
  return <LessonPage lesson={{id:lesson.id,slug:lesson.slug,sequence:lesson.sequence,title:lesson.title,part:lesson.part,kind:lesson.kind,description:lesson.description,html:lesson.html,minutes:lesson.minutes,wordCount:lesson.wordCount,diagram:lesson.diagram,concepts:lesson.concepts,headings:lesson.headings}} previous={previous?summary(previous):undefined} next={next?summary(next):undefined} related={related.map(summary)}/>;
}
