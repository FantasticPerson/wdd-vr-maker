@echo off
echo MAKE PANO (MULTIRES) droplet

set KRPANOTOOLSEXE=krpanotools64.exe
if "%PROCESSOR_ARCHITECTURE%" == "x86" set KRPANOTOOLSEXE=krpanotools32.exe

"%~dp0\%KRPANOTOOLSEXE%" makepano "%~dp0\templates\multires.config" "%1%"
GOTO DONE

:ERROR
echo.
echo Drag and drop panoramic images on this droplet to create 
echo automatically multiresolution panoramas from it.

:DONE
echo.