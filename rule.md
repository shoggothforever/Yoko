# Project Rules

## Git Workflow

1. **工作目录**: 所有git相关操作都在 `/root/.openclaw/workspace` 目录进行
2. **提交策略**: 每次有大改动都需要提交代码到远程仓库

### 提交命令模板

```bash
cd /root/.openclaw/workspace
git add <files>
git commit -m "<commit message>
- Change description

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

## Project Structure

```
workspace/
├── agents/          # OpenClaw agents
│   ├── gally/       # Gally (Galley) agent
│   └── motoko/      # Motoko agent
├── yoko-blog-server/  # yoko-blog API server
│   └── src/
│       ├── config/   # Configuration
│       ├── db/       # Database layer
│       ├── routes/   # API routes
│       ├── services/  # Business logic
│       └── index.js  # Entry point
└── skills/          # Skills and tools
```

## Development Notes

- PostgreSQL database for yoko-blog-server
- OpenClaw agent CLI integration
- Fastify web framework
