import OpenAI from "openai";


interface Options {
    prompt: string;
}


export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {

    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",  // o "gpt-4"
        messages: [
            {
                role: "assistant",
                content: `
                     Te serán proveídos textos en español con posibles errores ortográficos y gramaticales.
                     Puede tener algunos términos de Chile y sudamérica. 
                     Debes responder en formato JSON,
                     tu tarea es corregir errores ortográficos y retornar información con soluciones, 
                     también debes dar un porcentaje de acierto por el usuario.

                     Si no hay errores, debes retornar un mensaje de felicitaciones.

                     Ejemplo de salida: 

                     {
                       userScore: number, 
                       errors: string[] // [ 'error' -> solución ]
                       message: string // Usa un texto y emojis para felicitar al usuario
                     }
                  
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.3,
        max_tokens: 150
       
    });

    const aiResponse = completion.choices[0]?.message?.content;

    return aiResponse;
}