"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input, Select } from "@/components/ui";
import { useRouter } from "next/router";
import { addAnswer } from "@/stores/candidateDetailSlice";
import { store } from "@/stores/store";
import { LEVEL_OPTIONS } from "@/constants/candidate";
import Head from "next/head";
import { useSessionForm } from "@/hooks/useSessionForm";
import { useCandidates } from "@/hooks/useCandidates";
import { Session } from "@/types/session";
import questionService from "@/services/questionService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Answer } from "@/types/candidate";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const SessionPage = ({ params }: { params: { id?: string } }) => {
  const [isClient, setIsClient] = useState(false);
  const [generatedSessions, setGeneratedSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const id = params?.id || (router.query.id as string);

  const { candidate: storedCandidate, isLoading } = useCandidates(id);

  const { formData, topicOptions, handleChange, setFormData } =
    useSessionForm();

  useEffect(() => {
    setIsClient(true);
    setFormData((prev) => ({
      ...prev,
      language: storedCandidate?.skills?.[0] || "",
    }));
  }, [storedCandidate?.skills, setFormData]);

  const formRef = useRef<HTMLFormElement>(null);

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

      // Call questions API
      const questionsResponse = await questionService.searchQuestions({
        language: formData.language,
        position: formData.level,
        topic: formData.topic,
        page: 1,
        page_size: formData.questionCount,
        mode:'full',
        sort_by:'question',
        sort_direction: 'desc'
      });
      formData.questionCount = questionsResponse?.data?.length || 0
      if (!questionsResponse?.data?.length) {
        // Fallback to generate questions if search fails
        const generatedQuestions = await questionService.generateQuestions({
          language: formData.language,
          position: formData.level,
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
          store.dispatch(addAnswer(question));
        });
      } else {
        // Save found questions to candidate answers
        questionsResponse.data.forEach((question: Answer) => {
          store.dispatch(addAnswer(question));
        });
      }

      const newSession: Session = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      setGeneratedSessions((prev) => [...prev, newSession]);
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi tạo phiên phỏng vấn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!storedCandidate || !isClient || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      <Head>
        <title>Quizo Admin | Quản lý ứng viên</title>
        <meta name="description" content="Danh sách ứng viên Quizo" />
      </Head>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Tạo Phiên Thi Mới</h1>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Thông tin ứng viên</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Họ tên</p>
              <p className="font-medium">{storedCandidate.full_name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{storedCandidate.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Số điện thoại</p>
              <p className="font-medium">{storedCandidate.phone_number}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cấp độ</p>
              <p className="font-medium">{storedCandidate.interview_level}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form ref={formRef} className="space-y-6">
            <Select
              name="language"
              value={formData.language}
              onChange={handleChange}
              label="Ngôn ngữ"
              rules={["required"]}
              options={
                storedCandidate?.skills?.map((skill) => ({
                  value: skill,
                  label: skill,
                })) || []
              }
            />

            <Select
              name="level"
              value={formData.level}
              onChange={handleChange}
              label="Cấp độ"
              error=""
              rules={["required"]}
              options={LEVEL_OPTIONS}
            />

            <Select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              label="Chủ đề"
              options={topicOptions}
            />

            <Input
              type="number"
              name="questionCount"
              value={formData.questionCount}
              onChange={handleChange}
              label="Số lượng câu hỏi"
              rules={["required", "number", { min: 5 }, { max: 50 }]}
              min={5}
              max={50}
            />

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                onClick={handleGenerate}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Tạo câu hỏi
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={!storedCandidate.answers?.length}
                onClick={() => router.push(`/admin/sessions/interview`)}
              >
                Tạo phiên thi
              </button>
            </div>
          </form>
        </div>

        {generatedSessions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Danh sách Phiên Thi</h2>
            <div className="space-y-4">
              {generatedSessions.map((session) => (
                <div key={session.id} className="border p-4 rounded">
                  <p>
                    <span className="font-medium">Ngôn ngữ:</span>{" "}
                    {session.language}
                  </p>
                  <p>
                    <span className="font-medium">Cấp độ:</span> {session.level}
                  </p>
                  <p>
                    <span className="font-medium">Chủ đề:</span> {session.topic}
                  </p>
                  <p>
                    <span className="font-medium">Số câu hỏi:</span>{" "}
                    {session.questionCount}
                  </p>
                  <p>
                    <span className="font-medium">Thời gian tạo:</span>{" "}
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SessionPage;
