import NodeMediaServer from 'node-media-server';

export class RTMPServer {
  private nms: NodeMediaServer;

  constructor(
    private readonly rtmpPort: number = 1935,
    private readonly httpPort: number = 8000
  ) {
    this.nms = new NodeMediaServer({
      rtmp: {
        port: this.rtmpPort,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
      },
      http: {
        port: this.httpPort,
        mediaroot: './media',
        allow_origin: '*'
      },
      trans: {
        ffmpeg: process.env.FFMPEG_PATH || 'ffmpeg',
        tasks: [
          {
            app: 'live',
            hls: true,
            hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
            dash: true,
            dashFlags: '[f=dash:window_size=3:extra_window_size=1]'
          }
        ]
      }
    });
  }

  start() {
    try {
      this.nms.run();
      console.log(`✅ RTMP Server en rtmp://localhost:${this.rtmpPort}/live`);
      console.log(`✅ HLS Server en http://localhost:${this.httpPort}/live`);
    } catch (err) {
      console.error('❌ Error al iniciar RTMP Server:', err);
    }
  }

  stop() {
    this.nms.stop();
  }
}