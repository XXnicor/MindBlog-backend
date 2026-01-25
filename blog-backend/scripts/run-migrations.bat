@echo off
echo ========================================
echo EXECUTANDO MIGRACOES DO BANCO DE DADOS
echo ========================================
echo.

REM Configure suas credenciais aqui
set DB_HOST=localhost
set DB_PORT=3306
set DB_USER=root
set DB_NAME=blog_db

echo Conectando ao banco de dados: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo Usuario: %DB_USER%
echo.

REM Solicita a senha
set /p DB_PASSWORD=Digite a senha do MySQL: 

echo.
echo Executando migrations.sql...
echo.

mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < migrations.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo MIGRACOES CONCLUIDAS COM SUCESSO!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERRO AO EXECUTAR MIGRACOES!
    echo ========================================
)

echo.
pause
