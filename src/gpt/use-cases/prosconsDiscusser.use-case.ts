import OpenAI from "openai";


interface Options {
    prompt: string;
}



export const prosConsDicusserUseCase = async (openai: OpenAI, options: Options) => {

    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",  // o "gpt-4"
        messages: [
            {
                role: "system",
                content: `
        Eres un analista  especializado en comparar cualquier cosa que te pregunten.
          Cuando recibas una pregunta de comparación:
          1. Analiza ambas cosas objetivamente
          2. Genera una lista clara de ventajas (PROS) y desventajas (CONS) para cada uno
          3. Organiza la respuesta en este formato exacto:
             
             **Comparación: [Cosa 1] vs [Cosa  2]**
             
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

             Devuelve la repuesta en formato MarkDown
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.3,
        max_tokens: 450

    });

    const aiResponse = completion.choices[0]?.message;

    return aiResponse;

}