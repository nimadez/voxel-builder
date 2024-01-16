# Voxel Builder

![banner](https://repository-images.githubusercontent.com/565157149/8cd060fd-3126-4f46-bc15-7f8e26b975b5)

**Voxel-based 3D modeling application**

```Version 4.2.8 Beta```

[Try Now](https://nimadez.github.io/voxel-builder)<br>
[Download](https://github.com/nimadez/voxel-builder/releases/tag/installer)<br>
[Documentation](https://github.com/nimadez/voxel-builder/wiki)<br>
[Known Issues](https://github.com/nimadez/voxel-builder#known-issues)<br>
[FAQ](https://github.com/nimadez/voxel-builder#faq)

> - We have successfully upgraded to thin-instances and returned to the stable channel as of version 4.2.8
> - three-mesh-bvh has been updated to 0.7.0 and the pathtracer issue on Chrome for Android devices has been resolved.
> - The online version does not have maximum functionality, be sure to [download](https://github.com/nimadez/voxel-builder/releases/tag/installer) the Electron package.

## Features

**File I/O**
- Save and load JSON [wiki](https://github.com/nimadez/voxel-builder/wiki/File-Format)
- Import MagicaVoxel VOX
- Export to GLB, GLTF, OBJ, STL
- See [wiki](https://github.com/nimadez/voxel-builder/wiki/project)

**Voxelization**
- BVH voxelization method
- 3D model voxelizer [wiki](https://github.com/nimadez/voxel-builder/wiki/Voxelization)
- Image voxelizer [wiki](https://github.com/nimadez/voxel-builder/wiki/Voxelization)

**Model and Paint**
- Generators *(terrain, cube, isometric...)*
- Interactive modeling toolsets
- Symmetric drawing and painting
- See [wiki](https://github.com/nimadez/voxel-builder/wiki/model)

**Rendering**
- Real-time GPU path tracing [wiki](https://github.com/nimadez/voxel-builder/wiki/render)

**Export Meshes**
- Bake voxels to mesh [wiki](https://github.com/nimadez/voxel-builder/wiki/export)
- Unbake mesh to voxels

**Extensibility**
- ES modules [wiki](https://github.com/nimadez/voxel-builder/wiki/Modules)
- WebSocket client [wiki](https://github.com/nimadez/voxel-builder/wiki/WebSocket-Client)
- Startup project

**More**
- Extras [wiki](https://github.com/nimadez/voxel-builder/wiki/Extras)
- Minimum dependency, portable, online and offline
- Ad-free, no trackers, no logging

## Supported Browsers
- Electron *(recommended)*
- Google Chrome for desktop
- Google Chrome for tablet devices
> - PWA A2HS-ready *(add to home screen)*
> - Touch pen or Wacom tablet recommended for best experience
> - Voxel Builder is made for desktop and mobile, but its features have not been fully tested on mobile devices.

## Known Issues
```
:: Higher than 512K is not recommended
* If you don't manipulate a lot of voxels, you can render up to 512K+
* Electron is recommended for working with a large number of voxels
* For lag-free experience, turn off BVH Picking after 128K
* You cannot turn off BVH Picking when the Rect-Add tool is active

Higher values can have the following problems:
- Unable to quick-save baked meshes (DOMException: exceeded the quota)
- Intolerable delay when starting the real-time renderer
- Chrome tab may freeze or crash

Of course, the number of voxels is unlimited,
I have rendered up to 1 million voxels at 25 FPS.

:: Failed to import GLB meshes for voxelization
Multiple meshes need to have the same properties,
or they won't merge, the only solution is to merge meshes
before exporting to GLB.

:: Real-time renderer does not support multi-material
Postponed to future
```

## FAQ
```
:: How to merge vertices after export to GLB?
1- Open exported GLB file in Blender
2- Go to "Modeling" tab and choose vertex selection mode
3- Select all vertices (Ctrl + A)
4- Mesh > Clean Up > Merge by Distance

:: How to run Blender importer script?
1- Save project to JSON
2- Open Blender and go to "Scripting" tab
3- Click "Open" and select "blender-importer.py"
4- Run the script and select a JSON file
```

## History
```
↑ Voxel engine updated to Thin Instances (massive boost)
↑ Cut half precision (new scene)
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

Version 3.0.0 *(BJS 4)* to 4.2.2 *(BJS 6)*<br>
![screenshot](media/devshots.jpg?raw=true "Screenshot")

## License
Code released under the [MIT license](https://github.com/nimadez/voxel-builder/blob/main/LICENSE).

## Credits
- [Babylon.js](https://www.babylonjs.com/)
- [Three.js](https://threejs.org/)
- [Three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)
- [Electron](https://www.electronjs.org/)
- [MagicaVoxel](https://ephtracy.github.io/)
- [Google Material Icons](https://github.com/google/material-design-icons)
- [Blender](https://blender.org/)
- [Sketchfab](https://sketchfab.com/)
- [KhronosGroup](https://github.com/KhronosGroup/)
- [Shadertoy](https://www.shadertoy.com/)
- [vengi](https://mgerhardy.github.io/vengi/)

Thank you to those who have contributed knowledge:
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
