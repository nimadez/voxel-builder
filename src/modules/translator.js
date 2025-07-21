/* 
    Jul 2025
    @nimadez

    Translator: Translate Mesh Data
*/

import { THREE } from './three.js';
import { PositionKind, NormalKind, ColorKind, UVKind, VertexData, CreateMesh } from './babylon.js';
import { material, vMesh, builder, pool, preferences } from './core.js';
import { mergeGeometries, mergeVertices } from '../libs/addons/BufferGeometryUtils.js';


class Translator {
    constructor() {
        this.scene = undefined;
        this.mat_nul = undefined;
        this.mat_pbr = undefined;
        this.textures = [];

        this.voxels = undefined;
        this.positions = undefined;
        this.normals = undefined;
        this.uvs = undefined;
        this.colors = undefined;
        this.indices = undefined;
    }

    init() {
        this.scene = new THREE.Scene();

        this.mat_nul = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.FrontSide });
        this.mat_pbr = new THREE.MeshPhysicalMaterial({ vertexColors: true, side: THREE.FrontSide });
        
        for (const tex of material.textureMaps) {
            const t = new THREE.TextureLoader().load(tex);
            t.minFilter = THREE.NearestMipmapLinearFilter;
            t.magFilter = THREE.LinearFilter;
            this.textures.push(t);
        }
    }

    dispose() {
        this.voxels = undefined;
        this.positions = undefined;
        this.normals = undefined;
        this.uvs = undefined;
        this.colors = undefined;
        this.indices = undefined;

        this.scene.children.forEach(obj => {
            if (obj.isMesh) {
                if (obj.geometry)
                    obj.geometry.dispose();
                if (obj.material)
                    obj.material.dispose();
                if (obj.material.map)
                    obj.material.map.dispose();
            }
        });

        while (this.scene.children.length > 0)
            this.scene.remove(this.scene.children[0]);
    }

    // Babylon to Three

    convertMaterialPBR(mat, mesh) {
        mat.map = this.textures[preferences.getVoxelTextureId()];
        mat.color = new THREE.Color(
            mesh.material.albedoColor.r,
            mesh.material.albedoColor.g,
            mesh.material.albedoColor.b);
        mat.roughness = mesh.material.roughness;
        mat.metalness = mesh.material.metallic;
        mat.emissive = new THREE.Color(
            mesh.material.emissiveColor.r,
            mesh.material.emissiveColor.g,
            mesh.material.emissiveColor.b);
        mat.transparent = mesh.material.alpha < 1;
        mat.opacity = mesh.material.alpha;
        return mat;
    }

    getMeshesVoxels() {
        this.dispose();

        const meshes = new Array(builder.uniqueColors.length);
        
        for (let c = 0; c < builder.uniqueColors.length; c++) {
            
            this.voxels = builder.getVoxelsByColor(builder.uniqueColors[c]);
            this.positions = new Float32Array(vMesh.positions.length * this.voxels.length);
            this.normals = new Float32Array(vMesh.positions.length * this.voxels.length);
            this.uvs = new Float32Array(vMesh.uvs.length * this.voxels.length);
            this.colors = new Float32Array(vMesh.uvs.length * 2 * this.voxels.length);
            this.indices = new Uint32Array(vMesh.indices.length * this.voxels.length);

            for (let i = 0; i < this.voxels.length; i++) {
                const idx = this.voxels[i].idx;
                
                for (let v = 0; v < vMesh.positions.length; v += 3) {
                    this.positions[i * vMesh.positions.length + v] = builder.positions[idx * vMesh.positions.length + v];
                    this.positions[i * vMesh.positions.length + v + 1] = builder.positions[idx * vMesh.positions.length + v + 1];
                    this.positions[i * vMesh.positions.length + v + 2] = builder.positions[idx * vMesh.positions.length + v + 2];

                    this.normals[i * vMesh.normals.length + v] = -builder.normals[idx * vMesh.normals.length + v];
                    this.normals[i * vMesh.normals.length + v + 1] = -builder.normals[idx * vMesh.normals.length + v + 1];
                    this.normals[i * vMesh.normals.length + v + 2] = -builder.normals[idx * vMesh.normals.length + v + 2];
                }
                for (let v = 0; v < vMesh.uvs.length; v += 2) {
                    this.uvs[i * vMesh.uvs.length + v] = builder.uvs[idx * vMesh.uvs.length + v];
                    this.uvs[i * vMesh.uvs.length + v + 1] = builder.uvs[idx * vMesh.uvs.length + v + 1];
                    this.colors[i * vMesh.uvs.length * 2 + v * 2] = builder.colors[idx * vMesh.uvs.length * 2 + v * 2];
                    this.colors[i * vMesh.uvs.length * 2 + v * 2 + 1] = builder.colors[idx * vMesh.uvs.length * 2 + v * 2 + 1];
                    this.colors[i * vMesh.uvs.length * 2 + v * 2 + 2] = builder.colors[idx * vMesh.uvs.length * 2 + v * 2 + 2];
                    this.colors[i * vMesh.uvs.length * 2 + v * 2 + 3] = builder.colors[idx * vMesh.uvs.length * 2 + v * 2 + 3];
                }
                for (let v = 0; v < vMesh.indices.length; v++) {
                    this.indices[i * vMesh.indices.length + v] = builder.indices[i * vMesh.indices.length + v];
                }
            }

            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
            geom.setAttribute('normal', new THREE.BufferAttribute(this.normals, 3));
            geom.setAttribute('uv', new THREE.BufferAttribute(this.uvs, 2));
            geom.setAttribute('color', new THREE.BufferAttribute(this.colors, 4));
            geom.setIndex(new THREE.BufferAttribute(this.indices, 1));

            meshes[c] = new THREE.Mesh(geom, this.mat_nul.clone());
            meshes[c].name = `mesh_${c}`;

            if (builder.uniqueColors[c] === "#000000")
                meshes[c].material.name = 'emissive';

            this.scene.add(meshes[c]);
        }
        
        return meshes;
    }

    getBatchedMeshVoxels(material) {
        const batchedMesh = new THREE.BatchedMesh(
            builder.voxels.length,
            vMesh.positions.length, vMesh.indices.length,
            material.clone());
        const boxId = batchedMesh.addGeometry(new THREE.BoxGeometry(1, 1, 1));
        const mat = new THREE.Matrix4();
        const col = new THREE.Color();

        for (let i = 0; i < builder.voxels.length; i++) {
            const boxInst = batchedMesh.addInstance(boxId);
            mat.fromArray(builder.bufferMatrix, i * 16);
            batchedMesh.setMatrixAt(boxInst, mat);
            col.r = builder.bufferColors[i * 4];
            col.g = builder.bufferColors[i * 4 + 1];
            col.b = builder.bufferColors[i * 4 + 2];
            batchedMesh.setColorAt(boxInst, col);
        }

        batchedMesh.name = 'batchedMesh';
        batchedMesh.frustumCulled = true;
        batchedMesh.sortObjects = false;
        batchedMesh.perObjectFrustumCulled = true;
        batchedMesh.material.vertexColors = false;
        batchedMesh.material.side = THREE.FrontSide;
        
        return batchedMesh;
    }

    getMeshesBake() {
        this.dispose();

        const meshes = new Array(pool.meshes.length);

        for (let i = 0; i < pool.meshes.length; i++) {

            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pool.meshes[i].getVerticesData(PositionKind), 3), 3));
            geom.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(pool.meshes[i].getVerticesData(NormalKind), 3), 3));
            geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(pool.meshes[i].getVerticesData(UVKind), 2), 2));
            geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pool.meshes[i].getVerticesData(ColorKind), 4), 4));
            geom.setIndex(new THREE.BufferAttribute(new Uint32Array(pool.meshes[i].getIndices()), 1));

            geom.translate(
                pool.meshes[i].position.x,
                pool.meshes[i].position.y,
                pool.meshes[i].position.z
            );

            meshes[i] = new THREE.Mesh(geom, this.convertMaterialPBR(this.mat_pbr, pool.meshes[i]).clone());
            meshes[i].name = pool.meshes[i].name;

            this.scene.add(meshes[i]);
        }

        return meshes;
    }

    getMeshBakeSelected() {
        this.dispose();

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pool.selected.getVerticesData(PositionKind), 3), 3));
        geom.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(pool.selected.getVerticesData(NormalKind), 3), 3));
        geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(pool.selected.getVerticesData(UVKind), 2), 2));
        geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pool.selected.getVerticesData(ColorKind), 4), 4));
        geom.setIndex(new THREE.BufferAttribute(new Uint32Array(pool.selected.getIndices()), 1));

        const mesh = new THREE.Mesh(geom, this.convertMaterialPBR(this.mat_pbr, pool.selected).clone());
        mesh.name = pool.selected.name;

        this.scene.add(mesh);

        return mesh;
    }

    // Three to Babylon

    getMeshFromThree(geometries, scene) {
        let geom = mergeGeometries(geometries, false);

        if (geom) {
            if (!geom.index)
                geom = mergeVertices(geom);

            geom.computeVertexNormals();
            
            const mesh = CreateMesh('mesh', scene);
            const vertexData = VertexData();
            vertexData.positions = new Float32Array(geom.attributes.position.array);
            vertexData.normals = new Float32Array(geom.attributes.normal.array);
            if (geom.attributes.uv)
                vertexData.uvs = new Float32Array(geom.attributes.uv.array);
            if (geom.attributes.color)
                vertexData.colors = new Float32Array(geom.attributes.color.array);
            vertexData.indices = new Uint32Array(geom.index.array);
            vertexData.applyToMesh(mesh);

            geom.dispose();
            geom = null;
            return mesh;
        }

        geom = null;
        return undefined;
    }
}

export const translator = new Translator();
