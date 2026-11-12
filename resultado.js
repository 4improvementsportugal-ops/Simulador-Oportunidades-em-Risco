'use strict';
const params = new URLSearchParams(location.search);
let scenario = null;
try {scenario = JSON.parse(sessionStorage.getItem('simulador_oportunidades_4i') || 'null');} catch(_) {}
if (!scenario) scenario = Object.fromEntries(['leads','unfollowed','conversion','revenue'].map(k => [k, params.has(k) ? Number(params.get(k)) : undefined]));

const limits = {
  leads: [20,2000,100],
  unfollowed: [0,80,20],
  conversion: [0,30,5],
  revenue: [1000,20000,6000]
};
for (const [key,[min,max,fallback]] of Object.entries(limits)) {
  const val = Number(scenario[key]);
  if (!Number.isFinite(val) || val < min || val > max) scenario[key] = fallback;
}
const int = new Intl.NumberFormat('pt-PT', {maximumFractionDigits:2,useGrouping:'always'});
const euro = new Intl.NumberFormat('pt-PT', {style:'currency',currency:'EUR',maximumFractionDigits:0,useGrouping:'always'});
const risk = scenario.leads * scenario.unfollowed / 100;
const deals = risk * scenario.conversion / 100;
const potential = deals * scenario.revenue;
function put(id,val){document.getElementById(id).textContent = val;}
put('risk-result', int.format(risk));
put('money-result',euro.format(potential));
put('deal-result',int.format(deals));
put('deal-noun', Math.abs(deals-1) < 1e-9 ? 'negócio hipotético' : 'negócios hipotéticos');
put('p-leads',int.format(scenario.leads));
put('p-unfollowed',int.format(scenario.unfollowed)+'%');
put('p-conversion',int.format(scenario.conversion)+'%');
put('p-revenue',euro.format(scenario.revenue));
