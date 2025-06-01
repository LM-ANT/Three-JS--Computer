export const fShader = `
precision highp float;
precision highp int;

uniform vec3 color1;
uniform vec3 color2;
uniform float lineCount;
uniform float time;
uniform float speed;
uniform sampler2D screenTexture;

varying vec2 vUv;

// Paramètres CRT
const float curvature = 12.0;
const float scanlineIntensity = 0.25;
const float phosphorIntensity = 0.4;
const float vignetteIntensity = 0.3;
const float rgbShiftAmount = 0.002;
const float flickerIntensity = 0.02;

// Fonction de courbure de l'écran CRT
vec2 curve(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(curvature, curvature);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

// Fonction vignetting (assombrissement des bords)
float vignette(vec2 uv) {
    float dist = distance(uv, vec2(0.5, 0.5));
    return 1.0 - smoothstep(0.4, vignetteIntensity, dist);
}

// Fonction scanlines (lignes de balayage)
float scanlines(vec2 uv) {
    float line = sin(uv.y * 600.0) * scanlineIntensity;
    float scanline = clamp(1.0 + line, 0.7, 1.0);
    return scanline;
}

// Effet de phosphore (lueur verte subtile)
vec3 phosphor(vec3 color, vec2 uv) {
    vec3 phosphorColor = vec3(0.0, 1.0, 0.1);
    float phosphorMask = sin(uv.x * 2.0 * 3.14159) * 0.5 + 0.5;
    return mix(color, color + phosphorColor * 0.1, phosphorMask * phosphorIntensity);
}

// Distorsion RGB (séparation des couleurs)
vec3 rgbShift(sampler2D tex, vec2 uv) {
    vec2 shift = vec2(rgbShiftAmount * sin(time * 2.0), 0.0);
    float r = texture2D(tex, uv + shift).r;
    float g = texture2D(tex, uv).g;
    float b = texture2D(tex, uv - shift).b;
    return vec3(r, g, b);
}

// Effet de scintillement
float flicker(float time) {
    return 1.0 + sin(time * 30.0) * flickerIntensity + 
           sin(time * 7.3) * flickerIntensity * 0.3;
}

void main() {
    vec2 uv = vUv;
    
    // Appliquer la courbure CRT
    vec2 curvedUV = curve(uv);
    
    // Effet de lignes animées plus visible
    float p = abs(fract(lineCount * curvedUV.y + (time * speed)) * 2.0 - 1.0);
    vec3 lineEffect = mix(vec3(0.0), vec3(0.0, 0.15, 0.0), p * 0.6);
    
    // Couleur de base avec plus d'intensité
    vec3 baseColor = vec3(0.0, 0.05, 0.0);
    
    // Appliquer l'effet phosphore plus visible
    baseColor = phosphor(baseColor + lineEffect, curvedUV);
    
    // Appliquer les scanlines plus prononcées
    float scanlineEffect = scanlines(curvedUV);
    baseColor = mix(baseColor, vec3(0.0, 0.2, 0.0), (1.0 - scanlineEffect) * 0.5);
    
    // Appliquer le vignetting
    float vignetteEffect = vignette(curvedUV);
    baseColor = mix(baseColor, vec3(0.0, 0.0, 0.0), (1.0 - vignetteEffect) * 0.3);
    
    // Appliquer l'effet de scintillement
    float flickerEffect = flicker(time);
    baseColor *= flickerEffect;
    
    // Effet de lueur plus visible
    baseColor += vec3(0.0, 0.08, 0.0) * sin(time * 2.0) * 0.8;
    
    // Simuler la réflexion de l'écran
    float reflection = pow(1.0 - dot(normalize(vec3(curvedUV - 0.5, 0.3)), vec3(0.0, 0.0, 1.0)), 3.0);
    baseColor += vec3(0.1, 0.1, 0.15) * reflection * 0.4;
    
    // Opacité plus élevée pour un effet plus visible
    gl_FragColor = vec4(baseColor, 0.35);
}

`;
