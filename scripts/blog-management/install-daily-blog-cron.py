#!/usr/bin/env python3
"""Install the portable deterministic portion of the daily blog schedule.

Uses only the common `crontab` interface. The daemon must run in UTC+08:00;
unlike CRON_TZ, this works consistently across macOS cron and Linux cron.
"""
import datetime as dt
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RUNNER = ROOT / "scripts" / "blog-management" / "daily-blog-stage.sh"
BEGIN = "# BEGIN YOKO DAILY BLOG (managed)"
END = "# END YOKO DAILY BLOG (managed)"


def current_crontab():
    result = subprocess.run(["crontab", "-l"], text=True, capture_output=True)
    if result.returncode == 0:
        return result.stdout
    if "no crontab" in result.stderr.lower():
        return ""
    raise SystemExit(result.stderr.strip() or "Unable to read crontab")


def remove_managed_and_legacy(text):
    kept = []
    in_managed = False
    removed = []
    for line in text.splitlines():
        if line.strip() == BEGIN:
            in_managed = True
            removed.append(line)
            continue
        if line.strip() == END:
            in_managed = False
            removed.append(line)
            continue
        if in_managed:
            removed.append(line)
            continue
        # Only remove the known Yoko/OpenClaw 09:00 production jobs. Do not
        # touch unrelated 09:00 cron entries owned by the user.
        fields = line.split(None, 5)
        is_0900 = len(fields) == 6 and fields[0] == "0" and fields[1] == "9"
        is_legacy_yoko = re.search(
            r"daily-exploration-cron\.sh|cyberpunk-ghost-discovery\.sh|"
            r"openclaw.*(?:Yoko|yoko|workspace)", line
        )
        if is_0900 and is_legacy_yoko:
            removed.append(line)
        else:
            kept.append(line)
    return kept, removed


def managed_block():
    runner = str(RUNNER)
    return [
        BEGIN,
        "# Times use the host timezone; installer requires UTC+08:00 (Asia/Shanghai).",
        "PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/ChatGPT.app/Contents/Resources",
        f"40 9 * * * /bin/bash {runner} preflight",
        f"45 10 * * * /bin/bash {runner} maintain",
        f"10 11 * * * /bin/bash {runner} pages",
        f"30 11 * * * /bin/bash {runner} sla",
        END,
    ]


def main():
    offset = dt.datetime.now().astimezone().utcoffset()
    if offset != dt.timedelta(hours=8) and "--allow-host-timezone-mismatch" not in sys.argv:
        raise SystemExit(
            f"Host UTC offset is {offset}; set the host timezone to Asia/Shanghai "
            "or rerun with --allow-host-timezone-mismatch after adjusting cron hours."
        )
    original = current_crontab()
    kept, removed = remove_managed_and_legacy(original)
    output = "\n".join([*kept, *managed_block()]).strip() + "\n"
    subprocess.run(["crontab", "-"], input=output, text=True, check=True)
    print(f"Installed deterministic Yoko schedule for {ROOT}")
    if removed:
        print(f"Replaced {len(removed)} managed/legacy cron lines")
    else:
        print("No legacy 09:00 Yoko system cron was present")


if __name__ == "__main__":
    main()
