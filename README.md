# App de streaming y carga de video

## Desacarga del repositorio

```
  git clone https://github.com/jadodev/streaming.git
```

### Debes asegurarte de tener instalado ffmpeg, si no descargalo de aquí:

-Ve a:
```
 https://www.gyan.dev/ffmpeg/builds/
```
-Haz clic en "ffmpeg-release-full.7z" o "ffmpeg-release-essentials.7z" según lo que necesites (la versión "essentials" suele ser suficiente).

-Extrae el archivo .7z (usa 7-Zip si no tienes cómo abrirlo).

-Agrega la ruta de la carpeta bin a las variables de entorno (PATH) para poder usar ffmpeg desde la terminal (cmd o PowerShell).

###Debes tener redis instalado, si no descargalo de aquí:

📦 Descargar Redis para Windows (no oficial):
```
 https://github.com/microsoftarchive/redis/releases
```
Ahí verás varias versiones.

Te recomiendo descargar este archivo:
👉 Redis-x64-5.0.14.1.zip

📁 Una vez descargado:

Descomprime el .zip en una carpeta (por ejemplo: C:\redis).

Dentro encontrarás redis-server.exe y redis-cli.exe.

Puedes ejecutarlo directamente desde ahí, como ya hiciste. 😎

### Asegurate de tener mongo db instalado, si no instalalo siguiendo este tutorial:
  
```
 https://youtu.be/_C6AuXNySqo?si=8ucN__cNhg6ICG7t
```
### ingresa al proyecto y ejecuta yarn install y una vez hayas hecho esto yarn dev.

## el frontend para la transmision de video usa dos endpoints que quedaran en un html de ejemplo:

#### *Broadcaster o emisor de la transmision
```
<!DOCTYPE html>
<html>
<head>
    <title>Broadcaster</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        #status { margin: 15px 0; padding: 10px; border-radius: 4px; }
        .active { background: #d4edda; }
        .error { background: #f8d7da; }
    </style>
</head>
<body>
    <h1>Control de Transmisión</h1>
    <button id="startBtn">Iniciar Transmisión</button>
    <button id="stopBtn" disabled>Detener Transmisión</button>
    <div id="status"></div>
    <div id="obsConfig" style="margin-top: 20px; display: none;">
        <h3>Configuración OBS</h3>
        <p><strong>Servidor:</strong> <code>rtmp://localhost:1935/live</code></p>
        <p><strong>Clave de stream:</strong> <code id="streamKey"></code></p>
    </div>

    <script>
        const apiBaseUrl = 'http://localhost:3000';
        let currentStreamId = null;

        document.getElementById('startBtn').addEventListener('click', async () => {
            event.preventDefault(); 
            try {
                updateStatus("Iniciando transmisión...");
                
                const response = await fetch(`${apiBaseUrl}/stream/start`, {
                    method: 'POST'
                });
                
                if (!response.ok) throw new Error(await response.text());
                
                const { id, streamKey, rtmpUrl } = await response.json();
                currentStreamId = id;
                
                updateStatus(`Transmisión iniciada (ID: ${id})`, 'active');
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
                
                // Mostrar configuración OBS
                document.getElementById('streamKey').textContent = streamKey;
                document.getElementById('obsConfig').style.display = 'block';
                console.log("URL para OBS:", rtmpUrl);
                
            } catch (error) {
                updateStatus(`Error: ${error.message}`, 'error');
                console.error(error);
            }
        });

        document.getElementById('stopBtn').addEventListener('click', async () => {
            if (!currentStreamId) return;
            
            try {
                updateStatus("Deteniendo transmisión...");
                
                const response = await fetch(`${apiBaseUrl}/stream/stop/${currentStreamId}`, {
                    method: 'POST'
                });
                
                if (!response.ok) throw new Error(await response.text());
                
                updateStatus(`Transmisión ${currentStreamId} detenida`);
                document.getElementById('startBtn').disabled = false;
                document.getElementById('stopBtn').disabled = true;
                document.getElementById('obsConfig').style.display = 'none';
                currentStreamId = null;
                
            } catch (error) {
                updateStatus(`Error: ${error.message}`, 'error');
                console.error(error);
            }
        });

        function updateStatus(message, type = '') {
            const statusDiv = document.getElementById('status');
            statusDiv.textContent = message;
            statusDiv.className = type;
        }
    </script>
</body>
</html>
```

### *Viewer o consumidor

```
<!DOCTYPE html>
<html>
<head>
    <title>Viewer</title>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        #video { width: 100%; background: #000; }
    </style>
</head>
<body>
    <h1>Visualizador de Stream</h1>
    <video id="video" controls autoplay></video>
    <div>
        <input type="text" id="streamId" placeholder="Ingrese ID del stream">
        <button id="watchBtn">Ver Stream</button>
    </div>

    <script>
        const video = document.getElementById('video');
        const streamIdInput = document.getElementById('streamId');
        const watchBtn = document.getElementById('watchBtn');
        let hls = null;

        watchBtn.addEventListener('click', () => {
            const streamId = streamIdInput.value.trim();
            if (!streamId) return;

            if (hls) {
                hls.destroy();
            }

            if (Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    maxBufferLength: 1
                });
                hls.loadSource(`http://localhost:3000/hls/${streamId}/playlist.m3u8`);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = `http://localhost:8000/live/${streamId}/index.m3u8`;
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                });
            }
        });
    </script>
</body>
</html>
```

# Formulario de carga 
 ## para el formulario de carga estan disponibles endpoints en archivo de postman.
