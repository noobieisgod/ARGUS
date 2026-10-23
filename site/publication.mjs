// Public view only. Never change the frozen inputs or recalculate ARGUS results.
const pick=(value,keys)=>Object.fromEntries(keys.filter(key=>value?.[key]!==undefined).map(key=>[key,value[key]]));
const result=value=>({...pick(value,['status','rank','score','tieSize']),reason:value.status==='ranked'?null:'Not Ranked under ARGUS eligibility and coverage rules.'});

export function minimalSchool(s){
  const profile=s.admissionsProfile;
  const measure=value=>{
    const out=pick(value,['availabilityState','value','measure','reason','population','weighting','scale','sourceId']);
    if(value?.statistics)out.statistics=Object.fromEntries(['composite','math','evidence-based reading and writing','evidence-based reading','reading and writing'].filter(key=>value.statistics[key]).map(key=>[key,pick(value.statistics[key],['median','mean','p25','p75'])]));
    return out;
  };
  const acceptance=pick(profile.acceptance,['availabilityState','value','sourceId','sourceQuality','sourceLabel','cohort','userSupplied','applicants','admitted']);
  if(acceptance.sourceQuality==='usnews-undergraduate'){
    delete acceptance.value;delete acceptance.applicants;delete acceptance.admitted;
    acceptance.availabilityState='Withheld';
  }
  return {
    ...pick(s,['id','name','officialName','location']),publicationMinimal:true,
    overall:{...result(s.overall),categories:Object.fromEntries(Object.entries(s.overall.categories).map(([key,value])=>[key,pick(value,['rank','score'])]))},
    specialties:Object.fromEntries(Object.entries(s.specialties).map(([key,value])=>[key,result(value)])),
    sourceIds:[...new Set(Object.values(s.specialties).flatMap(value=>Object.values(value.components??{}).map(c=>c.sourceId)).filter(Boolean))],
    admissionsProfile:{...pick(profile,['cdsEdition','admissionsCohort','sourceId']),acceptance,sat:measure(profile.sat),gpa:measure(profile.gpa)}
  };
}

export const dataAccessNotice='<section id="data-access" class="detail-section"><h2>Underlying data requests</h2><p>This public build contains ARGUS results, institutional admissions facts, campus locations and source citations. Publisher input ranks, ratings, component tables, research extracts and original datasets are not distributed.</p><p><a href="https://github.com/noobieisgod/argus-university-rankings/issues/new?title=Data%20access%20request">Request a reproducibility review or permitted data access</a>. Identify the schools, fields and intended use. Do not post personal information, credentials or restricted source material in a public issue. Requests are reviewed individually; third-party data is supplied only where redistribution is permitted. Otherwise, source links and access instructions are provided. A request does not guarantee access or grant a reuse license.</p><p class="quiet">Reducing public exposure does not itself establish permission for derived rankings. The publication review remains a separate launch requirement.</p></section>';
