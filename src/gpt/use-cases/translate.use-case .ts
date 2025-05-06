import OpenAI from "openai";


interface Options {
    prompt: string;
    lang : string;
}


export const translateUseCase = async (openai: OpenAI, options: Options) => {
    const { prompt, lang } = options;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",  // o "gpt-4"
        messages: [
            {
                role: "user",
                content: `Traduce el siguiente texto al idioma "${lang}". Responde solo con el texto traducido, sin formato JSON, sin llaves ni comillas, solo la traducción:\n\n${prompt}`
            }
        ],
        temperature: 0.3,
        max_tokens: 150
    });

    const aiResponse = completion.choices[0]?.message?.content ?? 'Sin respuesta';

    // Retornamos directamente la cadena traducida
    return { content: aiResponse.trim() };
};
