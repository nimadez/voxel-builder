/* 
    Nov 2023
    @nimadez
*/
#define MAXSAMPLES 4096
#define RAY_OFFSET 1e-5
#define PIDF 0.31830988618 // (1.0 / PI)
#define sunCol vec3(2.7, 2.4, 1.2) // 3.0 * vec3(0.9, 0.8, 0.4)

uniform sampler2D uBuffer;
uniform int uRenderPassId;
uniform int uBounces;
uniform int uSamples;
uniform vec2 uResolution;
uniform float uAperture;
uniform float uFocalLength;
uniform sampler2D uNoise;
uniform samplerCube uCubeMap;
uniform sampler2D uTexture;
uniform float uEnvPower;
uniform bool uSunLight;
uniform vec3 uSunDir;
uniform bool uBackground;
uniform int uMaterialId;
uniform vec3 uEmissive;
uniform float uRoughness;
uniform bool uFastMode;

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
    1.0, 0.0, 50.0, 0.01, 1000.0
);

struct Ray {
    vec3 org;
    vec3 dir;
    float len;
};

struct HitResult {
    uvec4 faceIndices;
    vec3 faceNormal;
    vec3 barycoord;
    vec3 point;
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
    //cam.target  = normalize(cam.origin - cam.forward);
    //cam.fov     = 2.0 * atan(invProjectionMatrix[1][1]) * 180.0 / PI;
    cam.aperture = uAperture;
    cam.focalLength = uFocalLength;
}

vec3 stepRayOrigin(vec3 point, vec3 offset) {
    vec3 absPoint = abs(point);
    float maxPoint = max(absPoint.x, max(absPoint.y, absPoint.z));
    return point + offset * (maxPoint + 1.0) * RAY_OFFSET;
}

vec4 pathtrace(Ray ray, float seed) {
    vec3 acc = vec3(0); // accumulation
    vec3 att = vec3(1); // attenuation

    HitResult hit;

    vec3 normal;
    vec3 color;
    vec2 uv;
    //uint materialIndex;

    float depth = -1.0;

    for (int b = 0; b < uBounces; b++) {

        if (!bvhIntersectFirstHit(bvh, ray.org, ray.dir, hit.faceIndices, hit.faceNormal, hit.barycoord, hit.side, hit.dist)) {
             if (b == 0) {
                acc = background(ray.dir);
            } else {
                acc += att * ibl(ray.dir, uEnvPower);
            }
            break;
        } else {
            hit.point = ray.org + ray.dir * hit.dist;
            ray.len = distance(ray.org, hit.point);
            if (abs(ray.len) < EPSILON) break;

            if (b == 0) depth = ray.len;

            if (ray.len >= cam.farPlane) {
                acc = background(ray.dir);
                break;
            }

            //materialIndex = uTexelFetch1D(materialIndexAttribute, hit.faceIndices.x).r;
            color = hit.side * textureSampleBarycoord(colorAttribute, hit.barycoord, hit.faceIndices.xyz).xyz;
            color *= color;

            // pure black object is emissive (materialIndex == 0u)
            if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
                acc += att * uEmissive;
                break;
            }

            if (b == 0) {
                if (uRenderPassId > 0) {
                    // -1:none 0:postfx (ignore the calc)
                    if (uRenderPassId == 1) { // mask
                        return vec4(1);
                    } else if (uRenderPassId == 2) { // depth
                        return vec4(vec3(1), depth / float(uBounces));
                    } else if (uRenderPassId == 3) { // color
                        return vec4(color / float(uBounces), 1.0);
                    }
                }
            }

            normal = hit.side * textureSampleBarycoord(normalAttribute, hit.barycoord, hit.faceIndices.xyz).xyz;
            uv = hit.side * textureSampleBarycoord(uvAttribute, hit.barycoord, hit.faceIndices.xyz).xy;

            ray.org = stepRayOrigin(hit.point, hit.faceNormal);
            color += texture2D(uTexture, uv).rgb;

            if (uSunLight && b == 0) {
                float diffuse = max(0.0, dot(uSunDir, normalize(normal)));
                float shadow = 1.0;
                if (bvhIntersectFirstHit(bvh, ray.org, uSunDir, hit.faceIndices, hit.faceNormal, hit.barycoord, hit.side, hit.dist))
                    shadow = 0.0;
                att *= color;
                acc += att * sunCol * diffuse * shadow;
            }

            float cseed = seed + 63.2981*float(b);

            if (uMaterialId == 1) {
                // ideal lambert
                ray.dir = cosineDirection(normalize(normal), cseed);
                float pdf = dot(ray.dir, normal) * PIDF;
                att *= pdf * color;
            } else if (uMaterialId == 2) {
                // ideal metallic
                ray.dir = normalize(reflect(ray.dir, normal)) + uniformVector(cseed) * uRoughness;
                att *= color;
            } else if (uMaterialId == 3) {
                // TODO
            }
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

    if (!uBackground)
        return vec4(acc, min(depth, 1.0));

    return vec4(acc, 1.0);
}

void main() {
    float noise = seed+blueNoise();
    Ray ray;

    //vec2 ofAA = vec2(seed1, seed2) - 0.5; // using CPU for AA jitter
    //vec2 ndc = 2.0 * (gl_FragCoord.xy+ofAA)/uResolution.xy - vec2(1);
    vec2 ndc = 2.0 * vUv - vec2(1);

    ndcToCameraRay(ndc, cameraWorldMatrix, invProjectionMatrix, ray.org, ray.dir);
    adaptCamera(cameraWorldMatrix);

    if (cam.aperture > 0.0) {
        float camSeed1 = hash(noise+12.1476) * PI2;
        float camSeed2 = hash(noise+32.4920) * cam.aperture;
        vec3 focalPoint = normalize(ray.dir) * cam.focalLength;
        vec3 randAperturePos = (cos(camSeed1)*cam.right + sin(camSeed1)*cam.up) * sqrt(camSeed2);
        ray.org = cam.origin + randAperturePos;
        ray.dir = normalize(focalPoint - randAperturePos);
    }

    float prevWeight = float(uSamples) / float(uSamples + 1);
    float currWeight = 1.0 - prevWeight;
    vec4 col = pathtrace(ray, noise) * currWeight;
    col += texelFetch(uBuffer, ivec2(gl_FragCoord), 0) * prevWeight;
    //if (uSamples == 0) col *= 0.1;

    gl_FragColor = col;
}
