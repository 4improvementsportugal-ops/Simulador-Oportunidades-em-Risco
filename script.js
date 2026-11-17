'use strict';

// Webhook GoHighLevel (recebe as leads do formulário)
const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/lwdT8imgib43lDC9X1SC/webhook-trigger/K7jofWJuv7qXIWE7dzDQ';
const WEBHOOK_PREFIXO_PAIS = '351';

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
  const destino = 'obrigado.html?' + new URLSearchParams(scenario).toString();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const fullName = name.value.trim().replace(/\s+/g,' ');
  const parts = fullName.split(' ');
  const phoneDigits = digits.length === 9 ? WEBHOOK_PREFIXO_PAIS + digits : digits;
  const risk = scenario.leads * scenario.unfollowed / 100;
  const deals = risk * scenario.conversion / 100;
  const eventId = 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2,10);

  const payload = {
    name: fullName,
    first_name: parts[0],
    last_name: parts.slice(1).join(' '),
    email: email.value.trim(),
    phone: phoneDigits,
    telefone_original: phone.value.trim(),
    consentimento_privacidade: privacy.checked,
    consentimento_marketing: document.getElementById('marketing').checked,
    leads_recebidas: scenario.leads,
    percentagem_sem_seguimento: scenario.unfollowed,
    conversao_potencial: scenario.conversion,
    receita_media_negocio: scenario.revenue,
    leads_em_risco: Math.round(risk * 100) / 100,
    negocios_hipoteticos: Math.round(deals * 100) / 100,
    receita_potencial: Math.round(deals * scenario.revenue),
    origem: 'Simulador de Oportunidades em Risco | 4Improvements',
    pagina_url: window.location.href,
    event_id: eventId,
    timestamp: new Date().toISOString()
  };

  const envio = fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => null);

  try {
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', {content_name: 'Simulador de Oportunidades em Risco', value: payload.receita_potencial, currency: 'EUR'}, {eventID: eventId});
    }
  } catch(_) {}

  // Espera pelo envio (máx. 4 s) para a lead e o evento saírem antes do redirecionamento.
  Promise.race([envio, new Promise(r => setTimeout(r, 4000))])
    .then(() => new Promise(r => setTimeout(r, 400)))
    .then(() => window.location.assign(destino));
});
