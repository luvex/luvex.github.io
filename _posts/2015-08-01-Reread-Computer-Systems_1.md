---
layout: post
title: "Reread Computer System a programmer's perspective Chapter_1"
date: 2015-08-01 01:36:44 +0200
categories: [Reading]
tags: [Computer, System]
---

A review of rereading chapter 1.

<!--more-->

Contents of Chapter 1:

1. Information Is Bits + Context
2. Programs Are Translated by Other Programs into Different Forms
3. It Pays to Understand How Compilation Systems Work
4. Processors Read and Interpret Instructions Stored in Memory
5. Caches Matter
6. Storage Devices Form a Hierarchy
7. The Operating System Manages the Hardware
8. Systems Communicate with Other Systems Using Networks
9. Important Themes
10. Summary

In Chapter 1, the author briefly introduces what will be involved in the whole book. The core topic is **abstraction**.

Here are several points which I hadn't thought of before.

Firstly, what is information? The author tells us information is Bits + Context. Maybe this is even more important in the age of big data. While programming, context must be considered carefully.

Secondly, **all I/O devices** are regarded as **files** in modern operating systems. Obviously, it is a high abstraction and such ideas can be rather helpful for programmers.

Here are some knowledge points to review:

- There are two kinds of files: text files (consist of ASCII characters) and binary files (all other files).
- The flow of compilation (a C program example):
  - Preprocessing phase: generate another C program with the `.i` suffix
  - Compilation phase: translate to a text file with the `.s` suffix containing an **assembly language program**
  - Assembly phase: from assembly language to **machine language** (binary file with `.o` suffix)
  - Linking phase: generate executable object file linking standard libraries
- Hardware organization of a typical system:
  ![Hardware organization of a typical system](http://images.cnblogs.com/cnblogs_com/mydomain/201105/201105291545256647.png)
- Multi-level cache (Smaller → faster):
  ![An example of a memory hierarchy](http://img.blog.csdn.net/20130711103254515)
- Abstraction is provided by the OS
- Virtual memory:
  ![Process virtual address space](http://img.blog.csdn.net/20130711100004453)
- Concurrency and Parallelism:
  - Thread-Level Concurrency
  - Instruction-Level Concurrency
  - Single-Instruction, Multiple-Data (SIMD) Parallelism
- Three fundamental abstractions:
  - Files → I/O devices
  - Virtual memory → Both main memory and disks
  - Processes → the processor, main memory and I/O device

Also, the differences between concurrency and parallelism:

- **Concurrency** is a macroscopic concept: several processes can run at the same time sharing one CPU.
- **Parallelism** means several processes run via several CPUs simultaneously, each owning one CPU.
