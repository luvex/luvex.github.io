---
published: false
layout: post
title: "Two knowledge points in CSharp"
published: false
date: 2015-05-22 18:21:14 +0200
categories: [CSharp]
published: false
tags: ["C#", grammer]
---
published: false

Two grammar features:
published: false
- `const` & `readonly`
- `ref` & `out`
published: false

<!--more-->
published: false

## const & readonly
published: false

`readonly` and `const` differ in an important way. A `const` field can only be initialized at the declaration. A `readonly` field can be initialized at declaration or in a constructor. Therefore, `readonly` fields can have different values depending on the constructor used. Also, while a `const` field is a compile-time constant, a `readonly` field can be used for a runtime constant:
published: false

```csharp
published: false
public static readonly uint l1 = (uint)DateTime.Now.Ticks;
```
published: false

In short: **`const`** is a *static constant*, while **`readonly`** is a *dynamic constant* that can be determined at runtime.
published: false

## ref & out
published: false

The `ref` keyword passes an argument by reference rather than by value. Any changes made to the parameter in the called method are reflected in the calling method:
published: false

The `out` keyword also passes by reference, but unlike `ref`, it does not require the variable to be initialized before being passed. Both the method definition and the call must explicitly use the `out` keyword.
published: false

```csharp
published: false
class OutExample
{
published: false
    static void Method(out int i)
    {
published: false
        i = 44;
    }
published: false

    static void Main()
published: false
    {
        int value;
published: false
        Method(out value);
        // value is now 44
published: false
    }
}
published: false
```

published: false
#### References

published: false
1. [MSDN — readonly](https://msdn.microsoft.com/zh-cn/library/acdd6hb7.aspx)
2. [MSDN — ref](http://msdn.microsoft.com/zh-cn/library/14akc2c7.aspx)
published: false
3. [MSDN — out](https://msdn.microsoft.com/zh-cn/library/t3c3bfhx.aspx)
