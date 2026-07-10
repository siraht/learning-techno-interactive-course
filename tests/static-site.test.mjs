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
  assert.equal(lessonPages.length,103);
  assert.match(read("index.html"),/LIVING/);
  assert.match(read("course/001-what-v5-changes/index.html"),/What v5 changes/i);
  assert.match(read("design-system/index.html"),/CLUB MANUAL/i);
});

test("internal HTML links resolve to exported files",()=>{
  const htmlFiles=[];
  const walk=directory=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const full=path.join(directory,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith(".html"))htmlFiles.push(full);}};
  walk(root);
  const missing=[];
  for(const file of htmlFiles){const html=fs.readFileSync(file,"utf8");for(const match of html.matchAll(/href="([^"]+)"/g)){const href=match[1];if(!href.startsWith("/")||href.startsWith("//")||href.startsWith("/_next/"))continue;const clean=decodeURIComponent(href.split(/[?#]/)[0]);if(!clean)continue;const target=clean.endsWith("/")?path.join(root,clean,"index.html"):path.extname(clean)?path.join(root,clean):path.join(root,clean,"index.html");if(!fs.existsSync(target))missing.push(`${path.relative(root,file)} → ${href}`);}}
  assert.deepEqual(missing,[]);
});
