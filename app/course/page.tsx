import type { Metadata } from "next";
import { CourseMap } from "../../components/course-map";
import { parts } from "../../lib/course";

export const metadata: Metadata = { title: "Course map" };

export default function CourseMapPage() {
  return <CourseMap parts={parts.map((part)=>({ title:part.title, slug:part.slug, minutes:part.minutes, lessons:part.lessons.map(({id,slug,sequence,title,kind,minutes,description,concepts})=>({id,slug,sequence,title,kind,minutes,description,concepts})) }))}/>;
}
