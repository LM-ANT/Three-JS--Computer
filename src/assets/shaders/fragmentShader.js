export const fShader =`
precision highp float;
precision highp int;

uniform vec3 color1;
uniform vec3 color2;

uniform float lineCount;
uniform float time;
uniform float speed;

varying vec2 vUv;

void main() {
    float p = abs( fract( lineCount * vUv.y + ( time * speed ) ) * 2.0 - 1.0 );
    vec3 color = mix( color1, color2, vec3( p ) );
    gl_FragColor = vec4( color, 1 );
    gl_FragColor.a = 0.2;
}

`

