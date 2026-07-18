/* ==========================================================================
   ALGORITMO: Projeção ortogonal do cubo (Etapa 3)
   Ideia: descarta a coordenada Z de cada vértice já rotacionado e usa só
   (x, y) como ponto 2D — é a projeção paralela mais simples, sem nenhuma
   deformação por profundidade. As 12 arestas do cubo são rasterizadas
   ligando os vértices projetados e arredondados com bresenham().
   ========================================================================== */

function projecaoOrtogonal(anguloX, anguloY, cor) {
  const pontos2D = CUBO_VERTICES.map(function (v) {
    const r = rotacionarVertice(v, anguloX, anguloY);
    return { x: Math.round(r.x), y: Math.round(r.y) };
  });

  desenharArestasCubo(pontos2D, cor);
}
