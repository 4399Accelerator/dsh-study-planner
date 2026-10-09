# data/seed（可选）

放在这里的 `*.json` 会在插件**首次运行**（数据目录 `~/.dsh/study-planner/plans/` 里还没有
任何计划时）被复制过去，作为安装者的初始计划。

本模板仓库**默认不带任何计划文件**，这是有意为之：插件是通用工具，第一份计划由对话里的 AI
按 [`docs/plan-format.md`](../../docs/plan-format.md) 生成。

如果你想 fork 这个仓库、让安装者开箱就有一份计划：把符合规范的 JSON 放进本目录即可。
文件名要与计划里的 `id` 一致，例如 `my-plan.json` 对应 `"id": "my-plan"`。
