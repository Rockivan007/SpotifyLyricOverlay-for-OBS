# SpotifyLyricOverlay-for-OBS

A custom OBS widget that displays Spotify lyrics in real time with a clean now playing style, perfect for streams and personalized overlays.

# OBS Spotify Lyrics Extension

![Spotify Lyric Overlay](https://github.com/Rockivan007/SpotifyLyricOverlay-for-OBS/blob/main/overlay.png?raw=true)

[English](#english) | [Español](#español)

---

# English

This dynamic and elegant overlay widget displays Spotify real-time synchronized lyrics on OBS Studio.

## Requirements
* [**Spotify**](https://www.spotify.com/download/)[web:2] (official desktop app, not the Microsoft Store version).
* [**Spicetify**](https://spicetify.app/index.html)[web:6] installed and configured on Spotify.
* [**Python 3**](https://www.python.org/downloads/)[web:7] installed (to run the local WebSocket server).

## Installation & Usage Instructions

### 0. Install Python Dependencies
Before running the WebSocket server, you need to install the required Python package:
```bash
pip install websockets
```
*(This installs the `websockets` library needed for the WebSocket server. Other imports like `asyncio`, `json`, and `logging` are built-in to Python.)*

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
* [**Spotify**](https://www.spotify.com/download/)[web:2] (versión de escritorio oficial, no la de la tienda de Microsoft).
* [**Spicetify**](https://spicetify.app/index.html)[web:6] instalado y configurado en Spotify.
* [**Python 3**](https://www.python.org/downloads/)[web:7] instalado (para correr el servidor WebSocket local).

## Instrucciones de Instalación y Uso

### 0. Instalar Dependencias de Python
Antes de ejecutar el servidor WebSocket, necesitas instalar el paquete de Python requerido:
```bash
pip install websockets
```
*(Esto instala la biblioteca `websockets` necesaria para el servidor WebSocket. Los otros imports como `asyncio`, `json` y `logging` son builtin de Python.)*

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
``]
*(Mantén esta ventana abierta mientras hagas stream).*

### 3. Configurar OBS Studio
1. Abre OBS y añade una fuente de **Navegador** (Browser Source) en tu escena.
2. Activa la casilla **Local file** (Archivo local).
3. Haz clic en **Examinar** (Browse) y selecciona el archivo `index.html`.
4. Establece la resolución en **650 x 320** (es la escala rectangular recomendada).
5. ¡Listo! Al reproducir música en Spotify, el widget aparecerá automáticamente con la portada, título, barra de progreso y letras dinámicas en verde Spotify (`#1db954`).

***

# License - Non-Commercial Attribution with Corporate Use Exception

Copyright (c) 2026 rockivan 007

You are free to use, copy, modify, and share this software and its source code under the following conditions:

### For Individuals and Organizations (Including Companies):

- You **must give appropriate credit** to the original author (`rockivan 007`) in your project, documentation, or about page.  
- You **must include a copy** of this license (or a clear link to it) in any copy or fork of this project.  
- **Companies and businesses are permitted to use this software freely without paying any fee**, including in their own products and services.  

### Commercial Restrictions:

- You **may not sell** this software directly, sublicense it for a fee, or use it in any product or service where **this project is the main functionality being charged for**.  
- You **may not sell this software as a paid extension** or premium feature that users must pay to access.  
- You **may sell your product or service** that includes this software **only if**:  
  - This software is included as a **free extension/component** (not a paid feature).  
  - Appropriate credit is given to `rockivan 007`.  
  - This software is **not the core product** around which the entire product revolves (i.e., your product must have substantial functionality beyond this software).  
- You **may modify this project for your internal or commercial use**, but the product cannot be centered entirely around this project.  

### Additional Permission Notice

- **Everyone, including companies and organizations, may use this software freely as long as they comply with the conditions above.**  
- If your intended use falls outside these uses or conditions, you must contact the author personally to request explicit permission at: **[contact@furro.es](mailto:contact@furro.es)**  

### Summary

- **Free for all use** (including corporate) when given as a free component with credit.  
- **Cannot sell this software directly** or as a paid extension/feature.  
- **Can sell your product** that includes this software as a free component, provided it's not the main focus and credit is given.  
- **For any use outside these terms, prior permission is required via contact@furro.es**  

This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the author be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
```
