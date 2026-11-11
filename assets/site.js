'use strict';
(function(){
  const toggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.main-nav');
  if(toggle&&nav){
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      if(nav.classList.contains('is-open')){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}
    }));
  }
  const form=document.getElementById('catalog-filters');
  if(!form)return;
  const search=document.getElementById('search');
  const year=document.getElementById('year');
  const imprint=document.getElementById('imprint');
  const series=document.getElementById('series');
  const pdf=document.getElementById('pdf');
  const count=document.getElementById('filter-count');
  const empty=document.getElementById('filter-empty');
  const records=Array.from(document.querySelectorAll('.catalog-row'));
  const groups=Array.from(document.querySelectorAll('.year-group'));
  const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
  const params=new URLSearchParams(location.search);
  if(params.get('q'))search.value=params.get('q');
  if(params.get('year'))year.value=params.get('year');
  if(params.get('imprint'))imprint.value=params.get('imprint');
  if(params.get('series'))series.value=params.get('series');
  if(params.get('pdf')==='1')pdf.checked=true;
  function run(){
    const terms=norm(search.value).split(/\s+/).filter(Boolean);
    let visible=0;
    records.forEach(el=>{
      const text=norm(el.dataset.search);
      const show=terms.every(t=>text.includes(t))&&(!year.value||el.dataset.year===year.value)&&(!imprint.value||el.dataset.imprint===imprint.value)&&(!series.value||el.dataset.series===series.value)&&(!pdf.checked||el.dataset.pdf==='1');
      el.hidden=!show;
      if(show)visible++;
    });
    groups.forEach(g=>g.hidden=!g.querySelector('.catalog-row:not([hidden])'));
    count.textContent=String(visible);
    empty.hidden=visible!==0;
    const p=new URLSearchParams();
    if(search.value.trim())p.set('q',search.value.trim());
    if(year.value)p.set('year',year.value);
    if(imprint.value)p.set('imprint',imprint.value);
    if(series.value)p.set('series',series.value);
    if(pdf.checked)p.set('pdf','1');
    const suffix=p.toString();
    history.replaceState(null,'',location.pathname+(suffix?'?'+suffix:''));
  }
  form.addEventListener('input',run);
  form.addEventListener('change',run);
  form.addEventListener('reset',()=>setTimeout(run,0));
  run();
})();
