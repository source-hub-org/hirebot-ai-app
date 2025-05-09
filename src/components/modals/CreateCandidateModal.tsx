"use client";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectLanguages } from "@/stores/languageSlice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { store } from "@/stores/store";
import { setCandidate } from "@/stores/candidateDetailSlice";
import candidateService from "@/services/candidateService";
import { Candidate } from "@/types/candidate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LEVEL_OPTIONS, STATUS } from "@/constants/candidate";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const CreateCandidateModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const languages = useSelector(selectLanguages);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<Partial<Candidate>>({
    full_name: "",
    email: "",
    phone_number: "",
    interview_level: LEVEL_OPTIONS[0].value,
    skills: [],
  });
  const [forceValidate, setForceValidate] = useState(false);

  const skillOptions = languages?.map((lang) => lang.name) || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    setForceValidate(true);

    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for error messages
    const errorElements = formRef.current.querySelectorAll(
      ".text-red-500.text-xs.mt-1",
    );
    const hasErrors = Array.from(errorElements).some((el) => {
      return el.textContent && el.textContent.trim() !== "";
    });

    if (hasErrors) {
      return;
    }

    try {
      const candidateData = {
        full_name: formData.full_name || "",
        email: formData.email || "",
        phone_number: formData.phone_number || "",
        interview_level: formData.interview_level || "",
        skills: formData.skills as string[],
        status: STATUS.pending,
      };

      const result = await candidateService.createCandidate(candidateData);
      // Save to Redux store (which will also save to localStorage via the slice)
      store.dispatch(
        setCandidate({
          ...result.data,
          answers: [],
        }),
      );

      toast.success(result.message);
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create candidate";
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm ứng viên mới</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="full_name"
            value={formData?.full_name || ""}
            onChange={handleChange}
            label="Tên ứng viên"
            rules={["required"]}
            context={{ title: "Tên ứng viên" }}
            placeholder="Tên ứng viên"
            forceValidate={forceValidate}
          />

          <Input
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleChange}
            label="Số điện thoại"
            rules={["required", "phone"]}
            context={{ title: "Số điện thoại" }}
            placeholder="Số điện thoại"
            forceValidate={forceValidate}
          />

          <Input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            label="Email"
            rules={["required", "email"]}
            context={{ title: "Email" }}
            placeholder="Email"
            forceValidate={forceValidate}
          />

          <Select
            name="interview_level"
            value={formData.interview_level || "intern"}
            onChange={handleChange}
            label="Cấp độ phỏng vấn"
            rules={["required"]}
            context={{ title: "Cấp độ phỏng vấn" }}
            forceValidate={forceValidate}
            options={LEVEL_OPTIONS}
          />

          <MultiSelect
            options={skillOptions}
            selected={formData.skills || []}
            onChange={(selected: string[]) =>
              setFormData({ ...formData, skills: selected })
            }
            label="Chọn kỹ năng"
            placeholder="Chọn kỹ năng"
            className="mb-4"
            rules={["required"]}
            context={{ title: "Kỹ năng" }}
            forceValidate={forceValidate}
          />

          <Select
            name="gender"
            onChange={handleChange}
            label="Giới tính"
            value={formData.gender || "male"}
            options={[
              { value: "male", label: "Nam" },
              { value: "female", label: "Nữ" },
              { value: "other", label: "Khác" },
            ]}
            rules={["required"]}
            context={{ title: "Giới tính" }}
            forceValidate={forceValidate}
          />

          <Input
            name="preferred_stack"
            value={formData.preferred_stack || ""}
            onChange={handleChange}
            label="Vị trí ứng tuyển"
            placeholder="Vị trí tuyển dụng"
            rules={["required"]}
            context={{ title: "Vị trí ứng tuyển" }}
            forceValidate={forceValidate}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCandidateModal;
