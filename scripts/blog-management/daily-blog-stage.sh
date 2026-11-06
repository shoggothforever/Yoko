#!/bin/bash
# Compatibility entry point for retired system-cron stages.
# Daily writing and publication are now handled by the single app automation.
printf '%s\n' 'The old daily-blog stages are retired; this command makes no changes.'
printf '%s\n' 'Remove their cron entries with: python3 scripts/blog-management/install-daily-blog-cron.py --remove'
exit 0
