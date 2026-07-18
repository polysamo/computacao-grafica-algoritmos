/* ==========================================================================
   ALGORITMO: Polígono (Etapa 4 e base das transformações)
   Ideia: liga cada vértice ao próximo com bresenham(), como a polilinha,
   mas fecha a figura ligando o último vértice de volta ao primeiro — essa
   aresta extra é o que diferencia o polígono da polilinha. Serve tanto
   como algoritmo próprio quanto como primitiva reutilizada por translação,
   escala e rotação com pivô para desenhar geometria original/transformada.
   ========================================================================== */

function poligono(pontos, cor) {
  for (let i = 0; i < pontos.length; i++) {
    const atual = pontos[i];
    const proximo = pontos[(i + 1) % pontos.length]; // módulo faz o índice voltar a 0 no último vértice, fechando a figura
    bresenham(atual.x, atual.y, proximo.x, proximo.y, cor);
  }
}
