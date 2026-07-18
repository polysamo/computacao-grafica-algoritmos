/* ==========================================================================
   CUBO 3D — dados e utilidades compartilhados pelas projeções (Etapa 3)
   Define os 8 vértices e as 12 arestas de um cubo fixo, a rotação em torno
   dos eixos X e Y (aplicada antes de qualquer projeção) e a rotina comum
   que rasteriza as 12 arestas já projetadas em 2D com bresenham(). As três
   projeções (ortogonal, oblíqua, perspectiva) só diferem em como reduzem
   (x, y, z) rotacionado para (x, y) — o resto é compartilhado daqui.
   ========================================================================== */

const CUBO_VERTICES = [
  { x: -5, y: -5, z: -5 }, // 0
  { x:  5, y: -5, z: -5 }, // 1
  { x:  5, y:  5, z: -5 }, // 2
  { x: -5, y:  5, z: -5 }, // 3
  { x: -5, y: -5, z:  5 }, // 4
  { x:  5, y: -5, z:  5 }, // 5
  { x:  5, y:  5, z:  5 }, // 6
  { x: -5, y:  5, z:  5 }  // 7
];

const CUBO_ARESTAS = [
  [0, 1], [1, 2], [2, 3], [3, 0], // face de trás (z = -5)
  [4, 5], [5, 6], [6, 7], [7, 4], // face da frente (z = 5)
  [0, 4], [1, 5], [2, 6], [3, 7]  // arestas que ligam as duas faces
];

// Rotaciona um vértice em torno do eixo X e, em seguida, do eixo Y (graus).
function rotacionarVertice(v, anguloXGraus, anguloYGraus) {
  const radX = anguloXGraus * Math.PI / 180;
  const radY = anguloYGraus * Math.PI / 180;

  // rotação em X: gira o par (y, z) em torno do eixo x, que fica parado;
  // é a mesma rotação 2D de sempre, só que aplicada ao plano yz
  const y1 = v.y * Math.cos(radX) - v.z * Math.sin(radX);
  const z1 = v.y * Math.sin(radX) + v.z * Math.cos(radX);
  const x1 = v.x;

  // rotação em Y: gira o par (x, z) já rotacionado em torno do eixo y;
  // usa x1/z1 (saída do passo anterior), não os valores originais de v —
  // as duas rotações são aplicadas em sequência, não simultaneamente
  const x2 = x1 * Math.cos(radY) + z1 * Math.sin(radY);
  const z2 = -x1 * Math.sin(radY) + z1 * Math.cos(radY);
  const y2 = y1;

  return { x: x2, y: y2, z: z2 };
}

// Recebe os 8 pontos 2D já projetados e arredondados (na mesma ordem de
// CUBO_VERTICES) e rasteriza as 12 arestas com bresenham(), destacando os
// vértices projetados por cima.
function desenharArestasCubo(pontos2D, cor) {
  CUBO_ARESTAS.forEach(function ([i, j]) {
    bresenham(pontos2D[i].x, pontos2D[i].y, pontos2D[j].x, pontos2D[j].y, cor);
  });
  pontos2D.forEach(function (p) {
    setPixel(p.x, p.y, COR_PONTOS_CONTROLE);
  });
}
