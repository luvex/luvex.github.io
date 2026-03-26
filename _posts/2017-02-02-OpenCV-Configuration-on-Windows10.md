---
layout: post
title: "OpenCV Configuration on Windows10"
date: 2017-02-02 16:03:30 +0100
categories: [OpenCV]
tags: [OpenCV, Journal]
---

The configuration is based on Win10(64 bit), CUDA8.0, CMake 64 bit(3.6.3), TBB, OpenCV 3.1 source code, Visual Studio 2015.
(Laptop SurfaceBook, 16GB RAM, 500G SSD, i7-6600U, Nvidia GPU(1GB RAM))

<!--more-->

*I learned OpenCV under the guidance of professor [Frédéric Precioso](http://www.i3s.unice.fr/~precioso/) in [Polytech Nice-Sophia](http://www.polytechnice.fr/), Nice, France.*

Normally, it is a better choice to play with OpenCV on some development kit like [NVIDIA Jetson TK1](http://www.nvidia.com/object/jetson-tk1-embedded-dev-kit.html). But we can also try it with our own hardware for fun^-^

### Procedure 0: Prepare the tools

- OpenCV source code including [OpenCV](https://github.com/opencv/opencv/releases) and [Opencv_contrib](https://github.com/opencv/opencv_contrib/releases)
- [Nvidia CUDA 8.0](https://developer.nvidia.com/cuda-downloads)
- [CMake 3.6.3 64bit](https://cmake.org/download/) — other versions may cause errors
- [TBB](https://www.threadingbuildingblocks.org/download)
- [Visual Studio 2015 community](https://www.visualstudio.com/downloads/), install the C++ module to get the cl.exe compiler. I am using 64bit version, 32bit version should work as well.

After downloading and installing these tools and source codes, we can go to the next procedure.

### Procedure 1: Configure and generate .sln

In this part, we need to configure and generate the VS solution.

- Open CMake, and choose the source directory (OpenCV code) and destination directory (can be any path).
- Click configure, a dialog will pop up and we can choose the compiler (VS 2015 64-bit for me).

  ![cmake configure dialog](/generated/1-700by612-520617.png)

- The first configure will take some time, and it will give some errors. We need to check several options:
  - `BUILD_EXAMPLES`: sample codes
  - `OPENCV_EXTRA_MODULES_PATH`: path of `opencv_contrib` source code
  - `WITH_CUDA`
  - `WITH_TBB`: after enabling this, CMake may report include dirs not found — put the path of TBB there.

  ![cmake configuration result](/generated/2-700by550-962aee.png)

- After configuration succeeds (no red highlight or configure bugs), generate the solution. You can find `OpenCV.sln` in the destination directory.

Some hints:
1. If CMake cannot find some header files during configuration, they could be unix-like headers — find a replacement on the Internet and put them in your local compiler library.
2. If some modules continue reporting bugs, check if they are mandatory. If not, just uncheck them.

### Procedure 2: Build the source code

In this part, we compile and build the solution.

The solution should look like this (`samples` includes sample codes, `modules` includes various libs):

![VS solution structure](/generated/3-694by721-81e89b.png)

- We can build all the code together (build the `INSTALL` project under `CMakeTargets`), but this normally takes 1 hour and will produce lots of errors on first build.
- It's better to build only the modules you need one by one — fewer bugs and no useless libs.

Some hints:
1. Remove useless references and libs you can't fix, because some libs are unfinished — don't waste time on them.
2. VS2015 does not support VLA (Variable Length Array) which is supported in g++. Use `malloc()` and `free()` to rewrite those sections.

### Procedure 3: Test

I use `/sample/gpu/surface_keypoint_matcher` for the test. Build it and find the `.exe` file in `../bin/Debug/`, or set the parameters in VS to run it directly.

The result looks like this:

![keypoint matching result](/generated/4-700by540-a08fd6.png)

This is a code for matching the surface of objects in two images — try it with any other images.

##### References

- <http://www.cnblogs.com/asmer-stone/p/5530868.html>
- [Visual Studio VLA](https://msdn.microsoft.com/en-us/library/zb1574zs.aspx)
