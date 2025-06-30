@echo off
echo =========================================
echo    INICIANDO CONFIGURACIÓN DEL PROYECTO
echo =========================================

:: Crear entorno virtual
echo [1/3] Creando entorno virtual...
python -m venv venv

:: Activar entorno virtual
echo [2/3] Activando entorno virtual...
call venv\Scripts\activate

:: Instalar dependencias
echo [3/3] Instalando dependencias desde requirements.txt...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo =========================================
echo   ENTORNO CONFIGURADO CORRECTAMENTE
echo   Activa el entorno con: venv\Scripts\activate
echo   Ejecuta el servidor con: python app.py
echo =========================================
pause
