/* ==========================================================================
   ALGORITMO: Curva de Bézier de grau 3 (Etapa 2)
   Ideia: amostra B(t) = (1-t)³P0 + 3(1-t)²t·P1 + 3(1-t)t²P2 + t³P3 em
   passos fixos de t (PASSO_BEZIER), arredonda cada ponto amostrado e liga
   os consecutivos com bresenham(), na mesma lógica da Bézier de grau 2.
   O polígono de controle (P0-P1-P2-P3) é desenhado em cor secundária e
   tracejado, só como apoio visual.
   ========================================================================== */

function bezierCubica(p0, p1, p2, p3, cor) {
  bresenham(p0.x, p0.y, p1.x, p1.y, COR_POLIGONO_CONTROLE, true);
  bresenham(p1.x, p1.y, p2.x, p2.y, COR_POLIGONO_CONTROLE, true);
  bresenham(p2.x, p2.y, p3.x, p3.y, COR_POLIGONO_CONTROLE, true);

  const passos = Math.round(1 / PASSO_BEZIER);
  let anteriorX = p0.x;
  let anteriorY = p0.y;

  for (let i = 1; i <= passos; i++) {
    const t = i * PASSO_BEZIER; // fração já percorrida da curva neste passo, de 0 a 1
    const u = 1 - t;
    // coeficientes de Bernstein (u³, 3u²t, 3ut², t³): pesos que somam 1 e
    // fazem o ponto migrar de P0 (t=0) para P3 (t=1) passando perto de P1 e P2
    const x = Math.round(
      u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x
    );
    const y = Math.round(
      u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y
    );
    bresenham(anteriorX, anteriorY, x, y, cor); // liga o ponto amostrado anterior ao atual: a curva é uma polilinha fina
    anteriorX = x;
    anteriorY = y;
  }

  setPixel(p0.x, p0.y, COR_PONTOS_CONTROLE);
  setPixel(p1.x, p1.y, COR_PONTOS_CONTROLE);
  setPixel(p2.x, p2.y, COR_PONTOS_CONTROLE);
  setPixel(p3.x, p3.y, COR_PONTOS_CONTROLE);
}
