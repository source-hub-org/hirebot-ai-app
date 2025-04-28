import { http, HttpResponse } from "msw";

// Import dữ liệu mẫu
import { candidates } from "./data/candidates"; // Danh sách ứng viên
import { questions } from "./data/questions"; // Danh sách câu hỏi
import { sessions } from "./data/sessions"; // Danh sách phiên thi

// Define types for request bodies
interface LoginRequestBody {
  username: string;
  password: string;
}

interface SessionRequestBody {
  language: string;
  level: string;
  questionCount: number;
  timeLimit: number;
}

interface SubmitQuizRequestBody {
  candidateName: string;
  candidateEmail: string;
  timeSpent: string;
  answers?: Array<{ questionId: number; answerId: number }>;
}

// Define types for questions
interface QuestionOption {
  id: string;
  text: string;
  correct?: boolean;
}

interface Question {
  id: number;
  question: string;
  type: string;
  language: string;
  level: string;
  options?: QuestionOption[];
}

export const handlers = [
  // API đăng nhập quản trị viên
  http.post("/api/login", async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody;
    const { username, password } = body;

    if (username === "admin" && password === "password") {
      return HttpResponse.json(
        {
          token: "mock-jwt-token",
          user: {
            id: 1,
            name: "Admin User",
            role: "admin",
          },
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }),

  // Get candidates list
  http.get("/api/candidates", ({ request }) => {
    const url = new URL(request.url);
    // Get query parameters
    const language = url.searchParams.get("language");
    const level = url.searchParams.get("level");
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Filter candidates
    let filteredCandidates = [...candidates];

    if (language) {
      filteredCandidates = filteredCandidates.filter(
        (c) => c.language === language,
      );
    }

    if (level) {
      filteredCandidates = filteredCandidates.filter((c) => c.level === level);
    }

    if (status) {
      filteredCandidates = filteredCandidates.filter(
        (c) => c.status === status,
      );
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

    return HttpResponse.json(
      {
        data: paginatedCandidates,
        meta: {
          total: filteredCandidates.length,
          page,
          limit,
          totalPages: Math.ceil(filteredCandidates.length / limit),
        },
      },
      { status: 200 },
    );
  }),

  // Get candidate details
  http.get("/api/candidates/:id", ({ params }) => {
    const { id } = params;
    const candidate = candidates.find((c) => c.id === parseInt(id as string));

    if (!candidate) {
      return HttpResponse.json(
        { message: "Candidate not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: candidate }, { status: 200 });
  }),

  // Get candidate results
  http.get("/api/candidates/:id/results", ({ params }) => {
    const { id } = params;
    const candidate = candidates.find((c) => c.id === parseInt(id as string));

    if (!candidate) {
      return HttpResponse.json(
        { message: "Candidate not found" },
        { status: 404 },
      );
    }

    // Mock results data
    const results = {
      candidateId: candidate.id,
      candidateName: candidate.name,
      language: candidate.language,
      level: candidate.level,
      date: candidate.date,
      mcqScore: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
      essayScore: Math.floor(Math.random() * 41) + 60,
      totalScore: 0, // Will be calculated
      status: candidate.status,
      timeSpent: "25:30",
      feedback:
        "Ứng viên có kiến thức tốt về JavaScript, hiểu rõ về async/await và closure. Cần cải thiện thêm về performance optimization.",
      strengths: ["ES6 Features", "Array Methods", "DOM Manipulation"],
      weaknesses: ["Closures", "Async/Await", "Performance Optimization"],
      answers: [
        {
          question: "JavaScript là ngôn ngữ lập trình gì?",
          answer: "Interpreted",
          correct: true,
        },
        {
          question: "Sự khác biệt giữa let và var?",
          answer: "Block scope vs function scope",
          correct: true,
        },
        {
          question: "Closure trong JS là gì?",
          answer: "Function có thể truy cập biến bên ngoài scope của nó",
          correct: true,
        },
        {
          question: "Promise là gì?",
          answer:
            "Đối tượng đại diện cho giá trị có thể có hoặc không có ở tương lai",
          correct: true,
        },
        {
          question: "Event loop hoạt động thế nào?",
          answer: "Sai",
          correct: false,
        },
      ],
    };

    // Calculate total score
    results.totalScore = Math.round(
      (results.mcqScore + results.essayScore) / 2,
    );

    return HttpResponse.json({ data: results }, { status: 200 });
  }),

  // Get questions list
  http.get("/api/questions", ({ request }) => {
    const url = new URL(request.url);
    // Get query parameters
    const type = url.searchParams.get("type");
    const language = url.searchParams.get("language");
    const level = url.searchParams.get("level");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Filter questions
    let filteredQuestions = [...questions];

    if (type) {
      filteredQuestions = filteredQuestions.filter((q) => q.type === type);
    }

    if (language) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.language === language,
      );
    }

    if (level) {
      filteredQuestions = filteredQuestions.filter((q) => q.level === level);
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    return HttpResponse.json(
      {
        data: paginatedQuestions,
        meta: {
          total: filteredQuestions.length,
          page,
          limit,
          totalPages: Math.ceil(filteredQuestions.length / limit),
        },
      },
      { status: 200 },
    );
  }),

  // Create question
  http.post("/api/questions", async ({ request }) => {
    const newQuestion = (await request.json()) as Question;

    // Generate ID
    newQuestion.id = Math.max(...questions.map((q) => q.id)) + 1;

    // Add to questions array
    questions.push(newQuestion);

    return HttpResponse.json({ data: newQuestion }, { status: 201 });
  }),

  // Update question
  http.put("/api/questions/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedQuestion = (await request.json()) as Partial<Question>;

    const index = questions.findIndex((q) => q.id === parseInt(id as string));

    if (index === -1) {
      return HttpResponse.json(
        { message: "Question not found" },
        { status: 404 },
      );
    }

    // Update question
    questions[index] = { ...questions[index], ...updatedQuestion };

    return HttpResponse.json({ data: questions[index] }, { status: 200 });
  }),

  // Delete question
  http.delete("/api/questions/:id", ({ params }) => {
    const { id } = params;

    const index = questions.findIndex((q) => q.id === parseInt(id as string));

    if (index === -1) {
      return HttpResponse.json(
        { message: "Question not found" },
        { status: 404 },
      );
    }

    // Remove question
    questions.splice(index, 1);

    return HttpResponse.json(
      { message: "Question deleted successfully" },
      { status: 200 },
    );
  }),

  // Create session
  http.post("/api/sessions", async ({ request }) => {
    const body = (await request.json()) as SessionRequestBody;
    const { language, level, questionCount, timeLimit } = body;

    // Generate session token
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Create new session
    const newSession = {
      id: Math.max(...sessions.map((s) => s.id)) + 1,
      token,
      language,
      level,
      questionCount,
      timeLimit,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      status: "ACTIVE",
    };

    // Add to sessions array
    sessions.push(newSession);

    return HttpResponse.json({ data: newSession }, { status: 201 });
  }),

  // Get session by token
  http.get("/api/sessions/:token", ({ params }) => {
    const { token } = params;

    const session = sessions.find((s) => s.token === token);

    if (!session) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: session }, { status: 200 });
  }),

  // Get questions for session
  http.get("/api/sessions/:token/questions", ({ params }) => {
    const { token } = params;

    const session = sessions.find((s) => s.token === token);

    if (!session) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    // Filter questions by language and level
    const filteredQuestions = questions.filter(
      (q) => q.language === session.language && q.level === session.level,
    );

    // Randomly select questions
    const selectedQuestions = filteredQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, session.questionCount);

    return HttpResponse.json({ data: selectedQuestions }, { status: 200 });
  }),

  // Submit quiz answers
  http.post("/api/sessions/:token/submit", async ({ params, request }) => {
    const { token } = params;
    const body = (await request.json()) as SubmitQuizRequestBody;
    const { candidateName, candidateEmail, timeSpent } = body;

    const sessionToken = token as string; // Cast token to string
    const session = sessions.find((s) => s.token === sessionToken);

    if (!session) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    // Calculate score (in a real app, this would be more complex)
    const score = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
    const status = score >= 70 ? "PASS" : "FAIL";

    // Create new candidate
    const newCandidate = {
      id: Math.max(...candidates.map((c) => c.id)) + 1,
      name: candidateName,
      email: candidateEmail,
      language: session.language,
      level: session.level,
      status,
      date: new Date().toISOString().split("T")[0],
      sessionToken: sessionToken,
    };

    // Add to candidates array
    candidates.push(newCandidate);

    // Create result object
    const result = {
      candidateId: newCandidate.id,
      sessionToken: sessionToken,
      score,
      status,
      timeSpent,
      submittedAt: new Date().toISOString(),
    };

    return HttpResponse.json({ data: result }, { status: 201 });
  }),
];
