#!/usr/bin/env bash
TEX=delta-test-report.tex
xelatex $TEX && xelatex $TEX && xelatex $TEX
