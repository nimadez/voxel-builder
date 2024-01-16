/* 
    Nov 2023
    @nimadez
*/
#define MAXSAMPLES 4096
#define RAYOFFSET 1e-5
#define EPSILON 1e-6
#define PI2 6.28318530718
#define PIDF 0.31830988618 // 1.0/PI

uniform sampler2D uBuffer;
uniform int uRenderPassId;
uniform int uBounces;
uniform int uSamples;
uniform float uAperture;
uniform float uFocalLength;
uniform sampler2D uNoise;
uniform samplerCube uCubeMap;
uniform float uEnvPower;
uniform bool uDirectLight;
uniform vec3 uLightDir;
uniform vec3 uLightCol;
uniform bool uBackground;
uniform int uMaterialId;
uniform vec3 uEmissive;
uniform float uRoughness;
uniform float uGrid;

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
    vec3 target;
    float fov;
    float aperture;
    float focalLength;
    float nearPlane;
    float farPlane;
};
Camera cam = Camera(
    vec3(0),vec3(0),vec3(0),vec3(0),vec3(0),
    0.8, 0.0, 50.0, 0.1, 1000.0
);


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

vec3 cosineDirection(vec3 n, float seed) {
    float u = hash(seed+78.2317);
    float v = hash(seed+62.8739);
    float a = 6.283185*v; // method 3
    float b = 2.0*u-1.0;  // by @fizzer
    vec3 dir = vec3(sqrt(1.0-b*b)*vec2(cos(a),sin(a)),b);
    return n + dir;
}

vec3 background(vec3 rd) { // equalized to bjs skybox
    rd.y = -rd.y;
    return pow(texture(uCubeMap, rd).rgb, vec3(0.4545));
}

vec3 ibl(vec3 rd, float k) {
    rd.y = -rd.y;
    return k * clamp(texture(uCubeMap, rd).rgb, 0.0,1.0);
}

void adaptCamera(mat4 mat) {
    cam.right   = vec3(mat[0][0], mat[0][1], mat[0][2]);
    cam.up      = vec3(mat[1][0], mat[1][1], mat[1][2]);
    cam.forward = vec3(mat[2][0], mat[2][1], mat[2][2]);
    cam.origin  = vec3(mat[3][0], mat[3][1], mat[3][2]);
    cam.aperture = uAperture;
    cam.focalLength = uFocalLength;
}

vec3 stepRayOrigin(vec3 point, vec3 offset) {
    vec3 absPoint = abs(point);
    float maxPoint = max(absPoint.x, max(absPoint.y, absPoint.z));
    return point + offset * (maxPoint + 1.0) * RAYOFFSET;
}

vec4 pathtrace(vec3 ro, vec3 rd, float seed) {
    vec3 acc = vec3(0);
    vec3 att = vec3(1);

    uvec4 faceIndices;
    vec3 faceNormal;
    vec3 barycoord;
    vec3 point;
    float side;
    float dist;

    vec3 normal;
    vec3 color;
    vec2 uv;
    //uint materialIndex;

    float rayLen = 0.0;
    float depth = -1.0;
    float line = 0.0;

    for (int b = 0; b < uBounces; b++) {

        if (!bvhIntersectFirstHit(bvh, ro, rd, faceIndices, faceNormal, barycoord, side, dist)) {
             if (b == 0) {
                acc = background(rd);
            } else {
                acc += att * ibl(rd, uEnvPower);
            }
            break;
        } else {
            point = ro + rd * dist;
            rayLen = distance(ro, point);
            
            if (abs(rayLen) < EPSILON) break;
            if (rayLen >= cam.farPlane) {
                acc = background(rd);
                break;
            }

            if (b == 0) depth = rayLen;

            //materialIndex = uTexelFetch1D(materialIndexAttribute, faceIndices.x).r;
            color = side * textureSampleBarycoord(colorAttribute, barycoord, faceIndices.xyz).xyz;
            color *= color;

            // pure black object is emissive (materialIndex == 0u)
            if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
                acc += att * uEmissive;
                break;
            }

            if (uRenderPassId > 0) {
                if (b == 0) {
                    // -1:none 0:postfx (ignore the calc)
                    if (uRenderPassId == 1) { // 1:mask
                        return vec4(1);
                    } else if (uRenderPassId == 2) { // 2:depth
                        return vec4(vec3(1.0/(depth/5.0)), 1.0);
                    } else if (uRenderPassId == 3) { // 3:color
                        return vec4(pow(color, vec3(0.4545)), 1.0);
                    }
                }
            }

            normal = side * textureSampleBarycoord(normalAttribute, barycoord, faceIndices.xyz).xyz;
            uv = side * textureSampleBarycoord(uvAttribute, barycoord, faceIndices.xyz).xy;

            color = pow(color, vec3(0.4545));

            if (b == 0 && uGrid > 0.0) {
                vec2 grid = abs(fract(uv - 0.5) - 0.5) / rayLen*cam.farPlane;
                line = 1.0 - min(min(grid.x, grid.y), 1.0);
                color = mix(color, vec3(0), line * uGrid);
            }

            ro = stepRayOrigin(point, faceNormal);
            float cseed = seed + 63.2981*float(b);

            if (uMaterialId == 1) {
                // ideal lambert
                rd = cosineDirection(normalize(normal), cseed);
                float pdf = dot(rd, normal) * PIDF;
                att *= pdf * color;
            } else if (uMaterialId == 2) {
                // ideal metallic
                rd = normalize(reflect(rd, normal)) + uniformVector(cseed) * uRoughness;
                att *= color;
            }
        }

        // roulette
        if (b >= 3) {
            float q = min(max(att.x, max(att.y, att.z)) + 0.001, 0.95);
            if (hash(seed+13.6091) > q)
                break;
            att /= q;
        }

        if (uDirectLight) {
            if (b == 0) {
                if (!bvhIntersectFirstHit(bvh, ro, uLightDir, faceIndices, faceNormal, barycoord, side, dist))
                    acc += att * uLightCol;
            }
        }
    }

    acc /= float(uBounces);

    if (!uBackground)
        return vec4(acc, min(depth, 1.0));

    return vec4(acc, 1.0);
}

void main() {
    float noise = seed+blueNoise();
    vec2 ndc = 2.0 * vUv - vec2(1);

    vec3 ro, rd;
    ndcToCameraRay(ndc, cameraWorldMatrix, invProjectionMatrix, ro, rd);
    adaptCamera(cameraWorldMatrix);

    if (cam.aperture > 0.0) {
        float camSeed1 = hash(noise+12.1476) * PI2;
        float camSeed2 = hash(noise+32.4920) * cam.aperture;
        vec3 focalPoint = normalize(rd) * cam.focalLength;
        vec3 randAperturePos = (cos(camSeed1)*cam.right + sin(camSeed1)*cam.up) * sqrt(camSeed2);
        ro = cam.origin + randAperturePos;
        rd = normalize(focalPoint - randAperturePos);
    }

    float prevWeight = float(uSamples) / float(uSamples + 1);
    float currWeight = 1.0 - prevWeight;
    vec4 col = pathtrace(ro, rd, noise) * currWeight;
    col += texelFetch(uBuffer, ivec2(gl_FragCoord), 0) * prevWeight;

    gl_FragColor = col;
}
