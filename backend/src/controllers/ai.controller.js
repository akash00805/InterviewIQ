const { GoogleGenerativeAI } = require('@google/generative-ai');

const geminiApiKey = process.env.GEMINI_API_KEY;
let model = null;

if (geminiApiKey) {
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
}

const categoryQuestions = {
  DSA: [
    'What is the difference between an Array and a Linked List? When would you use each?',
    'Explain Binary Search and its time complexity. Where is it used?',
    'What is a Stack and a Queue? Give real-world examples of each.',
    'Explain the concept of recursion with an example. What are its advantages and disadvantages?',
    'What is the difference between BFS and DFS? When would you prefer one over the other?'
  ],
  DBMS: [
    'What is Normalization? Explain 1NF, 2NF, and 3NF with examples.',
    'What is the difference between SQL and NoSQL databases? When would you use each?',
    'Explain ACID properties in a database with examples.',
    'What is the difference between Primary Key and Foreign Key?',
    'What is indexing in a database and why is it important for performance?'
  ],
  OS: [
    'What is the difference between a Process and a Thread?',
    'Explain Deadlock. What are its four necessary conditions?',
    'What is Virtual Memory and how does it work?',
    'Explain different CPU scheduling algorithms like FCFS, SJF, and Round Robin.',
    'What is a semaphore? How is it used to solve synchronization problems?'
  ],
  CN: [
    'What is the OSI model? Explain each of its 7 layers.',
    'What is the difference between TCP and UDP? When would you use each?',
    'How does DNS work? Explain the process of domain name resolution.',
    'What is subnetting and why is it used in networking?',
    'What is the difference between HTTP and HTTPS? How does SSL/TLS work?'
  ],
  OOP: [
    'What are the 4 pillars of Object Oriented Programming? Explain each.',
    'What is the difference between Abstraction and Encapsulation?',
    'Explain polymorphism with a real-world example.',
    'What is the difference between a class and an object?',
    'What is method overloading vs method overriding? Give examples.'
  ],
  HR: [
    'Tell me about yourself and your background.',
    'What are your greatest strengths and weaknesses?',
    'Where do you see yourself in 5 years?',
    'Describe a time you handled a conflict in a team. How did you resolve it?',
    'Why do you want to join our company? What do you know about us?'
  ]
}

function fallbackGenerateQuestions(company, count) {
  const c = count || 5
  const category = (company || '').toUpperCase()
  const questions = categoryQuestions[category] || categoryQuestions['HR']
  return questions.slice(0, c)
}

function fallbackEvaluateAnswer(question, answer) {
  const q = (question || '').toLowerCase()
  const a = (answer || '').toLowerCase()

  const qTokens = new Set((q.match(/[a-zA-Z0-9+.#]{3,}/g) || []).slice(0, 60))
  const aTokens = new Set((a.match(/[a-zA-Z0-9+.#]{3,}/g) || []).slice(0, 120))
  let overlap = 0
  for (const t of qTokens) {
    if (aTokens.has(t)) overlap++
  }

  const score = Math.max(0, Math.min(100, 25 + overlap * 8))
  const feedback = score >= 75
    ? 'Good answer. You referenced relevant ideas and your response is well structured.'
    : 'Answer is understandable, but try to add more specific details and structure your response better.'

  return { score, feedback }
}

exports.generateQuestions = async (req, res) => {
  try {
    const { resumeText, company, count } = req.body

    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' })
    }

    const c = count || 5

    if (!model) {
      const questions = fallbackGenerateQuestions(company, c)
      return res.json({ questions })
    }

    const prompt = `You are an expert technical interviewer.
Generate exactly ${c} interview questions for the category: ${company || 'General'}.
${resumeText ? `Based on this candidate resume/context: ${resumeText.slice(0, 800)}` : ''}

Rules:
- Return ONLY a JSON array of strings
- No extra text, no markdown, no explanation
- Example: ["Question 1?", "Question 2?", "Question 3?"]

Generate ${c} questions now:`

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const clean = text.replace(/```json|```/g, '').trim()
      const questions = JSON.parse(clean)
      return res.json({ questions })
    } catch (err) {
      console.error('❌ Gemini error (falling back):', err.message)
      const questions = fallbackGenerateQuestions(company, c)
      return res.json({ questions })
    }

  } catch (error) {
    console.error('❌ generateQuestions fatal error:', error.message)
    const questions = fallbackGenerateQuestions(company, count)
    return res.json({ questions })
  }
}

exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body

    if (!question || !answer) {
      return res.status(400).json({ error: 'question and answer are required' })
    }

    if (!model) {
      return res.json(fallbackEvaluateAnswer(question, answer))
    }

    const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Question: ${question}
Candidate's Answer: ${answer}

Evaluate the answer and respond ONLY with a JSON object like this:
{"score": 85, "feedback": "Your feedback here in 2-3 sentences."}

Rules:
- score must be a number from 0 to 100
- feedback must be helpful and specific
- No extra text, only the JSON object`

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const clean = text.replace(/```json|```/g, '').trim()
      const evaluation = JSON.parse(clean)
      return res.json({ score: evaluation.score, feedback: evaluation.feedback })
    } catch (err) {
      console.error('❌ Gemini evaluateAnswer error (falling back):', err.message)
      return res.json(fallbackEvaluateAnswer(question, answer))
    }

  } catch (error) {
    console.error('❌ evaluateAnswer fatal error:', error.message)
    return res.json(fallbackEvaluateAnswer(question, answer))
  }
}