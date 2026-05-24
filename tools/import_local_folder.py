#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import local PPTX/POTX files into templates/{template_id}/.

Usage:
  python tools/import_local_folder.py
  python tools/import_local_folder.py --overwrite
  python tools/import_local_folder.py --input local_imports --output templates --category business --style general
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Tuple


VALID_EXTENSIONS = {".pptx", ".potx"}


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^\w\s-]", "", value, flags=re.UNICODE)
    value = re.sub(r"[\s_]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "template"


def unique_template_id(base_id: str, output_dir: Path) -> str:
    candidate = base_id
    index = 2
    while (output_dir / candidate).exists():
        candidate = f"{base_id}-{index}"
        index += 1
    return candidate


def build_metadata(template_id: str, source_file: Path, category: str, style: str, original_file: str) -> Dict:
    return {
        "template_id": template_id,
        "template_name": source_file.stem.replace("_", " ").replace("-", " ").strip() or template_id,
        "category": category,
        "style": style,
        "source_type": "local_import",
        "license_type": "user_provided",
        "credit_required": False,
        "premium": False,
        "tags": [],
        "original_file": original_file,
    }


def scan_files(input_dir: Path) -> List[Path]:
    if not input_dir.exists():
        return []
    return sorted(
        file for file in input_dir.iterdir()
        if file.is_file() and file.suffix.lower() in VALID_EXTENSIONS
    )


def import_one(source_file: Path, output_dir: Path, category: str, style: str, overwrite: bool) -> Tuple[str, str]:
    base_id = slugify(source_file.stem)
    template_id = base_id if overwrite else unique_template_id(base_id, output_dir)
    template_dir = output_dir / template_id

    if template_dir.exists() and not overwrite:
        return "skipped", f"{source_file.name}：模板已存在，未覆盖"

    template_dir.mkdir(parents=True, exist_ok=True)

    original_name = f"original{source_file.suffix.lower()}"
    destination = template_dir / original_name
    shutil.copy2(source_file, destination)

    metadata = build_metadata(template_id, source_file, category, style, original_name)
    (template_dir / "metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    credits_text = (
        f"Template ID: {template_id}\n"
        f"Original file: {source_file.name}\n"
        "Source type: local_import\n"
        "License type: user_provided\n"
        "Credit required: false\n"
    )
    (template_dir / "credits.txt").write_text(credits_text, encoding="utf-8")

    return "imported", f"{source_file.name} → templates/{template_id}/{original_name}"


def main() -> int:
    parser = argparse.ArgumentParser(description="导入 local_imports 里的真实 PPTX/POTX 到 templates。")
    parser.add_argument("--input", default="local_imports", help="输入目录，默认 local_imports")
    parser.add_argument("--output", default="templates", help="输出目录，默认 templates")
    parser.add_argument("--category", default="business", help="默认分类，默认 business")
    parser.add_argument("--style", default="general", help="默认风格，默认 general")
    parser.add_argument("--overwrite", action="store_true", help="覆盖已存在的同名模板")
    args = parser.parse_args()

    input_dir = Path(args.input)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    files = scan_files(input_dir)
    imported = 0
    skipped = 0
    failed = 0
    messages: List[str] = []

    for source_file in files:
        try:
            status, message = import_one(source_file, output_dir, args.category, args.style, args.overwrite)
            messages.append(message)
            if status == "imported":
                imported += 1
            else:
                skipped += 1
        except Exception as exc:
            failed += 1
            messages.append(f"{source_file.name}：失败：{exc}")

    print(f"扫描文件：{len(files)}")
    print(f"成功导入：{imported}")
    print(f"跳过：{skipped}")
    print(f"失败：{failed}")
    if messages:
        print("详情：")
        for message in messages:
            print(f"- {message}")
    else:
        print("详情：未发现 .pptx / .potx 文件。请把真实模板放入 local_imports/。")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
