/* ==========================================================================
   VALIDAÇÃO
   ========================================================================== */

function validarPonto(x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return 'Preencha todas as coordenadas do ponto.';
  }
  if (x <= -DOMINIO || x >= DOMINIO || y <= -DOMINIO || y >= DOMINIO) {
    return `Ponto (${x}, ${y}) fora do domínio (-${DOMINIO} < x, y < ${DOMINIO}).`;
  }
  return null;
}

function lerNumeroCampo(id) {
  const campo = document.getElementById(id);
  const valor = campo ? campo.value.trim() : '';
  return valor === '' ? NaN : Number(valor);
}

function mostrarErro(msg) {
  const el = document.getElementById('statusErro');
  el.textContent = msg;
  el.classList.add('visivel');
}

function limparErro() {
  const el = document.getElementById('statusErro');
  el.textContent = '';
  el.classList.remove('visivel');
}

// Interpreta uma lista de pontos digitada no formato "x,y; x,y; ...",
// usada por qualquer algoritmo com número variável de vértices (polilinha
// hoje, polígono numa etapa futura). Retorna { pontos, erro }.
function interpretarListaPontos(texto, minimo) {
  const partes = String(texto).split(';').map(p => p.trim()).filter(p => p.length > 0);

  if (partes.length < minimo) {
    return { pontos: null, erro: `Informe pelo menos ${minimo} pontos, no formato x,y; x,y; ...` };
  }

  const pontos = [];
  for (const parte of partes) {
    const coords = parte.split(',').map(v => v.trim());
    if (coords.length !== 2) {
      return { pontos: null, erro: `Ponto inválido: "${parte}". Use o formato x,y.` };
    }

    const x = coords[0] === '' ? NaN : Number(coords[0]);
    const y = coords[1] === '' ? NaN : Number(coords[1]);
    const erroPonto = validarPonto(x, y);
    if (erroPonto) {
      return { pontos: null, erro: erroPonto };
    }

    pontos.push({ x, y });
  }

  return { pontos, erro: null };
}

// Valida uma janela de recorte retangular (xmin, ymin) - (xmax, ymax):
// limites invertidos ou fora do domínio são rejeitados aqui.
function validarJanela(xmin, ymin, xmax, ymax) {
  if (![xmin, ymin, xmax, ymax].every(Number.isFinite)) {
    return 'Preencha todos os limites da janela de recorte.';
  }
  if (xmin >= xmax || ymin >= ymax) {
    return 'Janela de recorte inválida: o mínimo deve ser menor que o máximo.';
  }
  return validarPonto(xmin, ymin) || validarPonto(xmax, ymax);
}
