
// position...x、y、zの位置情報を持つ
//  attribute vec3 position

uniform float uWaveLength;
uniform vec2 uFrequency; // 周波数(波)
uniform float uTime;
uniform float uWaveSpeed;

varying float vElevation;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // x軸、z軸に対してそれぞれに波などをつけるためにあえてelevationをつくる
  float elevation = sin(modelPosition.x * uFrequency.x + uTime * uWaveSpeed) * uWaveLength
                  * sin(modelPosition.z * uFrequency.y + uTime * uWaveSpeed) * uWaveLength;

  // 振幅、周波数(波)
  modelPosition.y += elevation;


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  vElevation = elevation;
}