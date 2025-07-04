#!/bin/bash
cd /home/kavia/workspace/code-generation/webcalc-66517-2f788904/calculator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

