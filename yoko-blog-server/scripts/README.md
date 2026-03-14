# Ghost Chatroom 服务管理

## 快速开始

```bash
# 启动服务
./ghost.sh start

# 查看状态
./ghost.sh status

# 停止服务
./ghost.sh stop

# 重启服务
./ghost.sh restart
```

## 完整命令列表

| 命令 | 说明 | 示例 |
|------|------|------|
| `start` | 启动服务 | `./ghost.sh start` |
| `stop` | 停止服务 | `./ghost.sh stop` |
| `restart` | 重启服务 | `./ghost.sh restart` |
| `status` | 查看服务状态 | `./ghost.sh status` |
| `logs` | 查看日志 | `./ghost.sh logs` |
| `logs -f` | 实时查看日志 | `./ghost.sh logs -f` |
| `logs -n N` | 查看最近N行日志 | `./ghost.sh logs -n 100` |
| `manage` | 进入完整管理界面 | `./ghost.sh manage` |
| `help` | 显示帮助信息 | `./ghost.sh help` |

## 服务信息

- **监听端口**: 3001 (内部) → 8080 (外网)
- **外网访问**: http://118.145.99.224:8080
- **健康检查**: http://118.145.99.224:8080/api/health
- **前端页面**: http://118.145.99.224:8080/ghost-chatroom.html

## 日志位置

- 服务日志: `logs/service.log`
- 管理日志: `logs/manage.log`
- 讨论记录: `records/*.md`

## 脚本目录结构

```
yoko-blog-server/
├── ghost.sh                 # 统一入口脚本
├── scripts/                 # 脚本目录
│   ├── manage-service.sh   # 完整管理界面
│   ├── quick-start.sh      # 快速启动
│   ├── stop-service.sh     # 停止服务
│   └── check-status.sh     # 状态检查
├── src/                     # 源代码
├── logs/                    # 日志文件
└── records/                 # 讨论记录
```

## 故障排查

### 服务无法启动
```bash
# 查看日志
./ghost.sh logs -n 100

# 检查端口占用
ss -tlnp | grep 3001

# 查看进程
ps aux | grep node
```

### 服务响应异常
```bash
# 重启服务
./ghost.sh restart

# 查看实时日志
./ghost.sh logs -f
```

### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3001

# 停止占用进程
kill <PID>
```
