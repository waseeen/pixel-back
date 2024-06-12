import express from 'express';
import { config } from 'dotenv';
import api from './api';
import WebSocket from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import TileService from './services/tileService';
import { dbInit } from './database';

config();
export const tilesProvider = new TileService(
  Number(process.env.WIDTH),
  Number(process.env.HEIGHT),
  Number(process.env.COOLDOWN),
);
const app = express();
const server = createServer(app);
export const ws = new WebSocket.Server({ server });

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
  }),
);

app.use('/', express.json(), api);

dbInit().then(() => {
  tilesProvider.initGet();
  ws.on('connection', async (c) => {
    c.send(JSON.stringify(tilesProvider.get()));
  });

  server.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
  });
});
