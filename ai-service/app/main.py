from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import re
from collections import Counter

load_dotenv()

app = FastAPI(
    title="InterviewIQ AI Service",
    description="AI-powered question generation and answer evaluation service",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("BACKEND_URL", "http://localhost:5000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateQuestionsRequest(BaseModel):
    resume_content: str
    company: str | None = None
    count: int = 5

class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str

def extract_keywords(text: str) -> list[str]:
    normalized = re.sub(r"[^a-zA-Z0-9+.#\s]", " ", text.lower())
    tokens = [token for token in normalized.split() if len(token) > 1]
    stop_words = {
        'and', 'the', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'are', 'have', 'has', 'had',
        'will', 'can', 'was', 'were', 'their', 'them', 'they', 'but', 'not', 'when', 'what', 'which',
        'where', 'then', 'there', 'about', 'out', 'into', 'using', 'use', 'our', 'your', 'each', 'also',
        'such', 'role', 'project', 'experience'
    }
    filtered = [token for token in tokens if token not in stop_words]
    freq = Counter(filtered)
    return [token for token, _ in freq.most_common(10)]

def fallback_generate_questions(resume_content: str, company: str | None, count: int = 5) -> list[str]:
    keywords = extract_keywords(resume_content)
    company_prompt = company or 'this opportunity'
    questions = []

    if not keywords:
        questions = [
            f'Tell me about your experience and why you are interested in {company_prompt}.',
            'Describe a project where you delivered measurable results.',
            'How do you overcome technical challenges under pressure?'
        ]
    else:
        questions.append(f'Explain a time you used {keywords[0]} in a project.')
        questions.append(f'How do you solve problems using {keywords[0]}?')
        questions.append(f'Describe a challenge you faced with {keywords[0]} and how you resolved it.')
        if len(keywords) > 1:
            questions.append(f'How do you combine {keywords[0]} with {keywords[1]} in your work?')
        questions.append(f'Why are you interested in {company_prompt} and how does your experience match the role?')

    while len(questions) < count:
        next_skill = keywords[len(questions) % len(keywords)] if keywords else 'your skills'
        questions.append(f'Describe how you would apply {next_skill} to improve an existing product.')

    return questions[:count]

@app.get('/health')
async def health_check():
    return {'status': 'OK', 'message': 'AI Service is running'}

@app.post('/generate-questions')
async def generate_questions(request: GenerateQuestionsRequest):
    questions = fallback_generate_questions(request.resume_content, request.company, request.count)
    return {
        'status': 'success',
        'questions': questions
    }

@app.post('/evaluate-answer')
async def evaluate_answer(request: EvaluateAnswerRequest):
    answer = request.answer.strip()
    question = request.question.strip()

    if not answer or not question:
        return {'status': 'error', 'message': 'question and answer are required'}

    question_keywords = set(re.findall(r"\b[a-zA-Z0-9+.#]{2,}\b", question.lower()))
    answer_tokens = set(re.findall(r"\b[a-zA-Z0-9+.#]{2,}\b", answer.lower()))
    overlap = len(question_keywords.intersection(answer_tokens))
    score = 30 + min(40, overlap * 10) + min(30, len(answer.split()) // 12)
    score = max(0, min(100, score))

    feedback = 'Great answer! You covered the key points clearly.' if score > 70 else 'Try adding more structure and detail to strengthen your response.'

    return {
        'status': 'success',
        'score': score,
        'feedback': feedback
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
