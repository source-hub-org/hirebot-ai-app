"use client";
import React, { useState, useEffect } from "react";
import { Input, Select } from "@/components/ui";
import { useRouter } from "next/router";
import { LEVEL_OPTIONS, TYPES } from "@/constants/candidate";
import Head from "next/head";
import { useSessionForm } from "@/hooks/useSessionForm";
import { useCandidates } from "@/hooks/useCandidates";
import "react-toastify/dist/ReactToastify.css";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import QuestionsByTopicModal from "@/components/modals/QuestionsByTopicModal";

const SessionPage = ({ params }: { params: { id?: string } }) => {
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const id = params?.id || (router.query.id as string);

  const { candidate: storedCandidate, isLoading } = useCandidates(id);

  const { 
    loading, 
    formRef, 
    formData, 
    topicOptions, 
    handleChange, 
    setFormData, 
    generatedSessions, 
    handleGenerate, 
    deleteSession,
    getQuestionBySession,
    questionShow,
    setQuestionShow,
    sessions,
  } = useSessionForm();

  useEffect(() => {
    setIsClient(true);
    setFormData((prev) => ({
      ...prev,
      language: storedCandidate?.skills?.[0] || "",
    }));
  }, [storedCandidate?.skills, setFormData]);

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
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Kỹ năng phỏng vấn"
              error=""
              rules={["required"]}
              options={TYPES}
            />

            <Select
              name="language"
              value={formData.language}
              onChange={handleChange}
              label="Ngôn ngữ"
              rules={["required"]}
              disabled={formData.type !== TYPES[0].value}
              options={
                storedCandidate?.skills?.map((skill) => ({
                  value: skill,
                  label: skill,
                })) || []
              }
            />

            <Select
              name="level"
              value={formData.position}
              onChange={handleChange}
              label="Cấp độ"
              error=""
              rules={["required"]}
              disabled={formData.type !== TYPES[0].value}
              options={LEVEL_OPTIONS}
            />

            <Select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              label="Chủ đề"
              disabled={formData.type !== TYPES[0].value}
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
                <div key={session.id} className="border p-4 rounded relative">
                  <button 
                    onClick={() => deleteSession(session.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded absolute top-2 right-2"
                  >
                    Xóa
                  </button>
  
                  <button 
                    onClick={() => getQuestionBySession(session)}
                    className="px-4 py-2 bg-primary text-white rounded absolute top-2 right-20"
                  >
                    Xem câu hỏi
                  </button>
                  
                  <p>
                    <span className="font-medium">Kỹ năng phỏng vấn:</span> {TYPES.find(type => type.value === session.type)?.label}
                  </p>
                  {session.type === TYPES[0].value && (
                    <>
                      <p>
                        <span className="font-medium">Ngôn ngữ:</span> {session.language}
                      </p>
                      <p>
                        <span className="font-medium">Cấp độ:</span> {session.position}
                      </p>
                      <p>
                        <span className="font-medium">Chủ đề:</span> {session.topic}
                      </p>
                    </>
                  )}
                  <p>
                    <span className="font-medium">Số câu hỏi:</span> {session.questionCount}
                  </p>
                  <p>
                    <span className="font-medium">Thời gian tạo:</span> {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <QuestionsByTopicModal
        open={!!questionShow.length}
        onClose={() => setQuestionShow([])}
        questions={questionShow}
        sessionQuestion={sessions || undefined}
      />
    </>
  );
};

export default SessionPage;
