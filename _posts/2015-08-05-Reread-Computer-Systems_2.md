---
published: false
layout: post
title: "Reread Computer System a programmer's perspective Chapter_2"
published: false
date: 2015-08-05 20:36:44 +0200
categories: [Reading]
published: false
tags: [Computer, System]
---
published: false

A review of rereading chapter 2 — Representing and Manipulating Information.
published: false

<!--more-->
published: false

Contents of Chapter 2:
published: false

1. Information Storage
published: false
2. Integer Representations
3. Integer Arithmetic
published: false
4. Floating Point
5. Summary
published: false

## Information Storage
published: false

- Transfer among Binary, Decimal & Hexadecimal
published: false
- Every computer has a **word size** (representing virtual address — 32bit/64bit)
- Big endian or Little endian (should be noticed when data are communicated over a network)
published: false
- Swapping values in place:

published: false
```c
void inplace_swap(int *x, int *y)
published: false
{
    *y = *x ^ *y;
published: false
    *x = *x ^ *y;
    *y = *x ^ *y;
published: false
}
// For an array with odd length, be careful with the middle element —
published: false
// it could be set to 0 under such swapping
```
published: false

- Boolean Algebra: `&` `|` `~` `^`
published: false
- Logical Operations: `!` `&&` `||`
- Shift Operations: `<<` `>>` ([difference between logical & arithmetic operations](http://blog.sina.com.cn/s/blog_944790400101bsi8.html))
published: false
- In this part, it mainly talks about bit-level calculation.

published: false
## Integer Representations

published: false
## Integer Arithmetic

published: false
## Floating Point

published: false
## Summary
