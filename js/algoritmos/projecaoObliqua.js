/* ==========================================================================
   ALGORITMO: Projeção oblíqua (cavalier/cabinet) do cubo (Etapa 3)
   Ideia: soma à posição (x, y) de cada vértice rotacionado uma parcela da
   profundidade Z multiplicada por cos/sen de um ângulo — fator 1,0 dá a
   cavalier (profundidade em escala real), fator 0,5 dá a cabinet
   (profundidade reduzida à metade); fator e ângulo são configuráveis no
   painel. As arestas são rasterizadas com bresenham() a partir dos pontos
   projetados e arredondados.
   ========================================================================== */

function projecaoObliqua(anguloX, anguloY, fator, anguloObliquoGraus, cor) {
  const anguloObliquoRad = anguloObliquoGraus * Math.PI / 180;

  const pontos2D = CUBO_VERTICES.map(function (v) {
    const r = rotacionarVertice(v, anguloX, anguloY);
    // desloca (x, y) na direção do ângulo oblíquo por uma fração de z: é
    // essa parcela extra (ausente na projeção ortogonal) que dá a sensação
    // de profundidade "puxando" a face de trás na diagonal
    const x = r.x + fator * r.z * Math.cos(anguloObliquoRad);
    const y = r.y + fator * r.z * Math.sin(anguloObliquoRad);
    return { x: Math.round(x), y: Math.round(y) };
  });

  desenharArestasCubo(pontos2D, cor);
}
