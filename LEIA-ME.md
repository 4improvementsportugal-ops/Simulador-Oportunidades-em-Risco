# Simulador de Oportunidades em Risco | 4Improvements

Landing page em português de Portugal, visual a preto, branco e cinzento no mesmo padrão do simulador anterior. Implementada em HTML, CSS e JavaScript sem frameworks ou serviços externos.

## Ficheiros

- `index.html`: quatro secções da landing page e simulador de quatro indicadores, com formulário revelado após clique.
- `styles.css`: layout e componentes responsivos.
- `script.js`: sliders, validação e navegação da demonstração.
- `obrigado.html`: cenário matemático, três recomendações e opção de copiar resumo.
- `resultado.js`: cálculo de leads em risco, negócios hipotéticos e receita potencial.
- `privacidade.html`: nota provisória de demonstração, **não pronta para produção**.
- `assets/`: logótipo 4Improvements e favicon.

## Testar

1. Descompacta a pasta.
2. Abre `index.html` num navegador ou, preferencialmente, executa `python -m http.server 8000` nesta pasta e visita `http://localhost:8000`.
3. Ajusta as leads, percentagem sem seguimento, conversão potencial e receita média.
4. Clica em **Ver o meu resultado personalizado**, preenche os três campos e aceita a informação de privacidade.
5. Na página `obrigado.html`, o resultado é calculado automaticamente.

## Fórmulas

- **Leads em risco (valor matemático):** `leads recebidas × percentagem sem seguimento / 100`
- **Negócios hipotéticos:** `leads em risco × conversão potencial / 100`
- **Receita bruta potencial:** `negócios hipotéticos × receita média por negócio`

Exemplo inicial: 100 leads × 20% = 20 leads em risco; 20 × 5% = 1 negócio hipotético; 1 × 6.000 € = 6.000 € de receita bruta potencial. Isto **não** é perda demonstrada ou previsão.

## Avisos antes da publicação

- **Formulário ligado (2026-11-17):** envia as leads em JSON para o webhook GoHighLevel (`WEBHOOK_URL` no topo de `script.js`) e dispara o evento `Lead` do Meta Pixel 1190659816630727 (instalado em `index.html` e `obrigado.html`). Uploads manuais destes ficheiros apagam esta configuração.
- Apenas os quatro valores numéricos da simulação são armazenados temporariamente na sessão e colocados na URL de resultado como alternativa de navegação.
- Substituir a nota provisória de privacidade por uma política adequada e verificar conformidade com RGPD.
- Ligar o formulário a um endpoint HTTPS para nome, email, telemóvel, quatro parâmetros e consentimentos separados. Não colocar segredos de API no JavaScript.
- Confirmar a receção no backend antes de apresentar o diagnóstico como enviado por email.
- Rever as fontes externas das três estatísticas antes da publicação pública; os números e limitações seguem a copy fornecida pelo utilizador.
- Testar a página publicada em telemóvel e computador, incluindo acessibilidade e Core Web Vitals.

## Performance

- Sem carregamentos de frameworks, bibliotecas de ícones, fontes externas ou CDN.
- CSS e scripts locais; `script.js` e `resultado.js` carregados com `defer`.
- Logótipos locais com dimensões declaradas.
- Respeita a preferência `prefers-reduced-motion`.
