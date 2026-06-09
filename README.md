# SpotifyLyricOverlay-for-OBS
A custom OBS widget that displays Spotify lyrics in real time with a clean now playing style, perfect for streams and personalized overlays.



# OBS Spotify Lyrics Extension

![Spotify Lyric Overlay](https://github.com/Rockivan007/SpotifyLyricOverlay-for-OBS/blob/main/overlay.png?raw=true)

[English](#english) | [Español](#español)

---

# English

This dynamic and elegant overlay widget displays Spotify real-time synchronized lyrics on OBS Studio.

## Requirements
* **Spotify** (official desktop app, not the Microsoft Store version).
* **Spicetify** installed and configured on Spotify.
* **Python 3** installed (to run the local WebSocket server).

## Installation & Usage Instructions

### 1. Install the Spotify Extension (Spicetify)
Copy the `obs_lyrics.js` file to your Spicetify extensions folder:
* **On Windows (PowerShell)**:
  ```powershell
  Copy-Item -Path "obs_lyrics.js" -Destination "$env:USERPROFILE\.spicetify\Extensions\" -Force
  spicetify config extensions obs_lyrics.js
  spicetify apply
  ```

### 2. Start the WebSocket Server
The server acts as a real-time bridge between Spotify and OBS. Open a terminal in this folder and run:
```bash
python server.py
```
*(Keep this window open while streaming).*

### 3. Configure OBS Studio
1. Open OBS and add a **Browser** source to your scene.
2. Check the **Local file** box.
3. Click **Browse** and select the `index.html` file.
4. Set the resolution to **650 x 320** (recommended rectangular scale).
5. Done! When playing music on Spotify, the widget will automatically appear showing the cover art, track info, progress bar, and active green Spotify (`#1db954`) lyrics.

---

# Español

Este widget dinámico y elegante muestra las letras sincronizadas en tiempo real de Spotify en OBS Studio.

## Requisitos
* **Spotify** (versión de escritorio oficial, no la de la tienda de Microsoft).
* **Spicetify** instalado y configurado en Spotify.
* **Python 3** instalado (para correr el servidor WebSocket local).

## Instrucciones de Instalación y Uso

### 1. Instalar la extensión en Spotify (Spicetify)
Copia el archivo `obs_lyrics.js` en tu directorio de extensiones de Spicetify:
* **En Windows (PowerShell)**:
  ```powershell
  Copy-Item -Path "obs_lyrics.js" -Destination "$env:USERPROFILE\.spicetify\Extensions\" -Force
  spicetify config extensions obs_lyrics.js
  spicetify apply
  ```

### 2. Iniciar el Servidor WebSocket
El servidor puente transmite la información en tiempo real desde Spotify hacia OBS. Abre una terminal en esta carpeta y ejecuta:
```bash
python server.py
```
*(Mantén esta ventana abierta mientras hagas stream).*

### 3. Configurar OBS Studio
1. Abre OBS y añade una fuente de **Navegador** (Browser Source) en tu escena.
2. Activa la casilla **Local file** (Archivo local).
3. Haz clic en **Examinar** (Browse) y selecciona el archivo `index.html`.
4. Establece la resolución en **650 x 320** (es la escala rectangular recomendada).
5. ¡Listo! Al reproducir música en Spotify, el widget aparecerá automáticamente con la portada, título, barra de progreso y letras dinámicas en verde Spotify (`#1db954`).

---

# License - Non-Commercial Attribution

Copyright (c) 2026 rockivan 007

You are free to use, copy, modify, and share this software and its source code for **non-commercial purposes only**, under the following conditions:

- You **must give appropriate credit** to the original author (`rockivan 007`) in your project, documentation, or about page.  
- You **must include a copy** of this license (or a clear link to it) in any copy or fork of this project.  
- You **may not sell** this software, sublicense it for a fee, or use it in any product or service that charges money or requires payment to access its main functionality.  

This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the author be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
