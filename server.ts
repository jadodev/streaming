import app from './app';
import express from "express";
import { RTMPServer } from './src/infrastructure/rtpm/RTPMService';

const RTMP_PORT = 1935;
const HTTP_STREAM_PORT = 8000;

const rtmpServer = new RTMPServer(RTMP_PORT, HTTP_STREAM_PORT);
app.use('/hls', express.static('C:\\temp\\hls_output'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  rtmpServer.start();
});
