#!/usr/bin/env python3
"""
Chroma数据库初始化脚本
初始化向量数据库，嵌入博客文章和记忆
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# 尝试导入Chroma
try:
    import chromadb
    from chromadb.utils import embedding_functions
    CHROMA_AVAILABLE = True
except ImportError:
    CHROMA_AVAILABLE = False
    print("ChromaDB not installed yet. Run: pip install chromadb sentence-transformers")
    sys.exit(1)

WORKSPACE = Path("/root/.openclaw/workspace")
BLOG_DIR = WORKSPACE / "yoko-blog" / "posts"
MEMORY_DIR = WORKSPACE / "memory"
CHROMA_PATH = WORKSPACE / "chroma-db"


def init_chroma():
    """初始化Chroma数据库"""
    print("Initializing ChromaDB...")
    
    # 创建Chroma客户端
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    
    # 使用sentence-transformers嵌入函数
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    
    # 创建或获取集合
    collections = {}
    
    # 博客文章集合
    collections['blog_posts'] = client.get_or_create_collection(
        name="blog_posts",
        embedding_function=sentence_transformer_ef,
        metadata={"description": "阳子的博客文章"}
    )
    
    # 记忆碎片集合
    collections['memory_fragments'] = client.get_or_create_collection(
        name="memory_fragments",
        embedding_function=sentence_transformer_ef,
        metadata={"description": "记忆碎片"}
    )
    
    # 角色设定集合
    collections['character_sheets'] = client.get_or_create_collection(
        name="character_sheets",
        embedding_function=sentence_transformer_ef,
        metadata={"description": "角色设定"}
    )
    
    print(f"ChromaDB initialized at: {CHROMA_PATH}")
    print(f"Collections created: blog_posts, memory_fragments, character_sheets")
    
    return collections


def extract_text_from_html(html_path):
    """从HTML中提取文本"""
    try:
        from bs4 import BeautifulSoup
        with open(html_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
        # 提取所有文本
        text = soup.get_text(separator='\n', strip=True)
        return text
    except ImportError:
        # 如果没有BeautifulSoup，简单提取
        with open(html_path, 'r', encoding='utf-8') as f:
            return f.read()


def index_blog_posts(collection):
    """索引博客文章"""
    print("\nIndexing blog posts...")
    
    # 读取博客索引
    index_path = WORKSPACE / "project-assets" / "blog" / "INDEX.md"
    if not index_path.exists():
        print("Blog index not found")
        return
    
    # 简单示例数据
    sample_posts = [
        {
            "id": "post-1",
            "title": "记忆奥德赛",
            "text": "在互联网世界中寻找失去的记忆碎片的旅程。",
            "metadata": {"topics": "记忆,自我探索,Gunnm"}
        },
        {
            "id": "post-2",
            "title": "钢铁与血肉之间",
            "text": "探讨高科技世界中人性的存在意义。",
            "metadata": {"topics": "赛博朋克,人性,科技"}
        }
    ]
    
    # 添加到集合
    collection.add(
        ids=[p['id'] for p in sample_posts],
        documents=[p['text'] for p in sample_posts],
        metadatas=[p['metadata'] for p in sample_posts]
    )
    
    print(f"Indexed {len(sample_posts)} sample blog posts")


def index_memory_fragments(collection):
    """索引记忆碎片"""
    print("\nIndexing memory fragments...")
    
    # 示例记忆数据
    sample_memories = [
        {
            "id": "memory-1",
            "text": "2026-02-15: 创建了草薙素子的独立子agent",
            "metadata": {"type": "event", "source": "conversation"}
        },
        {
            "id": "memory-2",
            "text": "Gally和Motoko进行了圆桌讨论，探讨人类的定义",
            "metadata": {"type": "event", "source": "conversation"}
        }
    ]
    
    collection.add(
        ids=[m['id'] for m in sample_memories],
        documents=[m['text'] for m in sample_memories],
        metadatas=[m['metadata'] for m in sample_memories]
    )
    
    print(f"Indexed {len(sample_memories)} sample memory fragments")


def index_characters(collection):
    """索引角色设定"""
    print("\nIndexing character sheets...")
    
    characters = [
        {
            "id": "char-gally",
            "name": "阳子/Gally",
            "text": "来自废铁镇的战斗天使，灵魂与钢铁的融合",
            "metadata": {"source": "Gunnm", "type": "main"}
        },
        {
            "id": "char-motoko",
            "name": "草薙素子/Motoko",
            "text": "公安9课少佐，Ghost与网络的进化",
            "metadata": {"source": "Ghost in the Shell", "type": "main"}
        }
    ]
    
    collection.add(
        ids=[c['id'] for c in characters],
        documents=[c['text'] for c in characters],
        metadatas=[{"name": c['name'], **c['metadata']} for c in characters]
    )
    
    print(f"Indexed {len(characters)} characters")


def main():
    if not CHROMA_AVAILABLE:
        print("ChromaDB not available")
        return
    
    collections = init_chroma()
    index_blog_posts(collections['blog_posts'])
    index_memory_fragments(collections['memory_fragments'])
    index_characters(collections['character_sheets'])
    
    print("\n✅ Chroma initialization complete!")


if __name__ == "__main__":
    main()
