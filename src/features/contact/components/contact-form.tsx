import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { axiosInstance } from "@/shared/api/axios-instance";


type FormData = {
  full_name: string;
  email:     string;
  title:     string;
  subject:   string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;


export function ContactForm() {

  const { t, i18n } = useTranslation("contact");
  const isAr = i18n.language.startsWith("ar");

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email:     "",
    title:     "",
    subject:   "",
  });

  const [errors,      setErrors]      = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,   setIsSuccess]   = useState(false);


  // ── Validation ───────────────────────────────────────────

  const validate = (): boolean => {

    const e: FormErrors = {};

    if (!formData.full_name.trim())
      e.full_name = t("form.errors.nameRequired", "الاسم الكامل مطلوب");

    if (!formData.email.trim()) {
      e.email = t("form.errors.emailRequired", "البريد الإلكتروني مطلوب");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = t("form.errors.emailInvalid", "بريد إلكتروني غير صحيح");
    }

    if (!formData.title.trim())
      e.title = t("form.errors.titleRequired", "الموضوع مطلوب");

    if (!formData.subject.trim())
      e.subject = t("form.errors.messageRequired", "الرسالة مطلوبة");

    setErrors(e);
    return Object.keys(e).length === 0;

  };


  // ── Submit ───────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {

      const body = new FormData();
      body.append("full_name", formData.full_name);
      body.append("email",     formData.email);
      body.append("title",     formData.title);
      body.append("subject",   formData.subject);

      await axiosInstance.post("/contacts", body);

      setIsSuccess(true);
      setFormData({ full_name: "", email: "", title: "", subject: "" });
      toast.success(
        isAr ? "تم إرسال رسالتك بنجاح ✓" : "Message sent successfully ✓"
      );

      setTimeout(() => setIsSuccess(false), 5000);

    } catch (err: any) {

      // Show server validation errors if present
      const apiErrors = err?.response?.data?.errors;

      if (apiErrors && typeof apiErrors === "object") {
        const mapped: FormErrors = {};
        if (apiErrors.full_name) mapped.full_name = apiErrors.full_name[0];
        if (apiErrors.email)     mapped.email     = apiErrors.email[0];
        if (apiErrors.title)     mapped.title     = apiErrors.title[0];
        if (apiErrors.subject)   mapped.subject   = apiErrors.subject[0];
        setErrors(mapped);
      } else {
        const msg =
          err?.response?.data?.message ||
          (isAr ? "فشل إرسال الرسالة، حاول مرة أخرى" : "Failed to send, please try again");
        toast.error(msg);
      }

    } finally {
      setIsSubmitting(false);
    }

  };


  // ── Helpers ──────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses = (field: keyof FormData) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 ${
      errors[field] ? "border-red-300 bg-red-50/50" : "border-gray-200"
    }`;


  // ── Render ───────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {t("form.title", "أرسل لنا رسالة")}
      </h3>

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">
            {t("form.success", "تم إرسال رسالتك، سنتواصل معك قريباً")}
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("form.name", "الاسم الكامل")}
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder={t("form.namePlaceholder", "أدخل اسمك الكامل")}
            className={inputClasses("full_name")}
          />
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("form.email", "البريد الإلكتروني")}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("form.emailPlaceholder", "أدخل بريدك الإلكتروني")}
            className={inputClasses("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("form.titleField", "الموضوع")}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t("form.titlePlaceholder", "ما موضوع رسالتك؟")}
            className={inputClasses("title")}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Subject (message body) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("form.message", "الرسالة")}
          </label>
          <textarea
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder={t("form.messagePlaceholder", "اكتب رسالتك هنا...")}
            rows={5}
            className={`${inputClasses("subject")} resize-none`}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("form.sending", "جاري الإرسال...")}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t("form.submit", "إرسال الرسالة")}
            </>
          )}
        </button>

      </form>
    </motion.div>
  );
}
