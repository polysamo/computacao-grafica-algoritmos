/* ==========================================================================
   CONFIGURAÇÃO GERAL DO DOMÍNIO E DA GRADE
   Script clássico (sem módulos) — compartilha escopo global com os demais
   arquivos em js/, na ordem em que são incluídos no index.html.
   ========================================================================== */

// Domínio cartesiano exibido: -11 < x < 11 e -11 < y < 11
const DOMINIO = 11;

// Deslocamento usado para indexar a matriz pintado[][] a partir de coordenadas
// de mundo negativas (ex.: mundo x = -10 vira índice 1).
const OFFSET = 11;

// Tamanho da matriz booleana de pixels pintados (com pequena margem de segurança).
const TAM_MATRIZ = 22;

// Incremento de t usado na amostragem das curvas de Bézier (~0,02 => 50 segmentos).
const PASSO_BEZIER = 0.02;

// Cores de apoio reaproveitadas por todos os algoritmos, para manter a
// mesma convenção visual em todo o app (pontos/vértices de entrada vs.
// polígono de controle das curvas).
const COR_PONTOS_CONTROLE = '#d81b60';
const COR_POLIGONO_CONTROLE = '#b0b6c0';
const COR_JANELA_RECORTE = '#00897b';

// canvas.width / (2 * DOMINIO) => pixels por unidade de mundo
let ESCALA;

const canvas = document.getElementById('canvasGrade');
const ctx = canvas.getContext('2d');

// Matriz booleana consultada pelos algoritmos de preenchimento (etapas futuras)
// em vez de ler pixels de volta do canvas.
let pintado = [];
