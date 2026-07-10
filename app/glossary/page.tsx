import type { Metadata } from "next";
import { Glossary as GlossaryView } from "../../components/glossary";
import { glossary } from "../../lib/course";
export const metadata:Metadata={title:"Glossary"};
export default function GlossaryPage(){return <GlossaryView entries={glossary}/>;}
