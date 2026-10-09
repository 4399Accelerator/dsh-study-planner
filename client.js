// dsh-study-planner — 客户端（Web UI）插件
//
// 在会话视图里注册一个「学习计划」标签（与「对话」「模拟器」同排），
// 页面里显示：计划书（目标/周次）、每日学习任务、课后题、以及打卡进度可视化。
//
// 与对话的绑定：视图组件收到的 props.sessionId 就是当前会话。
// 计划文件由对话里的 AI 写进 $DSH_HOME/study-planner/plans/<id>.json，
// 本页面通过宿主接口读取；页面上的打卡与勾选由本页面写回 progress.json。
//
// 协议：client-modules，注册一个 lazy factory（id 必须等于包名）。
window.__ModuleLoader__.load({
  id: 'dsh-study-planner',
  factory: (require) => {
    const React = require('react')
    const h = React.createElement

    const API = '/dsh-study-planner/api'

    // --- 与宿主通信 -----------------------------------------------------------

    async function api(action, payload) {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, ...(payload || {}) }),
      })
      let data = null
      try {
        data = await res.json()
      } catch {
        data = null
      }
      if (!data || !res.ok || data.ok === false) {
        throw new Error((data && data.error) || `请求失败（HTTP ${res.status}）`)
      }
      return data.value
    }

    // --- 小工具 ---------------------------------------------------------------

    // 兜底读取当前会话 id（宿主已通过 props.sessionId 给出，仅在缺失时使用）。
    function currentSessionId() {
      try {
        const raw = localStorage.getItem('dsh.sessions.current')
        if (!raw) return null
        const parsed = JSON.parse(raw)
        return (parsed && parsed.sessionId) || null
      } catch {
        return null
      }
    }

    function pad(n) {
      return String(n).padStart(2, '0')
    }

    function todayKey() {
      const d = new Date()
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    }

    function dayKeyOf(iso) {
      if (typeof iso !== 'string' || iso.length < 10) return null
      return iso.slice(0, 10)
    }

    function dateDiffDays(fromKey, toKey) {
      const a = Date.parse(`${fromKey}T00:00:00`)
      const b = Date.parse(`${toKey}T00:00:00`)
      if (Number.isNaN(a) || Number.isNaN(b)) return 0
      return Math.round((b - a) / 86400000)
    }

    function flattenDays(plan) {
      const out = []
      if (!plan || !Array.isArray(plan.weeks)) return out
      let index = 0
      for (const week of plan.weeks) {
        const days = Array.isArray(week.days) ? week.days : []
        for (const day of days) {
          index += 1
          out.push({ day, week, index })
        }
      }
      return out
    }

    const KIND_META = {
      learn: { label: '学习', color: 'var(--dsw-alias-state-business-primary,#4c6ef5)' },
      practice: { label: '练习', color: 'var(--dsw-alias-state-business-primary,#4c6ef5)' },
      review: { label: '复习', color: 'var(--dsw-alias-state-warning-primary,#c98a15)' },
      project: { label: '项目', color: 'var(--dsw-alias-state-success-primary,#2f9e68)' },
      rest: { label: '机动', color: 'var(--dsw-alias-label-tertiary,#8a8a8a)' },
    }

    function kindMeta(kind) {
      return KIND_META[kind] || KIND_META.learn
    }

    function minutesText(minutes) {
      const m = Number(minutes) || 0
      if (m <= 0) return ''
      if (m < 60) return `${m} 分钟`
      const hours = m / 60
      return Number.isInteger(hours) ? `${hours} 小时` : `${hours.toFixed(1)} 小时`
    }

    // 进度统计：完成天数、总分钟、按打卡日期计算的连续天数。
    function computeStats(days, entry) {
      const record = (entry && entry.days) || {}
      let doneCount = 0
      let totalMinutes = 0
      let exerciseDone = 0
      let exerciseTotal = 0
      const dateSet = new Set()
      for (const item of days) {
        const state = record[item.day.id]
        if (state && state.done) {
          doneCount += 1
          totalMinutes += Number(state.minutes) || 0
          const key = dayKeyOf(state.at)
          if (key) dateSet.add(key)
        }
        const exercises = Array.isArray(item.day.exercises) ? item.day.exercises : []
        exerciseTotal += exercises.length
        for (const exercise of exercises) {
          if (state && state.exercises && state.exercises[exercise.id]) exerciseDone += 1
        }
      }
      // 连续打卡：从今天或昨天往前数（今天还没打卡不清零）。
      let streak = 0
      const today = todayKey()
      let cursor = dateSet.has(today) ? today : shiftKey(today, -1)
      while (dateSet.has(cursor)) {
        streak += 1
        cursor = shiftKey(cursor, -1)
      }
      return {
        doneCount,
        totalDays: days.length,
        totalMinutes,
        exerciseDone,
        exerciseTotal,
        streak,
        percent: days.length ? Math.round((doneCount / days.length) * 100) : 0,
      }
    }

    function shiftKey(key, delta) {      const t = Date.parse(`${key}T00:00:00`)
      if (Number.isNaN(t)) return key
      const d = new Date(t + delta * 86400000)
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    }

    // 今天是计划里的第几天：优先按开始日期推算，否则用第一个未完成的天。
    function resolveCurrentDayId(days, entry) {
      if (days.length === 0) return null
      const start = entry && entry.startDate
      if (start && /^\d{4}-\d{2}-\d{2}$/.test(start)) {
        const offset = dateDiffDays(start, todayKey())
        if (offset >= 0 && offset < days.length) return days[offset].day.id
      }
      for (const item of days) {
        const state = (entry && entry.days && entry.days[item.day.id]) || null
        if (!state || !state.done) return item.day.id
      }
      return days[days.length - 1].day.id
    }

    // 极简 Markdown 片段渲染：只处理 ``` 代码块与普通段落，够用于题目与答案。
    function renderRich(text) {
      const source = typeof text === 'string' ? text : ''
      if (!source.trim()) return null
      const parts = source.split(/```/)
      const nodes = []
      parts.forEach((part, i) => {
        if (i % 2 === 1) {
          const lines = part.replace(/^[a-zA-Z0-9+#-]*\n/, '')
          nodes.push(h('pre', { className: 'dsp-code', key: `c${i}` }, h('code', null, lines.replace(/\s+$/, ''))))
        } else if (part.trim()) {
          nodes.push(h('div', { className: 'dsp-text', key: `t${i}` }, part.replace(/^\n+|\n+$/g, '')))
        }
      })
      return nodes.length ? nodes : null
    }

    // --- 样式 -----------------------------------------------------------------

    const CSS = `
.dsp-root{display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;color:var(--dsw-alias-label-primary,inherit);font-size:13px}
.dsp-head{flex:none;display:flex;flex-direction:column;gap:8px;padding:12px 16px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.22))}
.dsp-head-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dsp-select{appearance:none;height:30px;padding:0 26px 0 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.35));background:var(--dsw-alias-fill-elevated,rgba(128,128,128,.08));color:inherit;font-size:13px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 14px) 13px,calc(100% - 9px) 13px;background-size:5px 5px,5px 5px;background-repeat:no-repeat}
.dsp-btn{appearance:none;height:30px;padding:0 12px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.35));background:var(--dsw-alias-fill-elevated,rgba(128,128,128,.08));color:inherit;font-size:13px;cursor:pointer;white-space:nowrap}
.dsp-btn:hover{border-color:var(--dsw-alias-border-l3,rgba(128,128,128,.55))}
.dsp-btn[disabled]{opacity:.5;cursor:default}
.dsp-btn-primary{border-color:transparent;background:var(--dsw-alias-state-business-primary,#4c6ef5);color:#fff}
.dsp-btn-ghost{background:transparent}
.dsp-input{flex:1;min-width:180px;height:30px;padding:0 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.35));background:var(--dsw-alias-fill-elevated,rgba(128,128,128,.06));color:inherit;font:inherit;font-size:13px}
.dsp-input::placeholder{color:var(--dsw-alias-label-tertiary,#8a8a8a)}
.dsp-spacer{flex:1}
.dsp-muted{color:var(--dsw-alias-label-tertiary,#8a8a8a)}
.dsp-meta{font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary,#666);display:flex;flex-wrap:wrap;gap:4px 14px}
.dsp-chip{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.3));font-size:11px;line-height:18px;color:var(--dsw-alias-label-secondary,#666)}
.dsp-body{flex:1;display:flex;min-height:0}
.dsp-side{flex:none;width:288px;display:flex;flex-direction:column;gap:14px;padding:14px 16px;overflow:auto;border-right:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.22))}
.dsp-main{flex:1;min-width:0;overflow:auto;padding:14px 18px 40px}
.dsp-stat-row{display:flex;align-items:baseline;gap:8px}
.dsp-percent{font-size:30px;font-weight:650;line-height:1}
.dsp-bar{height:8px;border-radius:999px;background:var(--dsw-alias-fill-elevated,rgba(128,128,128,.16));overflow:hidden}
.dsp-bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--dsw-alias-state-business-primary,#4c6ef5),var(--dsw-alias-state-success-primary,#2f9e68))}
.dsp-kv{display:grid;grid-template-columns:1fr auto;gap:6px 10px;font-size:12px}
.dsp-kv b{font-weight:600}
.dsp-section-title{font-size:12px;font-weight:650;color:var(--dsw-alias-label-secondary,#666);margin:2px 0 6px}
/* 打卡日历：每一列是一周（周一→周日），共 8 列 */
.dsp-grid{display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,1fr);grid-auto-columns:1fr;gap:4px}
.dsp-cell{position:relative;aspect-ratio:1/1;border-radius:5px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25));background:var(--dsw-alias-fill-elevated,rgba(128,128,128,.07));cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--dsw-alias-label-tertiary,#8a8a8a);padding:0}
.dsp-cell:hover{border-color:var(--dsw-alias-border-l3,rgba(128,128,128,.6))}
.dsp-cell-done{background:var(--dsw-alias-state-success-primary,#2f9e68);border-color:transparent;color:#fff}
.dsp-cell-rest{opacity:.55}
.dsp-cell-sel{outline:2px solid var(--dsw-alias-state-business-primary,#4c6ef5);outline-offset:1px}
.dsp-cell-today::after{content:"";position:absolute;inset:-3px;border-radius:7px;border:1px dashed var(--dsw-alias-state-business-primary,#4c6ef5)}
.dsp-legend{display:flex;gap:10px;font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a);flex-wrap:wrap;align-items:center}
.dsp-dot{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:4px;vertical-align:-1px}
.dsp-card{border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.22));border-radius:12px;padding:12px 14px;margin-bottom:12px;background:var(--dsw-alias-bg-layer-2,transparent)}
.dsp-card-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}
.dsp-day-title{font-size:16px;font-weight:650}
.dsp-list{margin:6px 0 0;padding-left:18px;line-height:1.75}
.dsp-list li{margin:2px 0}
.dsp-label{font-size:12px;font-weight:650;color:var(--dsw-alias-label-secondary,#666);margin-top:10px}
.dsp-check{display:flex;align-items:flex-start;gap:8px;line-height:1.7;cursor:pointer;padding:2px 0}
.dsp-check input{margin:3px 0 0;width:14px;height:14px;accent-color:var(--dsw-alias-state-business-primary,#4c6ef5);flex:none;cursor:pointer}
.dsp-ex{border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.22));border-radius:10px;padding:10px 12px;margin-top:8px}
.dsp-ex-head{display:flex;align-items:center;gap:8px;cursor:pointer}
.dsp-ex-title{font-weight:600;flex:1;min-width:0}
.dsp-ex-body{margin-top:8px;padding-top:8px;border-top:1px dashed var(--dsw-alias-border-l2,rgba(128,128,128,.25))}
.dsp-diff{font-size:10px;padding:0 6px;border-radius:999px;border:1px solid currentColor;line-height:16px}
.dsp-code{margin:6px 0;padding:10px 12px;border-radius:8px;background:var(--dsw-alias-bg-layer-3,rgba(128,128,128,.12));overflow:auto;font-size:12px;line-height:1.6;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.dsp-text{white-space:pre-wrap;line-height:1.75;margin:4px 0}
.dsp-textarea{width:100%;box-sizing:border-box;min-height:52px;resize:vertical;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.3));background:var(--dsw-alias-fill-elevated,rgba(128,128,128,.06));color:inherit;font:inherit;font-size:12px;line-height:1.6;padding:8px 10px}
.dsp-alert{border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.6;border:1px solid var(--dsw-alias-state-error-primary,#e5484d);color:var(--dsw-alias-state-error-primary,#e5484d)}
.dsp-empty{max-width:620px;margin:40px auto;line-height:1.8}
.dsp-hint{font-size:12px;line-height:1.7;color:var(--dsw-alias-label-secondary,#666);border:1px dashed var(--dsw-alias-border-l2,rgba(128,128,128,.3));border-radius:10px;padding:10px 12px;margin-top:10px}
.dsp-link{color:var(--dsw-alias-state-business-primary,#4c6ef5);cursor:pointer;text-decoration:underline}
.dsp-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px}
.dsp-note-saved{font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a)}
@media (max-width:760px){
  .dsp-body{flex-direction:column}
  .dsp-side{width:auto;max-height:46%;border-right:none;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.22))}
}
`

    function ensureStyle() {
      const id = 'dsh-study-planner-style'
      let el = document.getElementById(id)
      if (!el) {
        el = document.createElement('style')
        el.id = id
        el.textContent = CSS
        document.head.appendChild(el)
      }
      return el
    }

    // --- 视图组件 -------------------------------------------------------------

    function StudyPlannerView(props) {
      const sessionId = (props && props.sessionId) || currentSessionId() || null
      // 宿主通过在 conversation.view 的渲染调用里传入的标准 props 提供输入框动作；
      // 缺失时（宿主改版）自动降级为「复制提示词」。
      const inputActions = (props && props.inputActions) || null

      const [snap, setSnap] = React.useState(null)
      const [detail, setDetail] = React.useState(null)
      const [planId, setPlanId] = React.useState(null)
      const [selectedId, setSelectedId] = React.useState(null)
      const [error, setError] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [openEx, setOpenEx] = React.useState({})
      const [noteDraft, setNoteDraft] = React.useState('')
      const [notice, setNotice] = React.useState('')
      const [loaded, setLoaded] = React.useState(false)
      const [goalDraft, setGoalDraft] = React.useState('')
      const autoSelected = React.useRef(false)

      const refreshSnapshot = React.useCallback(async () => {
        const value = await api('state')
        setSnap(value)
        return value
      }, [])

      const loadPlan = React.useCallback(async (id) => {
        if (!id) return null
        const value = await api('plan', { planId: id })
        setDetail(value)
        setPlanId(id)
        setNoteDraft('')
        autoSelected.current = false
        return value
      }, [])

      // 首次挂载：拉快照并载入当前计划。
      React.useEffect(() => {
        let alive = true
        ;(async () => {
          try {
            setError('')
            const value = await refreshSnapshot()
            if (!alive) return
            const id = value.activePlanId || (value.plans[0] && value.plans[0].id) || null
            if (id) await loadPlan(id)
          } catch (reason) {
            if (alive) setError(String((reason && reason.message) || reason))
          } finally {
            if (alive) setLoaded(true)
          }
        })()
        return () => {
          alive = false
        }
      }, [refreshSnapshot, loadPlan])

      const days = React.useMemo(() => flattenDays(detail && detail.plan), [detail])
      const entry = detail && detail.entry ? detail.entry : null
      const stats = React.useMemo(() => computeStats(days, entry), [days, entry])
      const currentDayId = React.useMemo(() => resolveCurrentDayId(days, entry), [days, entry])

      // 默认选中「今天」那一天；用户点选后不再自动跳。
      React.useEffect(() => {
        if (autoSelected.current) return
        if (!days.length) return
        setSelectedId(currentDayId)
        autoSelected.current = true
      }, [days, currentDayId])

      // 切换选中日时清空备注草稿，避免把上一天的草稿带到下一天。
      React.useEffect(() => {
        setNoteDraft('')
      }, [selectedId])

      const selected = React.useMemo(() => {
        if (!days.length) return null
        return days.find((item) => item.day.id === selectedId) || days[0]
      }, [days, selectedId])

      const selectedState = selected && entry && entry.days ? entry.days[selected.day.id] || null : null

      const run = React.useCallback(
        async (fn, okText) => {
          setBusy(true)
          setError('')
          try {
            await fn()
            if (okText) {
              setNotice(okText)
              window.setTimeout(() => setNotice(''), 2200)
            }
          } catch (reason) {
            setError(String((reason && reason.message) || reason))
          } finally {
            setBusy(false)
          }
        },
        [],
      )

      const reload = React.useCallback(
        async (id) => {
          const target = id || planId
          const value = await refreshSnapshot()
          if (!target && value.plans[0]) return loadPlan(value.plans[0].id)
          if (target) return loadPlan(target)
          return null
        },
        [planId, refreshSnapshot, loadPlan],
      )

      const onToggleDay = React.useCallback(
        (dayId, done, minutes) => {
          if (!planId) return
          run(async () => {
            await api('toggle-day', { planId, dayId, done, minutes })
            await reload(planId)
          }, done ? '已打卡，继续保持' : '已撤销打卡')
        },
        [planId, run, reload],
      )

      const onToggleExercise = React.useCallback(
        (dayId, exerciseId, done) => {
          if (!planId) return
          run(async () => {
            await api('toggle-exercise', { planId, dayId, exerciseId, done })
            await reload(planId)
          })
        },
        [planId, run, reload],
      )

      const onToggleChecklist = React.useCallback(
        (dayId, index, done) => {
          if (!planId) return
          run(async () => {
            await api('toggle-checklist', { planId, dayId, index, done })
            await reload(planId)
          })
        },
        [planId, run, reload],
      )

      const onSaveNote = React.useCallback(
        (dayId) => {
          if (!planId) return
          run(async () => {
            await api('note', { planId, dayId, note: noteDraft })
            await reload(planId)
          }, '备注已保存')
        },
        [planId, noteDraft, run, reload],
      )

      const onSetStartDate = React.useCallback(
        (value) => {
          if (!planId) return
          run(async () => {
            await api('settings', { planId, startDate: value })
            await reload(planId)
          }, value ? '开始日期已更新' : '已清除开始日期')
        },
        [planId, run, reload],
      )

      const onReset = React.useCallback(() => {
        if (!planId) return
        if (!window.confirm('确定要清空这份计划的全部打卡记录吗？此操作不可撤销。')) return
        run(async () => {
          await api('reset', { planId })
          await reload(planId)
        }, '打卡记录已清空')
      }, [planId, run, reload])

      // 把「想学什么」拼成一段给 AI 的提示词。
      const buildPrompt = React.useCallback((goal) => {
        const want = (goal || '').trim() || '一个新的学习目标（请先问我是什么）'
        return (
          `请帮我制定学习计划：${want}。` +
          '按 D:\\DSH\\study-planner-plugin\\docs\\plan-format.md 的格式（plan format v1），' +
          '把计划写成 JSON 文件放进 %USERPROFILE%\\.dsh\\study-planner\\plans\\ 目录（文件名用计划 id）；' +
          '每天安排 1~2 小时，周一到周五学习、周六复习或项目、周日机动；' +
          '每天给 2~3 道课后题，含题目、提示、参考答案与难度。写完后告诉我计划 id。'
        )
      }, [])

      const copyText = React.useCallback((text, okText) => {
        const done = () => {
          setNotice(okText || '已复制')
          window.setTimeout(() => setNotice(''), 2600)
        }
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, () => setNotice('复制失败，请手动复制'))
            return
          }
        } catch {
          // 回落到直接显示
        }
        setNotice(text)
      }, [])

      // 直接填进下方对话框：用户按回车就能把目标交给当前对话的 AI 生成计划。
      const fillDraft = React.useCallback(() => {
        const text = buildPrompt(goalDraft)
        try {
          if (inputActions && typeof inputActions.setDraft === 'function') {
            inputActions.setDraft(text)
            setNotice('已填入下方对话框，按回车发送')
            window.setTimeout(() => setNotice(''), 3200)
            return
          }
        } catch {
          // 降级到复制
        }
        copyText(text, '无法自动填入，提示词已复制，请粘贴到对话框')
      }, [buildPrompt, goalDraft, inputActions, copyText])

      const goalRow = h(
        'div',
        { className: 'dsp-head-row' },
        h('input', {
          className: 'dsp-input',
          type: 'text',
          placeholder: '想新学点什么？例如：Python 数据分析，6 周，每天 1 小时',
          value: goalDraft,
          disabled: busy,
          onChange: (e) => setGoalDraft(e.target.value),
          onKeyDown: (e) => {
            if (e.key === 'Enter') fillDraft()
          },
        }),
        h('button', { type: 'button', className: 'dsp-btn dsp-btn-primary', disabled: busy, onClick: fillDraft }, '让 AI 生成计划'),
        h(
          'button',
          {
            type: 'button',
            className: 'dsp-btn dsp-btn-ghost',
            disabled: busy,
            onClick: () => copyText(buildPrompt(goalDraft), '提示词已复制'),
          },
          '复制提示词',
        ),
      )

      // --- 渲染 ---------------------------------------------------------------

      if (!detail) {
        return h(
          'div',
          { className: 'dsp-root' },
          h(
            'div',
            { className: 'dsp-empty' },
            h('div', { className: 'dsp-day-title' }, loaded ? '还没有学习计划' : '正在载入学习计划…'),
            loaded
              ? h(
                  'div',
                  { className: 'dsp-text dsp-muted' },
                  '写下你的学习目标，点「让 AI 生成计划」——提示词会填进本对话下方的输入框，按回车发送后 AI 会把计划写进数据目录，刷新本页即可看到计划表与打卡界面。',
                )
              : null,
            loaded ? h('div', { style: { marginTop: 12 } }, goalRow) : null,
            error ? h('div', { className: 'dsp-alert', style: { marginTop: 12 } }, error) : null,
            loaded
              ? h(
                  'div',
                  { className: 'dsp-actions' },
                  h('button', { type: 'button', className: 'dsp-btn', disabled: busy, onClick: () => run(async () => reload(null), '已刷新') }, '刷新'),
                )
              : null,
            loaded ? h('div', { className: 'dsp-hint' }, `计划文件目录：${(snap && snap.plansDir) || '~/.dsh/study-planner/plans'}`) : null,
          ),
        )
      }

      const plan = detail.plan
      const source = plan.source || {}
      const linked = sessionId && source.sessionId && String(source.sessionId) === String(sessionId)

      const weekCells = []
      days.forEach((item) => {
        const state = (entry && entry.days && entry.days[item.day.id]) || null
        const done = !!(state && state.done)
        const classes = ['dsp-cell']
        if (done) classes.push('dsp-cell-done')
        if (item.day.kind === 'rest') classes.push('dsp-cell-rest')
        if (item.day.id === selectedId) classes.push('dsp-cell-sel')
        if (item.day.id === currentDayId) classes.push('dsp-cell-today')
        weekCells.push(
          h(
            'button',
            {
              key: item.day.id,
              type: 'button',
              className: classes.join(' '),
              title: `第 ${item.week.week} 周 · ${item.day.weekday || ''} ${item.day.title || ''}${done ? '（已打卡）' : ''}`,
              onClick: () => setSelectedId(item.day.id),
            },
            done ? '✓' : String(item.index),
          ),
        )
      })

      const day = selected.day
      const week = selected.week
      const dayDone = !!(selectedState && selectedState.done)
      const exercises = Array.isArray(day.exercises) ? day.exercises : []
      const checklist = Array.isArray(day.checklist) ? day.checklist : []

      const sidePanel = h(
        'aside',
        { className: 'dsp-side' },
        h(
          'div',
          null,
          h('div', { className: 'dsp-stat-row' }, h('span', { className: 'dsp-percent' }, `${stats.percent}%`), h('span', { className: 'dsp-muted' }, '总体进度')),
          h('div', { className: 'dsp-bar', style: { marginTop: 8 } }, h('i', { style: { width: `${stats.percent}%` } })),
        ),
        h(
          'div',
          { className: 'dsp-kv' },
          h('span', { className: 'dsp-muted' }, '已完成'),
          h('b', null, `${stats.doneCount} / ${stats.totalDays} 天`),
          h('span', { className: 'dsp-muted' }, '累计学习'),
          h('b', null, `${(stats.totalMinutes / 60).toFixed(1)} 小时`),
          h('span', { className: 'dsp-muted' }, '连续打卡'),
          h('b', null, `${stats.streak} 天`),
          h('span', { className: 'dsp-muted' }, '课后题'),
          h('b', null, `${stats.exerciseDone} / ${stats.exerciseTotal} 道`),
        ),
        h(
          'div',
          null,
          h('div', { className: 'dsp-section-title' }, '打卡日历（点格子查看/补打卡）'),
          h('div', { className: 'dsp-grid' }, weekCells),
          h(
            'div',
            { className: 'dsp-legend', style: { marginTop: 8 } },
            h('span', null, h('i', { className: 'dsp-dot', style: { background: 'var(--dsw-alias-state-success-primary,#2f9e68)' } }), '已打卡'),
            h('span', null, h('i', { className: 'dsp-dot', style: { background: 'var(--dsw-alias-fill-elevated,rgba(128,128,128,.25))' } }), '未打卡'),
            h('span', null, '虚线框 = 今天'),
          ),
        ),
        h(
          'div',
          null,
          h('div', { className: 'dsp-section-title' }, '开始日期'),
          h('input', {
            type: 'date',
            className: 'dsp-textarea',
            style: { minHeight: 0, padding: '5px 8px' },
            value: (entry && entry.startDate) || '',
            disabled: busy,
            onChange: (e) => onSetStartDate(e.target.value),
          }),
          h('div', { className: 'dsp-muted', style: { fontSize: 11, marginTop: 6, lineHeight: 1.6 } }, '设置后，页面会按自然日推算「今天该学哪一天」。'),
        ),
      )

      const head = h(
        'header',
        { className: 'dsp-head' },
        h(
          'div',
          { className: 'dsp-head-row' },
          h('span', { style: { fontSize: 15, fontWeight: 650 } }, '学习计划'),
          h(
            'select',
            {
              className: 'dsp-select',
              value: plan.id,
              disabled: busy,
              onChange: (e) => run(async () => loadPlan(e.target.value)),
            },
            (snap && snap.plans ? snap.plans : [{ id: plan.id, title: plan.title }]).map((p) =>
              h('option', { key: p.id, value: p.id }, `${p.title}（${p.dayCount || ''}${p.dayCount ? ' 天' : ''}）`),
            ),
          ),
          h('span', { className: 'dsp-spacer' }),
          notice ? h('span', { className: 'dsp-note-saved' }, notice) : null,
          h(
            'button',
            { type: 'button', className: 'dsp-btn dsp-btn-ghost', disabled: busy, onClick: () => run(async () => reload(plan.id), '已刷新') },
            '刷新',
          ),
        ),
        h(
          'div',
          { className: 'dsp-meta' },
          plan.goal ? h('span', null, `目标：${plan.goal}`) : null,
          plan.dailyMinutes ? h('span', null, `建议每日：${minutesText(plan.dailyMinutes)}`) : null,
          plan.tools ? h('span', null, `环境/教材：${plan.tools}`) : null,
          h('span', null, `进度：${stats.doneCount}/${stats.totalDays} 天`),
          source.sessionTitle ? h('span', { className: 'dsp-chip' }, `来自对话：${source.sessionTitle}${linked ? '（当前）' : ''}`) : null,
        ),
        linked ? null : h('div', { className: 'dsp-meta dsp-muted' }, '提示：在对话里说出你的目标（如「帮我做一份 6 周 Python 计划，每天 1 小时」），AI 会把计划写到数据目录，刷新本页即可看到。'),
        goalRow,
      )

      const dayPanel = h(
        'main',
        { className: 'dsp-main' },
        error ? h('div', { className: 'dsp-alert', style: { marginBottom: 12 } }, error) : null,
        h(
          'div',
          { className: 'dsp-card' },
          h(
            'div',
            { className: 'dsp-card-head' },
            h('span', { className: 'dsp-chip' }, `第 ${week.week} 周 · ${week.title || ''}`),
            h('span', { className: 'dsp-chip' }, `${kindMeta(day.kind).label} · ${minutesText(day.minutes) || '不限时'}`),
            day.weekday ? h('span', { className: 'dsp-chip' }, day.weekday) : null,
            day.id === currentDayId ? h('span', { className: 'dsp-chip', style: { color: 'var(--dsw-alias-state-business-primary,#4c6ef5)' } }, '今天') : null,
            dayDone ? h('span', { className: 'dsp-chip', style: { color: 'var(--dsw-alias-state-success-primary,#2f9e68)' } }, '已打卡') : null,
          ),
          h('div', { className: 'dsp-day-title' }, `第 ${selected.index} 天 · ${day.title || ''}`),
          week.goal ? h('div', { className: 'dsp-meta', style: { marginTop: 6 } }, `本周目标：${week.goal}`) : null,
          Array.isArray(day.learn) && day.learn.length
            ? h(
                'div',
                null,
                h('div', { className: 'dsp-label' }, '今天学什么'),
                h('ul', { className: 'dsp-list' }, day.learn.map((line, i) => h('li', { key: i }, line))),
              )
            : null,
          day.reading ? h('div', null, h('div', { className: 'dsp-label' }, '阅读'), h('div', { className: 'dsp-text' }, day.reading)) : null,
          Array.isArray(day.practice) && day.practice.length
            ? h(
                'div',
                null,
                h('div', { className: 'dsp-label' }, '动手'),
                h('ul', { className: 'dsp-list' }, day.practice.map((line, i) => h('li', { key: i }, line))),
              )
            : null,
          checklist.length
            ? h(
                'div',
                null,
                h('div', { className: 'dsp-label' }, '完成标准'),
                checklist.map((line, i) => {
                  const checked = !!(selectedState && selectedState.checklist && selectedState.checklist[String(i)])
                  return h(
                    'label',
                    { className: 'dsp-check', key: i },
                    h('input', {
                      type: 'checkbox',
                      checked,
                      disabled: busy,
                      onChange: (e) => onToggleChecklist(day.id, i, e.target.checked),
                    }),
                    h('span', null, line),
                  )
                }),
              )
            : null,
          h(
            'div',
            { className: 'dsp-actions' },
            h(
              'button',
              {
                type: 'button',
                className: dayDone ? 'dsp-btn' : 'dsp-btn dsp-btn-primary',
                disabled: busy,
                onClick: () => onToggleDay(day.id, !dayDone, day.minutes),
              },
              dayDone ? '撤销今日打卡' : '完成今日打卡',
            ),
            h('span', { className: 'dsp-muted', style: { fontSize: 11 } }, dayDone && selectedState && selectedState.at ? `打卡时间：${String(selectedState.at).replace('T', ' ').slice(0, 16)}` : '打卡后会记入左侧进度'),
          ),
        ),
        exercises.length
          ? h(
              'div',
              { className: 'dsp-card' },
              h('div', { className: 'dsp-section-title' }, `课后题（${exercises.length} 道）`),
              exercises.map((exercise) => {
                const checked = !!(selectedState && selectedState.exercises && selectedState.exercises[exercise.id])
                const open = !!openEx[exercise.id]
                return h(
                  'div',
                  { className: 'dsp-ex', key: exercise.id },
                  h(
                    'div',
                    { className: 'dsp-ex-head' },
                    h('input', {
                      type: 'checkbox',
                      checked,
                      disabled: busy,
                      style: { width: 14, height: 14, accentColor: 'var(--dsw-alias-state-business-primary,#4c6ef5)', cursor: 'pointer' },
                      onChange: (e) => onToggleExercise(day.id, exercise.id, e.target.checked),
                    }),
                    h('span', { className: 'dsp-ex-title' }, exercise.title || exercise.id),
                    h(
                      'span',
                      {
                        className: 'dsp-diff',
                        style: {
                          color:
                            exercise.difficulty >= 3
                              ? 'var(--dsw-alias-state-error-primary,#e5484d)'
                              : exercise.difficulty === 2
                                ? 'var(--dsw-alias-state-warning-primary,#c98a15)'
                                : 'var(--dsw-alias-state-success-primary,#2f9e68)',
                        },
                      },
                      `难度 ${exercise.difficulty || 1}`,
                    ),
                    h(
                      'span',
                      { className: 'dsp-link', onClick: () => setOpenEx((prev) => ({ ...prev, [exercise.id]: !open })) },
                      open ? '收起' : '题目/提示/答案',
                    ),
                  ),
                  open
                    ? h(
                        'div',
                        { className: 'dsp-ex-body' },
                        renderRich(exercise.prompt),
                        exercise.hint ? h('div', null, h('div', { className: 'dsp-label' }, '提示'), renderRich(exercise.hint)) : null,
                        exercise.answer ? h('div', null, h('div', { className: 'dsp-label' }, '参考答案'), renderRich(exercise.answer)) : null,
                      )
                    : null,
                )
              }),
            )
          : null,
        h(
          'div',
          { className: 'dsp-card' },
          h('div', { className: 'dsp-section-title' }, '今日备注'),
          h('textarea', {
            className: 'dsp-textarea',
            value: noteDraft !== '' ? noteDraft : (selectedState && selectedState.note) || '',
            placeholder: '记录卡点、疑问或今天实际学了多久…',
            disabled: busy,
            onChange: (e) => setNoteDraft(e.target.value),
            onBlur: () => onSaveNote(day.id),
          }),
          h(
            'div',
            { className: 'dsp-actions' },
            h('button', { type: 'button', className: 'dsp-btn', disabled: busy, onClick: () => onSaveNote(day.id) }, '保存备注'),
            h('span', { className: 'dsp-spacer' }),
            h('button', { type: 'button', className: 'dsp-btn dsp-btn-ghost', disabled: busy, onClick: onReset }, '清空打卡记录'),
          ),
        ),
        h(
          'div',
          { className: 'dsp-hint' },
          `计划文件目录：${(snap && snap.plansDir) || '~/.dsh/study-planner/plans'}`,
          h('br'),
          '想调整计划？直接在左侧对话里说，例如「把第 5 周换成多线程实战，题目再难一点」，AI 会改写对应的计划 JSON，本页刷新后生效。',
        ),
      )

      return h('div', { className: 'dsp-root' }, head, h('div', { className: 'dsp-body' }, sidePanel, dayPanel))
    }

    // --- 插件本体 -------------------------------------------------------------

    const plugin = {
      inject: ['slots'],
      apply(ctx) {
        const styleEl = ensureStyle()
        ctx.effect(() => () => {
          if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl)
        }, 'dsh-study-planner: 样式清理')
        ctx.slots.inject('conversation.view', () =>
          ctx.slots.register(
            {
              name: 'conversation.view',
              id: 'dsh-study-planner',
              order: 30,
              label: () => '学习计划',
            },
            StudyPlannerView,
          ),
        )
      },
    }

    return plugin
  },
})
