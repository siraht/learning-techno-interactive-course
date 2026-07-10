import type { Metadata } from "next";
import { PracticeLog } from "../../components/practice-log";
export const metadata:Metadata={title:"Practice log"};
export default function PracticePage(){return <PracticeLog/>;}
