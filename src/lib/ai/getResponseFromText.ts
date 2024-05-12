import { OpenAI } from 'openai'



// Create a new configuration with your API key


// Create an OpenAIApi instance with the configuration
const openai = new OpenAI({
    apiKey: process.env.CHATGPT_API
});

// Function to create a text-based prompt from the object
function createPromptFromObject(examObject: Record<string, string>): string {
    let prompt = `Given an exam_paper object containing information about multiple exam papers, your task is to extract the content into a JavaScript object structured as follows:
    {
      "imp_keywords": [], // Array of topics fundamentally asked in exam papers
       
     "topic_frequency":{
     "high":[/*high frequency topics*/],
     "less":[/*less frequency topics*/]  
     },
      "imp_qa": [],    // Array of most asked questions in all exam papers
      "exam_difficulty":{
     "exam1":"easy", //and go on for all objects 
     },
     "all_questions" :{
     "exam1":[],//array of all question in exam 1 object of exam_paper
     //go on for rest
     },
    "blueprint":{
    "file1":{
    "Q1":{
    //extract most relevent topics asked and list out as topic 
    "topic 1",
    "topic 2",
    //added additional details as mentioned
    "marks": //total marks of each question ,
    "type": //add type of this question (theory,mcq etc.)
    }
    }
     };
     ->Instructions:
    1.Analyze the provided exam_paper object,there is chance that you will ignore question details which is in next line ,check if there is any more further detail of question in next few line before continue,remove header and footer (if any).
    2.Extract the required information by following the given format.
    3.Create an object containing  further objects:
        i.imp_keywords: Identify and list topics 	fundamentally asked in the exam papers.
        ii. topic_freaquency : frequency contain 2 further objects 1)high:extract list of topics which are more frequently asked,2)less :extract list of topics which are less frequently asked  
        iii.imp_qa: Extract and list the most frequently asked questions across all exam papers.
        iv .  exam_difficulty :  analayze all exam papers and determine difficulty of each exam paper
        v.	all_questions : extract question,sub question ot any type of question identifined in each exam paper   of each exam paper   contained in exam_paper object having same key  available in exam_paper    
    4. after every question ends there is an number which indicates marks of that particular question, indentify question number change  and take track of exam paper blueprint  and return question wise blue print in js object ,i am using react flow to showcase this information  do generate nodes and  edges 
    Exam Paper Object
    5.give simple text output,JavaScript object Strictly avoid javascript notation at start with the information required dont give any explaination or summery,strictly dont leave anything and generate large and whole response without avoiding anything.
    `;

    for (const [key, value] of Object.entries(examObject)) {
        prompt += `File: ${key}\nContent:\n${value}\n\n`;
    }

    return prompt;
}

// Function to get response from OpenAI
export async function getResponseFromText(prompt: Record<string, string>) {
    try {
        const Template = createPromptFromObject(prompt)

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are Exam Anlayzer for student to analyze their exam paper.",
                },
                { role: "user", content: Template },
            ],
            model: "gpt-3.5-turbo-0125",
        });
        console.log(completion.choices[0].message.content);

        return completion.choices[0].message.content; // Return the first response
    } catch (error: any) {
        console.error("Error while getting response from OpenAI:", error.message);
        throw error; // Re-throw the error to be handled by the caller
    }
}