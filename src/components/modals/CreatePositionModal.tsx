"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import positionService from "@/services/positionService";
import { Position } from "@/constants/position";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  onClose: () => void;
  refreshPositions: () => void;
};

export default function CreatePositionModal({
  onClose, 
  refreshPositions 
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<Partial<Position>>({
    title: "",
    description: "",
    instruction: "",
    level: 1,
    slug: "",
    is_active: true
  });
  const [forceValidate, setForceValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForceValidate(true);

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
      setIsLoading(true);
      formData.slug = formData.title?.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-') || "";
      await positionService.createPosition(formData);
      toast.success("Position created successfully");
      refreshPositions();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create position");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm vị trí mới</h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Tiêu đề"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              rules={["required"]}
              context={{ title: "Tiêu đề" }}
              forceValidate={forceValidate}
            />
            
            <Input
              label="Cấp độ"
              name="level"
              value={formData.level || ""}
              onChange={handleChange}
              rules={["required", "number", { min: 1 }]}
              context={{ title: "Cấp độ" }}
              forceValidate={forceValidate}
            />
            
            
            <Input
              label="Mô tả"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rules={["required"]}
              context={{ title: "Mô tả" }}
              forceValidate={forceValidate  }
            />
            
            <Input
              label="Hướng dẫn"
              name="instruction"
              rules={["required"]}
              context={{ title: "Hướng dẫn" }}
              value={formData.instruction || ""}
              onChange={handleChange}
              forceValidate={forceValidate}
            />
            
            <Select
              label="Trạng thái hoạt động"
              name="is_active"
              value={formData.is_active ? "true" : "false"}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  is_active: e.target.value === "true"
                }));
              }}
              options={[
                { value: "true", label: "Hoạt động" },
                { value: "false", label: "Không hoạt động" }
              ]}
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
               className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                disabled={isLoading}
              >
                {isLoading ? "Thêm..." : "Thêm vị trí"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
