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
    })).describe("A day-wise preparation plan for the candidate to improve their skills and prepare for the interview"),
    title: z.string().describe("The title of the job for which the interview report is generated")

})



async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `
You are an expert technical interviewer and hiring manager.

Analyze the candidate's resume, self-description, and job description.

Return a JSON object that STRICTLY follows the provided schema.

IMPORTANT:
- Do NOT leave any array empty.
- Generate at least:
  - 8 technicalQuestions
  - 5 behavioralQuestions
  - 5 skillGaps
  - 7 preparationPlan days
- matchScore must be an integer between 0 and 100.
- Every question must include:
  - question
  - intention
  - answer
- Every preparation day must include:
  - day
  - focus
  - tasks (minimum 3 tasks)
- Base your analysis on the resume and job description.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
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