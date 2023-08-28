/* 
    Nov 2023
    @nimadez
*/
#define MAXSAMPLES 4096
#define RAY_OFFSET 1e-5

uniform int uSamples;
uniform float uFov;
uniform float uAperture;
uniform float uFocalLength;
uniform int uBounces;
uniform sampler2D uBuffer;
uniform sampler2D uNoise;
uniform samplerCube uCubeMap;
uniform sampler2D uTexture;
uniform float uEnvPower;
uniform vec3 uEmissive;
uniform float uMetallic;
uniform bool uFastMode;

uniform mat4 cameraWorldMatrix;
uniform mat4 invProjectionMatrix;
uniform sampler2D normalAttribute;
uniform sampler2D colorAttribute;
uniform sampler2D uvAttribute;
uniform usampler2D materialIndexAttribute;
uniform BVH bvh;
uniform float seed;

varying vec2 vUv;


struct Camera {
    vec3 right;
    vec3 up;
    vec3 forward;
    vec3 origin;
    float fov;
    float focalLength;
    float aperture;
    float nearPlane;
    float farPlane;
};
Camera cam = Camera(
    vec3(0),vec3(0),vec3(0),vec3(0),
    1.0, 100.0, 0.0, 0.01, 1000.0
);

struct HitResult {
    uvec4 faceIndices;
    vec3 faceNormal;
    vec3 barycoord;
    vec3 outPoint;
    float side;
    float dist;
};


// TODO: this hash is not robust for unbiased rendering
float hash(float s) { return fract(sin(s)*43758.5453); }

float blueNoise() {
    return fract(texelFetch(uNoise,
        ivec2(gl_FragCoord.xy)/1%ivec2(256.0), 0).r +
            float(uSamples%MAXSAMPLES)*1.61803398874989484820459); // Φ golden ratio
}

vec3 uniformVector(float seed) {
    float a = 3.141593*hash(seed+56.1284);
    float b = 6.283185*hash(seed+14.8363);
    return vec3(sin(b)*sin(a), cos(b)*sin(a), cos(a));
}

vec3 cosineHemisphere(vec3 n, float seed) {
    float u = hash(seed+78.2317);
    float v = hash(seed+62.8739);
    float a = 6.283185*v; // method 3
    float b = 2.0*u-1.0;  // by @fizzer
    vec3 dir = vec3(sqrt(1.0-b*b)*vec2(cos(a),sin(a)),b);
    return n + dir;
}
//vec3 cosineHemisphere(vec3 n, float seed) {
//    return uniformVector(seed) + n; // to compare results
//}

vec3 background(vec3 rd, float k) { // equalize to babylon.js skybox
    return k * pow(texture(uCubeMap, vec3(rd.x, -rd.y, rd.z)).rgb, vec3(0.7));
}

vec3 imageBasedLighting(vec3 rd, float k) {
    return k * texture(uCubeMap, vec3(rd.x, -rd.y, rd.z)).rgb;
}

void adaptCamera(mat4 mat) {
    cam.right   = vec3(mat[0][0], mat[0][1], mat[0][2]);
    cam.up      = vec3(mat[1][0], mat[1][1], mat[1][2]);
    cam.forward = vec3(mat[2][0], mat[2][1], mat[2][2]);
    cam.origin  = vec3(mat[3][0], mat[3][1], mat[3][2]);
    cam.fov     = uFov;
    cam.aperture = uAperture;
    cam.focalLength = uFocalLength;
}

vec4 pathtrace(vec3 ro, vec3 rd, float seed) {
    vec3 acc = vec3(0); // accumulation
    vec3 att = vec3(1); // attenuation

    HitResult hit;
    float firstDepth;

    for (int b = 0; b < uBounces; b++) {

        if (bvhIntersectFirstHit(bvh, ro, rd, hit.faceIndices, hit.faceNormal, hit.barycoord, hit.side, hit.dist)) {
            if (b == 0) {
                firstDepth = hit.dist;

                if (hit.dist > cam.farPlane * 10.0) {
                    acc = background(rd, 1.0);
                    break;
                }
            }

            uint materialIndex = uTexelFetch1D(materialIndexAttribute, hit.faceIndices.x).r;
            vec3 color = hit.side * textureSampleBarycoord(colorAttribute, hit.barycoord, hit.faceIndices.xyz).xyz;

            // pure black object is emissive (materialIndex == 0u)
            if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
                float k = 15.0 * 15.0;
                acc += att * uEmissive * k;
                break;
            }

            vec3 point = ro + rd * hit.dist;
            vec3 absPoint = abs(point);
            float maxPoint = max(absPoint.x, max(absPoint.y, absPoint.z));
            ro = point + hit.faceNormal * (maxPoint + 1.0) * RAY_OFFSET;

            vec3 normal = hit.side * textureSampleBarycoord(normalAttribute, hit.barycoord, hit.faceIndices.xyz).xyz;
            vec2 uv = hit.side * textureSampleBarycoord(uvAttribute, hit.barycoord, hit.faceIndices.xyz).xy;
            color *= color;

            float cseed = seed + 63.2981*float(b);

            if (materialIndex == 1u) {
                // ideal lambert
                rd = normalize(cosineHemisphere(normal * hash(cseed+68.4523), cseed));
                float pdf = dot(normal, rd) * (1.0 / PI);
                att *= pdf * (color + texture2D(uTexture, uv).rgb);
            } else if (materialIndex == 2u) {
                // ideal metallic
                float g = clamp(1.0-uMetallic, 0.0,1.0);
                g = g * g;
                rd = normalize(reflect(rd, normal)) + uniformVector(cseed) * g;
                att *= color + texture2D(uTexture, uv).rgb;
            }
            
            if (uFastMode) rd *= 2.0; // pseudo flush rays

        } else {
            if (b == 0) {
                acc = background(rd, 1.0);
            } else {
                acc += att * imageBasedLighting(rd, uEnvPower);
            }
            break;
        }

        // roulette
        if (b >= 3) {
            float q = min(max(att.x, max(att.y, att.z)) + 0.001, 0.95);
            if (hash(seed+13.6091) > q)
                break;
            att /= q;
        }
    }

    acc /= float(uBounces);
    return vec4(acc, 1.0);
}

void main() {
    float noise = seed+blueNoise();
    vec3 ro, rd;
    vec4 col;

    //vec2 ofAA = vec2(s1, s2) - 0.5; // using CPU for AA jitter
    vec2 ndc = 2.0 * vUv - vec2(1.0);

    ndcToCameraRay(ndc, cameraWorldMatrix, invProjectionMatrix, ro, rd);
    adaptCamera(cameraWorldMatrix);

    vec3 randAperturePos = vec3(0);
    vec3 rdOF = rd;
    if (cam.aperture > 0.0) {
        vec3 focalPoint = cam.focalLength * rd;
        float camSeed1 = hash(noise+12.1476) * PI2;
        float camSeed2 = hash(noise+32.4920) * cam.aperture;
        randAperturePos = (cos(camSeed1)*cam.right + sin(camSeed1)*cam.up) * sqrt(camSeed2);
        rdOF = normalize(focalPoint - randAperturePos);
    }

    float prevWeight = float(uSamples) / float(uSamples + 1);
    float currWeight = 1.0 - prevWeight;
    col = pathtrace(ro + randAperturePos, rdOF, noise) * currWeight;
    col += texelFetch(uBuffer, ivec2(gl_FragCoord), 0) * prevWeight;
    if (uSamples == 0)
        col *= 0.1;

    gl_FragColor = col;
}
