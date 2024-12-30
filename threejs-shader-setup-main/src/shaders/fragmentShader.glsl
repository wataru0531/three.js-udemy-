
// mediump...データをどれだけ詳細に決定するか(etc...highupなどもある)
// precision mediump float;

// uniformから受け取る。
uniform vec3 uColor;

// sampler2d...画像などのテキスチャなどを用いるときの型
uniform sampler2D uTexture;

// uv...座標。飴の包み紙、物体を囲っているイメージ。

varying vec2 vUv;
varying float vElevation;

void main(){ 
  // 用意したテキスチャ(画像)をuv座標にマッピングする
  // texture2D...最初から用意された変数
  vec4 textureColor = texture2D(uTexture, vUv);

  // gl_FragColor = vec4(uColor, 1.0);

  textureColor.rgb *= vElevation * 3.0 + 0.7;

  gl_FragColor = textureColor;
}