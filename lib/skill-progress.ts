import type { ProgressState } from "../components/progress";

export interface SkillProgress {
  score:number;stage:"Not started"|"Encountered"|"Studied"|"Practiced"|"Demonstrated";
  visited:number;completed:number;practice:number;rating:number;lessonTotal:number;
}

export function calculateSkillProgress(lessonIds:string[],state:ProgressState):SkillProgress{
  const visited=lessonIds.filter(id=>state.visited.includes(id)||state.completed.includes(id)).length;
  const completed=lessonIds.filter(id=>state.completed.includes(id)).length;
  const practice=lessonIds.reduce((sum,id)=>sum+(state.exercises[id]?.length||0),0);
  const rating=0;
  const total=Math.max(1,lessonIds.length);
  const exposureScore=visited/total*15;
  const studyScore=completed/total*45;
  const practiceScore=Math.min(1,practice/Math.max(2,Math.ceil(total/3)))*25;
  const selfScore=rating/4*15;
  const score=Math.round(exposureScore+studyScore+practiceScore+selfScore);
  const stage=rating>=4?"Demonstrated":practice>0?"Practiced":completed>0?"Studied":visited>0?"Encountered":"Not started";
  return{score,stage,visited,completed,practice,rating,lessonTotal:lessonIds.length};
}

export function calculateSkillProgressById(skillId:string,lessonIds:string[],state:ProgressState):SkillProgress{
  const base=calculateSkillProgress(lessonIds,state);
  const loggedPractice=state.practiceEntries.filter(entry=>entry.skills?.includes(skillId)).length;
  const practice=base.practice+loggedPractice;
  const rating=Math.max(0,Math.min(4,state.skillEvidence?.[skillId]?.rating||0));
  const practiceScore=Math.min(1,practice/Math.max(2,Math.ceil(base.lessonTotal/3)))*25;
  const originalPracticeScore=Math.min(1,base.practice/Math.max(2,Math.ceil(base.lessonTotal/3)))*25;
  const score=Math.min(100,Math.round(base.score-originalPracticeScore+practiceScore+rating/4*15));
  const stage=rating>=4?"Demonstrated":practice>0?"Practiced":base.completed>0?"Studied":base.visited>0?"Encountered":"Not started";
  return{...base,practice,score,stage,rating};
}
