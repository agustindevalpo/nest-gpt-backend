// use-cases/prosconsDiscusserStream.use-case.ts
import OpenAI from "openai";
import { Response } from "express";

interface Options {
    prompt: string;
    res: Response;
}

export const prosConsDicusserStreamUseCase = async (
    openai: OpenAI,
    options: Options
) => {
    const { prompt, res } = options;

    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
            {
                role: "system",
                content: `
               Eres un analista especializado en comparar cualquier cosa que te pregunten.
Cuando recibas una pregunta de comparación:
1. Analiza ambas cosas objetivamente
2. Genera una lista clara de ventajas (PROS) y desventajas (CONS) para cada uno
3. Organiza la respuesta en este formato exacto:

**Comparación: [Cosa 1] vs [Cosa 2]**

### [Dispositivo 1]
**Pros:**
- Ventaja 1
- Ventaja 2

**Contras:**
- Desventaja 1
- Desventaja 2

### [Dispositivo 2]
**Pros:**
- Ventaja 1
- Ventaja 2

**Contras:**
- Desventaja 1
- Desventaja 2

**Conclusión breve:**
[Análisis final conciso]

Devuelve la respuesta en formato Markdown.
        `,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_tokens: 450,
    });

    // 👇 este es el encabezado que permite streaming tipo fetch
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                res.write(`data: ${JSON.stringify({content})}\n\n`);
                //res.write(content);
            }
        }

        res.end();
    } catch (error) {
        console.error("Error en stream:", error);
        res.end();
    }
};



