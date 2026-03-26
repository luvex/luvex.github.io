---
layout: post
title: "Experience in Alibaba Data Mining Contest"
date: 2015-04-30 00:42:44 +0200
categories: ["Academic English"]
tags: [Journal]
---

Journal For Class: English Learning Skills in Academic Contexts

<!--more-->

This month, I participated in a data mining contest held by Alibaba Corp. During the contest, I learned a lot about algorithms and models. So I'd like to write down the experience and make a summary.

The theme of the competition is recommending products or services to consumers based on user behavior data produced on mobile devices. There are two datasets offered by Alibaba Corp. One is a subset of goods, and the other is the behavior data of 10,000 consumers over a month including "Double 12" — a promotion day. The final goal is to predict which goods a specific consumer will buy on the day following the month. The evaluation standard is the F1 score: `2 * precision * recall / (precision + recall)`.

At first, I looked over the dataset and tried to find patterns or outliers. I realized that the geography data was incomplete — possibly caused by consumers' network environment. So I was careful about using it in my model. I chose logistic regression as a practical choice and selected consumer behavior and time as features. I separated the data into 4 groups. December 12th is a special day with lots of promotion activities, so consumer behavior on that day may be irrational — I dealt with it carefully.

I tried clustering to handle the December 12th outliers by lowering their weight, but the effect was not very ideal and I had no time to explore more efficient algorithms.

It is worth mentioning that I also tried collaborative filtering in the contest. Unfortunately, the result was too imprecise because the prediction set becomes too large when trying to find similarities among so many consumers. Maybe Amazon mixes several algorithms together, or it is just difficult to get a satisfying result with only one algorithm.

There are still many algorithms I didn't have time to try. I think SVM and decision trees are both available choices for this task.

It is a pity that I didn't qualify for the second round. I am curious about the cloud computing platform developed by Alibaba Corp. I hope I can do better in next year's contest.

[Alibaba Tianchi Big Data Contest Website](http://tianchi.aliyun.com/)
