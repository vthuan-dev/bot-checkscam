#!/usr/bin/env python3
"""
Run script cho CheckScam Telegram Bot
"""

import sys
import os
from pathlib import Path

def main():
    """Main function để chạy bot"""
    if len(sys.argv) > 1 and sys.argv[1] == 'simple':
        print("🚀 Chạy bot simple version...")
        from bot_simple import main as run_simple
        run_simple()
    else:
        print("🚀 Chạy bot full version...")
        from bot import main as run_full
        run_full()

if __name__ == '__main__':
    main()