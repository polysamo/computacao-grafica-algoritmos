/* ==========================================================================
   ALGORITMO: Projeção em perspectiva de um ponto de fuga (Etapa 3)
   Ideia: escala (x, y) de cada vértice rotacionado pelo fator d/(d+z), em
   que d é a distância do observador ao plano de projeção — quanto maior z
   (mais longe do observador), menor a escala, criando profundidade com um
   único ponto de fuga na origem. As arestas são rasterizadas com
   bresenham() a partir dos pontos projetados e arredondados.
   ========================================================================== */

function projecaoPerspectiva(anguloX, anguloY, d, cor) {
  const pontos2D = CUBO_VERTICES.map(function (v) {
    const r = rotacionarVertice(v, anguloX, anguloY);
    // fator d/(d+z): vértices com z maior (mais distantes do observador,
    // que fica em z = -d) encolhem mais — é essa razão, não uma subtração
    // fixa, que faz as arestas convergirem para o ponto de fuga na origem
    const x = (r.x * d) / (d + r.z);
    const y = (r.y * d) / (d + r.z);
    return { x: Math.round(x), y: Math.round(y) };
  });

  desenharArestasCubo(pontos2D, cor);
}
