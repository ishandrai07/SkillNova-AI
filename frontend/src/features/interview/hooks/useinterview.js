import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {

    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        );
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
    } = context;

    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile,
    }) => {

        setLoading(true);

        try {

            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile,
            });

            setReport(response.interviewReport);

            return { data: response.interviewReport, error: null };

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to generate report. Please try again.";

            console.error(
                "Generate interview report error:",
                error.response?.data || error.message
            );

            return { data: null, error: message };

        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (interviewId) => {

        setLoading(true);

        try {

            const response =
                await getInterviewReportById(interviewId);

            setReport(response.interviewReport);

            return response.interviewReport;

        } catch (error) {

            console.error(
                "Get interview report error:",
                error.response?.data || error.message
            );

            return null;

        } finally {
            setLoading(false);
        }
    };

    const getReports = async () => {

        setLoading(true);

        try {

            const response =
                await getAllInterviewReports();

            setReports(response.interviewReports);

            return response.interviewReports;

        } catch (error) {

            console.error(
                "Get interview reports error:",
                error.response?.data || error.message
            );

            return [];

        } finally {
            setLoading(false);
        }
    };

    const getResumePdf = async (interviewReportId) => {

        setLoading(true);

        try {

            const pdfBlob =
                await generateResumePdf({
                    interviewReportId,
                });

            const url = window.URL.createObjectURL(
                new Blob([pdfBlob], {
                    type: "application/pdf",
                })
            );

            const link = document.createElement("a");

            link.href = url;
            link.download =
                `resume_${interviewReportId}.pdf`;

            document.body.appendChild(link);
            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Generate resume PDF error:",
                error.response?.data || error.message
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }

    }, [interviewId]);

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf,
    };
};