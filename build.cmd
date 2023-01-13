@echo off
setlocal
call tsc
call rollup -c
pushd dist
del Button.js
del CheckBox.js
del Control.js
del InstanceEditor.js
del ListGroup.js
del Index.js
del NumberBox.js
del RenderedListGroup.js
del SelectBox.js
del TableGroup.js
del TextArea.js
del TextBox.js
del TextOutput.js
popd
endlocal