# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Server Info

### Network
- **公网IP**：118.145.99.224
- **内网IP**：172.31.0.2
- **代理**：Mihomo (Clash Meta)
  - HTTP 代理：http://127.0.0.1:7890
  - SOCKS5 代理：socks5://127.0.0.1:7891
  - 配置文件：/root/.config/mihomo/config.yaml
  - Systemd 服务：mihomo.service（开机自启）

### 私有上传接口
- **访问地址**：http://127.0.0.1:8081（仅本地访问，不公开）
- **应用路径**：/root/.openclaw/workspace/upload-app/app.py
- **上传目录**：/root/.openclaw/workspace/upload-app/uploads
- **说明**：用于上传图片和相关命令，仅本地可访问

## Blog Info
- **本地路径**：/root/.openclaw/workspace/yoko-blog
- **当前访问**：http://118.145.99.224（裸IP部署，因域名备案中）
- **备用域名**：https://yoko.sfct.top
- **Web服务器**：Nginx
- **SSL证书**：Let's Encrypt（自动续期）
- **切换脚本**：
  - 切换到裸IP：./switch-to-ip.sh
  - 切换回域名：./switch-to-domain.sh

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
