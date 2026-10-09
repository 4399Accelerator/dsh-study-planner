// dsh-study-planner — 主机端（Host）插件
//
// 职责：
//   1. 维护学习计划的数据目录：$DSH_HOME/study-planner/
//        plans/<planId>.json   一份计划一个文件（可由对话里的 AI 直接生成/修改）
//        progress.json         打卡记录（只有本插件写）
//   2. 首次运行时把内置的默认计划复制进 plans/，保证页面开箱有内容。
//   3. 通过宿主 Web 服务暴露一个 loopback-only 的 JSON 接口，
//      路径 /dsh-study-planner/api，POST 一个 { action, ... } 的身体，返回 { ok, value }。
//
// 客户端（client.js）只用这一个接口读写，不直接碰文件系统。
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-study-planner'

const ROUTE_PREFIX = '/dsh-study-planner'
const API_PATH = `${ROUTE_PREFIX}/api`
const PLAN_ID_RE = /^[A-Za-z0-9._-]{1,64}$/
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url))
// 可选种子：data/seed/*.json 会在数据目录还没有任何计划时被复制进去。
// 本模板仓库默认**不带**任何计划文件——第一份计划由对话里的 AI 按
// docs/plan-format.md 生成；想随插件附带默认计划，就把 JSON 放进 data/seed/。
const SEED_DIR = path.join(MODULE_DIR, 'data', 'seed')

// --- 路径 --------------------------------------------------------------------

function dshHome() {
  return process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
}

function storeRoot() {
  return path.join(dshHome(), 'study-planner')
}

function plansDir() {
  return path.join(storeRoot(), 'plans')
}

function progressFile() {
  return path.join(storeRoot(), 'progress.json')
}

// --- 基础读写 ----------------------------------------------------------------

function readJson(file, fallback) {
  try {
    const raw = fs.readFileSync(file, 'utf8')
    if (!raw.trim()) return fallback
    const parsed = JSON.parse(raw)
    return parsed === null || parsed === undefined ? fallback : parsed
  } catch {
    return fallback
  }
}

// 原子写：先写临时文件再改名，避免页面读到半个 JSON。
function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), 'utf8')
  fs.renameSync(tmp, file)
}

function emptyProgress() {
  return { version: 1, activePlanId: null, plans: {} }
}

function readProgress() {
  const raw = readJson(progressFile(), null)
  if (!raw || typeof raw !== 'object') return emptyProgress()
  const progress = {
    version: 1,
    activePlanId: typeof raw.activePlanId === 'string' ? raw.activePlanId : null,
    plans: raw.plans && typeof raw.plans === 'object' ? raw.plans : {},
  }
  return progress
}

function writeProgress(progress) {
  progress.version = 1
  writeJsonAtomic(progressFile(), progress)
  return progress
}

function planEntry(progress, planId) {
  if (!progress.plans[planId] || typeof progress.plans[planId] !== 'object') {
    progress.plans[planId] = { startDate: null, days: {}, updatedAt: null }
  }
  const entry = progress.plans[planId]
  if (!entry.days || typeof entry.days !== 'object') entry.days = {}
  if (entry.startDate === undefined) entry.startDate = null
  return entry
}

// --- 计划目录 ----------------------------------------------------------------

