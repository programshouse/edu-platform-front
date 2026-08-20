import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";

interface AssignmentUploadProps {
  selectedFile: File | null;
  isDragging: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onSubmit: () => void;
}

export function AssignmentUpload({
  selectedFile,
  isDragging,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onSubmit,
}: AssignmentUploadProps) {
  const { t } = useTranslation("courses");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t("assignment.upload")}</h3>
      
      <div
         onDragOver={onDragOver}
         onDragLeave={onDragLeave}
         onDrop={onDrop}
         onClick={() => fileInputRef.current?.click()}
         className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all mb-6 ${
           isDragging 
             ? "border-blue-500 bg-blue-50 relative z-10" 
             : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
         }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
        <p className="text-gray-600 mb-2 font-medium">
          {selectedFile 
             ? t("assignment.fileSelected", { file: selectedFile.name }) 
             : t("assignment.dragDrop")
          }
        </p>
        <p className="text-xs text-gray-400">PDF, DOCX, ZIP up to 50MB</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
        />
      </div>

      <div className="flex justify-end">
         <button
           onClick={onSubmit}
           disabled={!selectedFile}
           className="py-3 px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
         >
           {t("assignment.submitAssignment")}
         </button>
      </div>
    </div>
  );
}
