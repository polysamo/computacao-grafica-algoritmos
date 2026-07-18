/* ==========================================================================
   ALGORITMO: Translação 2D (Etapa 4)
   Ideia: desloca cada vértice do polígono por (dx, dy) aplicando uma única
   matriz homogênea 3x3 de translação a cada ponto via aplicarMatriz() — não
   soma dx/dy diretamente às coordenadas. O polígono original é desenhado em
   cor clara e o transformado em cor forte, lado a lado para comparação.
   ========================================================================== */

function translacao(pontos, dx, dy, corOriginal, corTransformada) {
  poligono(pontos, corOriginal);

  const m = matrizTranslacao(dx, dy);
  const transformado = pontos.map(function (p) {
    return aplicarMatriz(m, p); // mesma matriz para todos os vértices, cada um transformado independentemente
  });

  poligono(transformado, corTransformada);
}
