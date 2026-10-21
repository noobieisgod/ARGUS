const header=document.querySelector('.site-header');
if(header){
  const measure=()=>document.documentElement.style.setProperty('--header-height',`${getComputedStyle(header).position==='sticky'?Math.ceil(header.getBoundingClientRect().height):0}px`);
  measure();new ResizeObserver(measure).observe(header);
  for(const link of header.querySelectorAll('.main-nav a'))if(new URL(link.href).pathname===location.pathname)link.setAttribute('aria-current','page');
}
