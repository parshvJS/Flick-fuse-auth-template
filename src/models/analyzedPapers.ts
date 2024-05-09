import mongoose, { Schema, Document } from "mongoose";

// Define the interface for Exam data
export interface Exam extends Document {
    imp_keywords: string;
    high_topic_frequency: string;
    low_topic_frequency: string;
    imp_qa: string;
    exam_difficulty: string;
    all_questions: string;
    blueprint: string;
    pdf_url: string[];
    exam_name: string;
    username:string
}

// Define the schema for analyzed papers
const analyzedPaperSchema = new mongoose.Schema({
    imp_keywords: {
        type: String,
    },
    high_topic_frequency: {
        type: String,
        required: true,
    },
    low_topic_frequency: {
        type: String,
    },
    imp_qa: {
        type: String,
    },
    exam_difficulty: {
        type: String,
    },
    all_questions: {
        type: String,
    },
    blueprint: {
        type: String,
    },
    pdf_url: {
        type: [String], // Correct array of strings
    },
    exam_name: {
        type: String,
        required: true, // Ensure exam name is required
    },
    username:{
        type:String
    }
}, { timestamps: true });

// Create or use the correct model
const analyzedPaperModel = mongoose.models.AnalyzedExam as mongoose.Model<Exam> || mongoose.model<Exam>("AnalyzedExam", analyzedPaperSchema);

export default analyzedPaperModel;
