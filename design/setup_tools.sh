#!/usr/bin/env bash
# Installs the Python bits used by design/bn_text.py (Bengali shaping) and any
# Pillow work. ImageMagick does everything else and is already in the image.
# Safe to re-run; skips whatever is already importable.
set -e
need() { python3 -c "import $1" 2>/dev/null || echo "$1"; }
pkgs=""
for m in PIL uharfbuzz freetype; do
  [ -n "$(need $m)" ] && pkgs="$pkgs $m"
done
if [ -n "$pkgs" ]; then
  echo "installing:$pkgs"
  python3 -m pip install --break-system-packages --quiet \
    $(echo "$pkgs" | sed 's/PIL/Pillow/; s/freetype/freetype-py/')
fi
python3 - <<'PY'
from PIL import Image
import uharfbuzz, freetype
print("ok — Pillow", Image.__version__, "| uharfbuzz", uharfbuzz.__version__)
PY
