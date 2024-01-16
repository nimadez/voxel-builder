/* 
    Nov 2023
    @nimadez
*/
uniform sampler2D uBuffer;
uniform int uRenderPassId;

varying vec2 vUv;

// Narkowicz 2015, ACES Filmic Tone Mapping Curve
vec3 ACES(const vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main()	{
    vec4 data = texelFetch(uBuffer, ivec2(gl_FragCoord), 0);
    vec3 col = data.rgb;
    
    // tonemapping
    col = ACES(col);

    // grading
    if (uRenderPassId == 0) {
        col = pow(col, vec3(0.8, 0.85, 0.9));
    }

    // gamma 1.0/2.2
    col = pow(col, vec3(0.4545));

    if (uRenderPassId == 0) {
        // film grain
        float strength = 5.0;
        float x = (vUv.x + 4.0) * (vUv.y + 4.0) * 10.0;
        vec3 grain = vec3(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;
        col *= 1.0 - grain;

        // vignette
        col *= vec3(1) * smoothstep(2.0, 0.5, length(vUv * 2.0 - 1.0)) * 0.5 + 0.5;
    }
    
    gl_FragColor = vec4(col, data.a);
}
