---
published: false
layout: post
title: "Reread Computer System a programmer's perspective Chapter_1"
published: false
date: 2015-08-01 01:36:44 +0200
categories: [Reading]
published: false
tags: [Computer, System]
---
published: false

A review of rereading chapter 1.
published: false

<!--more-->
published: false

Contents of Chapter 1:
published: false

1. Information Is Bits + Context
published: false
2. Programs Are Translated by Other Programs into Different Forms
3. It Pays to Understand How Compilation Systems Work
published: false
4. Processors Read and Interpret Instructions Stored in Memory
5. Caches Matter
published: false
6. Storage Devices Form a Hierarchy
7. The Operating System Manages the Hardware
published: false
8. Systems Communicate with Other Systems Using Networks
9. Important Themes
published: false
10. Summary

published: false
In Chapter 1, the author briefly introduces what will be involved in the whole book. The core topic is **abstraction**.

published: false
Here are several points which I hadn't thought of before.

published: false
Firstly, what is information? The author tells us information is Bits + Context. Maybe this is even more important in the age of big data. While programming, context must be considered carefully.

published: false
Secondly, **all I/O devices** are regarded as **files** in modern operating systems. Obviously, it is a high abstraction and such ideas can be rather helpful for programmers.

published: false
Here are some knowledge points to review:

published: false
- There are two kinds of files: text files (consist of ASCII characters) and binary files (all other files).
- The flow of compilation (a C program example):
published: false
  - Preprocessing phase: generate another C program with the `.i` suffix
  - Compilation phase: translate to a text file with the `.s` suffix containing an **assembly language program**
published: false
  - Assembly phase: from assembly language to **machine language** (binary file with `.o` suffix)
  - Linking phase: generate executable object file linking standard libraries
published: false
- Hardware organization of a typical system:
  ![Hardware organization of a typical system](http://images.cnblogs.com/cnblogs_com/mydomain/201105/201105291545256647.png)
published: false
- Multi-level cache (Smaller → faster):
  ![An example of a memory hierarchy](http://img.blog.csdn.net/20130711103254515)
published: false
- Abstraction is provided by the OS
- Virtual memory:
published: false
  ![Process virtual address space](http://img.blog.csdn.net/20130711100004453)
- Concurrency and Parallelism:
published: false
  - Thread-Level Concurrency
  - Instruction-Level Concurrency
published: false
  - Single-Instruction, Multiple-Data (SIMD) Parallelism
- Three fundamental abstractions:
published: false
  - Files → I/O devices
  - Virtual memory → Both main memory and disks
published: false
  - Processes → the processor, main memory and I/O device

published: false
Also, the differences between concurrency and parallelism:

published: false
- **Concurrency** is a macroscopic concept: several processes can run at the same time sharing one CPU.
- **Parallelism** means several processes run via several CPUs simultaneously, each owning one CPU.
