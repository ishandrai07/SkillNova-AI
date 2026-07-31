const {GoogleGenAI} = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function invokeGeminiAi(){
    const response = await ai.models.generateContent({
        model:"gemini-3.6-flash",
        contents: "hello gemini ! Exaplain what is interview ?"
    })

    console.log(response.text);
    
}

module.exports = invokeGeminiAi