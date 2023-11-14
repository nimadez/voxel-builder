/* 
    Nov 2023
    @nimadez
*/
#define MAXSAMPLES 4096
#define RAY_OFFSET 1e-5

uniform vec2 uResolution;
uniform int uSamples;
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
uniform int uRenderPassId;

uniform BVH bvh;
uniform sampler2D normalAttribute;
uniform sampler2D colorAttribute;
uniform sampler2D uvAttribute;
//uniform usampler2D materialIndexAttribute;

uniform mat4 cameraWorldMatrix;
uniform mat4 invProjectionMatrix;
uniform float seed;

varying vec2 vUv;


struct Camera {
    vec3 right;
    vec3 up;
    vec3 forward;
    vec3 origin;
    float fov;
    float aperture;
    float focalLength;
    float nearPlane;
    float farPlane;
};
Camera cam = Camera(
    vec3(0),vec3(0),vec3(0),vec3(0),
    1.0, 0.0, 50.0, 0.01, 1000.0
);

struct HitResult {
    uvec4 faceIndices;
    vec3 faceNormal;
    vec3 barycoord;
    vec3 outPoint;
    float side;
    float dist;
};


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
    //return uniformVector(seed) + n;
}

vec3 background(vec3 rd, float a) { // equalized to bjs skybox
    return a * pow(texture(uCubeMap, vec3(rd.x, -rd.y, rd.z)).rgb, vec3(0.7));
}

vec3 imageBasedLighting(vec3 rd, float k) {
    return k * clamp(texture(uCubeMap, vec3(rd.x, -rd.y, rd.z)).rgb, 0.0,1.0);
}

void adaptCamera(mat4 mat) {
    cam.right   = vec3(mat[0][0], mat[0][1], mat[0][2]);
    cam.up      = vec3(mat[1][0], mat[1][1], mat[1][2]);
    cam.forward = vec3(mat[2][0], mat[2][1], mat[2][2]);
    cam.origin  = vec3(mat[3][0], mat[3][1], mat[3][2]);
    //cam.fov     = 2.0 * atan(invProjectionMatrix[1][1]) * 180.0 / PI;
    cam.aperture = uAperture;
    cam.focalLength = uFocalLength;
}

vec4 pathtrace(vec3 ro, vec3 rd, float seed) {
    vec3 acc = vec3(0); // accumulation
    vec3 att = vec3(1); // attenuation

    HitResult hit;
    vec3 point;
    float totalDist;
    float firstDepth = cam.nearPlane;

    vec3 normal;
    vec3 color;
    vec2 uv;
    //uint materialIndex;

    for (int b = 0; b < uBounces; b++) {

        if (!bvhIntersectFirstHit(bvh, ro, rd, hit.faceIndices, hit.faceNormal, hit.barycoord, hit.side, hit.dist)) {
             if (b == 0) {
                acc = background(rd, 1.0);
            } else {
                acc += att * imageBasedLighting(rd, uEnvPower);
            }
            break;
        } else {
            point = ro + rd * hit.dist;
            totalDist = distance(ro, point);

            if (b == 0) firstDepth = totalDist;

            if (firstDepth >= cam.farPlane) { // far clip
                acc = background(rd, 1.0);
                break;
            }

            //materialIndex = uTexelFetch1D(materialIndexAttribute, hit.faceIndices.x).r;
            color = hit.side * textureSampleBarycoord(colorAttribute, hit.barycoord, hit.faceIndices.xyz).xyz;
            color *= color;

            if (uRenderPassId > 0) {
                // -1: none 0: post fx
                if (uRenderPassId == 1) { // mask pass
                    return vec4(1);
                } else if (uRenderPassId == 2) { // depth pass
                    firstDepth = (firstDepth >= cam.farPlane) ? 1.0 : firstDepth;
                    return vec4(vec3(1), firstDepth / float(uBounces));
                } else if (uRenderPassId == 3) { // color pass
                    return vec4(color / float(uBounces), 1.0);
                }
            }

            // pure black object is emissive (materialIndex == 0u)
            if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
                float k = 13.0 * 13.0;
                acc += att * uEmissive * k * totalDist;
                break;
            }

            normal = hit.side * textureSampleBarycoord(normalAttribute, hit.barycoord, hit.faceIndices.xyz).xyz;
            uv = hit.side * textureSampleBarycoord(uvAttribute, hit.barycoord, hit.faceIndices.xyz).xy;

            float cseed = seed + 63.2981*float(b);
            vec3 absPoint = abs(point);
            float maxPoint = max(absPoint.x, max(absPoint.y, absPoint.z));
            ro = point + hit.faceNormal * (maxPoint + 1.0) * RAY_OFFSET;

            if (uMetallic == 0.0) {
                // ideal lambert (1u)
                rd = normalize(cosineHemisphere(normal * hash(cseed+68.4523), cseed));
                float pdf = dot(rd, normal) * (1.0 / PI);
                att *= pdf * (color + texture2D(uTexture, uv).rgb);
            } else {
                // ideal metallic (2u)
                float g = clamp(1.0-uMetallic, 0.0,1.0);
                g = g * g;
                rd = normalize(reflect(rd, normal)) + uniformVector(cseed) * g;
                att *= color + texture2D(uTexture, uv).rgb;
            }
        }

        // roulette
        if (b >= 3) {
            float q = min(max(att.x, max(att.y, att.z)) + 0.001, 0.95);
            if (hash(seed+13.6091) >= q)
                break;
            att /= q;
        }
    }

    acc /= float(uBounces);
    return vec4(acc, 1.0);
}

void main() {
    float noise = seed+blueNoise();
    float seed1 = hash(noise+12.1476);
    float seed2 = hash(noise+32.4920);
    vec3 ro, rd;

    //vec2 ofAA = vec2(seed1, seed2) - 0.5; // using CPU for AA jitter
    //vec2 ndc = 2.0 * (gl_FragCoord.xy+ofAA)/uResolution.xy - vec2(1);
    vec2 ndc = 2.0 * vUv - vec2(1);

    ndcToCameraRay(ndc, cameraWorldMatrix, invProjectionMatrix, ro, rd);
    adaptCamera(cameraWorldMatrix);

    vec3 randAperturePos = vec3(0);
    vec3 rdOF = rd;
    if (cam.aperture > 0.0) {
        vec3 focalPoint = normalize(rd) * cam.focalLength;
        float camSeed1 = seed1 * PI2;
        float camSeed2 = seed2 * cam.aperture;
        randAperturePos = (cos(camSeed1)*cam.right + sin(camSeed1)*cam.up) * sqrt(camSeed2);
        rdOF = focalPoint - randAperturePos;
    }

    float prevWeight = float(uSamples) / float(uSamples + 1);
    float currWeight = 1.0 - prevWeight;
    vec4 col = pathtrace(ro + randAperturePos, rdOF, noise) * currWeight;
    col += texelFetch(uBuffer, ivec2(gl_FragCoord), 0) * prevWeight;

    gl_FragColor = col;
}
