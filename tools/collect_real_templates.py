#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
V17 real template collector.

Purpose:
- Collect ONLY legally usable public PPTX/POTX files.
- Build templates/{template_id}/original.pptx + metadata.json + cover.svg.
- Build templates/registry.json for the front end.

This script does NOT bypass login, payment, access control, robots restrictions,
or licensing restrictions. It only uses direct sources you list and GitHub public
repositories whose license metadata is in the allowed list.
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Dict, Iterable, List, Optional

ROOT = Path(__file__).resolve().parents[1]
SOURCES_FILE = ROOT / "template_sources.json"
TEMPLATES_DIR = ROOT / "templates"
REGISTRY_FILE = TEMPLATES_DIR / "registry.json"
USER_AGENT = "ai-ppt-studio-cloud-template-collector/17"


def read_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value[:70] or "template"


def request_json(url: str, token: Optional[str] = None) -> Dict:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/vnd.github+json"})
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=35) as response:
        return json.loads(response.read().decode("utf-8"))


def download_bytes(url: str, token: Optional[str] = None, max_bytes: int = 12 * 1024 * 1024) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    if token and "api.github.com" in url:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=60) as response:
        length = response.headers.get("Content-Length")
        if length and int(length) > max_bytes:
            raise ValueError(f"File too large: {int(length)} bytes")
        data = response.read(max_bytes + 1)
        if len(data) > max_bytes:
            raise ValueError("File too large after download")
        return data


def is_pptx_bytes(data: bytes) -> bool:
    # pptx/potx are ZIP files containing ppt/presentation.xml
    return data.startswith(b"PK") and b"ppt/presentation.xml" in data[: min(len(data), 800000)]


def github_search_repositories(query: str, token: Optional[str], per_page: int = 10) -> List[Dict]:
    q = urllib.parse.urlencode({"q": query, "per_page": str(per_page), "sort": "stars", "order": "desc"})
    data = request_json(f"https://api.github.com/search/repositories?{q}", token)
    return data.get("items", [])


def github_repo_license(repo_full_name: str, token: Optional[str]) -> Optional[str]:
    try:
        data = request_json(f"https://api.github.com/repos/{repo_full_name}", token)
        lic = data.get("license") or {}
        return (lic.get("key") or "").lower() or None
    except Exception:
        return None


def github_tree(repo_full_name: str, branch: str, token: Optional[str]) -> List[Dict]:
    data = request_json(f"https://api.github.com/repos/{repo_full_name}/git/trees/{branch}?recursive=1", token)
    return data.get("tree", [])


def raw_github_url(repo_full_name: str, branch: str, path: str) -> str:
    return f"https://raw.githubusercontent.com/{repo_full_name}/{branch}/{urllib.parse.quote(path)}"


def template_id_for(name: str, url: str) -> str:
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:8]
    return f"{slugify(name)}-{digest}"


def infer_category(text: str) -> str:
    t = text.lower()
    if any(x in t for x in ["medical", "health", "clinic", "hospital"]):
        return "medical"
    if any(x in t for x in ["education", "school", "training", "lesson", "course"]):
        return "education"
    if any(x in t for x in ["finance", "report", "kpi", "data", "dashboard"]):
        return "data"
    if any(x in t for x in ["government", "policy", "public", "ngo"]):
        return "public"
    if any(x in t for x in ["startup", "pitch", "business", "corporate"]):
        return "business"
    return "general"


