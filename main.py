from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=[""], allow_headers=[""],
)

latest_data = {
    "STM32": {},
    "BMP180": {},
    "CH": {}
}
clients = set()

@app.get("/")
async def root():
    return {"status": "running"}

@app.post("/update")
async def update_data(request: Request):
    data = await request.json()
    for key in data:
        if key in latest_data:
            latest_data[key].update(data[key])
    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    try:
        while True:
            await asyncio.sleep(1000)
    except WebSocketDisconnect:
        clients.remove(websocket)

@app.on_event("startup")
async def startup():
    asyncio.create_task(broadcast_data())

async def broadcast_data():
    while True:
        await asyncio.sleep(1)
        text = json.dumps(latest_data)
        dead_clients = set()
        for ws in clients:
            try:
                await ws.send_text(text)
            except:
                dead_clients.add(ws)
        for dc in dead_clients:
            clients.remove(dc)
