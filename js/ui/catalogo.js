/* ==========================================================================
   CATÁLOGO DE ALGORITMOS
   Cada entrada descreve os campos de ponto que aparecem no painel (na ordem
   em que devem ser preenchidos por clique) e a função que executa o
   algoritmo lendo esses campos. Para adicionar uma nova etapa: implemente o
   algoritmo em js/algoritmos/, inclua o <script src> correspondente em
   index.html antes deste arquivo e registre a entrada aqui.
   ========================================================================== */

const algoritmos = {
  reta: {
    nome: 'Reta (Bresenham)',
    pontos: [
      { rotulo: 'Ponto A', idX: 'ax', idY: 'ay' },
      { rotulo: 'Ponto B', idX: 'bx', idY: 'by' }
    ],
    executar: function () {
      const ax = Number(document.getElementById('ax').value);
      const ay = Number(document.getElementById('ay').value);
      const bx = Number(document.getElementById('bx').value);
      const by = Number(document.getElementById('by').value);

      const erroA = validarPonto(ax, ay);
      const erroB = validarPonto(bx, by);
      if (erroA) { mostrarErro(erroA); return; }
      if (erroB) { mostrarErro(erroB); return; }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      bresenham(ax, ay, bx, by, cor);

      // realça os pontos de entrada em uma cor distinta, por cima da reta
      setPixel(ax, ay, COR_PONTOS_CONTROLE);
      setPixel(bx, by, COR_PONTOS_CONTROLE);
    }
  },

  polilinha: {
    nome: 'Polilinha',
    pontos: [],
    entradaTexto: {
      id: 'pontosPolilinha',
      rotulo: 'Pontos (x,y; x,y; ...) — mínimo 4',
      placeholder: 'ex.: -8,-8; -3,5; 2,-6; 7,7'
    },
    executar: function () {
      const texto = document.getElementById('pontosPolilinha').value;
      const resultado = interpretarListaPontos(texto, 4);
      if (resultado.erro) { mostrarErro(resultado.erro); return; }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      polilinha(resultado.pontos, cor);
    }
  },

  bezier2: {
    nome: 'Bézier grau 2',
    pontos: [
      { rotulo: 'P0 (início)', idX: 'q0x', idY: 'q0y' },
      { rotulo: 'P1 (controle)', idX: 'q1x', idY: 'q1y' },
      { rotulo: 'P2 (fim)', idX: 'q2x', idY: 'q2y' }
    ],
    executar: function () {
      const p0 = { x: Number(document.getElementById('q0x').value), y: Number(document.getElementById('q0y').value) };
      const p1 = { x: Number(document.getElementById('q1x').value), y: Number(document.getElementById('q1y').value) };
      const p2 = { x: Number(document.getElementById('q2x').value), y: Number(document.getElementById('q2y').value) };

      const erro = validarPonto(p0.x, p0.y) || validarPonto(p1.x, p1.y) || validarPonto(p2.x, p2.y);
      if (erro) { mostrarErro(erro); return; }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      bezierQuadratica(p0, p1, p2, cor);
    }
  },

  bezier3: {
    nome: 'Bézier grau 3',
    pontos: [
      { rotulo: 'P0 (início)', idX: 'c0x', idY: 'c0y' },
      { rotulo: 'P1 (controle)', idX: 'c1x', idY: 'c1y' },
      { rotulo: 'P2 (controle)', idX: 'c2x', idY: 'c2y' },
      { rotulo: 'P3 (fim)', idX: 'c3x', idY: 'c3y' }
    ],
    executar: function () {
      const p0 = { x: Number(document.getElementById('c0x').value), y: Number(document.getElementById('c0y').value) };
      const p1 = { x: Number(document.getElementById('c1x').value), y: Number(document.getElementById('c1y').value) };
      const p2 = { x: Number(document.getElementById('c2x').value), y: Number(document.getElementById('c2y').value) };
      const p3 = { x: Number(document.getElementById('c3x').value), y: Number(document.getElementById('c3y').value) };

      const erro = validarPonto(p0.x, p0.y) || validarPonto(p1.x, p1.y) ||
                   validarPonto(p2.x, p2.y) || validarPonto(p3.x, p3.y);
      if (erro) { mostrarErro(erro); return; }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      bezierCubica(p0, p1, p2, p3, cor);
    }
  },

  projOrtogonal: {
    nome: 'Cubo — Projeção Ortogonal',
    pontos: [],
    autoExecutar: true,
    camposExtras: [
      { id: 'rotXOrto', tipo: 'slider', rotulo: 'Rotação X (°)', min: 0, max: 360, step: 1, valor: 25 },
      { id: 'rotYOrto', tipo: 'slider', rotulo: 'Rotação Y (°)', min: 0, max: 360, step: 1, valor: 35 }
    ],
    executar: function () {
      const rotX = Number(document.getElementById('rotXOrto').value);
      const rotY = Number(document.getElementById('rotYOrto').value);
      const cor = document.getElementById('corTraco').value;

      limparErro();
      desenharGrade();
      projecaoOrtogonal(rotX, rotY, cor);
    }
  },

  projObliqua: {
    nome: 'Cubo — Projeção Oblíqua',
    pontos: [],
    autoExecutar: true,
    camposExtras: [
      { id: 'rotXObl', tipo: 'slider', rotulo: 'Rotação X (°)', min: 0, max: 360, step: 1, valor: 25 },
      { id: 'rotYObl', tipo: 'slider', rotulo: 'Rotação Y (°)', min: 0, max: 360, step: 1, valor: 35 },
      { id: 'fatorObl', tipo: 'slider', rotulo: 'Fator (1,0 cavalier / 0,5 cabinet)', min: 0.1, max: 1, step: 0.1, valor: 1 },
      { id: 'anguloObl', tipo: 'slider', rotulo: 'Ângulo de projeção (°)', min: 0, max: 90, step: 1, valor: 45 }
    ],
    executar: function () {
      const rotX = Number(document.getElementById('rotXObl').value);
      const rotY = Number(document.getElementById('rotYObl').value);
      const fator = Number(document.getElementById('fatorObl').value);
      const angulo = Number(document.getElementById('anguloObl').value);
      const cor = document.getElementById('corTraco').value;

      limparErro();
      desenharGrade();
      projecaoObliqua(rotX, rotY, fator, angulo, cor);
    }
  },

  projPerspectiva: {
    nome: 'Cubo — Projeção Perspectiva',
    pontos: [],
    autoExecutar: true,
    camposExtras: [
      { id: 'rotXPer', tipo: 'slider', rotulo: 'Rotação X (°)', min: 0, max: 360, step: 1, valor: 25 },
      { id: 'rotYPer', tipo: 'slider', rotulo: 'Rotação Y (°)', min: 0, max: 360, step: 1, valor: 35 },
      { id: 'distanciaD', tipo: 'slider', rotulo: 'Distância d do observador', min: 10, max: 40, step: 1, valor: 10 }
    ],
    executar: function () {
      const rotX = Number(document.getElementById('rotXPer').value);
      const rotY = Number(document.getElementById('rotYPer').value);
      const d = Number(document.getElementById('distanciaD').value);
      const cor = document.getElementById('corTraco').value;

      limparErro();
      desenharGrade();
      projecaoPerspectiva(rotX, rotY, d, cor);
    }
  },

  poligono: {
    nome: 'Polígono',
    pontos: [],
    entradaTexto: {
      id: 'pontosPoligono',
      rotulo: 'Vértices (x,y; x,y; ...) — mínimo 3',
      placeholder: 'ex.: -6,-6; 6,-6; 6,6; -6,6'
    },
    executar: function () {
      const texto = document.getElementById('pontosPoligono').value;
      const resultado = interpretarListaPontos(texto, 3);
      if (resultado.erro) { mostrarErro(resultado.erro); return; }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      poligono(resultado.pontos, cor);
      resultado.pontos.forEach(function (p) {
        setPixel(p.x, p.y, COR_PONTOS_CONTROLE);
      });
    }
  },

  translacao: {
    nome: 'Transformação — Translação',
    pontos: [],
    entradaTexto: {
      id: 'pontosTranslacao',
      rotulo: 'Vértices do polígono (x,y; x,y; ...) — mínimo 3',
      placeholder: 'ex.: -8,-8; -4,-8; -4,-4; -8,-4'
    },
    camposExtras: [
      { id: 'transDx', rotulo: 'dx', min: -20, max: 20, step: 1, valor: 6 },
      { id: 'transDy', rotulo: 'dy', min: -20, max: 20, step: 1, valor: 6 }
    ],
    executar: function () {
      const texto = document.getElementById('pontosTranslacao').value;
      const resultado = interpretarListaPontos(texto, 3);
      if (resultado.erro) { mostrarErro(resultado.erro); return; }

      const dx = Number(document.getElementById('transDx').value);
      const dy = Number(document.getElementById('transDy').value);

      limparErro();
      const cor = document.getElementById('corTraco').value;
      translacao(resultado.pontos, dx, dy, COR_POLIGONO_CONTROLE, cor);
    }
  },

  escala: {
    nome: 'Transformação — Escala',
    pontos: [],
    entradaTexto: {
      id: 'pontosEscala',
      rotulo: 'Vértices do polígono (x,y; x,y; ...) — mínimo 3',
      placeholder: 'ex.: -8,-8; -4,-8; -4,-4; -8,-4'
    },
    camposExtras: [
      { id: 'escalaSx', rotulo: 'sx', min: 0.1, max: 3, step: 0.1, valor: 1.5 },
      { id: 'escalaSy', rotulo: 'sy', min: 0.1, max: 3, step: 0.1, valor: 1.5 },
      { id: 'escalaFixoX', rotulo: 'Ponto fixo — x', min: -10, max: 10, step: 1, valor: -8 },
      { id: 'escalaFixoY', rotulo: 'Ponto fixo — y', min: -10, max: 10, step: 1, valor: -8 }
    ],
    executar: function () {
      const texto = document.getElementById('pontosEscala').value;
      const resultado = interpretarListaPontos(texto, 3);
      if (resultado.erro) { mostrarErro(resultado.erro); return; }

      const sx = Number(document.getElementById('escalaSx').value);
      const sy = Number(document.getElementById('escalaSy').value);
      const fixoX = Number(document.getElementById('escalaFixoX').value);
      const fixoY = Number(document.getElementById('escalaFixoY').value);

      limparErro();
      const cor = document.getElementById('corTraco').value;
      escala(resultado.pontos, sx, sy, fixoX, fixoY, COR_POLIGONO_CONTROLE, cor);
    }
  },

  rotacaoPivo: {
    nome: 'Transformação — Rotação com pivô',
    pontos: [],
    entradaTexto: {
      id: 'pontosRotacao',
      rotulo: 'Vértices do polígono (x,y; x,y; ...) — mínimo 3',
      placeholder: 'ex.: -8,-8; -4,-8; -4,-4; -8,-4'
    },
    camposExtras: [
      { id: 'rotacaoAngulo', rotulo: 'Ângulo (°, negativo = horário)', min: -180, max: 180, step: 1, valor: 45 },
      { id: 'rotacaoPivoX', rotulo: 'Pivô — x', min: -10, max: 10, step: 1, valor: -8 },
      { id: 'rotacaoPivoY', rotulo: 'Pivô — y', min: -10, max: 10, step: 1, valor: -8 }
    ],
    executar: function () {
      const texto = document.getElementById('pontosRotacao').value;
      const resultado = interpretarListaPontos(texto, 3);
      if (resultado.erro) { mostrarErro(resultado.erro); return; }

      const angulo = Number(document.getElementById('rotacaoAngulo').value);
      const pivoX = Number(document.getElementById('rotacaoPivoX').value);
      const pivoY = Number(document.getElementById('rotacaoPivoY').value);

      limparErro();
      const cor = document.getElementById('corTraco').value;
      rotacaoPivo(resultado.pontos, angulo, pivoX, pivoY, COR_POLIGONO_CONTROLE, cor);
    }
  },

  circulo: {
    nome: 'Círculo (ponto médio)',
    pontos: [
      { rotulo: 'Centro', idX: 'ccx', idY: 'ccy' }
    ],
    camposExtras: [
      { id: 'raio', rotulo: 'Raio', min: 1, max: 15, step: 1, valor: 5 }
    ],
    executar: function () {
      const cx = Number(document.getElementById('ccx').value);
      const cy = Number(document.getElementById('ccy').value);
      const raio = Number(document.getElementById('raio').value);

      const erroCentro = validarPonto(cx, cy);
      if (erroCentro) { mostrarErro(erroCentro); return; }
      if (!Number.isFinite(raio) || raio <= 0) {
        mostrarErro('O raio deve ser um número positivo.');
        return;
      }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      circunferencia(cx, cy, raio, cor);
    }
  },

  elipse: {
    nome: 'Elipse (ponto médio)',
    pontos: [
      { rotulo: 'Centro', idX: 'elcx', idY: 'elcy' }
    ],
    camposExtras: [
      { id: 'elRaioX', rotulo: 'Raio X', min: 1, max: 15, step: 1, valor: 8 },
      { id: 'elRaioY', rotulo: 'Raio Y', min: 1, max: 15, step: 1, valor: 5 }
    ],
    executar: function () {
      const cx = Number(document.getElementById('elcx').value);
      const cy = Number(document.getElementById('elcy').value);
      const raioX = Number(document.getElementById('elRaioX').value);
      const raioY = Number(document.getElementById('elRaioY').value);

      const erroCentro = validarPonto(cx, cy);
      if (erroCentro) { mostrarErro(erroCentro); return; }
      if (!Number.isFinite(raioX) || raioX <= 0 || !Number.isFinite(raioY) || raioY <= 0) {
        mostrarErro('Os raios X e Y devem ser números positivos.');
        return;
      }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      elipse(cx, cy, raioX, raioY, cor);
    }
  },

  recorteLinha: {
    nome: 'Recorte de Linha (Cohen-Sutherland)',
    pontos: [
      { rotulo: 'Ponto A (reta)', idX: 'clAx', idY: 'clAy' },
      { rotulo: 'Ponto B (reta)', idX: 'clBx', idY: 'clBy' }
    ],
    camposExtras: [
      { id: 'clXmin', rotulo: 'Janela — xmin', min: -10, max: 10, step: 1, valor: -5 },
      { id: 'clYmin', rotulo: 'Janela — ymin', min: -10, max: 10, step: 1, valor: -5 },
      { id: 'clXmax', rotulo: 'Janela — xmax', min: -10, max: 10, step: 1, valor: 5 },
      { id: 'clYmax', rotulo: 'Janela — ymax', min: -10, max: 10, step: 1, valor: 5 }
    ],
    executar: function () {
      const ax = Number(document.getElementById('clAx').value);
      const ay = Number(document.getElementById('clAy').value);
      const bx = Number(document.getElementById('clBx').value);
      const by = Number(document.getElementById('clBy').value);
      const xmin = Number(document.getElementById('clXmin').value);
      const ymin = Number(document.getElementById('clYmin').value);
      const xmax = Number(document.getElementById('clXmax').value);
      const ymax = Number(document.getElementById('clYmax').value);

      const erro = validarPonto(ax, ay) || validarPonto(bx, by) || validarJanela(xmin, ymin, xmax, ymax);
      if (erro) { mostrarErro(erro); return; }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      recorteDeLinha(ax, ay, bx, by, xmin, ymin, xmax, ymax, COR_POLIGONO_CONTROLE, cor);
    }
  },

  recortePoligono: {
    nome: 'Recorte de Polígono (Sutherland-Hodgman)',
    pontos: [],
    entradaTexto: {
      id: 'pontosRecortePoligono',
      rotulo: 'Vértices do polígono (x,y; x,y; ...) — mínimo 3',
      placeholder: 'ex.: -9,-2; -2,-9; 7,-3; 5,7; -3,8'
    },
    camposExtras: [
      { id: 'rpXmin', rotulo: 'Janela — xmin', min: -10, max: 10, step: 1, valor: -4 },
      { id: 'rpYmin', rotulo: 'Janela — ymin', min: -10, max: 10, step: 1, valor: -4 },
      { id: 'rpXmax', rotulo: 'Janela — xmax', min: -10, max: 10, step: 1, valor: 4 },
      { id: 'rpYmax', rotulo: 'Janela — ymax', min: -10, max: 10, step: 1, valor: 4 }
    ],
    executar: function () {
      const texto = document.getElementById('pontosRecortePoligono').value;
      const resultado = interpretarListaPontos(texto, 3);
      if (resultado.erro) { mostrarErro(resultado.erro); return; }

      const xmin = Number(document.getElementById('rpXmin').value);
      const ymin = Number(document.getElementById('rpYmin').value);
      const xmax = Number(document.getElementById('rpXmax').value);
      const ymax = Number(document.getElementById('rpYmax').value);

      const erroJanela = validarJanela(xmin, ymin, xmax, ymax);
      if (erroJanela) { mostrarErro(erroJanela); return; }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      recorteDePoligono(resultado.pontos, xmin, ymin, xmax, ymax, COR_POLIGONO_CONTROLE, cor);
    }
  },

  preenchimento: {
    nome: 'Preenchimento (flood fill)',
    pontos: [
      { rotulo: 'Semente', idX: 'semX', idY: 'semY' }
    ],
    executar: function () {
      const x = Number(document.getElementById('semX').value);
      const y = Number(document.getElementById('semY').value);

      const erro = validarPonto(x, y);
      if (erro) { mostrarErro(erro); return; }

      const xi = Math.round(x);
      const yi = Math.round(y);
      if (pintado[xi + OFFSET][yi + OFFSET]) {
        mostrarErro('A semente já está sobre uma borda ou área pintada — escolha um ponto dentro de uma região vazia.');
        return;
      }

      limparErro();
      const cor = document.getElementById('corTraco').value;
      preenchimento({ x: xi, y: yi }, cor);
    }
  }
};
