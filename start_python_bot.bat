@echo off
REM Script khởi động CheckScam Telegram Bot Python Version cho Windows

echo 🐍 CheckScam Telegram Bot - Python Version
echo ==========================================

REM Kiểm tra Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python không được tìm thấy!
    echo 📦 Tải Python từ: https://python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python version:
python --version

REM Kiểm tra pip
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip không được tìm thấy!
    echo 📦 Cài đặt pip hoặc reinstall Python
    pause
    exit /b 1
)

REM Tạo virtual environment (optional)
if not exist "venv" (
    echo 🔧 Tạo Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Kích hoạt virtual environment...
call venv\Scripts\activate.bat

REM Cài đặt dependencies
echo 📦 Cài đặt Python packages...
pip install -r requirements.txt

REM Kiểm tra file .env
if not exist ".env" (
    echo ⚠️  File .env không tồn tại!
    echo 📝 Tạo file .env với TELEGRAM_BOT_TOKEN
    pause
    exit /b 1
)

REM Kiểm tra bot token
findstr "your_bot_token_here" .env >nul
if not errorlevel 1 (
    echo ⚠️  Vui lòng cập nhật TELEGRAM_BOT_TOKEN trong file .env
    pause
    exit /b 1
)

echo ✅ Tất cả đã sẵn sàng!

REM Chạy bot
echo 🚀 Khởi động bot...
if "%1"=="simple" (
    echo 📱 Chạy Simple Bot (chỉ Facebook lookup)...
    python bot_simple.py
) else (
    echo 📱 Chạy Full Bot (Facebook + Phone + Bank)...
    python bot.py
)

pause