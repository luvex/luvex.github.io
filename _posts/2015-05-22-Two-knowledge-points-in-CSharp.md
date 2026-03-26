---
layout: post
title: "Two knowledge points in CSharp"
date: 2015-05-22 18:21:14 +0200
categories: [CSharp]
tags: ["C#", grammer]
---

Two grammar features:
- `const` & `readonly`
- `ref` & `out`

<!--more-->

## const & readonly

`readonly` and `const` differ in an important way. A `const` field can only be initialized at the declaration. A `readonly` field can be initialized at declaration or in a constructor. Therefore, `readonly` fields can have different values depending on the constructor used. Also, while a `const` field is a compile-time constant, a `readonly` field can be used for a runtime constant:

```csharp
public static readonly uint l1 = (uint)DateTime.Now.Ticks;
```

In short: **`const`** is a *static constant*, while **`readonly`** is a *dynamic constant* that can be determined at runtime.

## ref & out

The `ref` keyword passes an argument by reference rather than by value. Any changes made to the parameter in the called method are reflected in the calling method:

The `out` keyword also passes by reference, but unlike `ref`, it does not require the variable to be initialized before being passed. Both the method definition and the call must explicitly use the `out` keyword.

```csharp
class OutExample
{
    static void Method(out int i)
    {
        i = 44;
    }

    static void Main()
    {
        int value;
        Method(out value);
        // value is now 44
    }
}
```

#### References

1. [MSDN — readonly](https://msdn.microsoft.com/zh-cn/library/acdd6hb7.aspx)
2. [MSDN — ref](http://msdn.microsoft.com/zh-cn/library/14akc2c7.aspx)
3. [MSDN — out](https://msdn.microsoft.com/zh-cn/library/t3c3bfhx.aspx)
