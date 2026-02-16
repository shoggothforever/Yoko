#!/usr/bin/env python3
"""
简单内存缓存 - Redis的临时替代品
用于会话状态、token追踪等
"""

import json
import time
from pathlib import Path
from datetime import datetime

WORKSPACE = Path("/root/.openclaw/workspace")
CACHE_FILE = WORKSPACE / "memory" / "simple-cache.json"


class SimpleCache:
    """简单的内存缓存，带持久化"""
    
    def __init__(self):
        self._cache = {}
        self._load()
    
    def _load(self):
        """从文件加载缓存"""
        if CACHE_FILE.exists():
            try:
                with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self._cache = data.get('cache', {})
            except:
                self._cache = {}
    
    def _save(self):
        """保存缓存到文件"""
        CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump({
                'cache': self._cache,
                'last_update': datetime.now().isoformat()
            }, f, ensure_ascii=False, indent=2)
    
    def get(self, key, default=None):
        """获取缓存值"""
        return self._cache.get(key, default)
    
    def set(self, key, value):
        """设置缓存值"""
        self._cache[key] = value
        self._save()
    
    def incr(self, key, amount=1):
        """递增计数"""
        current = self.get(key, 0)
        new_val = current + amount
        self.set(key, new_val)
        return new_val
    
    def delete(self, key):
        """删除键"""
        if key in self._cache:
            del self._cache[key]
            self._save()
    
    def keys(self, pattern=None):
        """获取所有键，支持简单模式匹配"""
        if pattern:
            pattern = pattern.replace('*', '')
            return [k for k in self._cache.keys() if pattern in k]
        return list(self._cache.keys())


# 全局缓存实例
_cache = SimpleCache()


def get_cache():
    """获取全局缓存实例"""
    return _cache


# 快捷函数
def cache_get(key, default=None):
    return _cache.get(key, default)

def cache_set(key, value):
    return _cache.set(key, value)

def cache_incr(key, amount=1):
    return _cache.incr(key, amount)


if __name__ == "__main__":
    # 测试
    print("Simple Cache Test")
    cache_set("test_key", "test_value")
    print(f"Get: {cache_get('test_key')}")
    cache_incr("counter")
    cache_incr("counter")
    print(f"Counter: {cache_get('counter')}")
    print("Test complete!")
