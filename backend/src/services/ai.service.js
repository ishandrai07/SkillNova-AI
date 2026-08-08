const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/*
|--------------------------------------------------------------------------
| ZOD VALIDATION SCHEMA
|--------------------------------------------------------------------------
| This is used AFTER Gemini responds.
| It protects MongoDB from malformed AI data.
*/

const interviewReportSchema = z.object({
    title: z.string().min(1),

    matchScore: z
        .number()
        .min(0)
        .max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string().min(1),
            intention: z.string().min(1),
            answer: z.string().min(1),
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string().min(1),
            intention: z.string().min(1),
            answer: z.string().min(1),
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string().min(1),
            severity: z.enum(["low", "medium", "high"]),
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number().int().min(1),
            focus: z.string().min(1),
            tasks: z.array(z.string().min(1)),
        })
    ),
});


/*
|--------------------------------------------------------------------------
| GEMINI JSON SCHEMA
|--------------------------------------------------------------------------
| IMPORTANT:
| Do NOT use zod-to-json-schema here.
|
| Gemini receives this plain JSON Schema directly.
|--------------------------------------------------------------------------
*/

const interviewReportJsonSchema = {
    type: "object",

    properties: {

        title: {
            type: "string",
            description:
                "The exact job title extracted from the job description.",
        },

        matchScore: {
            type: "number",
            description:
                "A number from 0 to 100 representing how closely the candidate matches the job.",
        },

        technicalQuestions: {
            type: "array",
            description:
                "Technical interview questions specifically based on the candidate's resume and job description.",

            items: {
                type: "object",

                properties: {

                    question: {
                        type: "string",
                        description:
                            "A technical interview question.",
                    },

                    intention: {
                        type: "string",
                        description:
                            "What the interviewer wants to evaluate with this question.",
                    },

                    answer: {
                        type: "string",
                        description:
                            "A strong answer strategy explaining what the candidate should discuss.",
                    },
                },

                required: [
                    "question",
                    "intention",
                    "answer",
                ],

                propertyOrdering: [
                    "question",
                    "intention",
                    "answer",
                ],
            },
        },

        behavioralQuestions: {
            type: "array",
            description:
                "Behavioral interview questions specifically relevant to the candidate and target role.",

            items: {
                type: "object",

                properties: {

                    question: {
                        type: "string",
                        description:
                            "A behavioral interview question.",
                    },

                    intention: {
                        type: "string",
                        description:
                            "What the interviewer wants to evaluate.",
                    },

                    answer: {
                        type: "string",
                        description:
                            "A recommended way for the candidate to answer the question.",
                    },
                },

                required: [
                    "question",
                    "intention",
                    "answer",
                ],

                propertyOrdering: [
                    "question",
                    "intention",
                    "answer",
                ],
            },
        },

        skillGaps: {
            type: "array",
            description:
                "Skills that the candidate should improve for the target job.",

            items: {
                type: "object",

                properties: {

                    skill: {
                        type: "string",
                        description:
                            "The missing or weak skill.",
                    },

                    severity: {
                        type: "string",
                        enum: [
                            "low",
                            "medium",
                            "high",
                        ],
                        description:
                            "Importance of the skill gap.",
                    },
                },

                required: [
                    "skill",
                    "severity",
                ],

                propertyOrdering: [
                    "skill",
                    "severity",
                ],
            },
        },

        preparationPlan: {
            type: "array",
            description:
                "A day-by-day interview preparation plan.",

            items: {
                type: "object",

                properties: {

                    day: {
                        type: "integer",
                        description:
                            "Day number starting from 1.",
                    },

                    focus: {
                        type: "string",
                        description:
                            "The main topic to focus on that day.",
                    },

                    tasks: {
                        type: "array",
                        description:
                            "Specific preparation tasks for that day.",

                        items: {
                            type: "string",
                        },
                    },
                },

                required: [
                    "day",
                    "focus",
                    "tasks",
                ],

                propertyOrdering: [
                    "day",
                    "focus",
                    "tasks",
                ],
            },
        },
    },

    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ],

    propertyOrdering: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ],
};


