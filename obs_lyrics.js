// NAME: OBS Lyrics Bridge
// AUTHOR: Antigravity
// DESCRIPTION: Envía canción, letras y estado de reproducción a OBS vía WebSocket local.
// VERSION: 3.0.0

(function OBSLyricsBridge() {
    if (!Spicetify?.Player || !Spicetify?.CosmosAsync) {
        setTimeout(OBSLyricsBridge, 500);
        return;
    }

    let ws = null;
    let currentUri = null;

    // ─── WebSocket ───────────────────────────────────────────────
    function connectWs() {
        ws = new WebSocket("ws://127.0.0.1:8989");
        ws.onopen  = () => {
            console.log("[OBS Lyrics] Conectado");
            sendPlayState();
            handleSongChange();
        };
        ws.onclose = () => setTimeout(connectWs, 5000);
        ws.onerror = () => ws.close();
    }

    function send(payload) {
        if (ws?.readyState === WebSocket.OPEN)
            ws.send(JSON.stringify(payload));
    }

    // ─── Estado de reproducción (play / pause) ───────────────────
    function sendPlayState() {
        const playing = Spicetify.Player.isPlaying();
        send({
            type:     "playstate",
            playing:  playing,
            time:     Spicetify.Player.getProgress(),
            wallTime: Date.now()
        });
    }

    Spicetify.Player.addEventListener("playpause", sendPlayState);

    // ─── Progreso — siempre, incluso en pausa ────────────────────
    setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) {
            send({
                type:     "progress",
                time:     Spicetify.Player.getProgress(),
                playing:  Spicetify.Player.isPlaying(),
                wallTime: Date.now()
            });
        }
    }, 250);

    // ─── Parseo LRC ───────────────────────────────────────────────
    function parseLrc(str) {
        return str.split("\n").reduce((acc, line) => {
            const m = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
            if (m) acc.push({
                time: Math.round((+m[1] * 60 + +m[2]) * 1000),
                text: m[3].trim()
            });
            return acc;
        }, []);
    }

    // ─── Información del track actual ────────────────────────────
    function getTrackMeta() {
        const data  = Spicetify.Player.data;
        const track = data?.item ?? data?.track;
        if (!track) return null;

        let title = "Unknown", artist = "Unknown", album = "", duration = 0, imageUrl = "", uri = track.uri ?? "";

        if (track.metadata) {
            title    = track.metadata.title         ?? title;
            artist   = track.metadata.artist_name   ?? artist;
            album    = track.metadata.album_title    ?? album;
            duration = Math.round((+track.metadata.duration || 0) / 1000);
            imageUrl = track.metadata.image_xlarge_url ?? track.metadata.image_url ?? "";
        } else {
            title    = track.name ?? title;
            artist   = track.artists?.map(a => a.name).join(", ") ?? artist;
            album    = track.album?.name ?? album;
            duration = Math.round((track.duration_ms || 0) / 1000);
            imageUrl = track.album?.images?.[0]?.url ?? "";
        }

        if (imageUrl.startsWith("spotify:image:"))
            imageUrl = "https://i.scdn.co/image/" + imageUrl.split(":")[2];

        return { title, artist, album, duration, imageUrl, uri };
    }

    // ─── Búsqueda de letras ───────────────────────────────────────
    async function fetchSpotifyLyrics(uri) {
        const id = uri.split(":")[2];
        if (!id) return null;
        try {
            const r = await Spicetify.CosmosAsync.get(
                `https://spclient.wg.spotify.com/color-lyrics/v2/track/${id}?format=json&market=from_token`
            );
            // Ignorar letras explícitamente no sincronizadas
            if (r?.lyrics?.syncType === "UNSYNCED") {
                return null;
            }
            if (r?.lyrics?.lines?.length) {
                const mapped = r.lyrics.lines.map(l => ({ time: +l.startTimeMs, text: l.words || "" }));
                // Si hay varias líneas y todas están en el tiempo 0, no están sincronizadas
                if (mapped.length > 1 && mapped.every(l => l.time === 0)) {
                    return null;
                }
                return mapped.filter(l => !isNaN(l.time));
            }
        } catch (_) {}
        return null;
    }

    async function fetchLrclib(title, artist, album, duration) {
        const clean = s => s.replace(/\(.*?\)|\[.*?\]/g, "").trim();
        const t = encodeURIComponent(clean(title));
        const a = encodeURIComponent(clean(artist.split(",")[0]));
        const al = encodeURIComponent(album);

        // Intento 1: exacto con álbum + duración
        try {
            const r = await fetch(`https://lrclib.net/api/get?track_name=${t}&artist_name=${a}&album_name=${al}&duration=${duration}`);
            if (r.ok) { const d = await r.json(); if (d.syncedLyrics) return parseLrc(d.syncedLyrics); }
        } catch (_) {}

        // Intento 2: sin álbum
        try {
            const r = await fetch(`https://lrclib.net/api/get?track_name=${t}&artist_name=${a}&duration=${duration}`);
            if (r.ok) { const d = await r.json(); if (d.syncedLyrics) return parseLrc(d.syncedLyrics); }
        } catch (_) {}

        // Intento 3: búsqueda libre
        try {
            const r = await fetch(`https://lrclib.net/api/search?track_name=${t}&artist_name=${a}`);
            if (r.ok) {
                const list = await r.json();
                const hit  = list?.find(x => x.syncedLyrics);
                if (hit) return parseLrc(hit.syncedLyrics);
            }
        } catch (_) {}

        return null;
    }

    // ─── Cambio de canción ────────────────────────────────────────
    async function handleSongChange() {
        const meta = getTrackMeta();
        if (!meta) return;

        const { title, artist, album, duration, imageUrl, uri } = meta;
        currentUri = uri;

        console.log(`[OBS Lyrics] "${title}" – ${artist}`);

        // Enviar metadatos inmediatamente (sin letra aún)
        send({ type: "track", title, artist, album, duration, cover: imageUrl, lyrics: [] });

        // Buscar letras
        let lyrics = (await fetchSpotifyLyrics(uri)) ?? (await fetchLrclib(title, artist, album, duration)) ?? [];

        // Filtro global: si hay varias líneas y todas tienen tiempo 0, no están sincronizadas
        if (lyrics.length > 1 && lyrics.every(l => l.time === 0)) {
            lyrics = [];
        }

        if (currentUri !== uri) return; // canción cambiada durante la búsqueda

        send({ type: "track", title, artist, album, duration, cover: imageUrl, lyrics });
        console.log(`[OBS Lyrics] ${lyrics.length} líneas enviadas.`);
    }

    Spicetify.Player.addEventListener("songchange", handleSongChange);

    connectWs();
})();
