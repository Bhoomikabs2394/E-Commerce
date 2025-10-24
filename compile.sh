#!/usr/bin/env bash
set -e
echo "Compiling discount.cpp..."
g++ -std=c++11 discount.cpp -O2 -o discount
if [ $? -ne 0 ]; then
  echo "Compilation failed"
  exit 1
fi
chmod +x discount
echo "Compiled ./discount"
