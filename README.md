# 📌 Guía de Uso de Git - ProyNaVishe_FRONT

Este repositorio contiene las instrucciones básicas para la gestión del código en **ProyNaVishe_FRONT**.

## 🔹 Configuración Inicial
Antes de empezar, configura tu usuario de Git:

```sh
# Configurar tu nombre de usuario
git config --global user.name "Tu Nombre"

# Configurar tu correo electrónico
git config --global user.email "tuemail@example.com"
```

## 🔹 Clonar el Repositorio
Para obtener el código en tu máquina local, clona el repositorio:

```sh
git clone <URL_DEL_REPO>
```

## 🔹 Ver el Estado del Repositorio
Para ver los cambios en el repositorio, usa:

```sh
git status
```

## 🔹 Añadir Cambios al Área de Preparación
Antes de hacer un commit, debes añadir los archivos modificados:

```sh
# Añadir un archivo específico
git add <archivo>

# Añadir todos los archivos modificados
git add .
```

## 🔹 Confirmar Cambios (Commit)
Después de agregar los archivos, confirma los cambios:

```sh
git commit -m "Mensaje del commit"
```

## 🔹 Subir Cambios al Repositorio Remoto
Para enviar tus cambios al repositorio en GitHub:

```sh
git push origin <nombre_rama>
```

⚠ **Nota:** Si necesitas forzar el push (¡Usar con precaución!):

```sh
git push --force
```

## 🔹 Obtener y Fusionar Cambios del Remoto
Si hay cambios en el repositorio remoto que no tienes en tu máquina:

```sh
git pull origin <nombre_rama>
```

## 🔹 Trabajando con Ramas
Para ver las ramas disponibles:

```sh
git branch
```

Para crear una nueva rama:

```sh
git branch <nombre_rama>
```

Para cambiar a una rama específica:

```sh
git checkout <nombre_rama>
```

---
## 📌 **Recomendaciones**
✔ **Usar commits con mensajes descriptivos** para facilitar el seguimiento de cambios.
✔ **Evitar `git push --force` a menos que sea estrictamente necesario**.
✔ **Mantener la rama principal (`main` o `develop`) limpia y estable**.
✔ **Realizar `git pull` antes de `git push` para evitar conflictos.**

---

📌 **Proyecto:** Sistema de Monitoreo y Seguridad para la Apícola Ña Vishe  
📌 **Mantenedor:** [Líder DevSecOps]  

🚀 ¡Feliz desarrollo! 🎯
