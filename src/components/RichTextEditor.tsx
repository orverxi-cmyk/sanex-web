
"use client";

import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, label, placeholder }: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current && !quillRef.current) {
      const initQuill = async () => {
        const QuillModule = await import("quill");
        const Quill = QuillModule.default;

        quillRef.current = new Quill(containerRef.current!, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "clean"],
            ],
          },
          placeholder: placeholder,
        });

        // Set initial value
        if (value) {
          quillRef.current.root.innerHTML = value;
        }

        quillRef.current.on("text-change", () => {
          if (!isUpdatingRef.current) {
            const html = quillRef.current.root.innerHTML;
            // Only trigger onChange if the content actually changed and isn't just empty Quill boilerplate
            if (html === "<p><br></p>" && !value) return;
            onChange(html);
          }
        });
      };

      initQuill();
    }
  }, []);

  // Sync external value changes into the editor
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      isUpdatingRef.current = true;
      quillRef.current.root.innerHTML = value || "";
      isUpdatingRef.current = false;
    }
  }, [value]);

  return (
    <div className="space-y-1.5">
      {label && <label className="text-[10px] font-bold uppercase text-muted-foreground">{label}</label>}
      <div className="rounded-md border bg-white overflow-hidden shadow-sm rich-text-editor-container">
        <div ref={containerRef} className="min-h-[150px]" />
      </div>
      <style jsx global>{`
        .rich-text-editor-container .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--muted)/0.3);
        }
        .rich-text-editor-container .ql-container {
          border: none !important;
          font-family: inherit;
        }
        .rich-text-editor-container .ql-editor {
          font-size: 0.875rem;
          min-height: 150px;
        }
      `}</style>
    </div>
  );
}
