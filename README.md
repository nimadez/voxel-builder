# Voxel Builder

![banner](https://repository-images.githubusercontent.com/565157149/c2f6095e-d792-4085-94aa-da5bead7c06a)

**Voxel-based 3D modeling application**

Version 4.1.4 Beta 2023<br>
Babylon.js 6.29.2 ```main engine```<br>
Three.js r158

[Try Now](https://nimadez.github.io/voxel-builder)<br>
[Documentation](https://github.com/nimadez/voxel-builder/wiki)<br>
[Changelog](https://github.com/nimadez/voxel-builder/blob/main/CHANGELOG.md)

## Features

**File I/O**
- Save and load VBX [wiki](https://github.com/nimadez/voxel-builder/wiki/VBX-Format)
- Import MagicaVoxel VOX
- Export to GLB, GLTF, OBJ, STL
- See [wiki](https://github.com/nimadez/voxel-builder/wiki/project)

**Voxelization**
- 3D model voxelizer [wiki](https://github.com/nimadez/voxel-builder/wiki/Voxelization)
- Image voxelizer [wiki](https://github.com/nimadez/voxel-builder/wiki/Voxelization)

**Model and Paint**
- Gnerators *(terrain, cube, isometric...)*
- Interactive modeling toolsets
- Symmetric drawing and painting
- See [wiki](https://github.com/nimadez/voxel-builder/wiki/model)

**Mesh Bakery**
- Bake voxel particles to mesh [wiki](https://github.com/nimadez/voxel-builder/wiki/bakery)

**Rendering**
- Real-time GPU path tracing [wiki](https://github.com/nimadez/voxel-builder/wiki/Real-Time-GPU-Path-Tracing)
- PBR rendering in sandbox [wiki](https://github.com/nimadez/voxel-builder/wiki/sandbox)

**Extensibility**
- ES modules [wiki](https://github.com/nimadez/voxel-builder/wiki/Modules)
- WebSocket client [wiki](https://github.com/nimadez/voxel-builder/wiki/WebSocket-Client)

**More**
- External applications [wiki](https://github.com/nimadez/voxel-builder/wiki/External-Apps)
- Minimum dependency, portable, online or offline
- Ad-free, no miners and trackers, no logging

## Supported Browsers
- Electron *(recommended)*
- Google Chrome for desktop
- Google Chrome for tablet devices
> - PWA A2HS-ready *(add to home screen)*
> - Touch pen or Wacom tablet recommended for best experience
> - Voxel Builder is a desktop app and its capabilities are not fully tested on mobile devices

## Known Issues
```
■ Maximum 64K voxels (64000 or 40x40x40)
Higher values can have the following problems:
- Picking issue (GPU)
- SPS rebuild delay (CPU)
- Local storage, unable to save/load/undo/redo
- Baking takes forever
- Intolerable delay when starting and stopping the pathtracer
- Slow down UI and CSS animations
- Chrome tab may freeze or crash

Of course, the number of voxels is unlimited, there are
no restrictions, so you can use this program in the future
with more powerful computers.

■ Failed to import GLB meshes for voxelization
Multiple meshes need to have the same properties,
or they won't merge, the only solution is to merge meshes
before exporting to GLB.
```

## FAQ
```
■ How to merge vertices after export to GLB?
1- Open exported GLB file in Blender
2- Go to "Modeling" tab and choose vertex selection mode
3- Select all vertices (Ctrl + A)
4- Mesh > Clean Up > Merge by Distance

■ How to run Blender importer script?
1- Save project to VBX file
2- Open Blender and go to "Scripting" tab
3- Click "Open" and select "blender-importer.py"
4- Run the script and select a VBX file
```

## History
```
↑ Real-time GPU path tracing
↑ Introducing ES modules
↑ Stable beta release
↑ Advancing to the next level (bakery)
↑ Major code rewrite (functions to classes)
↑ Features and uix overhaul
↑ New SPS particles to build the world
↑ I wrote a playground for learning Babylon.js
```

Latest<br>
![screenshot](media/screenshot.jpg?raw=true "Screenshot")

Version 3.0.0 *(BJS 4)* to 4.0.0 *(BJS 6)*<br>
![screenshot](media/devshots.jpg?raw=true "Screenshot")

## License
Code released under the [MIT license](https://github.com/nimadez/voxel-builder/blob/main/LICENSE).

## Credits
- [Babylon.js](https://www.babylonjs.com/)
- [Three.js](https://threejs.org/)
- [Three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)
- [MagicaVoxel](https://ephtracy.github.io/)
- [Electron](https://www.electronjs.org/)
- [Google Material Icons](https://github.com/google/material-design-icons)
- [Blender](https://blender.org/)
- [Sketchfab](https://sketchfab.com/)
- [KhronosGroup](https://github.com/KhronosGroup/)
- [Shadertoy](https://www.shadertoy.com/)
- [vengi](https://mgerhardy.github.io/vengi/)

- [Allen Hastings](https://www.linkedin.com/in/allenhastings)
- [Erich Loftis](https://github.com/erichlof)
- [Eric Heitz](https://eheitzresearch.wordpress.com/772-2/)
- [Evan Wallace](https://github.com/evanw)
- [Garrett Johnson](https://github.com/gkjohnson)
- [Inigo Quilez](https://www.iquilezles.org/)
- [knightcrawler25](https://github.com/knightcrawler25)
- [Mr.doob](https://mrdoob.com/)

###### Available in [Babylon.js community demos](https://www.babylonjs.com/community/)

<a href="https://www.babylonjs.com/"><img width="200" src="https://raw.githubusercontent.com/BabylonJS/Brand-Toolkit/master/babylonjs_identity/fullColor/babylonjs_identity_color.svg"></img></a>
<a href="https://threejs.org/"><img width="80" src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Three.js_Icon.svg"></img></a>
<a href="https://github.com/KhronosGroup/"><img width="120" src="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/glTF_RGB_June16.svg"></img></a>
