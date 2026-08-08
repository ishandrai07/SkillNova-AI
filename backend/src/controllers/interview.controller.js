const pdfParse = require("pdf-parse");

const {
    generateInterviewReport,
    generateResumePdf,
} = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");


/**
 * @description
 * Generate interview report based on:
 * - Job description
 * - Resume
 * - Self description
 *
 * @route POST /api/interview
 * @access Private
 */
async function generateInterviewReportController(req, res) {

    try {

        // -----------------------------------------
        // 1. Get request data
        // -----------------------------------------

        const { selfDescription, jobDescription } = req.body;


        // -----------------------------------------
        // 2. Validate job description
        // -----------------------------------------

        if (!jobDescription || !jobDescription.trim()) {

            return res.status(400).json({
                message: "Job description is required.",
            });

        }


        // -----------------------------------------
        // 3. Resume OR self description required
        // -----------------------------------------

        if (
            !req.file &&
            (!selfDescription || !selfDescription.trim())
        ) {

            return res.status(400).json({
                message: "Please provide a resume or self description.",
            });

        }


        // -----------------------------------------
        // 4. Extract resume text
        // -----------------------------------------

        let resumeText = "";


        if (req.file) {

            // Currently supporting PDF only
            if (req.file.mimetype !== "application/pdf") {

                return res.status(400).json({
                    message: "Only PDF resumes are supported.",
                });

            }


            // pdf-parse v2.x
            const pdf = new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            );


            const pdfData = await pdf.getText();


            resumeText = pdfData.text || "";

        }


        // -----------------------------------------
        // 5. Log request information
        // -----------------------------------------

        console.log("\n========== INTERVIEW REQUEST ==========");

        console.log(
            "Resume uploaded:",
            !!req.file
        );

        console.log(
            "Resume size:",
            req.file?.size || 0
        );

        console.log(
            "Resume text length:",
            resumeText.length
        );

        console.log(
            "Self description:",
            !!selfDescription
        );

        console.log(
            "Job description length:",
            jobDescription.length
        );


        // -----------------------------------------
        // 6. Generate AI report
        // -----------------------------------------

        console.log(
            "\n========== CALLING GEMINI =========="
        );


        const aiReport = await generateInterviewReport({

            resume: resumeText,

            selfDescription:
                selfDescription || "",

            jobDescription,

        });


        // -----------------------------------------
        // 7. Print AI response
        // -----------------------------------------

        console.log(
            "\n========== AI REPORT =========="
        );

        console.dir(
            aiReport,
            {
                depth: null
            }
        );


        // -----------------------------------------
        // 8. Validate AI response
        // -----------------------------------------

        if (!aiReport) {

            return res.status(500).json({
                message: "AI did not return an interview report.",
            });

        }


        // title is required by MongoDB
        if (
            !aiReport.title ||
            typeof aiReport.title !== "string"
        ) {

            return res.status(500).json({
                message:
                    "AI response is missing a valid title.",
            });

        }


        // matchScore
        if (
            typeof aiReport.matchScore !== "number" ||
            aiReport.matchScore < 0 ||
            aiReport.matchScore > 100
        ) {

            return res.status(500).json({
                message:
                    "AI response contains an invalid match score.",
            });

        }


        // technicalQuestions
        if (
            !Array.isArray(
                aiReport.technicalQuestions
            )
        ) {

            return res.status(500).json({
                message:
                    "AI response contains invalid technical questions.",
            });

        }


        // behavioralQuestions
        if (
            !Array.isArray(
                aiReport.behavioralQuestions
            )
        ) {

            return res.status(500).json({
                message:
                    "AI response contains invalid behavioral questions.",
            });

        }


        // skillGaps
        if (
            !Array.isArray(
                aiReport.skillGaps
            )
        ) {

            return res.status(500).json({
                message:
                    "AI response contains invalid skill gaps.",
            });

        }


        // preparationPlan
        if (
            !Array.isArray(
                aiReport.preparationPlan
            )
        ) {

            return res.status(500).json({
                message:
                    "AI response contains invalid preparation plan.",
            });

        }


        // -----------------------------------------
        // 9. Create MongoDB report
        // -----------------------------------------

        const interviewReport =
            await interviewReportModel.create({

                user: req.user.id,

                resume: resumeText,

                selfDescription:
                    selfDescription || "",

                jobDescription,

                title: aiReport.title,

                matchScore: aiReport.matchScore,

                technicalQuestions:
                    aiReport.technicalQuestions,

                behavioralQuestions:
                    aiReport.behavioralQuestions,

                skillGaps:
                    aiReport.skillGaps,

                preparationPlan:
                    aiReport.preparationPlan,

            });


        // -----------------------------------------
        // 10. Send response
        // -----------------------------------------

        return res.status(201).json({

            message:
                "Interview report generated successfully.",

            interviewReport,

        });

    } catch (error) {

        console.error(
            "\n===== generateInterviewReportController ERROR ====="
        );

        console.error(error);


        return res.status(500).json({

            message:
                "Failed to generate interview report.",

            error: error.message,

        });

    }

}


