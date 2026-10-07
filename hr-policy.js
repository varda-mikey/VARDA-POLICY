(()=>{
const api=window.VardaPolicyApi,$=id=>document.getElementById(id),E=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let hrToken='',customCodes=new Set(),saveRequestId='',draft=null;
document.head.insertAdjacentHTML('beforeend',`<style>.policyActions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px;padding:10px 12px}.policyActions .adminBtn{position:static;margin:0}.hrOpen{display:block;margin:0;border:1px solid #dec3ca;background:#701326;color:#fff;border-radius:10px;padding:10px 14px;font-weight:900}.hrFields{display:grid;grid-template-columns:1fr 1fr;gap:12px}.hrFields label{display:grid;gap:5px;font-weight:700}.hrFields input,.hrFields select,.hrFields textarea{width:100%;box-sizing:border-box;border:1px solid #cbd5df;padding:11px;border-radius:8px;font:inherit}.hrWide{grid-column:1/-1}.hrFields textarea{min-height:100px}.hrActions{display:flex;gap:10px;margin-top:15px}.hrActions button{border:0;border-radius:9px;padding:12px 16px;background:#701326;color:#fff;font-weight:800}.hrActions button:disabled{opacity:.6}.hrPreview{background:#fffbeb;border:1px solid #d6a62e;border-radius:12px;padding:16px;margin-top:16px}.policySync{font-size:13px;color:#66727e;padding:8px 0}.policySync button{margin-left:8px;padding:5px 10px;border:1px solid #dec3ca;background:#fff;border-radius:6px}.hrSaved{padding:10px;background:#f0fdf4;border-radius:8px;color:#166534}.hrLogin input{width:100%;max-width:400px;padding:12px;border:1px solid #cbd5df;border-radius:8px}.hrLogin{max-width:480px}#hrStatus{margin-top:12px}@media(max-width:600px){.hrFields{grid-template-columns:1fr}.hrWide{grid-column:auto}}</style>`);
document.body.insertAdjacentHTML('afterbegin','<div class="policyActions" id="policyActions"><button class="hrOpen" id="hrOpen">HR – MANAGE POLICIES</button></div>');
$('policyActions').appendChild($('adminOpen'));
document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="hrModal" role="dialog" aria-modal="true" aria-labelledby="hrHeading"><div class="modalBox"><div class="modalHead"><h2 id="hrHeading">HR Policy Manager</h2><button class="closeModal" id="hrClose">Close</button></div><div id="hrContent"></div></div></div>`);
const sync=document.createElement('div');sync.className='policySync';sync.id='policySync';sync.setAttribute('role','status');$('summary').before(sync);
const busy=text=>'<span class="vardaSpinner" aria-hidden="true"></span>'+E(text);
function mergePolicies(rows){
  for(let i=policies.length-1;i>=0;i--)if(customCodes.has(policies[i].code))policies.splice(i,1);
  customCodes=new Set();window.VARDA_TL=window.VARDA_TL||{};
  rows.forEach(p=>{if(!policies.some(x=>x.code===p.code)){policies.push(p);customCodes.add(p.code);window.VARDA_TL[p.code]={title:p.titleTL,rule:p.ruleTL}}});
  const dep=$('department').value;$('department').innerHTML=`<option value="">${E(ui[lang].allDept)}</option>`+[...new Set(policies.map(x=>x.department))].sort().map(x=>`<option value="${E(x)}">${E(x)}</option>`).join('');$('department').value=dep;
  const max=policies.reduce((n,p)=>Math.max(n,Number(p.code.match(/\d+$/)?.[0])||0),86);
  ui.en.subtitle='Official employee policy reference · ACT-001 to ACT-'+String(max).padStart(3,'0');ui.tl.subtitle='Opisyal na sanggunian ng empleyado · ACT-001 hanggang ACT-'+String(max).padStart(3,'0');$('subtitle').textContent=ui[lang].subtitle;render();
  window.VardaPolicySetReady(true,rows);
}
async function syncPolicies(){
  $('policySync').innerHTML=busy('Loading HR-added policies…');window.VardaPolicySetReady(false);
  try{const d=await api({action:'policies'});mergePolicies(d.policies);$('policySync').innerHTML='Policy library updated. <button id="refreshPolicies">Refresh policies</button>';$('refreshPolicies').onclick=syncPolicies}
  catch(x){$('policySync').innerHTML='Added policies could not load. Please retry before acknowledging. <button id="retryPolicies">Retry</button>';$('retryPolicies').onclick=syncPolicies}
}
function showLogin(){
  $('hrContent').innerHTML='<form class="hrLogin" id="hrLogin"><p>Enter the HR password to add a company policy.</p><input id="hrPassword" type="password" autocomplete="current-password" placeholder="HR password" required><div class="hrActions"><button id="hrLoginButton">LOGIN</button></div><div id="hrStatus" role="status"></div></form>';
  $('hrLogin').onsubmit=async e=>{e.preventDefault();const b=$('hrLoginButton');b.disabled=true;b.innerHTML=busy('Logging in…');try{const d=await api({action:'hr_login',password:$('hrPassword').value});hrToken=d.token;$('hrPassword').value='';showEditor()}catch(x){$('hrStatus').textContent=x.message;b.disabled=false;b.textContent='LOGIN'}};
}
function showEditor(){
  saveRequestId='';draft=null;
  $('hrContent').innerHTML=`<p>Use the same policy format. The ACT code is assigned when saved.</p><form id="hrForm"><div class="hrFields"><label class="hrWide">English policy title<input name="title" maxlength="200" required></label><label>Department<input name="department" maxlength="120" list="hrDepartments" required><datalist id="hrDepartments">${[...new Set(policies.map(x=>x.department))].sort().map(x=>`<option value="${E(x)}">`).join('')}</datalist></label><label>Severity<select name="severity"><option>Minor</option><option>Major</option><option>Critical</option></select></label><label>Demerit points<input name="points" type="number" min="1" max="4" step="1" value="1" required></label><label>ACT code<input value="Assigned automatically on save" disabled></label><label class="hrWide">English covered conduct<textarea name="rule" maxlength="4000" required></textarea></label><label class="hrWide">Tagalog policy title<input name="titleTL" maxlength="200" required></label><label class="hrWide">Tagalog covered conduct<textarea name="ruleTL" maxlength="4000" required></textarea></label></div><div class="hrActions"><button type="submit">PREVIEW POLICY</button><button type="button" id="hrLogout">LOG OUT</button></div><div id="hrPreview"></div><div id="hrStatus" role="status"></div></form>`;
  const form=$('hrForm'),ranges={Minor:[1,4],Major:[5,14],Critical:[15,25]};
  form.elements.severity.onchange=()=>{const r=ranges[form.elements.severity.value];form.elements.points.min=r[0];form.elements.points.max=r[1];form.elements.points.value=r[0]};
  form.oninput=()=>{draft=null;saveRequestId='';$('hrPreview').innerHTML=''};
  form.onsubmit=e=>{e.preventDefault();draft=Object.fromEntries(new FormData(form));draft.points=Number(draft.points);saveRequestId=crypto.randomUUID();$('hrStatus').textContent='';$('hrPreview').innerHTML=`<section class="hrPreview"><b>POLICY PREVIEW · ACT code assigned on save</b><h3>${E(draft.title)}</h3><p>${E(draft.department)} · ${E(draft.severity)} · −${draft.points} points</p><p>${E(draft.rule)}</p><hr><h3>${E(draft.titleTL)}</h3><p>${E(draft.ruleTL)}</p><div class="hrActions"><button type="button" id="saveHrPolicy">SAVE POLICY</button></div></section>`;$('saveHrPolicy').onclick=savePolicy};
  $('hrLogout').onclick=()=>{hrToken='';showLogin()};
}
async function savePolicy(){
  if(!draft)return;const b=$('saveHrPolicy'),form=$('hrForm');b.disabled=true;b.innerHTML=busy('Saving policy…');Array.from(form.elements).forEach(x=>x.disabled=true);$('hrStatus').textContent='Saving to the shared policy library. Please wait.';
  try{const d=await api({action:'policy_add',token:hrToken,requestId:saveRequestId,...draft}),rows=policies.filter(x=>customCodes.has(x.code));if(!rows.some(x=>x.code===d.policy.code))rows.push(d.policy);mergePolicies(rows);$('hrContent').innerHTML=`<p class="hrSaved">✓ ${E(d.policy.code)} saved successfully. It is now in the policy library.</p><div class="hrActions"><button id="addAnotherPolicy">ADD ANOTHER POLICY</button><button id="hrDone">DONE</button></div>`;$('addAnotherPolicy').onclick=showEditor;$('hrDone').onclick=()=>{$('hrModal').classList.remove('open')};$('policySync').textContent='Policy library updated.'}
  catch(x){$('hrStatus').textContent=x.message;Array.from(form.elements).forEach(x=>x.disabled=false);b.textContent='RETRY SAVE';if(/session expired/i.test(x.message)){hrToken='';const login=document.createElement('button');login.type='button';login.textContent='Log in again';login.onclick=showLogin;$('hrStatus').appendChild(login)}}
}
$('hrOpen').onclick=()=>{$('hrModal').classList.add('open');if(!hrToken)showLogin()};$('hrClose').onclick=()=>{$('hrModal').classList.remove('open')};
syncPolicies();
})();
