'use strict';

const integer = new Intl.NumberFormat('pt-PT', {maximumFractionDigits:0,useGrouping:'always'});
const percent = new Intl.NumberFormat('pt-PT', {maximumFractionDigits:1});
const euro = new Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR', maximumFractionDigits:0, useGrouping:'always'});

const sliders = [
  {id:'leads', output:'leads-out', format:v=>integer.format(v)},
  {id:'unfollowed', output:'unfollowed-out', format:v=>percent.format(v)+'%'},
  {id:'conversion', output:'conversion-out', format:v=>percent.format(v)+'%'},
  {id:'revenue', output:'revenue-out', format:v=>euro.format(v)}
];

for (const item of sliders) {
  const slider = document.getElementById(item.id);
  const output = document.getElementById(item.output);
  const update = () => {
    const value = Number(slider.value);
    output.textContent = item.format(value);
    slider.style.setProperty('--progress', `${100 * (value-Number(slider.min))/(Number(slider.max)-Number(slider.min))}%`);
  };
  slider.addEventListener('input', update);
  update();
}

const panel = document.getElementById('form-panel');
const reveal = document.getElementById('reveal-form');
reveal.addEventListener('click', () => {
  panel.hidden = false;
  reveal.setAttribute('aria-expanded','true');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  panel.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
  window.setTimeout(() => document.getElementById('fullName').focus({preventScroll:true}), reduced?0:260);
});

function showError(field, message) {
  const error = document.getElementById('form-error');
  error.textContent = message;
  error.hidden = false;
  field.focus();
}

const form = document.getElementById('lead-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('form-error').hidden = true;
  const name = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const privacy = document.getElementById('privacy');

  if (name.value.trim().length < 2) return showError(name, 'Indica o teu nome completo.');
  if (!email.value.trim() || !email.validity.valid) return showError(email, 'Indica um email válido.');
  const digits = phone.value.replace(/\D/g,'');
  if (digits.length < 9 || digits.length > 15) return showError(phone, 'Indica um número de telemóvel válido.');
  if (!privacy.checked) return showError(privacy, 'Confirma que leste a informação de privacidade.');

  const scenario = Object.fromEntries(sliders.map(({id}) => [id, Number(document.getElementById(id).value)]));
  try {sessionStorage.setItem('simulador_oportunidades_4i', JSON.stringify(scenario));} catch(_) { /* Fallback: URL */ }
  // Demonstração: nenhum dado pessoal é guardado ou transmitido.
  window.location.assign('obrigado.html?' + new URLSearchParams(scenario).toString());
});
