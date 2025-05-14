import { Question } from "@/types/question";
import { useState } from "react";
import { toast } from "react-toastify";
import questionService from "@/services/questionService";
import logicService from "@/services/logicService";
import instrumentService from "@/services/instrumentService";

export const useQuestion = () => {
  // --- EDIT MODAL STATE & HANDLERS ---
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditQuestion = (question: Question) => {
    setEditQuestion(question);
    setShowEditModal(true);
  };

  const deleteQuestion = (questionId: string) => {
    questionService
      .deleteQuestion(questionId)
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Xóa không thành công!");
      });
  };
  const deleteQuestionInstriment = (questionId: string) => {
    instrumentService
      .delete(questionId)
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Xóa không thành công!");
      });
  };
  const deleteQuestionLogic = (questionId: string) => {
    logicService
      .delete(questionId)
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Xóa không thành công!");
      });
  };

  // --- END EDIT MODAL STATE & HANDLERS ---
  return {
    editQuestion,
    setEditQuestion,
    showEditModal,
    setShowEditModal,
    handleEditQuestion,
    deleteQuestion,
    deleteQuestionInstriment,
    deleteQuestionLogic,
  };
};
