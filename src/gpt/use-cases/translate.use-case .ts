import OpenAI from "openai";


interface Options {
    prompt: string;
    lang : string;
}


export const translateUseCase = async (openai: OpenAI, options: Options) => {

    const { prompt } = options;
    const { lang } = options;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",  // o "gpt-4"
        messages: [
            {
                role: "assistant",
                content: `
                     Traduce el siguiente texto al idioma ${ lang }: ${ prompt } y debes responder 
                     en formato JSON,
                     
                     { message : string}
                     
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