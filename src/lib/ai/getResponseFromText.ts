import { OpenAI } from 'openai'
// Function to clean the response from ChatGPT
function cleanResponse(response: string): string {
  // Find the index of the first occurrence of {
  const startIndex = response.indexOf('{');

  // If { is found, return the content from that index onward
  if (startIndex !== -1) {
    return response.slice(startIndex);
  }

  // If { is not found, return the entire response
  return response;
}
const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API
});

// Function to create a text-based prompt from the object
function createPromptFromObject(examObject: Record<string, string>): string {
  let prompt = `Given an exam_paper object containing information about multiple exam papers, your task is to extract the content into a JavaScript object structured as follows:
   
    {
      "imp_keywords": [], // Array of topics fundamentally asked in exam papers
      "topic_frequency": {
        "high": [/*high frequency topics*/],
        "less": [/*less frequency topics*/]
      },
      "imp_qa": [], // Array of most asked questions in all exam papers
      "exam_difficulty": {
        "exam1": "easy", // and go on for all objects
      },
      "all_questions": {
        "exam1": [], // array of all questions in exam1 object of exam_paper
        // go on for rest
      },
      "blueprint": {
        "file1": {
          "Q1": {
            // extract most relevant topics asked and list out as topic
            "topic 1",
            "topic 2",
            // added additional details as mentioned
            "marks": // total marks of each question,
            "type": // add type of this question (theory, mcq, etc.)
          }
        }
      }
    }
    Instructions:
    
    Analyze the provided exam_paper object, considering there is a chance you might ignore question details which are in the next line. Check if there is any further detail of the question in the next few lines before continuing. Remove header and footer (if any).
    Extract the required information by following the given format.
    Create an object containing further objects:
    imp_keywords: Identify and list topics fundamentally asked in the exam papers.
    topic_frequency: Contains two further objects:
    high: Extract a list of topics which are more frequently asked.
    less: Extract a list of topics which are less frequently asked.
    imp_qa: Extract and list the most frequently asked questions across all exam papers.
    exam_difficulty: Analyze all exam papers and determine the difficulty of each exam paper on a scale: ['easy', 'medium', 'hard', 'very hard', 'extreme'].
    all_questions: Extract questions, sub-questions, or any type of questions identified in each exam paper contained in the exam_paper object,never miss any question in each exam
    After every question ends, there is a number which indicates the marks of that particular question. Identify the question number change, track the exam paper blueprint, and return the question-wise blueprint in a JavaScript object. I am using React Flow to showcase this information, so do generate nodes and edges.
    Provide only output of the JavaScript object with most information about exam as possible(no more than that only object). Strictly avoid JavaScript notation at the start and do not give any explanation or summary. Strictly avoid leaving anything out and generate a large and comprehensive response without omitting any details make each field as efficient as possible. generate JSON parsable response no comments.
    Exam Paper Object:`;

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
          content: "You are Exam Analyzer for students to analyze their exam paper.your job is to provide exam related data from exam paper generate whole and usefull response",
        },
        { role: "user", content: Template },
      ],
      model: "gpt-3.5-turbo-0125",
    });

    const cleanedResponse = cleanResponse(completion.choices[0].message.content!);
    console.log(cleanedResponse);

    return cleanedResponse;
  } catch (error: any) {
    console.error("Error while getting response from OpenAI:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}
