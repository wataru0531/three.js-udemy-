// matrix...行列
// atribute....頂点情報
// uniform....グローバル変数(vertesShader、fragmentShaderで共通に使う変数など)
// varying...vertexShaderからfragmentShaderに変数を渡す

// カメラがどこからどこまでの領域を写しているのか
// uniform mat4 projectionMatrix;

// カメラがどこに存在するのかを決めるための行列
// uniform mat4 viewMatrix;

// シェーダーの位置を決めるための行列
// uniform mat4 modelMatrix;

// x,y,z の座標(attributeを使う)
// attribute vec3 position;

// グローバル変数を受け取る
uniform vec2 uFrequency;

uniform float uTime;

// uv...uv座標。ジオメトリの座標が入っている。
//      uv座標はvertexShaderでしか取得できない
//      デフォルトでuv座標の情報が格納されていて、vUvの変数に格納してfragmentShaderに送る
varying vec2 vUv;

varying float vElevation;

void main(){
  // シェーダーの位置を動かすにはModelMatrixを操作
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // 波を起こす。
  // このelevationををフラグメントに渡して影を付けていく
  float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;

  modelPosition.z += elevation;

  // 縦軸に縮小をかける
  // modelPosition.y *= 0.6;


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  // ブラウザは2D空間。.3D空間から2D空間に置き換えるために各行列を掛け合わせる(座標変換)
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  // vUvにはuv座標の情報を格納されている
  vUv = uv;
  vElevation = elevation;
}