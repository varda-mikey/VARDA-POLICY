/* Load the HR interface only when HR opens it. Keep personnel data in memory only. */
(() => {
  'use strict';
  const host=document.getElementById('policyActions');
  if(!host)return;
  const launchButton=document.createElement('button');
  launchButton.className='hrOpen';launchButton.textContent='EMPLOYEE RECORDS';
  host.prepend(launchButton);
  let task=null;
  async function open(...args){
    launchButton.disabled=true;launchButton.innerHTML='<span class="hubLoader" aria-hidden="true"></span>Opening…';
    try{
      if(!task)task=new Promise((resolve,reject)=>{
        const script=document.createElement('script');script.src='hr-hub.js?v=20261015-modern3';script.async=true;
        script.onload=()=>resolve();script.onerror=()=>{task=null;script.remove();reject(Error('Unable to load employee records. Please try again.'));};
        document.body.appendChild(script);
      });
      await task;
      const hub=window.VardaHrHub;
      if(!hub||hub.open===open)throw Error('Employee records did not load. Refresh and try again.');
      launchButton.remove();
      const oldModal=document.getElementById('adminModal');
      if(oldModal?.classList.contains('open'))document.getElementById('adminClose')?.click();
      return await hub.open(...args);
    }catch(error){
      launchButton.disabled=false;launchButton.textContent='RETRY EMPLOYEE RECORDS';
      launchButton.title=error.message;
    }
  }
  launchButton.onclick=()=>open();
  window.VardaHrHub={open};
})();
