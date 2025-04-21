import { Router } from "express";
import { StreamController } from "../controller/StreamController";
import { StreamApplicationService } from "../../application/service/StreamApplicationService";
import { StreamDomainService } from "../../domain/service/StreamDomainService";
import { StreamRepository } from "../persistence/repository/StreamRepository";
import { FFmpegStreamProcessorAdapter } from "../ffmpeg/FfmpeStreamProcessAdapter";

const routerStream = Router();

const repository = new StreamRepository();
const domainService = new StreamDomainService(repository);
const ffmpegAdapter = new FFmpegStreamProcessorAdapter()
const applicationService = new StreamApplicationService(domainService, ffmpegAdapter);
const controller = new StreamController(applicationService);

routerStream.post("/stream/start", (req, res) => controller.startStream(req, res));
routerStream.post("/stream/stop/:id", (req, res) => controller.stopStream(req, res));

export default routerStream;
