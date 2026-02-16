#!/usr/bin/env python3
"""
Bot 日志管理模块
负责日志记录、归档、切换等功能
"""

import json
import os
from datetime import datetime
from pathlib import Path

WORKSPACE = Path("/root/.openclaw/workspace")
MEMORY_DIR = WORKSPACE / "memory"
LOGS_DIR = MEMORY_DIR / "logs"
ARCHIVE_DIR = LOGS_DIR / "archive"
LOG_INDEX = MEMORY_DIR / "log-index.json"
CURRENT_LOG = LOGS_DIR / "current.log"


def ensure_dirs():
    """确保必要的目录存在"""
    for dir_path in [MEMORY_DIR, LOGS_DIR, ARCHIVE_DIR]:
        dir_path.mkdir(parents=True, exist_ok=True)


def load_log_index():
    """加载日志索引"""
    ensure_dirs()
    if not LOG_INDEX.exists():
        index = {
            "current_log": str(CURRENT_LOG.relative_to(WORKSPACE)),
            "current_session": "",
            "logs": []
        }
        save_log_index(index)
        return index
    with open(LOG_INDEX, "r", encoding="utf-8") as f:
        return json.load(f)


def save_log_index(index):
    """保存日志索引"""
    ensure_dirs()
    with open(LOG_INDEX, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)


def get_timestamp():
    """获取当前时间戳"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def get_iso_timestamp():
    """获取ISO格式时间戳"""
    return datetime.now().isoformat() + "Z"


def log_message(level: str, message: str):
    """记录一条日志"""
    ensure_dirs()
    timestamp = get_timestamp()
    log_line = f"[{timestamp}] [{level}] {message}\n"
    
    with open(CURRENT_LOG, "a", encoding="utf-8") as f:
        f.write(log_line)


def start_session(session_id: str):
    """开始新会话"""
    index = load_log_index()
    
    # 如果当前日志存在且有内容，先归档
    if CURRENT_LOG.exists() and CURRENT_LOG.stat().st_size > 0:
        archive_current_session(index)
    
    # 创建新的空日志文件
    CURRENT_LOG.touch()
    
    # 更新索引
    index["current_session"] = session_id
    index["current_log"] = str(CURRENT_LOG.relative_to(WORKSPACE))
    save_log_index(index)
    
    # 记录会话开始
    log_message("SESSION", f"会话开始: {session_id}")
    return index


def archive_current_session(index: dict = None):
    """归档当前会话"""
    if index is None:
        index = load_log_index()
    
    if not CURRENT_LOG.exists() or CURRENT_LOG.stat().st_size == 0:
        return None
    
    # 读取当前日志的第一条和最后一条来确定时间范围
    with open(CURRENT_LOG, "r", encoding="utf-8") as f:
        lines = f.readlines()
        if not lines:
            return None
        
        # 解析开始时间（从第一条日志）
        start_time = get_iso_timestamp()
        try:
            first_line = lines[0]
            if "[" in first_line and "]" in first_line:
                time_str = first_line.split("[")[1].split("]")[0]
                start_time = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"
        except:
            pass
        
        # 解析结束时间（从最后一条日志）
        end_time = get_iso_timestamp()
        try:
            last_line = lines[-1]
            if "[" in last_line and "]" in last_line:
                time_str = last_line.split("[")[1].split("]")[0]
                end_time = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"
        except:
            pass
    
    # 生成归档文件名
    session_id = index.get("current_session", "unknown")
    archive_name = f"{session_id}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"
    archive_path = ARCHIVE_DIR / archive_name
    
    # 移动当前日志到归档
    CURRENT_LOG.rename(archive_path)
    
    # 更新索引
    archive_info = {
        "session_id": session_id,
        "path": str(archive_path.relative_to(WORKSPACE)),
        "start_time": start_time,
        "end_time": end_time,
        "status": "archived"
    }
    index["logs"].insert(0, archive_info)  # 最新的在前面
    save_log_index(index)
    
    return archive_info


def log_context_state(cwnd: int, ssthresh: int, tokens: int, phase: str):
    """记录上下文控制状态"""
    log_message("CONTEXT", f"cwnd: {cwnd}, ssthresh: {ssthresh}, tokens: {tokens}, phase: {phase}")


def log_compression(level: str, details: str):
    """记录压缩操作"""
    log_message("COMPRESS", f"[{level}] {details}")


def log_user_message(message: str):
    """记录用户消息"""
    log_message("MESSAGE", f"用户: {message}")


def log_assistant_message(message: str):
    """记录助手消息"""
    # 截断过长的消息
    if len(message) > 500:
        message = message[:500] + "..."
    log_message("MESSAGE", f"助手: {message}")


if __name__ == "__main__":
    # 简单测试
    print("日志管理器测试")
    log_message("INFO", "这是一条测试日志")
    print(f"日志已写入: {CURRENT_LOG}")
