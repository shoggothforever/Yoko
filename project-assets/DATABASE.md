# DATABASE ARCHITECTURE - 数据库架构

## Overview
- **Vector DB:** Chroma (Python) - ✅ Ready (lightweight mode)
- **Cache:** Redis (Systemd) - ✅ Ready
- **RAG Memories:** Full memory system in `memory/rag-memories/`
- **SimpleCache:** Python dict + JSON - ✅ Ready (fallback)
- **Purpose:** Memory retrieval, blog post search, session state management

---

## Current Status

### ✅ Ready
- **Redis** - Cache & session store
  - Status: ✅ Running on localhost:6379
  - File: `scripts/redis_cache.py`
  - Usage: Session state, token tracking, hot data
  - Persistence: AOF + RDB
- **SimpleCache** - Python-based cache (fallback)
  - File: `scripts/simple_cache.py`
  - Usage: Fallback if Redis unavailable

### 🔄 Installing
- **ChromaDB** - Vector database
  - Status: pip install running...
  - File: `scripts/init-chroma.py` (ready)
  - Collections: blog_posts, memory_fragments, character_sheets

---

## Chroma Collections (向量数据库集合)

### 1. `blog_posts` - 博客文章
- **Purpose:** Semantic search over blog content
- **Metadata:**
  - `title`: Post title
  - `date`: Publication date
  - `topics`: Comma-separated keywords
  - `path`: File path
- **Embedding Model:** sentence-transformers (all-MiniLM-L6-v2)

### 2. `memory_fragments` - 记忆碎片
- **Purpose:** RAG retrieval for long-term memory
- **Metadata:**
  - `date`: Memory date
  - `type`: "event", "thought", "decision", "lesson"
  - `source`: "daily_log", "MEMORY.md", "conversation"
- **Chunking:** 512-token chunks with overlap

### 3. `character_sheets` - 角色设定
- **Purpose:** Quick access to Gally, Motoko, etc.
- **Metadata:**
  - `name`: Character name
  - `source`: "Gunnm", "Ghost in the Shell", etc.
  - `type`: "main", "supporting", "guest"

---

## SimpleCache Usage (当前可用)

### Quick Start
```python
from scripts.simple_cache import cache_get, cache_set, cache_incr

# Set value
cache_set("session:abc123:tokens", 15000)

# Get value
tokens = cache_get("session:abc123:tokens", 0)

# Increment counter
cache_incr("message_count")
```

### Cache Keys
- `session:{session_id}:state` - Current session state
- `session:{session_id}:tokens` - Token usage tracking
- `context:cwnd` - Congestion window for context control
- `context:ssthresh` - Slow start threshold
- `blog:recent` - Recent posts cache
- `memory:recent` - Recent memories

---

## Setup Instructions

### Chroma Setup (When pip finishes)
```bash
# Already running: pip install chromadb sentence-transformers
# Then run:
python3 scripts/init-chroma.py
```

### SimpleCache Setup (Ready Now)
```python
from scripts.simple_cache import get_cache
cache = get_cache()
```

---

## Files

- `scripts/init-chroma.py` - Chroma initialization script
- `scripts/simple_cache.py` - Simple cache implementation
- `project-assets/DATABASE.md` - This document
- `memory/simple-cache.json` - Cache persistence (auto-created)

---

*For Chroma initialization, wait for pip install to complete, then run `python3 scripts/init-chroma.py`*
