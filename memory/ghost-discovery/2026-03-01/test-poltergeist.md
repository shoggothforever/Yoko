# Poltergeist 测试文件

这是一个测试文件，用于验证 Poltergeist 的文件监控功能。

---

**创建时间：** $(date '+%Y-%m-%d %H:%M:%S')
**测试目标：** 验证 `memory/ghost-discovery/**/*.md` 的监控

---

## 预期行为

1. 当这个文件被修改时，Poltergeist 应该检测到
2. 自动运行 `./scripts/blog-management/oneforall.sh`
3. 博客列表和 sitemap 应该被更新

---

## 测试结果

$(date '+%Y-%m-%d %H:%M:%S') - 文件创建成功