/**
 * @description
 * Get interview report by ID
 *
 * @route GET /api/interview/report/:interviewId
 * @access Private
 */
async function getInterviewReportByIdController(
    req,
    res
) {

    try {

        const { interviewId } = req.params;


        const interviewReport =
            await interviewReportModel.findOne({

                _id: interviewId,

                user: req.user.id,

            });


        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found.",

            });

        }


        return res.status(200).json({

            message:
                "Interview report fetched successfully.",

            interviewReport,

        });

    } catch (error) {

        console.error(
            "getInterviewReportByIdController error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch interview report.",

            error: error.message,

        });

    }

}


/**
 * @description
 * Get all interview reports of logged-in user
 *
 * @route GET /api/interview
 * @access Private
 */
async function getAllInterviewReportsController(
    req,
    res
) {

    try {

        const interviewReports =
            await interviewReportModel

                .find({
                    user: req.user.id
                })

                .sort({
                    createdAt: -1
                })

                .select(
                    "-resume -selfDescription -jobDescription -__v"
                );


        return res.status(200).json({

            message:
                "Interview reports fetched successfully.",

            interviewReports,

        });

    } catch (error) {

        console.error(
            "getAllInterviewReportsController error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch interview reports.",

            error: error.message,

        });

    }

}


/**
 * @description
 * Generate ATS-friendly resume PDF
 *
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @access Private
 */
async function generateResumePdfController(
    req,
    res
) {

    try {

        const { interviewReportId } = req.params;


        // -----------------------------------------
        // Find report belonging to logged-in user
        // -----------------------------------------

        const interviewReport =
            await interviewReportModel.findOne({

                _id: interviewReportId,

                user: req.user.id,

            });


        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found.",

            });

        }


        // -----------------------------------------
        // Extract required information
        // -----------------------------------------

        const {

            resume,

            jobDescription,

            selfDescription,

        } = interviewReport;


        // -----------------------------------------
        // Generate PDF
        // -----------------------------------------

        console.log(
            "\n========== GENERATING RESUME PDF =========="
        );


        const pdfBuffer =
            await generateResumePdf({

                resume: resume || "",

                jobDescription:
                    jobDescription || "",

                selfDescription:
                    selfDescription || "",

            });


        // -----------------------------------------
        // Send PDF
        // -----------------------------------------

        res.set({

            "Content-Type":
                "application/pdf",

            "Content-Disposition":
                `attachment; filename=resume_${interviewReportId}.pdf`,

            "Content-Length":
                pdfBuffer.length,

        });


        return res.send(pdfBuffer);

    } catch (error) {

        console.error(
            "generateResumePdfController error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to generate resume PDF.",

            error: error.message,

        });

    }

}


module.exports = {

    generateInterviewReportController,

    getInterviewReportByIdController,

    getAllInterviewReportsController,

    generateResumePdfController,

};