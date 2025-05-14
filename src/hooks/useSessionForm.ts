import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "@/stores/store";
import { LEVEL_OPTIONS, TYPES } from "@/constants/candidate";
import { Session, SessionFormData } from "@/types/session";
import questionService from "@/services/questionService";
import instrumentService from "@/services/instrumentService";
import { toast } from "react-toastify";
import { Answer } from "@/types/candidate";
import { addAnswer, removeAnswersBySession } from "@/stores/candidateDetailSlice";
import { ApiResponse } from "@/types/common";
import logicService from "@/services/logicService";

export const useSessionForm = () => {
  const [formData, setFormData] = useState<SessionFormData>({
    language: "",
    position: LEVEL_OPTIONS[0].value,
    topic: "",
    questionCount: 5,
    type: TYPES[0].value
  });
  const [generatedSessions, setGeneratedSessions] = useState<Session[]>([]);
  const [sessions, setSessions] = useState<Session>();
  const [questionShow, setQuestionShow] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [topicOptions, setTopicOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const storedTopics = useSelector(
    (state: RootState) => state.candidateDetail.topics,
  );

  const changeLevel = useCallback(
    (level: string) => {
      const newFilteredTopics =
        storedTopics?.filter((topic) => topic.suitable_level === level) || [];

      const newTopicOptions = newFilteredTopics.map((topic) => ({
        value: topic.title,
        label: topic.title,
      }));

      setTopicOptions(newTopicOptions);

      if (newTopicOptions.length > 0) {
        setFormData((prev) => ({
          ...prev,
          topic: newTopicOptions[0].value,
        }));
      }
    },
    [storedTopics],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "position") {
      changeLevel(value);
    }
  };

  // Initialize topic options
  useEffect(() => {
    if (storedTopics) {
      changeLevel(formData.position);
    }
  }, [storedTopics, formData.position, changeLevel]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for error messages
    const errorElements = formRef.current.querySelectorAll(
      ".text-red-500.text-xs.mt-1",
    );
    const hasErrors = Array.from(errorElements).some((el) => {
      return el.textContent && el.textContent.trim() !== "";
    });

    if (hasErrors) return;

    try {
      setLoading(true);

      // Get existing question IDs for this session criteria
      let existingQuestionIds = ''
      // Call questions API with ignore_question_ids
      let questionsResponse: ApiResponse<Answer[]> | null = null;
      if (formData.type === TYPES[0].value) {
        existingQuestionIds = store.getState().candidateDetail.candidate?.answers
          ?.filter(answer => 
            answer.language === formData.language &&
            answer.position?.toLowerCase() === formData.position.toLowerCase() &&
            answer.topic === formData.topic
          )
          .map(answer => answer._id)
          .filter(Boolean)
          .join(',') ?? '';
        questionsResponse = await questionService.searchQuestions({
          language: formData.language,
          position: formData.position,
          topic: formData.topic,
          page: 1,
          page_size: formData.questionCount,
          mode: 'full',
          sort_by: 'question',
          sort_direction: 'desc',
          ignore_question_ids: existingQuestionIds
        });
      }
      if (formData.type === TYPES[1].value) {
        existingQuestionIds = store.getState().candidateDetail.candidate?.answers
          ?.filter(answer => 
            answer.questionId
          )
          .map(answer => answer._id)
          .filter(Boolean)
          .join(',') ?? '';
        questionsResponse = await instrumentService.get({
          page: 1,
          limit: formData.questionCount,
          mode: 'full',
          sort_by: 'createdAt',
          sort_direction: 'desc',
          ignore_instrument_ids: existingQuestionIds
        });
      }
      if (formData.type === TYPES[2].value) {
        existingQuestionIds = store.getState().candidateDetail.candidate?.answers
          ?.filter(answer => 
            answer._id
          )
          .map(answer => answer._id)
          .filter(Boolean)
          .join(',') ?? '';
        questionsResponse = await logicService.get({
          page: 1,
          limit: formData.questionCount,
          mode: 'full',
          sort_by: 'createdAt',
          sort_direction: 'desc',
          ignore_question_ids: existingQuestionIds
        });
      }
      formData.questionCount = questionsResponse?.data?.length || 0
      if (!questionsResponse?.data?.length && formData.type === TYPES[0].value) {
        // Fallback to generate questions if search fails
        const generatedQuestions = await questionService.generateQuestions({
          language: formData.language,
          position: formData.position,
          topic: formData.topic,
          count: formData.questionCount
        });
        if (!generatedQuestions?.data?.length) {
          toast.error("Không thể tạo câu hỏi phù hợp");
          return;
        }
        formData.questionCount = generatedQuestions?.data?.length || 0
        
        // Save generated questions to candidate answers
        generatedQuestions.data.forEach((question: Answer) => {
          store.dispatch(addAnswer({ ...question, sessionId: Date.now(), filter_fe: formData }));
        });
      }
      else if (questionsResponse?.data?.length) {
        // Save found questions to candidate answers
        const newSession: Session = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };

        questionsResponse.data.forEach((question: Answer) => {
          store.dispatch(addAnswer({ ...question, sessionId: newSession.id , filter_fe: formData }));
        });

        setGeneratedSessions((prev) => [...prev, newSession]);
      } else {
        toast.error("Không thể tạo câu hỏi phù hợp");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi tạo phiên phỏng vấn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = (sessionId: number) => {
    setGeneratedSessions(prev => {
      // Get the session being deleted
      const deletedSession = prev.find(session => session.id === sessionId);
      
      // Remove answers related to this session from Redux store
      if (deletedSession) {
        store.dispatch(removeAnswersBySession(deletedSession));
      }
      
      return prev.filter(session => session.id !== sessionId);
    });
  };

  const getQuestionBySession = (session: Session) => {
    const questions = store.getState().candidateDetail.candidate?.answers.filter(answer => answer.sessionId === session.id);
    setQuestionShow(questions || []);
    setSessions(session);
  };
  return {
    formData,
    formRef,
    loading,
    topicOptions,
    handleGenerate,
    generatedSessions,
    deleteSession,
    handleChange,
    setFormData,
    getQuestionBySession,
    questionShow,
    setQuestionShow,
    sessions,
  };
};
