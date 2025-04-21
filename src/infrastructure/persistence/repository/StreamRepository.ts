import { Stream } from "../../../domain/entity/Stream";
import { StreamRepositoryPort } from "../../../domain/port/out/StreamRepositoryPort";
import { StreamModel } from "../moongose/StreamDocument";

export class StreamRepository implements StreamRepositoryPort{

    async save(stream: Stream): Promise<Stream> {
        const streamDoc = new StreamModel({
            isRecording: stream.getIsRecording(),
            startedAt: stream.getStartedAt(),
            stoppedAt: stream.getStoppedAt(),
          });
      
          const saved = await streamDoc.save();
          stream.assignId(saved.id.toString());
          return stream;
    }

    async findById(id: string): Promise<Stream> {
        const found = await StreamModel.findById(id).exec();
        if (!found) throw new Error(`Stream con id ${id} no encontrado`);
    
        const stream = new Stream(found.startedAt);
        stream.assignId(found.id.toString());
    
        if (!found.isRecording) {
          stream.stop();
        }
    
        return stream;
      }
}