// 首次运行：准备数据目录；若配置了种子计划则种入，否则保持为空，
// 由页面上的引导把第一份计划交给对话里的 AI 生成。
function ensureStore() {
  const dir = plansDir()
  fs.mkdirSync(dir, { recursive: true })
  let existing = []
  try {
    existing = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.json'))
  } catch {
    existing = []
  }
  if (existing.length === 0) {
    try {
      const seeds = fs.readdirSync(SEED_DIR).filter((f) => f.toLowerCase().endsWith('.json'))
      for (const file of seeds) {
        const plan = readJson(path.join(SEED_DIR, file), null)
        if (!plan || typeof plan !== 'object') continue
        if (typeof plan.id !== 'string' || !PLAN_ID_RE.test(plan.id)) continue
        writeJsonAtomic(path.join(dir, `${plan.id}.json`), plan)
        existing.push(`${plan.id}.json`)
      }
    } catch {
      // 没有 data/seed 目录是正常情况：第一份计划由对话生成
    }
  }
  const progress = readProgress()
  if (!progress.activePlanId && existing.length > 0) {
    progress.activePlanId = existing[0].replace(/\.json$/i, '')
    writeProgress(progress)
  }
  // 把计划格式说明放到数据目录一份：用户和 AI 都能就近查到怎么写计划。
  try {
    const readme = path.join(storeRoot(), 'README.md')
    if (!fs.existsSync(readme)) {
      const doc = path.join(MODULE_DIR, 'docs', 'plan-format.md')
      if (fs.existsSync(doc)) fs.copyFileSync(doc, readme)
    }
  } catch {
    // 说明文件写不进不影响功能
  }
  return existing
}

function loadPlanFile(file) {
  const plan = readJson(file, null)
  if (!plan || typeof plan !== 'object' || !Array.isArray(plan.weeks)) return null
  if (typeof plan.id !== 'string' || !PLAN_ID_RE.test(plan.id)) return null
  return plan
}

function listPlans() {
  ensureStore()
  const out = []
  let files = []
  try {
    files = fs.readdirSync(plansDir())
  } catch {
    files = []
  }
  for (const file of files) {
    if (!file.toLowerCase().endsWith('.json')) continue
    const plan = loadPlanFile(path.join(plansDir(), file))
    if (!plan) continue
    const days = countDays(plan)
    out.push({
      id: plan.id,
      title: typeof plan.title === 'string' && plan.title ? plan.title : plan.id,
      subject: plan.subject || '',
      level: plan.level || '',
      goal: plan.goal || '',
      tools: plan.tools || '',
      dailyMinutes: Number(plan.dailyMinutes) || 0,
      weeks: plan.weeks.length,
      dayCount: days,
      source: plan.source && typeof plan.source === 'object' ? plan.source : null,
      updatedAt: plan.updatedAt || plan.createdAt || null,
    })
  }
  out.sort((a, b) => String(a.title).localeCompare(String(b.title), 'zh-Hans-CN'))
  return out
}

function countDays(plan) {
  let n = 0
  for (const week of plan.weeks) {
    if (week && Array.isArray(week.days)) n += week.days.length
  }
  return n
}

function readPlan(planId) {
  if (typeof planId !== 'string' || !PLAN_ID_RE.test(planId)) return null
  return loadPlanFile(path.join(plansDir(), `${planId}.json`))
}

// 找到计划里的某一天（按 dayId），用于校验打卡请求。
function findDay(plan, dayId) {
  for (const week of plan.weeks) {
    if (!week || !Array.isArray(week.days)) continue
    for (const day of week.days) {
      if (day && day.id === dayId) return { week, day }
    }
  }
  return null
}

// --- 接口动作 ----------------------------------------------------------------

function snapshot() {
  const plans = listPlans()
  const progress = readProgress()
  if (!progress.activePlanId && plans.length > 0) progress.activePlanId = plans[0].id
  return {
    ok: true,
    value: {
      root: storeRoot(),
      plansDir: plansDir(),
      plans,
      activePlanId: progress.activePlanId,
      progress: progress.plans,
    },
  }
}

function actionGetPlan(body) {
  const plan = readPlan(body.planId)
  if (!plan) return { ok: false, error: `找不到计划 ${body.planId}` }
  const progress = readProgress()
  return { ok: true, value: { plan, entry: progress.plans[plan.id] || null } }
}

function withEntry(planId, mutate) {
  const plan = readPlan(planId)
  if (!plan) return { ok: false, error: `找不到计划 ${planId}` }
  const progress = readProgress()
  const entry = planEntry(progress, plan.id)
  const result = mutate(plan, entry)
  entry.updatedAt = new Date().toISOString()
  progress.activePlanId = progress.activePlanId || plan.id
  writeProgress(progress)
  return { ok: true, value: { entry, extra: result || null } }
}

