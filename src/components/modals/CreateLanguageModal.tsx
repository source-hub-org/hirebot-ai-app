"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import languageService from "@/services/languageService"; // Import languageService
import { MultiSelect } from "../ui/MultiSelect";
import { ParadigmOptions } from "@/constants/language";
import { Language, initialLanguage } from "@/constants/language";


type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateLanguageModal({ onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<Language>(initialLanguage);
  const [forceValidate, setForceValidate] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForceValidate(true);
    if (!formRef.current) return;

    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for error messages
    const errorElements = formRef.current.querySelectorAll(".text-red-500.text-xs.mt-1");
    const hasErrors = Array.from(errorElements).some((el) => {
      return el.textContent && el.textContent.trim() !== "";
    });

    if (hasErrors) {
      return;
    }

    try {
      const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    const formDataWithSlug = {
        designed_by : formData.designed_by,
        first_appeared: parseInt(formData.first_appeared?.toString()),
        name: formData.name,
        popularity_rank: parseInt(formData.popularity_rank?.toString()),
        slug: slug,
        usage: formData.usage,
        type_system: formData.type_system,
        paradigm: formData.paradigm
      };
      const response = await languageService.createLanguage(formDataWithSlug as Partial<Language>);
      if ('error' in response) {
        throw new Error(response.message || "Tạo ngôn ngữ thất bại");
      }
      toast.success("Tạo ngôn ngữ thành công");
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Tạo ngôn ngữ thất bại";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm ngôn ngữ mới</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên ngôn ngữ"
            name="name"
            value={formData.name}
            onChange={handleChange}
            rules={["required"]}
            context={{ title: "Tên ngôn ngữ" }}
            forceValidate={forceValidate}
          />
          <Input
            label="Ngày xuất hiện đầu tiên"
            name="first_appeared"
            value={formData.first_appeared}
            rules={["required", "number", { min: 1940 }, { max: 2025 }]}
            onChange={handleChange}
            context={{ title: "Ngày xuất hiện đầu tiên" }}
            forceValidate={forceValidate}
          />
          <Input
            label="Được thiết kế bởi"
            name="designed_by"
            value={formData.designed_by}
            rules={["required"]}
            onChange={handleChange}
            context={{ title: "Được thiết kế bởi" }}
            forceValidate={forceValidate}
          />
          <Input
            label="Xếp hạng phổ biến"
            name="popularity_rank"
            type="number"
            value={formData.popularity_rank?.toString()}
            onChange={handleChange}
            rules={["required", "number", { min: 1 }, { max: 100 }]}
            context={{ title: "Xếp hạng phổ biến" }}
            forceValidate={forceValidate}
          />
          <Input
            label="Mục đích sử dụng"
            name="usage"
            value={formData.usage}
            onChange={handleChange}
            rules={["required"]}
            context={{ title: "Mục đích sử dụng" }}
            forceValidate={forceValidate}
          />
          <Input
            label="Hệ thống kiểu"
            name="type_system"
            value={formData.type_system}
            onChange={handleChange}
            rules={["required"]}
            context={{ title: "Hệ thống kiểu" }}
            forceValidate={forceValidate}
          />

          <MultiSelect
            options={ParadigmOptions.map((option) => option.value)}
            selected={formData.paradigm || []}
            onChange={(selected: string[]) =>
              setFormData({ ...formData, paradigm: selected })
            }
            label="Mô hình lập trình"
            placeholder="Chọn mô hình lập trình"
            className="mb-4"
            rules={["required"]}
            context={{ title: "Mô hình lập trình" }}
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
}
