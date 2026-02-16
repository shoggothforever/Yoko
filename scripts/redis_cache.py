#!/usr/bin/env python3
"""
Redis缓存封装
用于会话状态、token追踪、热点数据缓存
"""

import json
from pathlib import Path
from datetime import datetime

# 尝试导入Redis
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    print("Redis-py not installed. Using SimpleCache fallback.")
    from scripts.simple_cache import SimpleCache


WORKSPACE = Path("/root/.openclaw/workspace")


class RedisCache:
    """Redis缓存封装"""
    
    def __init__(self, host='localhost', port=6379, db=0):
        self.host = host
        self.port = port
        self.db = db
        self._client = None
        self._fallback = None
        
        if REDIS_AVAILABLE:
            try:
                self._client = redis.Redis(
                    host=host,
                    port=port,
                    db=db,
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5
                )
                # 测试连接
                self._client.ping()
                print(f"Connected to Redis: {host}:{port}")
            except Exception as e:
                print(f"Redis connection failed: {e}")
                print("Falling back to SimpleCache")
                self._client = None
        
        # 如果Redis不可用，使用SimpleCache作为后备
        if not self._client:
            from scripts.simple_cache import SimpleCache
            self._fallback = SimpleCache()
    
    def _is_redis_available(self):
        """检查Redis是否可用"""
        return self._client is not None
    
    def get(self, key, default=None):
        """获取缓存值"""
        if self._is_redis_available():
            value = self._client.get(key)
            if value is None:
                return default
            try:
                return json.loads(value)
            except:
                return value
        else:
            return self._fallback.get(key, default)
    
    def set(self, key, value, ex=None):
        """设置缓存值"""
        if self._is_redis_available():
            if isinstance(value, (dict, list, int, float, bool)):
                value = json.dumps(value, ensure_ascii=False)
            self._client.set(key, value, ex=ex)
        else:
            self._fallback.set(key, value)
    
    def incr(self, key, amount=1):
        """递增计数"""
        if self._is_redis_available():
            return self._client.incrby(key, amount)
        else:
            return self._fallback.incr(key, amount)
    
    def delete(self, key):
        """删除键"""
        if self._is_redis_available():
            self._client.delete(key)
        else:
            self._fallback.delete(key)
    
    def keys(self, pattern=None):
        """获取所有键"""
        if self._is_redis_available():
            if pattern:
                return self._client.keys(pattern)
            return self._client.keys("*")
        else:
            return self._fallback.keys(pattern)
    
    def ping(self):
        """测试连接"""
        if self._is_redis_available():
            try:
                return self._client.ping()
            except:
                return False
        return False


# 全局缓存实例
_redis_cache = None


def get_cache():
    """获取全局缓存实例"""
    global _redis_cache
    if _redis_cache is None:
        _redis_cache = RedisCache()
    return _redis_cache


# 快捷函数
def cache_get(key, default=None):
    return get_cache().get(key, default)

def cache_set(key, value, ex=None):
    return get_cache().set(key, value, ex)

def cache_incr(key, amount=1):
    return get_cache().incr(key, amount)

def cache_delete(key):
    return get_cache().delete(key)


if __name__ == "__main__":
    # 测试
    print("Redis Cache Test")
    print(f"Redis available: {REDIS_AVAILABLE}")
    
    cache = get_cache()
    print(f"Cache type: {'Redis' if cache._is_redis_available() else 'SimpleCache (fallback)'}")
    
    cache_set("test_key", "test_value")
    print(f"Get: {cache_get('test_key')}")
    
    cache_incr("counter")
    cache_incr("counter")
    print(f"Counter: {cache_get('counter')}")
    
    print("Test complete!")