function actionToggleDay(body) {
  return withEntry(body.planId, (plan, entry) => {
    const found = findDay(plan, body.dayId)
    if (!found) throw new Error(`计划里没有 ${body.dayId} 这一天`)
    const done = body.done !== false
    const current = entry.days[body.dayId] || {}
    const day = found.day
    if (done) {
      entry.days[body.dayId] = {
        ...current,
        done: true,
        at: new Date().toISOString(),
        minutes: Number(body.minutes) || Number(day.minutes) || 0,
        note: typeof current.note === 'string' ? current.note : '',
        exercises: current.exercises && typeof current.exercises === 'object' ? current.exercises : {},
        checklist: current.checklist && typeof current.checklist === 'object' ? current.checklist : {},
      }
    } else {
      entry.days[body.dayId] = {
        ...current,
        done: false,
        at: null,
      }
    }
    return entry.days[body.dayId]
  })
}

function actionToggleExercise(body) {
  return withEntry(body.planId, (plan, entry) => {
    const found = findDay(plan, body.dayId)
    if (!found) throw new Error(`计划里没有 ${body.dayId} 这一天`)
    const current = entry.days[body.dayId] || { done: false, at: null, minutes: 0, note: '' }
    const exercises = current.exercises && typeof current.exercises === 'object' ? { ...current.exercises } : {}
    exercises[String(body.exerciseId)] = body.done !== false
    current.exercises = exercises
    entry.days[body.dayId] = current
    return exercises
  })
}

function actionToggleChecklist(body) {
  return withEntry(body.planId, (plan, entry) => {
    const found = findDay(plan, body.dayId)
    if (!found) throw new Error(`计划里没有 ${body.dayId} 这一天`)
    const current = entry.days[body.dayId] || { done: false, at: null, minutes: 0, note: '' }
    const checklist = current.checklist && typeof current.checklist === 'object' ? { ...current.checklist } : {}
    checklist[String(body.index)] = body.done !== false
    current.checklist = checklist
    entry.days[body.dayId] = current
    return checklist
  })
}

function actionNote(body) {
  return withEntry(body.planId, (plan, entry) => {
    const current = entry.days[body.dayId] || { done: false, at: null, minutes: 0 }
    current.note = typeof body.note === 'string' ? body.note.slice(0, 2000) : ''
    entry.days[body.dayId] = current
    return current.note
  })
}

function actionSettings(body) {
  const progress = readProgress()
  if (typeof body.activePlanId === 'string' && body.activePlanId) {
    progress.activePlanId = body.activePlanId
  }
  if (typeof body.planId === 'string' && body.planId && typeof body.startDate === 'string') {
    const entry = planEntry(progress, body.planId)
    entry.startDate = /^\d{4}-\d{2}-\d{2}$/.test(body.startDate) ? body.startDate : null
    entry.updatedAt = new Date().toISOString()
  }
  writeProgress(progress)
  return { ok: true, value: progress }
}

function actionReset(body) {
  const planId = body.planId
  if (typeof planId !== 'string' || !PLAN_ID_RE.test(planId)) return { ok: false, error: '计划 id 非法' }
  const plan = readPlan(planId)
  const progress = readProgress()
  const startDate = progress.plans[planId]?.startDate || null
  progress.plans[planId] = { startDate, days: {}, updatedAt: new Date().toISOString() }
  writeProgress(progress)
  return { ok: true, value: { planId, cleared: plan ? countDays(plan) : 0 } }
}

