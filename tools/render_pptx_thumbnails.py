#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Render real PPTX/POTX template covers with LibreOffice.

Usage:
  python tools/render_pptx_thumbnails.py
  python tools/render_pptx_thumbnails.py --overwrite
  python tools/render_pptx_thumbnails.py --soffice "C:\Program Files\LibreOffice\program\soffice.exe"

Important:
- This script never creates fake covers.
- If LibreOffice cannot produce PNG output, manually upload templates/{template_id}/cover.png.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import List, Optional, Tuple


VALID_ORIGINALS = ("original.pptx", "original.potx")


def find_soffice(explicit_path: Optional[str]) -> Optional[str]:
    candidates: List[str] = []

    if explicit_path:
        candidates.append(explicit_path)

    env_path = os.environ.get("LIBREOFFICE_PATH")
    if env_path:
        candidates.append(env_path)

    candidates.append(r"C:\Program Files\LibreOffice\program\soffice.exe")

    path_soffice = shutil.which("soffice")
    if path_soffice:
        candidates.append(path_soffice)

    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return str(Path(candidate))

    return None


def find_original(template_dir: Path) -> Optional[Path]:
    for filename in VALID_ORIGINALS:
        candidate = template_dir / filename
        if candidate.exists():
            return candidate
    return None


def collect_templates(templates_dir: Path) -> List[Tuple[Path, Path]]:
    if not templates_dir.exists():
        return []

    result: List[Tuple[Path, Path]] = []
    for template_dir in sorted(templates_dir.iterdir()):
        if not template_dir.is_dir():
            continue
        original = find_original(template_dir)
        if original:
            result.append((template_dir, original))
    return result


def run_libreoffice_png(soffice: str, source_file: Path, output_dir: Path) -> Tuple[bool, str]:
    command = [
        soffice,
        "--headless",
        "--nologo",
        "--nofirststartwizard",
        "--convert-to",
        "png",
        "--outdir",
        str(output_dir),
        str(source_file),
    ]

    completed = subprocess.run(
        command,
        text=True,
        capture_output=True,
        timeout=120,
        check=False,
    )

    if completed.returncode != 0:
        return False, (completed.stderr or completed.stdout or "LibreOffice 转换失败").strip()

    png_files = sorted(output_dir.glob("*.png"))
    if not png_files:
        return False, "LibreOffice 未输出 PNG 文件；请手动上传 cover.png。"

    return True, "ok"


def render_one(soffice: str, template_dir: Path, original: Path, overwrite: bool) -> Tuple[bool, str]:
    cover_file = template_dir / "cover.png"
    if cover_file.exists() and not overwrite:
        return True, f"{template_dir.name}：cover.png 已存在，跳过"

    with tempfile.TemporaryDirectory(prefix="ppt-cover-") as temp_name:
        temp_dir = Path(temp_name)
        ok, message = run_libreoffice_png(soffice, original, temp_dir)
        if not ok:
            return False, f"{template_dir.name}：{message}"

        png_files = sorted(temp_dir.glob("*.png"))
        if not png_files:
            return False, f"{template_dir.name}：未找到 PNG 输出"

        shutil.copy2(png_files[0], cover_file)

        # Only copy real images actually produced by LibreOffice.
        for index, png_file in enumerate(png_files[:4], start=1):
            preview_file = template_dir / f"preview-{index:02d}.png"
            if preview_file.exists() and not overwrite:
                continue
            shutil.copy2(png_file, preview_file)

    return True, f"{template_dir.name}：已生成真实 cover.png"


def main() -> int:
    parser = argparse.ArgumentParser(description="使用 LibreOffice 为真实 PPTX/POTX 生成 cover.png。")
    parser.add_argument("--templates", default="templates", help="模板目录，默认 templates")
    parser.add_argument("--soffice", default=None, help="LibreOffice soffice.exe 路径")
    parser.add_argument("--overwrite", action="store_true", help="覆盖已存在的 cover.png / preview 图片")
    args = parser.parse_args()

    soffice = find_soffice(args.soffice)
    if not soffice:
        print("请先安装 LibreOffice，或手动上传 cover.png。")
        return 1

    templates = collect_templates(Path(args.templates))
    success = 0
    failed = 0
    messages: List[str] = []

    for template_dir, original in templates:
        try:
            ok, message = render_one(soffice, template_dir, original, args.overwrite)
            messages.append(message)
            if ok:
                success += 1
            else:
                failed += 1
        except Exception as exc:
            failed += 1
            messages.append(f"{template_dir.name}：失败：{exc}")

    print(f"扫描模板：{len(templates)}")
    print(f"成功生成封面：{success}")
    print(f"失败：{failed}")
    if messages:
        print("详情：")
        for message in messages:
            print(f"- {message}")
    else:
        print("详情：未发现 templates/*/original.pptx 或 original.potx。")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
