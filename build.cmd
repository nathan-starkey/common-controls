@echo off
setlocal
call tsc
call rollup -c
pushd dist
rmdir /s /q common-controls
del example\example.js
popd
endlocal