import courseData from "../data/course.json";

export type LessonKind = "foundation"|"rhythm"|"sound"|"systems"|"arrangement"|"practice"|"reference";
export type DiagramKind = "four-four"|"signal-flow"|"envelope"|"step-grid"|"machines"|"energy"|"modulation"|"spectrum"|null;
export interface Lesson { id:string;slug:string;sequence:number;title:string;part:string;partSlug:string;kind:LessonKind;diagram:DiagramKind;description:string;markdown:string;html:string;wordCount:number;minutes:number;headings:{id:string;label:string}[];concepts:string[]; }
export interface CoursePart { title:string;slug:string;lessons:Lesson[];minutes:number; }
export interface GlossaryEntry {term:string;definition:string;anchor:string;}

const slugify=(value:string)=>value.normalize("NFKD").replace(/[–—]/g,"-").replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-|-$/g,"").toLowerCase().slice(0,72);
const plain=(value:string)=>value.replace(/```[\s\S]*?```/g," ").replace(/https?:\/\/\S+/g," ").replace(/[*_`>#|\[\]()]/g," ").replace(/\s+/g," ").trim();

export const lessons=courseData as Lesson[];
export const parts:CoursePart[]=Array.from(new Set(lessons.map(lesson=>lesson.part))).map(title=>{const partLessons=lessons.filter(lesson=>lesson.part===title);return{title,slug:slugify(title),lessons:partLessons,minutes:partLessons.reduce((sum,lesson)=>sum+lesson.minutes,0)};});
export const totalMinutes=lessons.reduce((sum,lesson)=>sum+lesson.minutes,0);
export const getLesson=(slug:string)=>lessons.find(lesson=>lesson.slug===slug);
export function getAdjacentLesson(slug:string,direction:-1|1){const index=lessons.findIndex(lesson=>lesson.slug===slug);return lessons[index+direction];}
export function getRelatedLessons(lesson:Lesson,limit=4){return lessons.filter(candidate=>candidate.id!==lesson.id).map(candidate=>({candidate,score:candidate.concepts.filter(concept=>lesson.concepts.includes(concept)).length*3+(candidate.kind===lesson.kind?2:0)+(candidate.part===lesson.part?1:0)})).filter(item=>item.score>1).sort((a,b)=>b.score-a.score||a.candidate.sequence-b.candidate.sequence).slice(0,limit).map(item=>item.candidate);}
export const glossary:GlossaryEntry[]=(()=>{const lesson=lessons.find(item=>item.title.toLowerCase()==="glossary");if(!lesson)return[];const entries:GlossaryEntry[]=[];for(const line of lesson.markdown.split("\n")){const match=line.match(/^- \*\*(.+?):\*\*\s+(.+)/);if(match)entries.push({term:match[1],definition:plain(match[2]),anchor:slugify(match[1])});}return entries;})();
