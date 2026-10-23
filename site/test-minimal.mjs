import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {build,root} from './build.mjs';
import {minimalSchool} from './publication.mjs';
import {admissions,rankings,schoolUrl} from './templates.mjs';
import {compareCards} from './assets/sort.mjs';

const output=path.join(root,'../work/argus-publication/minimal-preview');
const result=await build({minimal:true,basePath:'/argus-university-rankings/',output,compact:true});
assert.equal(result.pages.size,245);assert.equal(result.data.schools.length,237);
const forbidden=/"(?:components|publishedRank|effectiveRank|rawEvidence|nicheGrades|lawHub|rawObservations|wsjSalary|wsjCareerPreparation)"\s*:/;
for(const original of result.data.allSchools){
  assert.ok(!forbidden.test(JSON.stringify(original)),'Raw input in public view');
  assert.equal(original.publicationMinimal,true);
  const html=result.pages.get(schoolUrl(original,result.data.images));
  assert.ok(!html.includes('<th>Publisher rank</th>')&&!html.includes('ARGUS component score'));
  assert.ok(html.includes('/methodology/#data-access'));
}
const privateData=JSON.parse(await fs.readFile(path.join(root,'data/usnews-acceptance/schools.json'),'utf8')).schools;
for(const s of privateData){
  const projected=result.data.schools.find(x=>x.id===s.id);
  for(const r of rankings){
    const original=r.key==='gus'?s.overall:s.specialties[r.key],publicResult=r.key==='gus'?projected.overall:projected.specialties[r.key];
    for(const field of ['status','rank','score','tieSize'])assert.equal(publicResult[field],original[field],s.id+' '+r.key+' '+field);
  }
  for(const key of Object.keys(s.overall.categories))assert.deepEqual(projected.overall.categories[key],{rank:s.overall.categories[key].rank,score:s.overall.categories[key].score});
  if(s.admissionsProfile.acceptance.sourceQuality==='usnews-undergraduate'){
    assert.equal(projected.admissionsProfile.acceptance.value,undefined);
    assert.equal(admissions(projected)[0].value,'See source');
  }
}
const cards=result.data.schools.map(s=>({dataset:{schoolId:s.id,score:String(s.overall.score??''),...Object.fromEntries(Object.entries(s.overall.categories).map(([key,c])=>[key+'Score',String(c.score??'')]))}}));
for(const key of ['score','careerScore','prestigeScore','experienceScore','learningScore'])assert.equal(new Set([...cards].sort((a,b)=>compareCards(a,b,key)).map(c=>c.dataset.schoolId)).size,237);
const method=result.pages.get('/methodology/');
assert.ok(method.includes('id="data-access"')&&method.includes('Requests are reviewed individually'));
assert.ok(!method.includes('<p>Master:'));
for(const html of result.pages.values()){
  assert.ok(!forbidden.test(html));assert.ok(!html.includes('undefined')&&!html.includes('NaN'));
  for(const [,href]of html.matchAll(/(?:href|src)="([^"]+)"/g))if(href.startsWith('/')){
    const url=new URL(href.replaceAll('&amp;','&'),'https://example.invalid');
    assert.ok(url.pathname.startsWith('/argus-university-rankings/'));
    const local=url.pathname.slice('/argus-university-rankings'.length);
    if(local.startsWith('/assets/'))await fs.access(path.join(output,local));
    else {assert.ok(result.pages.has(local),href);if(url.hash)assert.ok(result.pages.get(local).includes(`id="${url.hash.slice(1)}"`),href);}
  }
}
const provenance=JSON.parse(await fs.readFile(path.join(output,'provenance.json'),'utf8'));
assert.deepEqual(Object.keys(provenance).sort(),['pages','publicationProfile','schemaVersion','schools']);
// A future accidental template reference cannot reach these private observations.
const probe=structuredClone(result.data.schools[0]);probe.nicheGrades='SENTINEL';probe.overall.categories.career.components={rawEvidence:'SENTINEL'};probe.admissionsProfile.sat.statistics={math:{median:750,rawEvidence:'SENTINEL'},privateNotes:'SENTINEL'};
assert.ok(!JSON.stringify(minimalSchool(probe)).includes('SENTINEL'));
console.log('PASS: minimal 245-page profile, exact 237-school results/ties/NR, combined-view inputs, private-field exclusions, source requests and all internal links.');
