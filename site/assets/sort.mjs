import {createLocationFilter} from './location-filter.mjs';
const keys=new Set(['score','careerScore','prestigeScore','experienceScore','learningScore']);
export const sortKey=value=>keys.has(value)?value:'score';

function value(card,key){
  const raw=card.dataset[key];
  return raw==null||raw.trim()===''||!Number.isFinite(Number(raw))?null:Number(raw);
}

export function compareCards(a,b,key){
  if(!keys.has(key))throw new Error('Unknown ranking sort');
  const x=value(a,key),y=value(b,key);
  if(x===null&&y!==null)return 1;
  if(y===null&&x!==null)return -1;
  return (x===null?0:y-x)||((value(b,'score')??-1)-(value(a,'score')??-1))||a.dataset.schoolId.localeCompare(b.dataset.schoolId);
}

export function sortCards(list,key){
  list.append(...Array.from(list.children).sort((a,b)=>compareCards(a,b,key)));
}

export function sortRanking(list,nrSection,key){
  if(nrSection){
    list.append(...nrSection.querySelectorAll('.school-card'));
    if(key==='score')for(const card of Array.from(list.children))if(card.dataset.rank==='')nrSection.append(card);
    nrSection.hidden=key!=='score';
  }
  sortCards(list,key);
}

export function updateRankLabels(card,key){
  for(const line of card.querySelectorAll('.rank-line'))line.hidden=(line.dataset.rankView??'score')!==key;
  card.querySelector('.secondary-rank').hidden=key==='score';
  const reason=card.querySelector('.nr-reason');
  if(reason)reason.hidden=key!=='score';
}

if(typeof document!=='undefined'){
  const form=document.getElementById('ranking-sort'),list=document.getElementById('ranked-schools');
  if(form&&list){
    const initial=sortKey(new URLSearchParams(location.search).get('sort'));
    form.querySelector(`input[value="${initial}"]`).checked=true;
    let applyLocation=()=>{};
    const update=()=>{
      const selected=form.querySelector('input:checked');
      sortRanking(list,document.querySelector('.nr-section'),selected.value);
      for(const card of document.querySelectorAll('.school-card'))updateRankLabels(card,selected.value);
      applyLocation(selected.value);
      document.getElementById('sort-status').textContent='Sorted by '+selected.parentElement.textContent+'. Published ranks are unchanged.';
    };
    applyLocation=createLocationFilter(form,update);
    form.addEventListener('change',event=>{if(event.target.matches('input[type="radio"]'))update();});
    form.addEventListener('submit',event=>event.preventDefault());
    update();
  }
}
