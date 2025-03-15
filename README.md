# Voxel Builder

![screenshot](media/screenshot.png?raw=true "Screenshot")

**Voxel-based 3D Modeling Application**

**Model . Render . Export**

[https://nimadez.github.io/voxel-builder/](https://nimadez.github.io/voxel-builder/)

[Changelog](https://github.com/nimadez/voxel-builder/releases)<br>
[Installation](https://github.com/nimadez/voxel-builder#installation)<br>
[Wiki](https://github.com/nimadez/voxel-builder/wiki)<br>
[Known Issues](https://github.com/nimadez/voxel-builder#known-issues)<br>
[FAQ](https://github.com/nimadez/voxel-builder#faq)<br>
[Bug Report](https://github.com/nimadez/voxel-builder/issues)

## Features

**File I/O**
- Save and load JSON
- Import MagicaVoxel VOX
- Export to GLB, GLTF, OBJ, STL
- Local storages, snapshots, quicksave, undo

**Model and Paint**
- High performance voxel engine
- Generators *(terrain, cube, sphere, isometric...)*
- Interactive modeling toolsets
- Symmetric drawing and painting
- Color groups and voxel transforms

**Rendering**
- Three.js sandbox
- Three.js GPU path tracer
- Basic PBR rendering

**Voxelization**
- Fast BVH voxelization
- 3D model voxelizer
- Image voxelizer

**Export Meshes**
- Bake voxels to editable meshes
- Bake voxels by color groups
- Unbake exported GLB back to voxels
- glTF compatible editor

**Extensibility**
- ES modules
- WebSockets client
- User startup project
- Blender importer script

**More**
- Average startup time 300 ms *(after the first launch)*
- Unique handcrafted user-interface
- Minimum dependency, portable, online and offline
- Ad-free, no trackers, no logging, no loading screens

## Installation
Install [Electron](https://github.com/electron/electron/releases) *(recommended)*
```
electron-v*-linux-x64.zip
electron-v*-win32-x64.zip
```
Clone
```
git clone https://github.com/nimadez/voxel-builder
cd voxel-builder
```
Run
```
# Start with Electron:
electron .

# Start with Node.js:
node server.js
```
Update
```
cd voxel-builder
python3 update.py
```

## Supported Browsers
- Electron *(recommended)*
- Google Chrome
- Mozilla Firefox
> - PWA A2HS-ready *(add to home screen)*
> - For the best experience, a tablet with pen or Wacom is recommended

## Known Issues
Higher than 512K is not recommended
```
Electron is recommended for working with a large number of voxels

Higher values can have the following problems:
- Intolerable delay when starting the renderer
- Chrome tab may freeze or crash

Of course, the number of voxels is unlimited,
I have rendered up to 1 million voxels.
```
Failed to import GLB meshes for voxelization
```
Multiple meshes need to have the same properties or they won't merge,
the only solution is to merge meshes before exporting to GLB.
```
Wacom tablet crashes randomly and throws warning on Linux (GNOME)
```
Warning: BJS - Max number of touches exceeded. Ignoring touches in excess of 2.
This problem is related to Babylon.js and nothing can be done.
```
Error: Exceeded the quota
```
Browser storage is limited, use Electron for much higher capacity.
```

## FAQ
How to merge vertices after export to GLB?
```
1- Open exported GLB file in Blender
2- Go to "Modeling" tab and choose vertex selection mode
3- Select all vertices (Ctrl + A)
4- Mesh > Clean Up > Merge by Distance
```
How to run Blender importer script?
```
1- Save project to JSON
2- Open Blender and go to "Scripting" tab
3- Click "Open" and select "blender-importer.py"
4- Run the script and select a JSON file
```
How to go back to the previous version?
```
git clone https://github.com/nimadez/voxel-builder
cd voxel-builder
git log -2 (copy the hash of the previous commit)
git reset --hard $HASH
```

## History
```
↑ Unsafe WebGPU support
↑ Core initialization!
↑ Rendering was left to Three and three-gpu-pathtracer
↑ ES6 (the original index.html playground was moved)
↑ x1.5 faster startup (2s to 300ms)
↑ Migrating to Linux: Firefox ready
↑ High performance GPU picking system
↑ Voxel engine updated to thin-instances (64k to 512k)
↑ The world moved (from 0.0 to 0.5 center to avoid 0.5)
↑ Real-time GPU path tracing
↑ Introducing ES modules
↑ Advancing to the next level (bakery)
↑ Changed default handiness to right-handed coordinate
↑ New SPS particles to build the world
↑ 2019 - I wrote a playground for learning Babylon.js
```

Version 3.0.0 *(BJS 4)* to 4.2.2 *(BJS 6)*<br>
![screenshot](media/devshots.jpg?raw=true "Screenshot")

## License
Code released under the [MIT license](https://github.com/nimadez/voxel-builder/blob/main/LICENSE).

## Credits
- [Babylon.js](https://www.babylonjs.com/)
- [Three.js](https://threejs.org/)
- [Three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)
- [Three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer)
- [Electron](https://www.electronjs.org/)
- [MagicaVoxel](https://ephtracy.github.io/)
- [Google Material Icons](https://github.com/google/material-design-icons)
- [Blender](https://blender.org/)
- [Sketchfab](https://sketchfab.com/)
- [KhronosGroup](https://github.com/KhronosGroup/)
- [Shadertoy](https://www.shadertoy.com/)
- [vengi](https://vengi-voxel.github.io/vengi/)
#
- [Allen Hastings](https://www.linkedin.com/in/allenhastings)
- [David Catuhe](https://twitter.com/deltakosh)
- [Erich Loftis](https://github.com/erichlof)
- [Eric Heitz](https://eheitzresearch.wordpress.com/772-2/)
- [Evan Wallace](https://github.com/evanw)
- [Garrett Johnson](https://github.com/gkjohnson)
- [Inigo Quilez](https://www.iquilezles.org/)
- [knightcrawler25](https://github.com/knightcrawler25)
- [Mr.doob](https://mrdoob.com/)
#

###### Available in [Babylon.js community demos](https://www.babylonjs.com/community/)

<a href="https://www.babylonjs.com/"><img width="200" src="https://raw.githubusercontent.com/BabylonJS/Brand-Toolkit/master/babylonjs_identity/fullColor/babylonjs_identity_color.svg"></img></a>
<a href="https://threejs.org/"><img width="80" src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Three.js_Icon.svg"></img></a>
<a href="https://github.com/KhronosGroup/"><img width="120" src="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/glTF_RGB_June16.svg"></img></a>
