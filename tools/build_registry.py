#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build templates/registry.json from imported real templates.

Usage:
  python tools/build_registry.py
  python tools/build_registry.py --templates templates --output templates/registry.json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple


VALID_ORIGINALS = ("original.pptx", "original.potx")


def find_original(template_dir: Path) -> Optional[Path]:
    for filename in VALID_ORIGINALS:
        candidate = template_dir / filename
        if candidate.exists():
            return candidate
    return None


def load_metadata(template_dir: Path) -> Optional[Dict]:
    metadata_file = template_dir / "metadata.json"
    if not metadata_file.exists():
        return None
    return json.loads(metadata_file.read_text(encoding="utf-8"))


def build_entry(template_dir: Path, metadata: Dict, original: Path) -> Dict:
    template_id = metadata.get("template_id") or template_dir.name
    preview_images = []
    for index in range(1, 5):
        preview = template_dir / f"preview-{index:02d}.png"
        if preview.exists():
            preview_images.append(f"./templates/{template_id}/preview-{index:02d}.png")

    return {
        "template_id": template_id,
        "template_name": metadata.get("template_name") or template_id,
        "category": metadata.get("category") or "business",
        "style": metadata.get("style") or "general",
        "cover_image": f"./templates/{template_id}/cover.png",
        "preview_images": preview_images,
        "source_type": metadata.get("source_type") or "local_import",
        "license_type": metadata.get("license_type") or "user_provided",
        "credit_required": bool(metadata.get("credit_required", False)),
        "premium": bool(metadata.get("premium", False)),
        "tags": metadata.get("tags") if isinstance(metadata.get("tags"), list) else [],
        "original_file": metadata.get("original_file") or original.name,
    }


def scan_templates(templates_dir: Path) -> Tuple[List[Dict], Dict[str, int], List[str]]:
    registry: List[Dict] = []
    stats = {
        "folders": 0,
        "has_ppt": 0,
        "has_cover": 0,
        "included": 0,
        "excluded": 0,
    }
    reasons: List[str] = []

    if not templates_dir.exists():
        return registry, stats, ["templates 目录不存在"]

    for template_dir in sorted(templates_dir.iterdir()):
        if not template_dir.is_dir():
            continue

        stats["folders"] += 1
        original = find_original(template_dir)
        cover = template_dir / "cover.png"
        metadata_file = template_dir / "metadata.json"

        if original:
            stats["has_ppt"] += 1
        if cover.exists():
            stats["has_cover"] += 1

        if not original:
            stats["excluded"] += 1
            reasons.append(f"{template_dir.name}：缺少 original.pptx/original.potx")
            continue
        if not cover.exists():
            stats["excluded"] += 1
            reasons.append(f"{template_dir.name}：缺少 cover.png")
            continue
        if not metadata_file.exists():
            stats["excluded"] += 1
            reasons.append(f"{template_dir.name}：缺少 metadata.json")
            continue

        try:
            metadata = load_metadata(template_dir)
            if not metadata:
                raise ValueError("metadata.json 为空")
            registry.append(build_entry(template_dir, metadata, original))
            stats["included"] += 1
        except Exception as exc:
            stats["excluded"] += 1
            reasons.append(f"{template_dir.name}：metadata.json 无法读取：{exc}")

    return registry, stats, reasons


def main() -> int:
    parser = argparse.ArgumentParser(description="生成真实模板 registry.json。")
    parser.add_argument("--templates", default="templates", help="模板目录，默认 templates")
    parser.add_argument("--output", default="templates/registry.json", help="输出 registry.json，默认 templates/registry.json")
    args = parser.parse_args()

    templates_dir = Path(args.templates)
    output_file = Path(args.output)

    registry, stats, reasons = scan_templates(templates_dir)

    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"扫描模板文件夹：{stats['folders']}")
    print(f"有 PPTX/POTX：{stats['has_ppt']}")
    print(f"有 cover.png：{stats['has_cover']}")
    print(f"进入 registry.json：{stats['included']}")
    print(f"排除：{stats['excluded']}")
    if reasons:
        print("排除原因：")
        for reason in reasons:
            print(f"- {reason}")
    else:
        print("排除原因：无")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
