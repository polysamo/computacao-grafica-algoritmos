/* ==========================================================================
   ALGORITMO: Curva de Bézier de grau 2 (Etapa 2)
   Ideia: amostra B(t) = (1-t)²P0 + 2(1-t)t·P1 + t²P2 em passos fixos de t
   (PASSO_BEZIER), arredonda cada ponto amostrado para a grade e liga os
   pontos consecutivos com bresenham() — a curva nunca é traçada com uma
   primitiva nativa. O polígono de controle (P0-P1-P2) é desenhado em cor
   secundária e tracejado, só como apoio visual.
   ========================================================================== */

function bezierQuadratica(p0, p1, p2, cor) {
  bresenham(p0.x, p0.y, p1.x, p1.y, COR_POLIGONO_CONTROLE, true);
  bresenham(p1.x, p1.y, p2.x, p2.y, COR_POLIGONO_CONTROLE, true);

  const passos = Math.round(1 / PASSO_BEZIER);
  let anteriorX = p0.x;
  let anteriorY = p0.y;

  for (let i = 1; i <= passos; i++) {
    const t = i * PASSO_BEZIER;
    const u = 1 - t;
    const x = Math.round(u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x);
    const y = Math.round(u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y);
    bresenham(anteriorX, anteriorY, x, y, cor);
    anteriorX = x;
    anteriorY = y;
  }

  setPixel(p0.x, p0.y, COR_PONTOS_CONTROLE);
  setPixel(p1.x, p1.y, COR_PONTOS_CONTROLE);
  setPixel(p2.x, p2.y, COR_PONTOS_CONTROLE);
}
