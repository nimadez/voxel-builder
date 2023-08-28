precision mediump float;
precision mediump int;
precision mediump sampler2D;

uniform sampler2D uBuffer;
uniform float uTime;
uniform bool uPostFx;

varying vec2 vUv;

vec3 ACES(const vec3 x) { // Narkowicz 2015, ACES Filmic Tone Mapping Curve
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main()	{
    vec4 data = texelFetch(uBuffer, ivec2(gl_FragCoord), 0);
    vec3 col = data.rgb / data.a;
    
    col = ACES(col);                    // tonemapping
    col = pow(col, vec3(0.4545));       // gamma 1.0/2.2

    if (uPostFx) {
        vec2 cen = vUv - vec2(0.5);

        // grading
        col = pow(col, vec3(0.8, 0.85, 0.9));

        // film grain
        float strength = 8.0;
        float x = (vUv.x + 4.0) * (vUv.y + 4.0) * (uTime * 10.0);
        vec3 grain = vec3(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;
        col *= 1.0 - grain;

        // vignette
        col *= vec3(1) * smoothstep(1.8, 0.5, length(vUv * 2.0 - 1.0)) * 0.5 + 0.5;
    }
    
    gl_FragColor = vec4(col, 1.0);
}
