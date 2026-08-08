const mongoose = require("mongoose");


/*
|--------------------------------------------------------------------------
| Technical Question
|--------------------------------------------------------------------------
*/

const technicalQuestionSchema =
    new mongoose.Schema(

        {
            question: {
                type: String,
                required: [
                    true,
                    "Technical question is required",
                ],
                trim: true,
            },

            intention: {
                type: String,
                required: [
                    true,
                    "Intention is required",
                ],
                trim: true,
            },

            answer: {
                type: String,
                required: [
                    true,
                    "Answer is required",
                ],
                trim: true,
            },
        },

        {
            _id: false,
        }
    );


/*
|--------------------------------------------------------------------------
| Behavioral Question
|--------------------------------------------------------------------------
*/

const behavioralQuestionSchema =
    new mongoose.Schema(

        {
            question: {
                type: String,
                required: [
                    true,
                    "Behavioral question is required",
                ],
                trim: true,
            },

            intention: {
                type: String,
                required: [
                    true,
                    "Intention is required",
                ],
                trim: true,
            },

            answer: {
                type: String,
                required: [
                    true,
                    "Answer is required",
                ],
                trim: true,
            },
        },

        {
            _id: false,
        }
    );


/*
|--------------------------------------------------------------------------
| Skill Gap
|--------------------------------------------------------------------------
*/

const skillGapSchema =
    new mongoose.Schema(

        {
            skill: {
                type: String,
                required: [
                    true,
                    "Skill is required",
                ],
                trim: true,
            },

            severity: {
                type: String,

                enum: [
                    "low",
                    "medium",
                    "high",
                ],

                required: [
                    true,
                    "Severity is required",
                ],
            },
        },

        {
            _id: false,
        }
    );


/*
|--------------------------------------------------------------------------
| Preparation Plan
|--------------------------------------------------------------------------
*/

const preparationPlanSchema =
    new mongoose.Schema(

        {
            day: {
                type: Number,

                required: [
                    true,
                    "Day is required",
                ],

                min: 1,
            },

            focus: {
                type: String,

                required: [
                    true,
                    "Focus is required",
                ],

                trim: true,
            },

            tasks: [
                {
                    type: String,

                    required: [
                        true,
                        "Task is required",
                    ],

                    trim: true,
                },
            ],
        },

        {
            _id: false,
        }
    );


/*
|--------------------------------------------------------------------------
| Interview Report
|--------------------------------------------------------------------------
*/

const interviewReportSchema =
    new mongoose.Schema(

        {
            user: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "users",

                required: [
                    true,
                    "User is required",
                ],

                index: true,
            },


            title: {
                type: String,

                required: [
                    true,
                    "Job title is required",
                ],

                trim: true,
            },


            jobDescription: {
                type: String,

                required: [
                    true,
                    "Job description is required",
                ],

                trim: true,
            },


            resume: {
                type: String,

                default: "",
            },


            selfDescription: {
                type: String,

                default: "",
            },


            matchScore: {
                type: Number,

                min: 0,

                max: 100,

                required: [
                    true,
                    "Match score is required",
                ],
            },


            technicalQuestions: {
                type: [
                    technicalQuestionSchema,
                ],

                default: [],
            },


            behavioralQuestions: {
                type: [
                    behavioralQuestionSchema,
                ],

                default: [],
            },


            skillGaps: {
                type: [
                    skillGapSchema,
                ],

                default: [],
            },


            preparationPlan: {
                type: [
                    preparationPlanSchema,
                ],

                default: [],
            },
        },

        {
            timestamps: true,
        }
    );


/*
|--------------------------------------------------------------------------
| Index
|--------------------------------------------------------------------------
*/

interviewReportSchema.index({
    user: 1,
    createdAt: -1,
});


const interviewReportModel =
    mongoose.model(
        "InterviewReport",
        interviewReportSchema
    );


module.exports =
    interviewReportModel;