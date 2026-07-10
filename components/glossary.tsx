"use client";

import { useEffect, useMemo, useState } from "react";
import type { GlossaryEntry } from "../lib/course";
import { Icon } from "./icon";

export function Glossary({ entries }:{entries:GlossaryEntry[]}){
  const [query,setQuery]=useState("");
  useEffect(()=>{const q=new URLSearchParams(window.location.search).get("q");if(q)queueMicrotask(()=>setQuery(q));},[]);
  const shown=useMemo(()=>entries.filter(item=>`${item.term} ${item.definition}`.toLowerCase().includes(query.toLowerCase())),[entries,query]);
  const groups=useMemo(()=>Array.from(new Set(shown.map(item=>item.term[0].toUpperCase()))),[shown]);
  return <div className="glossary-page page-pad"><header className="page-heading"><div><p className="eyebrow"><span>PLAIN LANGUAGE → PRECISE TERM</span><b>A–Z</b></p><h1>VOCABULARY<br/>WITH A BODY</h1><p>Terms are useful only when they reconnect to something you can hear, count, touch, or change.</p></div><div className="alphabet">{"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter=><a key={letter} href={`#letter-${letter}`}>{letter}</a>)}</div></header><label className="glossary-search"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search meter, swing, modulation…"/><span>{shown.length} TERMS</span></label><div className="glossary-list">{groups.map(letter=><section id={`letter-${letter}`} key={letter}><header>{letter}</header><div>{shown.filter(item=>item.term.startsWith(letter)).map(item=><article id={item.anchor} key={item.term}><h2>{item.term}</h2><p>{item.definition}</p></article>)}</div></section>)}</div>{!shown.length&&<div className="empty-state">No term matches that search.</div>}</div>;
}
