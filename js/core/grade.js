/* ==========================================================================
   GRADE, EIXOS E RÓTULOS
   As primitivas nativas do canvas (moveTo/lineTo/stroke/fillText) só são
   usadas aqui, para desenhar a grade de apoio, os eixos e os textos. Nenhum
   algoritmo de rasterização usa essas primitivas para gerar sua saída.
   ========================================================================== */

function desenharGrade() {
  ESCALA = canvas.width / (2 * DOMINIO);

  // zera a matriz de pixels pintados
  pintado = [];
  for (let i = 0; i < TAM_MATRIZ; i++) {
    pintado.push(new Array(TAM_MATRIZ).fill(false));
  }

  // fundo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // linhas finas da grade, uma para cada inteiro do domínio
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#e3e5e8';
  ctx.beginPath();
  for (let i = -DOMINIO; i <= DOMINIO; i++) {
    const vert = mundoParaTela(i, DOMINIO);
    const vertFim = mundoParaTela(i, -DOMINIO);
    ctx.moveTo(Math.round(vert.px) + 0.5, vert.py);
    ctx.lineTo(Math.round(vertFim.px) + 0.5, vertFim.py);

    const horiz = mundoParaTela(-DOMINIO, i);
    const horizFim = mundoParaTela(DOMINIO, i);
    ctx.moveTo(horiz.px, Math.round(horiz.py) + 0.5);
    ctx.lineTo(horizFim.px, Math.round(horizFim.py) + 0.5);
  }
  ctx.stroke();

  // eixos X e Y em destaque
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#8a8f98';
  ctx.beginPath();
  const origemEsq = mundoParaTela(-DOMINIO, 0);
  const origemDir = mundoParaTela(DOMINIO, 0);
  ctx.moveTo(origemEsq.px, origemEsq.py);
  ctx.lineTo(origemDir.px, origemDir.py);

  const origemCima = mundoParaTela(0, DOMINIO);
  const origemBaixo = mundoParaTela(0, -DOMINIO);
  ctx.moveTo(origemCima.px, origemCima.py);
  ctx.lineTo(origemBaixo.px, origemBaixo.py);
  ctx.stroke();

  // rótulos numéricos dos eixos
  ctx.fillStyle = '#555';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = -DOMINIO + 1; i <= DOMINIO - 1; i++) {
    if (i === 0) continue;
    const p = mundoParaTela(i, 0);
    ctx.fillText(String(i), p.px, p.py + 4);
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = -DOMINIO + 1; i <= DOMINIO - 1; i++) {
    if (i === 0) continue;
    const p = mundoParaTela(0, i);
    ctx.fillText(String(i), p.px - 4, p.py);
  }
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const origem = mundoParaTela(0, 0);
  ctx.fillText('0', origem.px + 4, origem.py + 4);
}

/* ==========================================================================
   setPixel — ÚNICO ponto de contato dos algoritmos com o canvas.
   Pinta a célula unitária cujo centro é o inteiro mais próximo de (x, y) e
   atualiza a matriz booleana pintado[][]. Coordenadas fora do domínio
   -11 < x < 11 / -11 < y < 11 são silenciosamente descartadas.
   ========================================================================== */

function setPixel(x, y, cor) {
  const xi = Math.round(x);
  const yi = Math.round(y);

  if (xi <= -DOMINIO || xi >= DOMINIO || yi <= -DOMINIO || yi >= DOMINIO) {
    return; // fora do domínio, descarta
  }

  const i = xi + OFFSET;
  const j = yi + OFFSET;
  pintado[i][j] = true;

  // desenha o quadrado unitário centrado em (xi, yi)
  const canto = mundoParaTela(xi - 0.5, yi + 0.5);
  ctx.fillStyle = cor;
  ctx.fillRect(canto.px, canto.py, ESCALA, ESCALA);
}
