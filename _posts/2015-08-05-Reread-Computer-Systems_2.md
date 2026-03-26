---
layout: post
title: "Reread Computer System a programmer's perspective Chapter_2"
date: 2015-08-05 20:36:44 +0200
categories: [Reading]
tags: [Computer, System]
---

A review of rereading chapter 2 — Representing and Manipulating Information.

<!--more-->

Contents of Chapter 2:

1. Information Storage
2. Integer Representations
3. Integer Arithmetic
4. Floating Point
5. Summary

## Information Storage

- Transfer among Binary, Decimal & Hexadecimal
- Every computer has a **word size** (representing virtual address — 32bit/64bit)
- Big endian or Little endian (should be noticed when data are communicated over a network)
- Swapping values in place:

```c
void inplace_swap(int *x, int *y)
{
    *y = *x ^ *y;
    *x = *x ^ *y;
    *y = *x ^ *y;
}
// For an array with odd length, be careful with the middle element —
// it could be set to 0 under such swapping
```

- Boolean Algebra: `&` `|` `~` `^`
- Logical Operations: `!` `&&` `||`
- Shift Operations: `<<` `>>` ([difference between logical & arithmetic operations](http://blog.sina.com.cn/s/blog_944790400101bsi8.html))
- In this part, it mainly talks about bit-level calculation.

## Integer Representations

## Integer Arithmetic

## Floating Point

## Summary
