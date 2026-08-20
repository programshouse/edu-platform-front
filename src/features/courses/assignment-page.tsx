import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AssignmentHeader } from "./components/assignment-header";
import { AssignmentUpload } from "./components/assignment-upload";
import { AssignmentResult } from "./components/assignment-result";

// Mock Data
const mockAssignment = {
  title: "Build a Landing Page",
  description: "Create a fully responsive landing page using HTML and CSS. Requirements:\n- Use Flexbox or Grid for layout\n- Mobile-first approach\n- Include a hero section, features list, and contact form.",
  deadline: "2026-04-15T23:59:59Z", // Future date
  status: "not_submitted", // "not_submitted", "submitted", "graded"
  grade: null, // e.g. 85
  maxGrade: 100,
  teacherComment: null as string | null, // "Great job on the responsiveness!"
  submittedFile: null as string | null // e.g. "landing_page.zip"
};

export function AssignmentPage() {
  const { courseId, lectureIndex } = useParams();

  const [assignmentData, setAssignmentData] = useState(mockAssignment);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      // API Call goes here
      setAssignmentData((prev) => ({
        ...prev,
        status: "submitted",
        submittedFile: selectedFile.name
      }));
    }
  };

  // Format date
  const deadlineDate = new Date(assignmentData.deadline);
  const isOverdue = new Date() > deadlineDate && assignmentData.status === "not_submitted";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <AssignmentHeader
          title={assignmentData.title}
          description={assignmentData.description}
          deadlineDate={deadlineDate}
          isOverdue={isOverdue}
          status={assignmentData.status}
          courseId={courseId}
          lectureIndex={lectureIndex}
        />

        {/* Submission / Grade Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
          {assignmentData.status === "not_submitted" ? (
             <AssignmentUpload
                selectedFile={selectedFile}
                isDragging={isDragging}
                onFileChange={handleFileChange}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onSubmit={handleSubmit}
             />
          ) : (
            <AssignmentResult
               status={assignmentData.status}
               submittedFile={assignmentData.submittedFile}
               grade={assignmentData.grade}
               maxGrade={assignmentData.maxGrade}
               teacherComment={assignmentData.teacherComment}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