/*
|--------------------------------------------------------------------------
| GENERATE INTERVIEW REPORT
|--------------------------------------------------------------------------
*/

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {

    const prompt = `
You are an expert technical interviewer and career preparation assistant.

Analyze the candidate's resume, self-description, and target job description.

Generate a complete interview preparation report.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Follow the provided JSON schema exactly.
3. Do NOT add any extra fields.
4. Do NOT rename any fields.
5. technicalQuestions MUST be an array of objects.
6. behavioralQuestions MUST be an array of objects.
7. skillGaps MUST be an array of objects.
8. preparationPlan MUST be an array of objects.
9. skill severity MUST be exactly one of:
   - "low"
   - "medium"
   - "high"
10. preparationPlan.day MUST be a NUMBER.
11. Do NOT write "Day 1", "Day 2", etc.
12. Use:
   1
   2
   3
   4
   5
13. technicalQuestions should contain 5-7 questions.
14. behavioralQuestions should contain 4-6 questions.
15. skillGaps should contain 3-5 relevant skill gaps.
16. preparationPlan should contain 5 days.
17. Questions should be based on the actual candidate information.
18. Do not invent technologies or experience that are not present in the candidate information.
19. The title must be the job title from the job description.
20. matchScore must be between 0 and 100.

CANDIDATE RESUME:

${resume || "No resume provided."}


CANDIDATE SELF DESCRIPTION:

${selfDescription || "No self description provided."}


JOB DESCRIPTION:

${jobDescription}
`;

    console.log("\n========== CALLING GEMINI INTERVIEW API ==========\n");

    try {

        const response = await ai.models.generateContent({

            model: "gemini-3-flash-preview",

            contents: prompt,

            config: {

                responseMimeType: "application/json",

                responseJsonSchema:
                    interviewReportJsonSchema,

                thinkingConfig: {
                    thinkingLevel: "LOW",
                },
            },
        });


        console.log(
            "\n========== RAW GEMINI RESPONSE =========="
        );

        console.log(response.text);


        if (!response.text) {

            throw new Error(
                "Gemini returned an empty response."
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Parse JSON
        |--------------------------------------------------------------------------
        */

        let parsedResponse;

        try {

            parsedResponse =
                JSON.parse(response.text);

        } catch (jsonError) {

            console.error(
                "Gemini returned invalid JSON:",
                jsonError
            );

            throw new Error(
                "Gemini returned invalid JSON."
            );
        }


        console.log(
            "\n========== PARSED GEMINI RESPONSE =========="
        );

        console.dir(
            parsedResponse,
            {
                depth: null,
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Validate with Zod
        |--------------------------------------------------------------------------
        */

        const validation =
            interviewReportSchema.safeParse(
                parsedResponse
            );


        if (!validation.success) {

            console.error(
                "\n========== GEMINI SCHEMA VALIDATION FAILED =========="
            );

            console.error(
                JSON.stringify(
                    validation.error.format(),
                    null,
                    2
                )
            );

            throw new Error(
                "Gemini response does not match the interview report schema."
            );
        }


        console.log(
            "\n========== GEMINI RESPONSE VALIDATED SUCCESSFULLY =========="
        );


        return validation.data;

    } catch (error) {

        console.error(
            "\n========== GEMINI INTERVIEW ERROR =========="
        );

        console.error(error);

        throw error;
    }
}


/*
|--------------------------------------------------------------------------
| GENERATE PDF FROM HTML
|--------------------------------------------------------------------------
*/

async function generatePdfFromHtml(htmlContent) {

    if (
        !htmlContent ||
        typeof htmlContent !== "string"
    ) {
        throw new Error(
            "Invalid HTML content received for PDF generation."
        );
    }


    const browser =
        await puppeteer.launch({
            headless: true,
        });


    try {

        const page =
            await browser.newPage();


        await page.setContent(
            htmlContent,
            {
                waitUntil: "networkidle0",
            }
        );


        const pdfBuffer =
            await page.pdf({

                format: "A4",

                printBackground: true,

                margin: {

                    top: "20mm",

                    bottom: "20mm",

                    left: "15mm",

                    right: "15mm",
                },
            });


        return pdfBuffer;

    } finally {

        await browser.close();
    }
}


/*
|--------------------------------------------------------------------------
| RESUME JSON SCHEMA
|--------------------------------------------------------------------------
*/

const resumeJsonSchema = {

    type: "object",

    properties: {

        html: {
            type: "string",
            description:
                "Complete HTML document for the candidate's ATS-friendly resume.",
        },
    },

    required: [
        "html",
    ],

    propertyOrdering: [
        "html",
    ],
};


/*
|--------------------------------------------------------------------------
| RESUME ZOD SCHEMA
|--------------------------------------------------------------------------
*/

const resumeSchema = z.object({

    html: z.string().min(1),

});


/*
|--------------------------------------------------------------------------
| GENERATE RESUME PDF
|--------------------------------------------------------------------------
*/

async function generateResumePdf({

    resume,

    selfDescription,

    jobDescription,

}) {

    const prompt = `
You are a professional resume writer.

Create a professional ATS-friendly resume based ONLY on the candidate information provided below.

The resume must be tailored specifically to the target job description.

IMPORTANT RULES:

1. Return ONLY JSON.
2. The JSON must contain exactly one field:
   "html"
3. html must contain complete HTML.
4. Do NOT return Markdown.
5. Do NOT wrap the HTML in a Markdown code block.
6. Do NOT add explanations outside the JSON.
7. Make the resume professional and clean.
8. Keep it approximately 1-2 pages.
9. Use standard resume sections.
10. Keep the design simple and ATS-friendly.
11. Use readable fonts.
12. Avoid complex tables.
13. Do not use images.
14. Do not invent experience.
15. Do not invent education.
16. Do not invent skills.
17. Only use information present in the provided candidate information.
18. Tailor skills and project descriptions to the job description where appropriate.
19. Make the content sound naturally written by a human.
20. The HTML should be directly usable by Puppeteer to generate a PDF.

CANDIDATE RESUME:

${resume || "No resume provided."}


CANDIDATE SELF DESCRIPTION:

${selfDescription || "No self description provided."}


TARGET JOB DESCRIPTION:

${jobDescription}
`;

    console.log(
        "\n========== CALLING GEMINI RESUME API ==========\n"
    );


    const response =
        await ai.models.generateContent({

            model: "gemini-3-flash-preview",

            contents: prompt,

            config: {

                responseMimeType: "application/json",

                responseJsonSchema:
                    resumeJsonSchema,

                thinkingConfig: {
                    thinkingLevel: "LOW",
                },
            },
        });


    console.log(
        "\n========== RAW GEMINI RESUME RESPONSE =========="
    );

    console.log(response.text);


    if (!response.text) {

        throw new Error(
            "Gemini returned an empty resume response."
        );
    }


    let parsedResponse;

    try {

        parsedResponse =
            JSON.parse(response.text);

    } catch (error) {

        console.error(
            "Invalid resume JSON:",
            error
        );

        throw new Error(
            "Gemini returned invalid resume JSON."
        );
    }


    const validation =
        resumeSchema.safeParse(
            parsedResponse
        );


    if (!validation.success) {

        console.error(
            "\n========== RESUME SCHEMA VALIDATION FAILED =========="
        );

        console.error(
            JSON.stringify(
                validation.error.format(),
                null,
                2
            )
        );

        throw new Error(
            "Gemini resume response does not match the expected schema."
        );
    }


    const pdfBuffer =
        await generatePdfFromHtml(
            validation.data.html
        );


    return pdfBuffer;
}


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {

    generateInterviewReport,

    generateResumePdf,

};