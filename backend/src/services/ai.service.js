const {GoogleGenAI} = require("@google/genai")
const {z} = require('zod')
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The match score between the candidate's profile and the job description, ranging from 0 to 100"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question , what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),

    behavioralQuestions:z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question , what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, can be low, medium or high"),
       
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan, starting from 1"),
        focus: z.string().describe("The focus of the day, what skill or topic to focus on"),
        tasks: z.array(z.string()).describe("List of tasks to be completed on this day")
    })).describe("A day-wise preparation plan for the candidate to improve their skills and prepare for the interview")

})



async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `Generate an interview report for a candidate with the following details:
    - Resume: ${resume}
    - Self-Description: ${selfDescription}
    - Job Description: ${jobDescription}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    })

    return JSON.parse(response.text)
    
}

module.exports = generateInterviewReport