// 让对话里的 AI（或任何脚本）可以直接推一份计划进来。
function actionImport(body) {
  const plan = body.plan
  if (!plan || typeof plan !== 'object' || !Array.isArray(plan.weeks)) {
    return { ok: false, error: 'plan 必须是含 weeks 数组的对象' }
  }
  if (typeof plan.id !== 'string' || !PLAN_ID_RE.test(plan.id)) {
    return { ok: false, error: 'plan.id 非法（只允许字母数字._-）' }
  }
  for (const week of plan.weeks) {
    if (!week || !Array.isArray(week.days)) return { ok: false, error: '每一周都必须有 days 数组' }
    for (const day of week.days) {
      if (!day || typeof day.id !== 'string' || !day.id) return { ok: false, error: '每一天都必须有 id' }
    }
  }
  const now = new Date().toISOString()
  const saved = { createdAt: now, ...plan, updatedAt: now }
  writeJsonAtomic(path.join(plansDir(), `${plan.id}.json`), saved)
  return { ok: true, value: { id: plan.id, dayCount: countDays(plan) } }
}

function actionRemovePlan(body) {
  const planId = body.planId
  if (typeof planId !== 'string' || !PLAN_ID_RE.test(planId)) return { ok: false, error: '计划 id 非法' }
  try {
    fs.rmSync(path.join(plansDir(), `${planId}.json`), { force: true })
  } catch (error) {
    return { ok: false, error: String((error && error.message) || error) }
  }
  const progress = readProgress()
  delete progress.plans[planId]
  if (progress.activePlanId === planId) progress.activePlanId = null
  writeProgress(progress)
  return { ok: true, value: { id: planId } }
}

const ACTIONS = {
  state: () => snapshot(),
  plan: actionGetPlan,
  'toggle-day': actionToggleDay,
  'toggle-exercise': actionToggleExercise,
  'toggle-checklist': actionToggleChecklist,
  note: actionNote,
  settings: actionSettings,
  reset: actionReset,
  import: actionImport,
  'remove-plan': actionRemovePlan,
}

function handle(action, body) {
  const fn = ACTIONS[action]
  if (!fn) return { ok: false, error: `未知动作 ${action}` }
  try {
    return fn(body || {})
  } catch (error) {
    return { ok: false, error: String((error && error.message) || error) }
  }
}

// --- HTTP --------------------------------------------------------------------

function isLoopbackAddress(address) {
  if (typeof address !== 'string' || address.length === 0) return false
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1' || address.startsWith('127.')
}

function isLocalHostHeader(host) {
  if (typeof host !== 'string' || host.length === 0) return false
  const name = host.split(':')[0].replace(/^\[|\]$/g, '').toLowerCase()
  return name === 'localhost' || name === '127.0.0.1' || name === '::1'
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
  })
  res.end(payload)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 8e6) req.destroy()
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
    req.on('aborted', () => reject(new Error('aborted')))
  })
}

function guard(req, res) {
  if (!isLoopbackAddress(req.socket && req.socket.remoteAddress)) {
    sendJson(res, 403, { ok: false, error: 'loopback only' })
    return false
  }
  if (!isLocalHostHeader(req.headers.host)) {
    sendJson(res, 403, { ok: false, error: 'unexpected host' })
    return false
  }
  return true
}

export function apply(ctx) {
  const register = (webServer, fiber) => {
    fiber.effect(() =>
      webServer.register({
        kind: 'exact',
        path: API_PATH,
        handler: async (req, res) => {
          if (!guard(req, res)) return
          if (req.method !== 'POST') {
            sendJson(res, 405, { ok: false, error: 'POST only' })
            return
          }
          let body = {}
          try {
            const raw = await readBody(req)
            if (raw) body = JSON.parse(raw)
          } catch {
            sendJson(res, 400, { ok: false, error: 'malformed JSON body' })
            return
          }
          sendJson(res, 200, handle(body.action, body))
        },
      }),
    )
  }

  const webServer = ctx.get('webServer')
  if (webServer) {
    register(webServer, ctx)
  } else {
    ctx.inject(['webServer'], (sub) => register(sub.webServer, sub))
  }

  // 数据目录在插件激活时准备好，页面第一次打开就有计划可看。
  try {
    ensureStore()
  } catch {
    // 目录不可写时留给接口层报错，不阻断插件加载
  }
}
