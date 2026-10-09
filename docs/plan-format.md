# 学习计划数据格式（study plan format v1）

DSH 「学习计划」插件的计划文件是**一个 JSON 文件 = 一份计划**。

存放目录：`%USERPROFILE%\.dsh\study-planner\plans\<planId>.json`

插件本身**不带任何计划**（这是通用模板）：数据目录里没有计划时，页面会显示引导页。
对话里的 AI 要为用户「生成计划书 / 计划表」时，按下面的格式写一个 JSON 文件到该目录即可，
插件页面会立刻在下拉框里列出它。**不要手工修改 `progress.json`**（那是插件的打卡记录）。

## 顶层字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 计划标识，建议小写短横线，如 `git-basics`。必须与文件名一致。 |
| `title` | string | 是 | 计划标题，显示在页面顶部。 |
| `subject` | string | 否 | 学科或主题，如 `Python`、`英语`。 |
| `level` | string | 否 | 起点说明，如 `零基础`、`有编程基础`。 |
| `goal` | string | 是 | 一句话目标（显示为「学习目标」）。 |
| `tools` | string | 否 | 建议环境 / 教材 / 工具。 |
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
| `days` | array | 该周 7 天（建议 7 天，`kind: rest` 表示休息 / 机动日）。 |

## 日（day）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 全局唯一，建议 `w<周>d<天>`，如 `w3d5`。 |
| `weekday` | string | 建议星期，如 `周一`。上班族节奏可参考：周一~周五 `learn/practice`，周六 `review/project`，周日 `rest`。 |
| `title` | string | 当天主题。 |
| `minutes` | number | 当天建议分钟数（如 45 / 60 / 90 / 120）。 |
| `kind` | string | `learn` / `practice` / `review` / `project` / `rest` 之一。 |
| `learn` | string[] | 知识点列表（每条一句话，页面显示为要点）。 |
| `reading` | string | 教材 / 文档章节，如 `《Pro Git》第 2 章 2.1`。 |
| `practice` | string[] | 动手任务（做出可验收的东西）。 |
| `exercises` | array | 课后题，见下。`rest` 日可为空数组。 |
| `checklist` | string[] | 当天完成标准（2~4 条，页面显示为可勾选项）。 |

## 课后题（exercise）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 唯一，建议 `w1d1e1`。 |
| `title` | string | 题目标题。 |
| `prompt` | string | 题目正文，可含 Markdown 代码块（用 ``` 包裹）。 |
| `hint` | string | 一条思路提示（不是答案）。 |
| `answer` | string | 参考答案：可直接使用的完整答案；编程题给完整可运行的代码 + 关键点说明。 |
| `difficulty` | number | 1（入门）/ 2（中等）/ 3（挑战）。 |

## 内容要求

1. **先确认起点与时间**：用户当前水平、每天能投入多久、想达到什么结果；对话里没说的就先问，再确定周数与每天 `minutes`。
2. **单日可完成**：每天知识点 2~4 条、动手任务 1~2 条、课后题 2~3 道，总量要落在当天时间里。
3. **题目可验收**：写出输入输出、验收标准或产出物，避免「请谈谈你的理解」这类无法判定的题。
4. **答案可直接用**：编程题给完整可运行的代码；其他学科给可照做的完整答案，并附关键点解释。
5. **有节奏**：每周留出复习 / 项目日；最后一周以综合项目或可见成果收尾。

## 最小示例

```json
{
  "id": "git-basics",
  "title": "Git 基础 2 周计划",
  "subject": "Git",
  "level": "零基础",
  "goal": "能独立完成日常分支开发与冲突解决",
  "tools": "Git 2.40+，任意终端",
  "dailyMinutes": 45,
  "weeks": [
    {
      "week": 1,
      "title": "从提交到分支",
      "goal": "理解三层模型，能建分支并合并",
      "days": [
        {
          "id": "w1d1",
          "weekday": "周一",
          "title": "仓库与第一次提交",
          "minutes": 45,
          "kind": "learn",
          "learn": ["git init 与 git clone 的区别", "工作区、暂存区、提交的三层模型"],
          "reading": "《Pro Git》第 2 章 2.1~2.2",
          "practice": ["新建一个仓库并完成 3 次提交，用 git log --oneline 查看"],
          "exercises": [
            {
              "id": "w1d1e1",
              "title": "把三次修改拆成三次提交",
              "prompt": "在同一个文件里做三次修改并分别提交，每次提交信息要说明这次改了什么。\n验收：`git log --oneline` 能看到三条记录。",
              "hint": "改一次就 add + commit，不要留到最后一起提交。",
              "answer": "每次修改后依次执行：\n```\ngit add note.txt\ngit commit -m \"添加标题\"\n```\n重复三次，最后 `git log --oneline` 应有三行。关键是理解 add 只把改动放进暂存区，commit 才生成快照。",
              "difficulty": 1
            }
          ],
          "checklist": ["本地仓库建好", "三条提交记录都在"]
        }
      ]
    }
  ]
}
```