def safe_write_template(item: Dict, data: bytes, license_key: str) -> Optional[Dict]:
    if not is_pptx_bytes(data):
        print(f"skip non-pptx: {item.get('name')}")
        return None
    ext = ".potx" if item.get("url", "").lower().endswith(".potx") else ".pptx"
    tid = template_id_for(item["name"], item["url"])
    tdir = TEMPLATES_DIR / tid
    tdir.mkdir(parents=True, exist_ok=True)
    original = tdir / f"original{ext}"
    original.write_bytes(data)
    cover_svg = make_cover_svg(item["name"], item.get("source", "Public source"), infer_category(item["name"]), license_key)
    (tdir / "cover.svg").write_text(cover_svg, encoding="utf-8")
    meta = {
        "template_id": tid,
        "template_name": item["name"],
        "category": infer_category(item["name"] + " " + item.get("source", "")),
        "source_type": "public_open_source",
        "license_type": license_key,
        "source_url": item["url"],
        "source_repo": item.get("source", ""),
        "original_file": f"./templates/{tid}/original{ext}",
        "cover_image": f"./templates/{tid}/cover.svg",
        "premium": False,
        "credit_required": license_key.startswith("cc-by"),
        "tags": [infer_category(item["name"]), license_key, "real-pptx"]
    }
    (tdir / "metadata.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return meta


def make_cover_svg(title: str, source: str, category: str, license_key: str) -> str:
    # This is not a fake PPT template; it is a generated cover placeholder for a verified real PPTX file.
    # If LibreOffice rendering is added later, cover.svg can be replaced by true slide screenshot.
    colors = {
        "business": ("#071426", "#0f4cbd"),
        "medical": ("#0f766e", "#38bdf8"),
        "education": ("#f97316", "#facc15"),
        "public": ("#0b1d35", "#d6a43a"),
        "data": ("#155e75", "#7c3aed"),
        "general": ("#334155", "#64748b"),
    }.get(category, ("#334155", "#64748b"))
    title = title[:56]
    source = source[:48]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{colors[0]}"/><stop offset="1" stop-color="{colors[1]}"/></linearGradient></defs>
  <rect width="960" height="540" fill="url(#g)"/>
  <circle cx="780" cy="110" r="130" fill="white" opacity="0.12"/>
  <rect x="70" y="74" width="180" height="10" fill="white" opacity="0.75"/>
  <text x="70" y="130" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="white">REAL PPTX TEMPLATE</text>
  <text x="70" y="250" font-family="Arial, sans-serif" font-size="54" font-weight="900" fill="white">{escape_xml(title)}</text>
  <text x="70" y="324" font-family="Arial, sans-serif" font-size="22" fill="white" opacity="0.84">Source: {escape_xml(source)}</text>
  <text x="70" y="365" font-family="Arial, sans-serif" font-size="20" fill="white" opacity="0.72">License: {escape_xml(license_key)}</text>
  <rect x="70" y="430" width="270" height="54" rx="27" fill="white" opacity="0.16"/>
  <text x="98" y="465" font-family="Arial, sans-serif" font-size="19" font-weight="700" fill="white">Verified real PPTX file</text>
</svg>'''


def escape_xml(s: str) -> str:
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def collect_direct_sources(config: Dict, token: Optional[str], max_bytes: int) -> List[Dict]:
    collected = []
    for src in config.get("direct_sources", []):
        try:
            url = src["url"]
            data = download_bytes(url, token, max_bytes=max_bytes)
            item = {"name": src.get("name") or Path(urllib.parse.urlparse(url).path).stem, "url": url, "source": src.get("source_site", "direct")}
            meta = safe_write_template(item, data, src.get("license", "user_configured"))
            if meta:
                collected.append(meta)
        except Exception as exc:
            print(f"direct source failed: {src}: {exc}")
    return collected


def collect_from_github(config: Dict, token: Optional[str], max_templates: int, max_bytes: int) -> List[Dict]:
    allowed = set(x.lower() for x in config.get("allowed_license_keys", []))
    found: List[Dict] = []
    seen_urls = set()
    for query in config.get("repository_queries", []):
        if len(found) >= max_templates:
            break
        try:
            repos = github_search_repositories(query, token, per_page=10)
        except Exception as exc:
            print(f"repo search failed: {query}: {exc}")
            continue
        for repo in repos:
            if len(found) >= max_templates:
                break
            full_name = repo.get("full_name")
            branch = repo.get("default_branch") or "main"
            if not full_name:
                continue
            license_key = github_repo_license(full_name, token)
            if not license_key or license_key.lower() not in allowed:
                print(f"skip license {full_name}: {license_key}")
                continue
            try:
                tree = github_tree(full_name, branch, token)
            except Exception as exc:
                print(f"tree failed {full_name}: {exc}")
                continue
            ppt_paths = [x.get("path") for x in tree if (x.get("type") == "blob" and str(x.get("path", "")).lower().endswith((".pptx", ".potx")))]
            for path in ppt_paths[:4]:
                if len(found) >= max_templates:
                    break
                url = raw_github_url(full_name, branch, path)
                if url in seen_urls:
                    continue
                seen_urls.add(url)
                try:
                    data = download_bytes(url, token, max_bytes=max_bytes)
                    name = Path(path).stem.replace("_", " ").replace("-", " ") or repo.get("name", "template")
                    meta = safe_write_template({"name": name, "url": url, "source": full_name}, data, license_key)
                    if meta:
                        found.append(meta)
                        print(f"collected: {full_name}/{path}")
                except Exception as exc:
                    print(f"download failed {url}: {exc}")
    return found


def build_registry() -> List[Dict]:
    entries = []
    for meta_file in sorted(TEMPLATES_DIR.glob("*/metadata.json")):
        try:
            entries.append(json.loads(meta_file.read_text(encoding="utf-8")))
        except Exception as exc:
            print(f"bad metadata {meta_file}: {exc}")
    TEMPLATES_DIR.mkdir(exist_ok=True)
    REGISTRY_FILE.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return entries


def main() -> int:
    config = read_json(SOURCES_FILE, {})
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    max_templates = int(config.get("max_templates", 12))
    max_bytes = int(float(config.get("max_file_mb", 12)) * 1024 * 1024)
    TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
    collected = []
    collected.extend(collect_direct_sources(config, token, max_bytes))
    if len(collected) < max_templates:
        collected.extend(collect_from_github(config, token, max_templates - len(collected), max_bytes))
    registry = build_registry()
    print(f"Collected this run: {len(collected)}")
    print(f"Registry total: {len(registry)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
