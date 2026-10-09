# dsh-study-planner

> DeepSeek Harness (DSH) 插件：在会话视图里加一个 **「学习计划」** 标签页，把每日学习计划、课后题和打卡进度做成可视化界面。
> 计划书由**对话里的 AI 生成**（说一句目标即可），打卡记录保存在本地。

标签位置：会话顶部「对话 / 模拟器」这一排的右侧。

```
dsh plugin --profile <你的 profile> add github:4399Accelerator/dsh-study-planner
```

仓库地址：<https://github.com/4399Accelerator/dsh-study-planner>

---

## 特性

- **计划表**：按周 / 天列出主题、知识点、阅读章节、动手任务、完成标准，以及每日 **课后题**（题目 / 提示 / 参考答案 / 难度）。
- **打卡进度可视化**：总进度百分比、已完成天数、累计学时、连续打卡天数、课后题完成数，以及打卡日历（点任意格子查看或补打卡）。
- **今日推荐**：设置开始日期后按自然日推算「今天该学哪一天」；未设置时自动推荐第一个未完成的天。
- **与对话绑定**：页面会显示计划来自哪个对话；当前会话就是来源时标记「（当前）」。页头输入框可以直接把「生成计划」的提示词填进下方对话框，回车交给 AI。
- **数据在本地**：计划是普通 JSON 文件，打卡记录由插件的宿主半侧维护，全部放在 `~/.dsh/study-planner/`。
- **多计划**：`plans/` 目录下有多少份计划，页面顶部下拉框就有多少个选项。

内置一份开箱即用的 **《C++ 8 周进阶计划》**：56 天、104 道课后题，起点是「已掌握 `class` 之前的语法」，终点是现代 C++（STL、模板、智能指针、移动语义、并发入门）+ 一个综合项目；工作日 60~90 分钟，周六 120 分钟项目日，周日 30 分钟回顾。

---

## 安装

### 方式一：在 DSH 界面里安装（推荐）

1. 打开 DSH 左侧 **插件** 页 → **添加插件**；
2. 填入本仓库地址：

   ```
   github:4399Accelerator/dsh-study-planner
   ```

3. 安装完成后 **刷新页面**（`F5`）；若标签没出现，重启一次 DSH。

### 方式二：命令行

```bash
dsh plugin --profile <你的 profile> add github:4399Accelerator/dsh-study-planner
```

### 方式三：压缩包（本机没有安装 git 时用这个）

`github:` 形式的安装需要本机有 `git`。没有 git 的话，直接填 GitHub 的源码压缩包地址：

```
https://github.com/4399Accelerator/dsh-study-planner/archive/refs/heads/main.tar.gz
```

想锁定某个版本：

```
https://github.com/4399Accelerator/dsh-study-planner/archive/refs/tags/v1.0.0.tar.gz
```

### 方式四：本地目录（开发用）

```bash
dsh plugin --profile <你的 profile> add <本仓库绝对路径>
```

> DSH 目前**不支持插件自动更新**，升级需要先卸载再安装新版。

---

## 使用

1. 打开任意一个**已经发过消息**的会话（空白会话不显示标签栏，这是 DSH 宿主的限制）；
2. 顶部标签栏点 **学习计划**；
3. 左侧看整体进度与打卡日历，右侧看当天任务；做完题点 **完成今日打卡**；
4. 建议先在左侧 **开始日期** 里选今天，这样「今天」会跟着日期走。

### 想学别的科目？

在页面顶部输入框写下目标，例如：

> Python 数据分析，6 周，每天 1 小时

点 **让 AI 生成计划** —— 提示词会被填进下方对话框，回车发送后 AI 会按 [计划文件格式](docs/plan-format.md) 把计划写进数据目录，回到本页刷新即可看到。

也可以直接在对话里说：

> 帮我做一份 6 周 Python 数据分析学习计划，每天 1 小时，写到学习计划插件的 plans 目录里。

---

## 数据位置

```
%USERPROFILE%\.dsh\study-planner\
├── plans\<计划 id>.json     # 一份计划一个文件（AI 直接写这里）
├── progress.json            # 打卡记录，由插件维护，不建议手改
└── README.md                # 计划 JSON 格式说明（首次运行时自动放入）
```

计划文件格式见 [`docs/plan-format.md`](docs/plan-format.md)。

---

## 宿主接口

插件的宿主半侧注册一个仅限本机回环访问的接口：

```
POST /dsh-study-planner/api     { "action": "...", ... }  ->  { "ok": true, "value": ... }
```

| action | 参数 | 说明 |
| --- | --- | --- |
| `state` | — | 计划列表、当前计划、全部打卡记录、数据目录 |
| `plan` | `planId` | 某份计划的完整内容与其进度 |
| `toggle-day` | `planId, dayId, done, minutes?` | 打卡 / 撤销打卡 |
| `toggle-exercise` | `planId, dayId, exerciseId, done` | 勾选课后题 |
| `toggle-checklist` | `planId, dayId, index, done` | 勾选完成标准 |
| `note` | `planId, dayId, note` | 保存当天备注 |
| `settings` | `activePlanId` 或 `planId + startDate` | 切换当前计划 / 设置开始日期 |
| `reset` | `planId` | 清空某计划的打卡记录（保留开始日期） |
| `import` | `plan` | 直接写入一份计划（供 AI 或脚本调用） |
| `remove-plan` | `planId` | 删除计划文件及其进度 |

---

## 工作原理

一个 DSH 插件包由两半组成，本包两半都是手写 JavaScript，**没有构建步骤**：

| 文件 | 角色 |
| --- | --- |
| `index.js` | 宿主半侧：计划 / 打卡数据的读写与 HTTP 接口，由 `cordis.patch.yml` 注册进 profile |
| `client.js` | 浏览器半侧：通过 `ctx.slots.inject('conversation.view', …)` 注册「学习计划」标签与界面 |
| `cordis.patch.yml` | 组合包 patch：把宿主行插入 profile 配置树 |
| `data/plan-cpp-8week.json` | 内置默认计划（首次运行时复制到数据目录） |
| `data/weeks/week-*.json` | 上面那份计划的 8 个周次源文件，方便按周修改 |
| `locale/zh.json`, `locale/en.json` | 插件管理页显示的标题与描述 |
| `docs/plan-format.md` | 计划 JSON 格式规范（AI 写计划时读它） |
| `docs/cpp-8week-plan.zh.md` | 由计划 JSON 生成的离线计划书（含全部题目与参考答案） |

浏览器半侧只依赖 DSH 平台提供的 `react`，不 import 任何 Harness 内部包；样式只用 `--dsw-alias-*` 主题变量，因此浅色 / 深色主题下都跟随宿主。

---

## 常见问题

**标签栏没有「学习计划」？**
1. 确认当前会话已经发过至少一条消息（空白会话不渲染视图标签）；
2. 刷新页面（`F5`）；
3. 仍然没有就重启 DSH —— 新增插件在下次启动时确定加载。

**点「完成今日打卡」没反应？**
宿主接口挂在 DSH 的 Web 服务上，只有本机回环地址可访问；确认 DSH 是以 Web / 桌面形态启动的。

**升级插件？**
先卸载再安装新版（DSH 暂不支持插件自动更新）。数据在 `~/.dsh/study-planner/`，卸载插件不会删除它。

---

## 许可

[MIT](LICENSE)
