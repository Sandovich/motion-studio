#!/usr/bin/env bash
# Ставит скилл motion-studio и (опционально) официальные паки в проект, где работает Claude Code.
# Запуск из папки проекта:  bash /путь/к/motion-studio/scripts/install-skills.sh
set -e
REPO="$(cd "$(dirname "$0")/.." && pwd)"
npx skills add "$REPO" -s motion-studio -a claude-code -y --copy          # главный скилл (всё знание внутри)
npx skills add remotion-dev/skills -a claude-code -s '*' -y --copy        # официальные скиллы Remotion
npx skills add emilkowalski/skills --skill apple-design -a claude-code -y --copy   # аудит движения
if [ "$1" = "--full" ]; then
  npx skills add charlie947/motion-graphics-skills -a claude-code -s '*' -y --copy # 13 рецептов отдельными скиллами
  npx skills add heygen-com/hyperframes -a claude-code -s '*' -y --copy            # 21 скилл HyperFrames
fi
echo "Готово. Откройте Claude Code и скажите: «сделай моушн-ролик про …»"
