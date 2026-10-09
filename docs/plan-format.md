# 学习计划数据格式（study plan format v1）

DSH 「学习计划」插件的计划文件是**一个 JSON 文件 = 一份计划**。
存放目录：`%USERPROFILE%\.dsh\study-planner\plans\<planId>.json`
插件在首次运行时会自动写入内置默认计划 `cpp-8week.json`。

Agent（也就是对话里的 AI）要为用户「生成计划书/计划表」时，只要按下面的格式写一个 JSON 文件到该目录即可，
插件页面会立刻在下拉框里列出它。**不要手工修改 progress.json**（那是插件的打卡记录）。

## 顶层字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 计划标识，建议小写短横线，如 `cpp-8week`。必须与文件名一致。 |
| `title` | string | 是 | 计划标题，显示在页面顶部。 |
| `subject` | string | 否 | 学科，如 `C++`。 |
| `level` | string | 否 | 起点说明，如 `有基础（掌握 class 之前的语法）`。 |
| `goal` | string | 是 | 一句话目标（会显示为「学习目标」卡片）。 |
| `tools` | string | 否 | 建议环境/教材。 |
| `dailyMinutes` | number | 否 | 建议每日投入分钟数。 |
| `startDate` | string | 否 | `YYYY-MM-DD`。留空则由用户在页面上点选开始日期，页面据此推算「今天学哪一天」。 |
| `source` | object | 否 | `{ "sessionId": "...", "sessionTitle": "...", "note": "..." }`，记录计划由哪个对话生成，页面会显示「来自对话」。 |
| `weeks` | array | 是 | 周数组，每周含 `days` 数组。 |

## 周（week）

| 字段 | 类型 | 说明 |
|---|---|---|
| `week` | number | 第几周，从 1 开始。 |
| `title` | string | 本周主题。 |
| `goal` | string | 本周目标。 |
| `days` | array | 该周 7 天（建议 7 天，`kind: rest` 表示休息/机动日）。 |

## 日（day）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 全局唯一，建议 `w<周>d<天>`，如 `w3d5`。 |
| `weekday` | string | 建议星期，如 `周一`。上班族建议：周一~周五 `learn/practice`，周六 `review/project`，周日 `rest`。 |
| `title` | string | 当天主题。 |
| `minutes` | number | 当天建议分钟数（60 / 90 / 120）。 |
| `kind` | string | `learn` / `practice` / `review` / `project` / `rest` 之一。 |
| `learn` | string[] | 知识点列表（每条一句话，页面显示为要点）。 |
| `reading` | string | 教材/文档章节，如 `《C++ Primer》第 7 章 7.1 定义抽象数据类型`。 |
| `practice` | string[] | 动手任务（写代码、跑通、调试）。 |
| `exercises` | array | 课后题，见下。`rest` 日可为空数组。 |
| `checklist` | string[] | 当天完成标准（2~4 条，页面显示为可勾选项）。 |

## 课后题（exercise）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 唯一，建议 `w1d1e1`。 |
| `title` | string | 题目标题。 |
| `prompt` | string | 题目正文，可含 Markdown 代码块（用 ``` 包裹）。 |
| `hint` | string | 一条思路提示（不是答案）。 |
| `answer` | string | 参考答案：完整可编译的 C++ 代码 + 关键点说明。 |
| `difficulty` | number | 1（入门）/ 2（中等）/ 3（挑战）。 |

## 内容要求

1. 学习者**已掌握 class 之前的内容**（变量、类型、控制流、函数、数组、指针与引用基础、字符串、结构体），
   所以计划从**类与对象**开始，终点是现代 C++（含 STL、模板、智能指针、移动语义、并发入门）。
2. 每天可投入 **1~2 小时**，因此单日任务必须能在该时间内完成：知识点 2~4 条，题目 2~3 道。
3. 题目必须**可落地、可编译、有明确验收**，避免「请谈谈你的理解」这类空题。
4. 参考答案必须是**能编译运行的 C++17 代码**，并附 1~3 行关键点解释。
5. 每周留出复习与项目日，第 8 周以综合项目（如命令行通讯录/矩阵库/简易解释器）收尾。

## 最小示例

```json
{
  "id": "sample",
  "title": "示例计划",
  "goal": "演示格式",
  "weeks": [
    {
      "week": 1,
      "title": "第一周",
      "goal": "入门",
      "days": [
        {
          "id": "w1d1",
          "weekday": "周一",
          "title": "类与封装",
          "minutes": 90,
          "kind": "learn",
          "learn": ["class 与 struct 的区别", "访问控制 public/private"],
          "reading": "《C++ Primer》第 7 章",
          "practice": ["写一个 Rectangle 类并计算面积"],
          "exercises": [
            {
              "id": "w1d1e1",
              "title": "实现 Rectangle",
              "prompt": "实现 Rectangle 类，含 width/height 与 area()。",
              "hint": "注意成员函数用 const 修饰。",
              "answer": "```cpp\nclass Rectangle {\npublic:\n  Rectangle(double w, double h) : w_(w), h_(h) {}\n  double area() const { return w_ * h_; }\nprivate:\n  double w_, h_;\n};\n```\n成员函数用 const 修饰表示不修改对象状态。",
              "difficulty": 1
            }
          ],
          "checklist": ["看完 7.1", "代码编译通过"]
        }
      ]
    }
  ]
}
```
