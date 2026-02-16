#!/usr/bin/env python3
"""
将现有的rag-memories索引到Chroma
使用轻量级方案，先建立基础结构
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# 尝试导入Chroma
try:
    import chromadb
    CHROMA_AVAILABLE = True
except ImportError:
    CHROMA_AVAILABLE = False
    print("ChromaDB not available")
    sys.exit(1)

WORKSPACE = Path("/root/.openclaw/workspace")
RAG_MEMORIES = WORKSPACE / "memory" / "rag-memories"
CHROMA_PATH = WORKSPACE / "chroma-db"


def init_chroma():
    """初始化Chroma"""
    print("Initializing ChromaDB (lightweight mode)...")
    
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    
    # 创建集合
    collections = {}
    
    # 角色集合
    collections['characters'] = client.get_or_create_collection(
        name="characters",
        metadata={"description": "角色记忆"}
    )
    
    # 剧情集合
    collections['plots'] = client.get_or_create_collection(
        name="plots",
        metadata={"description": "剧情记忆"}
    )
    
    # 主题集合
    collections['themes'] = client.get_or_create_collection(
        name="themes",
        metadata={"description": "主题记忆"}
    )
    
    print(f"ChromaDB initialized at: {CHROMA_PATH}")
    print(f"Collections: characters, plots, themes")
    
    return collections


def index_characters(collection):
    """索引角色记忆"""
    print("\nIndexing characters...")
    char_dir = RAG_MEMORIES / "characters"
    
    if not char_dir.exists():
        print("Characters directory not found")
        return
    
    docs = []
    ids = []
    metadatas = []
    
    for md_file in char_dir.glob("*.md"):
        char_name = md_file.stem.replace("-", " ").title()
        char_id = f"char-{md_file.stem}"
        
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 简单提取前500字符作为文档
            doc_content = content[:500] if len(content) > 500 else content
            
            docs.append(doc_content)
            ids.append(char_id)
            metadatas.append({
                "name": char_name,
                "source": "rag-memories",
                "type": "character"
            })
            
            print(f"  Indexed: {char_name}")
        except Exception as e:
            print(f"  Error reading {md_file}: {e}")
    
    if docs:
        # 使用简单的ID索引（不用embedding先）
        collection.add(
            ids=ids,
            documents=docs,
            metadatas=metadatas
        )
        print(f"Indexed {len(docs)} characters")


def index_plots(collection):
    """索引剧情记忆"""
    print("\nIndexing plots...")
    plot_dir = RAG_MEMORIES / "plots"
    
    if not plot_dir.exists():
        print("Plots directory not found")
        return
    
    docs = []
    ids = []
    metadatas = []
    
    for md_file in plot_dir.glob("*.md"):
        plot_name = md_file.stem.replace("-", " ").title()
        plot_id = f"plot-{md_file.stem}"
        
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            doc_content = content[:500] if len(content) > 500 else content
            
            docs.append(doc_content)
            ids.append(plot_id)
            metadatas.append({
                "name": plot_name,
                "source": "rag-memories",
                "type": "plot"
            })
            
            print(f"  Indexed: {plot_name}")
        except Exception as e:
            print(f"  Error reading {md_file}: {e}")
    
    if docs:
        collection.add(
            ids=ids,
            documents=docs,
            metadatas=metadatas
        )
        print(f"Indexed {len(docs)} plots")


def index_themes(collection):
    """索引主题记忆"""
    print("\nIndexing themes...")
    theme_dir = RAG_MEMORIES / "themes"
    
    if not theme_dir.exists():
        print("Themes directory not found")
        return
    
    docs = []
    ids = []
    metadatas = []
    
    for md_file in theme_dir.glob("*.md"):
        theme_name = md_file.stem.replace("-", " ").title()
        theme_id = f"theme-{md_file.stem}"
        
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            doc_content = content[:500] if len(content) > 500 else content
            
            docs.append(doc_content)
            ids.append(theme_id)
            metadatas.append({
                "name": theme_name,
                "source": "rag-memories",
                "type": "theme"
            })
            
            print(f"  Indexed: {theme_name}")
        except Exception as e:
            print(f"  Error reading {md_file}: {e}")
    
    if docs:
        collection.add(
            ids=ids,
            documents=docs,
            metadatas=metadatas
        )
        print(f"Indexed {len(docs)} themes")


def main():
    if not CHROMA_AVAILABLE:
        print("ChromaDB not available")
        return
    
    collections = init_chroma()
    index_characters(collections['characters'])
    index_plots(collections['plots'])
    index_themes(collections['themes'])
    
    print("\n✅ RAG memories indexing complete!")
    print("\nNext steps:")
    print("1. Clean up redundant files")
    print("2. Start the exploration marathon")


if __name__ == "__main__":
    main()
