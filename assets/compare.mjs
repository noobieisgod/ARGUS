export function addSchool(selected,id){
  return selected.includes(id)||selected.length>=3?selected:[...selected,id];
}

export function matchingSchools(options,query){
  const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return words.length?options.filter(option=>words.every(word=>option.dataset.search.toLowerCase().includes(word))):[];
}

export function updateComparison(selected,table,status){
  const ids=new Set(selected.slice(0,3));
  for(const cell of table.querySelectorAll('[data-school-col]'))cell.hidden=!ids.has(cell.dataset.schoolCol);
  table.hidden=ids.size===0;
  status.textContent=`Comparing ${ids.size}/3 schools.`;
}

if(typeof document!=='undefined'){
  const form=document.getElementById('comparison-controls'),table=document.getElementById('comparison-table'),status=document.getElementById('comparison-status');
  const search=document.getElementById('school-search'),dropdown=document.getElementById('school-search-dropdown'),list=document.getElementById('school-options'),chips=document.getElementById('comparison-selected'),empty=document.getElementById('school-search-empty'),help=document.getElementById('comparison-help');
  if(form&&table&&status&&search&&dropdown&&list&&chips&&empty&&help){
    const options=Array.from(list.querySelectorAll('[data-school-id]'));
    let selected=[],active=-1;
    const close=()=>{dropdown.hidden=true;search.setAttribute('aria-expanded','false');search.removeAttribute('aria-activedescendant');active=-1;};
    const suggestions=()=>{
      const matches=matchingSchools(options,search.value);
      active=-1;search.removeAttribute('aria-activedescendant');
      for(const option of options){
        option.hidden=!matches.includes(option);
        option.disabled=selected.includes(option.dataset.schoolId)||selected.length===3;
        option.setAttribute('aria-selected',String(selected.includes(option.dataset.schoolId)));
        option.classList.remove('active-option');
      }
      empty.hidden=matches.length>0;
      dropdown.hidden=!search.value.trim();
      search.setAttribute('aria-expanded',String(!dropdown.hidden));
    };
    const render=()=>{
      updateComparison(selected,table,status);
      chips.replaceChildren();
      for(const id of selected){
        const option=options.find(option=>option.dataset.schoolId===id),button=document.createElement('button');
        button.type='button';button.dataset.removeSchool=id;
        button.textContent=option.dataset.name+' ×';
        button.setAttribute('aria-label','Remove '+option.dataset.name);
        chips.append(button);
      }
      help.textContent=selected.length===3?'Three-school limit reached. Remove a selected school to choose another.':'Search and select up to three schools.';
      suggestions();
    };
    const choose=option=>{
      if(!option||option.disabled)return;
      selected=addSchool(selected,option.dataset.schoolId);
      search.value='';render();close();search.focus();
    };
    form.addEventListener('submit',event=>event.preventDefault());
    search.addEventListener('input',suggestions);
    search.addEventListener('focus',suggestions);
    search.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();close();return;}
      if(!['ArrowDown','ArrowUp','Enter'].includes(event.key))return;
      event.preventDefault();
      if(dropdown.hidden)suggestions();
      const available=options.filter(option=>!option.hidden&&!option.disabled);
      if(event.key==='Enter'){choose(available[active<0?0:active]);return;}
      if(!available.length)return;
      active=active<0?(event.key==='ArrowDown'?0:available.length-1):(active+(event.key==='ArrowDown'?1:-1)+available.length)%available.length;
      for(const option of options)option.classList.toggle('active-option',option===available[active]);
      search.setAttribute('aria-activedescendant',available[active].id);
      available[active].scrollIntoView({block:'nearest'});
    });
    list.addEventListener('click',event=>choose(event.target.closest('button[data-school-id]')));
    chips.addEventListener('click',event=>{
      const button=event.target.closest('[data-remove-school]');
      if(!button)return;
      selected=selected.filter(id=>id!==button.dataset.removeSchool);render();search.focus();
    });
    document.addEventListener('pointerdown',event=>{if(!form.contains(event.target))close();});
    render();
  }
}
