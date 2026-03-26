---
layout: page
title: Hints
permalink: /hints
---

## Java

- Calculate hamming distance by comparing bits: `Integer.bitCount(x ^ y)`
- Utilize `split()` to count appearance of characters, add `blank space` in the beginning and end of the `String` first
- `string.replaceAll("regular expression","")`
- Count prime numbers: [Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)

```java
public int countPrimes_1(int n)
{
    boolean[] isPrime = new boolean[n];
    for (int i = 2; i < n; i++)
        isPrime[i] = true;
    for (int i = 2; i * i < n; i++)
    {
        if (!isPrime[i])
            continue;
        for (int j = i * i; j < n; j += i)
            isPrime[j] = false;
    }
    int count = 0;
    for (int i = 0; i < n; i++)
        if (isPrime[i])
            count++;
    return count;
}
```

- Always consider boundary or overflow numbers
- When we want to log the appearance of some characters, initialize an integer array with size 256 — since each `char` maps to a number, use `char` as index and value as count:

```java
int[] chars = new int[256];
for (char c : s.toCharArray())
{
    chars[c]++;
}
```
