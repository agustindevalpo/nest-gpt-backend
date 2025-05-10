import * as path from "path";
import * as fs from "fs";
import OpenAI from "openai";

interface Options {
  prompt: string;
  voice?: string;
}

export interface AudioResult {
  ok: boolean;
  fileName?: string;
  filePath?: string;
  message?: string;
  error?: string;
}

export const textToAudioUseCase = async (openai: OpenAI, { prompt, voice }: Options): Promise<AudioResult> => {
  const voices = {
    alloy: "alloy",
    echo: "echo",
    fable: "fable",
    onyx: "onyx",
    nova: "nova",
    shimmer: "shimmer"
  };

  const selectedVoice = voices[voice?.toLowerCase() ?? "nova"];

  const folderPath = path.resolve(__dirname, "../../../generated/audios");
  fs.mkdirSync(folderPath, { recursive: true });

  const fileName = `${Date.now()}.mp3`;
  const filePath = path.resolve(folderPath, fileName);

  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: selectedVoice,
      input: prompt,
      response_format: "mp3"
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return {
      ok: true,
      fileName: fileName.replace('.mp3', ''),
      filePath: filePath
    };
  } catch (error) {
    console.error("Error en textToAudioUseCase:", error);
    return {
      ok: false,
      message: "No se pudo generar el audio",
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};