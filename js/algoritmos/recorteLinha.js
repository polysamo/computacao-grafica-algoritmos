/* ==========================================================================
   ALGORITMO: Recorte de linha — Cohen-Sutherland (Etapa 5)
   Ideia: classifica os dois extremos da reta com um código de região de 4
   bits (esquerda/direita/baixo/cima da janela) e, enquanto a reta não está
   trivialmente dentro nem trivialmente fora, substitui o extremo fora da
   janela pela interseção com a aresta correspondente — repetindo até
   sobrar só o trecho visível (ou nada). A janela é desenhada numa cor
   própria, a reta original em cor clara e o trecho recortado em cor forte.
   ========================================================================== */

const CS_DENTRO = 0;
const CS_ESQUERDA = 1;
const CS_DIREITA = 2;
const CS_BAIXO = 4;
const CS_CIMA = 8;

function calcularCodigoRegiao(x, y, xmin, ymin, xmax, ymax) {
  let codigo = CS_DENTRO;
  if (x < xmin) codigo |= CS_ESQUERDA;
  else if (x > xmax) codigo |= CS_DIREITA;
  if (y < ymin) codigo |= CS_BAIXO;
  else if (y > ymax) codigo |= CS_CIMA;
  return codigo;
}

// Recorta a reta (x0,y0)-(x1,y1) contra a janela e devolve o segmento
// visível ({x0,y0,x1,y1}) ou null se a reta cai inteiramente fora dela.
function recorteCohenSutherland(x0, y0, x1, y1, xmin, ymin, xmax, ymax) {
  let codigo0 = calcularCodigoRegiao(x0, y0, xmin, ymin, xmax, ymax);
  let codigo1 = calcularCodigoRegiao(x1, y1, xmin, ymin, xmax, ymax);

  while (true) {
    if ((codigo0 | codigo1) === 0) {
      return { x0, y0, x1, y1 }; // OR zero: nenhum bit fora ligado em nenhum extremo — reta trivialmente dentro
    }
    if ((codigo0 & codigo1) !== 0) {
      return null; // AND diferente de zero: os dois extremos compartilham a mesma região fora — trivialmente fora
    }

    // nem trivialmente dentro nem fora: escolhe o extremo que está fora da
    // janela (sempre existe pelo menos um, pelas duas checagens acima) e
    // recorta esse extremo contra a aresta correspondente
    const codigoFora = codigo0 !== CS_DENTRO ? codigo0 : codigo1;
    let x, y;

    // a ordem de checagem (cima, baixo, direita, esquerda) é arbitrária, mas
    // precisa testar só um bit por vez — um ponto pode estar fora em dois
    // eixos ao mesmo tempo (ex.: canto), e cada iteração resolve um deles
    if (codigoFora & CS_CIMA) {
      x = x0 + (x1 - x0) * (ymax - y0) / (y1 - y0); // interseção da reta com y = ymax
      y = ymax;
    } else if (codigoFora & CS_BAIXO) {
      x = x0 + (x1 - x0) * (ymin - y0) / (y1 - y0); // interseção com y = ymin
      y = ymin;
    } else if (codigoFora & CS_DIREITA) {
      y = y0 + (y1 - y0) * (xmax - x0) / (x1 - x0); // interseção com x = xmax
      x = xmax;
    } else {
      y = y0 + (y1 - y0) * (xmin - x0) / (x1 - x0); // interseção com x = xmin
      x = xmin;
    }

    // substitui o extremo que estava fora pelo ponto de interseção e
    // recalcula o código de região dele — a reta encolhe a cada iteração
    if (codigoFora === codigo0) {
      x0 = x; y0 = y;
      codigo0 = calcularCodigoRegiao(x0, y0, xmin, ymin, xmax, ymax);
    } else {
      x1 = x; y1 = y;
      codigo1 = calcularCodigoRegiao(x1, y1, xmin, ymin, xmax, ymax);
    }
  }
}

function recorteDeLinha(x0, y0, x1, y1, xmin, ymin, xmax, ymax, corOriginal, corRecortada) {
  bresenham(xmin, ymin, xmax, ymin, COR_JANELA_RECORTE);
  bresenham(xmax, ymin, xmax, ymax, COR_JANELA_RECORTE);
  bresenham(xmax, ymax, xmin, ymax, COR_JANELA_RECORTE);
  bresenham(xmin, ymax, xmin, ymin, COR_JANELA_RECORTE);

  bresenham(x0, y0, x1, y1, corOriginal);

  const visivel = recorteCohenSutherland(x0, y0, x1, y1, xmin, ymin, xmax, ymax);
  if (visivel) {
    bresenham(visivel.x0, visivel.y0, visivel.x1, visivel.y1, corRecortada);
  }
}
