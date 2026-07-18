/* ==========================================================================
   ALGORITMO: Elipse — ponto médio, duas regiões (Etapa 5)
   Ideia: assim como o círculo, usa um critério de decisão para caminhar
   pixel a pixel, mas a elipse precisa de duas regiões porque a curvatura
   muda: a região 1 vai de x=0 até o ponto em que a inclinação da tangente
   cruza -1, e a região 2 cobre o resto até y=0. Cada ponto calculado é
   replicado nos 4 quadrantes por simetria em torno do centro (cx, cy).
   O centro não é destacado com setPixel (ao contrário dos outros
   algoritmos) de propósito: é o ponto mais natural para semear o
   preenchimento (Etapa 5), e marcá-lo deixaria essa célula ocupada.
   ========================================================================== */

function elipse(cx, cy, rx, ry, cor) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  rx = Math.round(rx);
  ry = Math.round(ry);

  const rx2 = rx * rx;
  const ry2 = ry * ry;

  let x = 0;
  let y = ry;

  plotarQuatroQuadrantes(cx, cy, x, y, cor);

  // região 1: |inclinação da tangente| < 1 — a curva é "mais horizontal",
  // então x avança sempre e o passo em y é decidido pelo critério d1
  let d1 = ry2 - rx2 * ry + 0.25 * rx2;
  let dx = 2 * ry2 * x; // derivada parcial em x do critério de decisão, atualizada incrementalmente
  let dy = 2 * rx2 * y; // idem para y — evita recalcular d1 do zero a cada passo

  while (dx < dy) { // enquanto a tangente ainda tem inclinação < 1 (região 1)
    x++;
    dx += 2 * ry2;
    if (d1 < 0) {
      // ponto médio ainda dentro da elipse: (x+1, y) já aproxima bem, y não muda
      d1 += dx + ry2;
    } else {
      // ponto médio caiu fora: (x+1, y-1) aproxima melhor, y também recua
      y--;
      dy -= 2 * rx2;
      d1 += dx - dy + ry2;
    }
    plotarQuatroQuadrantes(cx, cy, x, y, cor);
  }

  // região 2: |inclinação da tangente| >= 1 — a curva fica "mais vertical",
  // então o papel se inverte: y avança sempre e o passo em x é decidido por d2
  let d2 = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;

  while (y > 0) {
    y--;
    dy -= 2 * rx2;
    if (d2 > 0) {
      // ponto médio ainda fora da elipse (do lado de dentro da curvatura): x não muda
      d2 += rx2 - dy;
    } else {
      // ponto médio já cruzou para dentro: x também avança
      x++;
      dx += 2 * ry2;
      d2 += dx - dy + rx2;
    }
    plotarQuatroQuadrantes(cx, cy, x, y, cor);
  }
}

// Espelha um ponto (x, y) calculado nos outros 3 quadrantes, em torno do centro.
function plotarQuatroQuadrantes(cx, cy, x, y, cor) {
  setPixel(cx + x, cy + y, cor);
  setPixel(cx - x, cy + y, cor);
  setPixel(cx + x, cy - y, cor);
  setPixel(cx - x, cy - y, cor);
}
