

interface Frequency{
    high:string[];
    less:string[]
}

export interface AnalyzedExam {
    pdf_url:string[];
    imp_keywords:string[];
    topic_frequency:Frequency;
    imp_qa:string[];
    blueprint:object;
    all_questions:object;
    exam_difficulty:object;
    file_count: number;
    imp_count: number;
    total_qa: number;
    file_name:String[];
}