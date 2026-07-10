import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=path.resolve("out");
const read=relative=>fs.readFileSync(path.join(root,relative),"utf8");

test("exports the complete interlinked course",()=>{
  const lessonPages=[];
  for(const entry of fs.readdirSync(path.join(root,"course"),{withFileTypes:true})){
    if(entry.isDirectory()&&fs.existsSync(path.join(root,"course",entry.name,"index.html")))lessonPages.push(entry.name);
  }
  assert.equal(lessonPages.length,112);
  assert.match(read("index.html"),/LIVING/);
  assert.match(read("course/001-what-v5-changes/index.html"),/What v5 changes/i);
  assert.match(read("design-system/index.html"),/CLUB MANUAL/i);
  assert.match(read("skills/index.html"),/CAPABILITY, NOT JUST COMPLETION/i);
  assert.match(read("course/111-glossary/index.html"),/Amplitude envelope/i);
  assert.match(read("course/112-completion-checklist/index.html"),/completed the core course/i);
});

test("exports accessibility landmarks and explanatory lesson scaffolding",()=>{
  const dashboard=read("index.html");
  const lesson=read("course/024-machines-are-teachers-interfaces-shape-rhythm/index.html");
  assert.match(dashboard,/Skip to course content/);
  assert.match(dashboard,/id="main-content"/);
  assert.match(lesson,/HOW TO USE THIS LESSON/);
  assert.match(lesson,/SKILLS WORKED HERE/);
  assert.match(lesson,/aria-pressed=/);
  assert.match(lesson,/class="table-region"/);
  assert.match(lesson,/href="\/skills\/#skill-/);
  assert.match(read("skills/index.html"),/href="\/course\//);
});

test("lesson headings descend without skipped levels",()=>{
  const lessonRoot=path.join(root,"course");
  const failures=[];
  for(const entry of fs.readdirSync(lessonRoot,{withFileTypes:true})){
    if(!entry.isDirectory())continue;
    const file=path.join(lessonRoot,entry.name,"index.html");
    if(!fs.existsSync(file))continue;
    const levels=Array.from(fs.readFileSync(file,"utf8").matchAll(/<h([1-6])\b/g),match=>Number(match[1]));
    if(levels[0]!==1)failures.push(`${entry.name}: first heading is h${levels[0]||"none"}`);
    for(let index=1;index<levels.length;index++)if(levels[index]>levels[index-1]+1)failures.push(`${entry.name}: h${levels[index-1]} to h${levels[index]}`);
  }
  assert.deepEqual(failures,[]);
});

test("new-tab links include safe relationship attributes",()=>{
  const lesson=read("course/095-artist-aesthetic-research-used-to-calibrate-the-course/index.html");
  for(const match of lesson.matchAll(/<a[^>]*target="_blank"[^>]*>/g))assert.match(match[0],/rel="noreferrer"/);
});

test("every lesson participates in the lesson-skill graph",()=>{
  const lessonRoot=path.join(root,"course");
  const failures=[];
  for(const entry of fs.readdirSync(lessonRoot,{withFileTypes:true})){
    if(!entry.isDirectory())continue;
    const file=path.join(lessonRoot,entry.name,"index.html");
    if(!fs.existsSync(file))continue;
    const html=fs.readFileSync(file,"utf8");
    if(!html.includes("SKILLS WORKED HERE"))failures.push(`${entry.name}: no skill explanation`);
    if(!/href="\/skills\/#skill-/.test(html))failures.push(`${entry.name}: no skill link`);
    if(!/href="\/course\//.test(html))failures.push(`${entry.name}: no lesson link`);
  }
  assert.deepEqual(failures,[]);
  const skills=read("skills/index.html");
  assert.equal((skills.match(/class="skill-card/g)||[]).length,26);
});

test("contextual vocabulary links reach the glossary",()=>{
  let count=0;
  const lessonRoot=path.join(root,"course");
  for(const entry of fs.readdirSync(lessonRoot,{withFileTypes:true})){
    const file=path.join(lessonRoot,entry.name,"index.html");
    if(fs.existsSync(file))count+=(fs.readFileSync(file,"utf8").match(/class="term-link"/g)||[]).length;
  }
  assert.ok(count>=200,`expected at least 200 contextual glossary links, found ${count}`);
});

test("internal HTML links resolve to exported files",()=>{
  const htmlFiles=[];
  const walk=directory=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const full=path.join(directory,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith(".html"))htmlFiles.push(full);}};
  walk(root);
  const missing=[];
  for(const file of htmlFiles){const html=fs.readFileSync(file,"utf8");for(const match of html.matchAll(/href="([^"]+)"/g)){const href=match[1];if(!href.startsWith("/")||href.startsWith("//")||href.startsWith("/_next/"))continue;const clean=decodeURIComponent(href.split(/[?#]/)[0]);if(!clean)continue;const target=clean.endsWith("/")?path.join(root,clean,"index.html"):path.extname(clean)?path.join(root,clean):path.join(root,clean,"index.html");if(!fs.existsSync(target))missing.push(`${path.relative(root,file)} → ${href}`);}}
  assert.deepEqual(missing,[]);
});
