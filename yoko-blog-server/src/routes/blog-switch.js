'use strict';

const { execFile } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const SCRIPT = '/root/.openclaw/workspace/scripts/blog-switch.sh';
const REGISTRY = '/root/.openclaw/workspace/scripts/blogs.json';
const NAME_RE = /^[a-zA-Z0-9_-]+$/;
const EXEC_TIMEOUT = 10000;

async function readRegistry() {
  const raw = await fs.readFile(REGISTRY, 'utf-8');
  return JSON.parse(raw);
}

function runSwitch(name) {
  return new Promise((resolve, reject) => {
    execFile(SCRIPT, ['switch', name], { timeout: EXEC_TIMEOUT }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

// 切换结果 HTML 页面
function switchHtml(name, success, message) {
  const color = success ? '#4ade80' : '#f87171';
  const icon = success ? '✓' : '✗';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Blog Switch</title>
${success ? '<meta http-equiv="refresh" content="3;url=http://118.145.99.224">' : ''}
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#e5e5e5;font-family:system-ui,sans-serif}
.card{text-align:center;padding:2rem 3rem;border:1px solid #333;border-radius:12px;background:#111}
.icon{font-size:3rem;color:${color}}
.name{color:${color};font-weight:700}
.msg{margin-top:.5rem;color:#999;font-size:.875rem}
</style></head><body><div class="card">
<div class="icon">${icon}</div>
<h2>切换到 <span class="name">${name}</span> ${success ? '成功' : '失败'}</h2>
<p class="msg">${message}</p>
${success ? '<p class="msg">3 秒后跳转到首页…</p>' : ''}
</div></body></html>`;
}

async function routes(fastify) {
  // GET /switch/:name — 浏览器友好入口
  fastify.get('/switch/:name', async (request, reply) => {
    const { name } = request.params;

    if (!NAME_RE.test(name)) {
      reply.type('text/html').code(400);
      return switchHtml(name, false, '名称只允许字母、数字、下划线和连字符');
    }

    try {
      const reg = await readRegistry();
      if (!reg.blogs[name]) {
        reply.type('text/html').code(404);
        return switchHtml(name, false, `未注册的博客: ${name}。可用: ${Object.keys(reg.blogs).join(', ')}`);
      }

      if (reg.active === name) {
        reply.type('text/html').code(200);
        return switchHtml(name, true, '当前已经是该博客，无需切换');
      }

      const result = await runSwitch(name);
      reply.type('text/html').code(200);
      return switchHtml(name, true, result.stdout.replace(/\x1b\[[0-9;]*m/g, ''));
    } catch (err) {
      reply.type('text/html').code(500);
      return switchHtml(name, false, err.message);
    }
  });

  // GET /api/blog-switch/switch/:name — JSON API
  fastify.get('/api/blog-switch/switch/:name', async (request, reply) => {
    const { name } = request.params;

    if (!NAME_RE.test(name)) {
      return reply.code(400).send({ ok: false, error: 'invalid name' });
    }

    try {
      const reg = await readRegistry();
      if (!reg.blogs[name]) {
        return reply.code(404).send({ ok: false, error: `unknown blog: ${name}`, available: Object.keys(reg.blogs) });
      }

      if (reg.active === name) {
        return { ok: true, message: 'already active', active: name };
      }

      const result = await runSwitch(name);
      return { ok: true, message: 'switched', active: name, detail: result.stdout.replace(/\x1b\[[0-9;]*m/g, '') };
    } catch (err) {
      return reply.code(500).send({ ok: false, error: err.message });
    }
  });

  // GET /api/blog-switch/status
  fastify.get('/api/blog-switch/status', async () => {
    const reg = await readRegistry();
    return { active: reg.active, path: reg.blogs[reg.active] || null };
  });

  // GET /api/blog-switch/list
  fastify.get('/api/blog-switch/list', async () => {
    const reg = await readRegistry();
    return { active: reg.active, blogs: reg.blogs };
  });
}

module.exports = routes;
