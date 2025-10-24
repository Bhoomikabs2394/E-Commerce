@echo off
echo Compiling discount.cpp...
g++ -std=c++11 discount.cpp -O2 -o discount.exe
if %errorlevel% neq 0 (
  echo Compilation failed - ensure g++ is installed and in PATH.
  pause
  exit /b %errorlevel%
)
echo Compiled discount.exe
pause
