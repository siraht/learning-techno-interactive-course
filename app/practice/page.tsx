import type { Metadata } from "next";
import { PracticeLog } from "../../components/practice-log";
import { skills } from "../../lib/skills";
export const metadata:Metadata={title:"Practice log"};
export default function PracticePage(){return <PracticeLog skills={skills.map(({id,name,domain})=>({id,name,domain}))}/>;}
