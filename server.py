import asyncio
import websockets
import json
import logging

logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(message)s')

clients = set()

async def handler(websocket):
    clients.add(websocket)
    logging.info(f"Nuevo cliente conectado. Clientes totales: {len(clients)}")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if data.get("type") == "track":
                    lyrics = data.get("lyrics", [])
                    logging.info(f"TRACK: {data.get('title')} - {data.get('artist')}. Lyrics lines: {len(lyrics)}")
                    if lyrics:
                        logging.info(f"First 3 lines of lyrics: {lyrics[:3]}")
            except Exception as e:
                pass
            # Reenviar el mensaje a todos los demás clientes conectados (incluyendo OBS)
            for client in clients:
                if client != websocket:
                    try:
                        await client.send(message)
                    except websockets.exceptions.ConnectionClosed:
                        pass
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        clients.remove(websocket)
        logging.info(f"Cliente desconectado. Clientes totales: {len(clients)}")
        # Notificar a los clientes restantes que la reproducción se detuvo (por si se cerró Spotify)
        for client in clients:
            try:
                await client.send(json.dumps({"type": "playstate", "playing": False}))
            except websockets.exceptions.ConnectionClosed:
                pass

async def main():
    print("=========================================================")
    print("Servidor WebSocket de Lyrics iniciado en ws://127.0.0.1:8989")
    print("Asegúrate de que la extensión de Spicetify esté instalada.")
    print("Agrega 'index.html' como una Fuente de Navegador en OBS.")
    print("=========================================================")
    async with websockets.serve(handler, "127.0.0.1", 8989):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServidor detenido.")
