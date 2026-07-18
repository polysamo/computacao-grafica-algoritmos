/* ==========================================================================
   ALGORITMO: Recorte de polígono — Sutherland-Hodgman (Etapa 5)
   Ideia: recorta a lista de vértices contra cada uma das 4 arestas da
   janela em sequência (esquerda, direita, baixo, cima); em cada passagem,
   percorre os vértices atuais e decide, aresta a aresta do polígono, se
   mantém o vértice, insere o ponto de interseção, ou descarta — o
   resultado de uma passagem vira a entrada da próxima.
   ========================================================================== */

// Recorta 'pontos' contra uma única aresta da janela: dentroFn diz se um
// ponto está do lado visível dessa aresta, interseccaoFn calcula onde o
// segmento anterior-atual cruza essa aresta.
function recortarContraAresta(pontos, dentroFn, interseccaoFn) {
  const saida = [];
  if (pontos.length === 0) return saida;

  for (let i = 0; i < pontos.length; i++) {
    const atual = pontos[i];
    const anterior = pontos[(i - 1 + pontos.length) % pontos.length];
    const atualDentro = dentroFn(atual);
    const anteriorDentro = dentroFn(anterior);

    if (atualDentro) {
      if (!anteriorDentro) {
        saida.push(interseccaoFn(anterior, atual));
      }
      saida.push(atual);
    } else if (anteriorDentro) {
      saida.push(interseccaoFn(anterior, atual));
    }
  }

  return saida;
}

function recortePoligonoSutherlandHodgman(pontos, xmin, ymin, xmax, ymax) {
  let resultado = pontos;

  resultado = recortarContraAresta(
    resultado,
    function (p) { return p.x >= xmin; },
    function (a, b) {
      const t = (xmin - a.x) / (b.x - a.x);
      return { x: xmin, y: a.y + t * (b.y - a.y) };
    }
  );

  resultado = recortarContraAresta(
    resultado,
    function (p) { return p.x <= xmax; },
    function (a, b) {
      const t = (xmax - a.x) / (b.x - a.x);
      return { x: xmax, y: a.y + t * (b.y - a.y) };
    }
  );

  resultado = recortarContraAresta(
    resultado,
    function (p) { return p.y >= ymin; },
    function (a, b) {
      const t = (ymin - a.y) / (b.y - a.y);
      return { x: a.x + t * (b.x - a.x), y: ymin };
    }
  );

  resultado = recortarContraAresta(
    resultado,
    function (p) { return p.y <= ymax; },
    function (a, b) {
      const t = (ymax - a.y) / (b.y - a.y);
      return { x: a.x + t * (b.x - a.x), y: ymax };
    }
  );

  return resultado;
}

function recorteDePoligono(pontos, xmin, ymin, xmax, ymax, corOriginal, corRecortado) {
  bresenham(xmin, ymin, xmax, ymin, COR_JANELA_RECORTE);
  bresenham(xmax, ymin, xmax, ymax, COR_JANELA_RECORTE);
  bresenham(xmax, ymax, xmin, ymax, COR_JANELA_RECORTE);
  bresenham(xmin, ymax, xmin, ymin, COR_JANELA_RECORTE);

  poligono(pontos, corOriginal);

  const recortado = recortePoligonoSutherlandHodgman(pontos, xmin, ymin, xmax, ymax);
  if (recortado.length >= 3) {
    const arredondado = recortado.map(function (p) {
      return { x: Math.round(p.x), y: Math.round(p.y) };
    });
    poligono(arredondado, corRecortado);
  }
}
