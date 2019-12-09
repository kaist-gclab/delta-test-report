#!/usr/bin/env bash
rm -rf ./delta-server/ ./delta-object-storage/ ./delta-processor-null/

git clone --depth=1 https://github.com/kaist-gclab/delta-server
git clone --depth=1 https://github.com/kaist-gclab/delta-object-storage
git clone --depth=1 https://github.com/kaist-gclab/delta-processor-null
