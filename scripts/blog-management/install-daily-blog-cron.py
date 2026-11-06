#!/usr/bin/env python3
"""Retired schedule installer; --remove uninstalls only its managed block.

Daily writing and publication use the app automation. This compatibility
command never installs a system-cron schedule on macOS or Linux.
"""
import argparse
import subprocess

BEGIN = "# BEGIN YOKO DAILY BLOG (managed)"
END = "# END YOKO DAILY BLOG (managed)"


def current_crontab():
    result = subprocess.run(["crontab", "-l"], text=True, capture_output=True)
    if result.returncode == 0:
        return result.stdout
    if "no crontab" in result.stderr.lower():
        return ""
    raise SystemExit(result.stderr.strip() or "Unable to read crontab")


def remove_managed_block(text):
    """Preserve unrelated lines verbatim and reject an incomplete block."""
    kept = []
    removed = []
    in_managed = False
    for line in text.splitlines(keepends=True):
        if line.strip() == BEGIN:
            if in_managed:
                raise ValueError("Nested Yoko cron block; no changes made")
            in_managed = True
            removed.append(line)
        elif line.strip() == END:
            if not in_managed:
                raise ValueError("Unmatched Yoko cron end marker; no changes made")
            removed.append(line)
            in_managed = False
        elif in_managed:
            removed.append(line)
        else:
            kept.append(line)
    if in_managed:
        raise ValueError("Unclosed Yoko cron block; no changes made")
    return "".join(kept), removed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--remove", action="store_true", help="Remove the old managed cron block")
    parser.add_argument("--dry-run", action="store_true", help="Show the resulting crontab without changing it")
    args = parser.parse_args()
    if not args.remove:
        print("The Yoko system-cron schedule is retired. Use --remove to uninstall its managed block.")
        return
    original = current_crontab()
    try:
        output, removed = remove_managed_block(original)
    except ValueError as error:
        raise SystemExit(str(error)) from error
    if args.dry_run:
        print(output, end="")
        return
    if not removed:
        print("No managed Yoko cron block is installed; nothing changed.")
        return
    subprocess.run(["crontab", "-"], input=output, text=True, check=True)
    print(f"Removed {len(removed)} managed Yoko cron lines; unrelated entries were preserved.")


if __name__ == "__main__":
    main()
