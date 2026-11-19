// Đặt tại: lib/chat/knowledge.ts
// Toàn bộ "kiến thức" của chatbot nằm ở đây. Chỉ cần sửa file này để cập nhật bot.
// Giữ tổng nội dung ngắn gọn (khoảng 1.500-2.500 token) vì free tier giới hạn token/phút.
// Lưu ý: Các mục dưới đây được tổng hợp từ nội dung thật trên website, kèm chú thích nguồn để bạn kiểm tra và bổ sung.

export type KnowledgeType = "PROFILE" | "PROJECT" | "EXPERIENCE" | "SKILLS" | "SITE" | "FAQ";

export interface KnowledgeEntry {
  type: KnowledgeType;
  title: string;
  content: string;
  /** Đường dẫn trên website để bot gợi ý, ví dụ "/projects" */
  url?: string;
}

// Nguồn: shared/i18n/translates/lang-vn.ts (hero.greetingSuffix, about.intro.name)
export const OWNER_NAME = "Nguyễn Huyền Thoại";

export const knowledge: readonly KnowledgeEntry[] = [
  {
    type: "PROFILE",
    title: "Giới thiệu (Nguồn: trang chủ / và trang /about)",
    content:
      "Nguyễn Huyền Thoại là Kỹ sư .NET Full-Stack (Full-Stack .NET Engineer) với hơn 5 năm kinh nghiệm, " +
      "chuyên phát triển hệ thống doanh nghiệp, tối ưu hóa vận hành và ứng dụng AI (AI agents, LLMs) vào quy trình lập trình. " +
      "[Placeholder: bổ sung thành phố đang sống / trạng thái tìm việc nếu muốn công khai].",
    url: "/about",
  },
  {
    type: "EXPERIENCE",
    title: "Kinh nghiệm & Học vấn (Nguồn: trang /about)",
    content:
      "- EMS Coporation: Senior Software Engineer (Thg 11 2020 – Hiện tại), tham gia phát triển các phân hệ cốt lõi hệ thống HRIS doanh nghiệp.\n" +
      "- DV Software: Intern Software Engineer (Thg 2 2020 – Thg 6 2020).\n" +
      "- Học vấn: Cao Thang Technical College, Cử nhân Công nghệ thông tin (2017 – 2020).",
    url: "/about",
  },
  {
    type: "SKILLS",
    title: "Chuyên môn & Công nghệ (Nguồn: trang /about)",
    content:
      "Chuyên môn: AI-Assisted Development, UI/UX Design, Design Systems, Frontend Development, Backend Development, Business Analyst, Interaction Design, Performance Tuning. " +
      "Công nghệ (Stack): React, Next.js, TypeScript, Tailwind CSS, Angular, JavaScript, .NET, C# / LINQ / SQL Server, GSAP, GitHub, Claude.",
    url: "/about",
  },
  {
    type: "PROJECT",
    title: "Dự án Doanh nghiệp & Hệ thống HRIS tại EMSC (Nguồn: trang / và /projects)",
    content:
      "Các phân hệ cốt lõi phục vụ quản trị nguồn nhân lực quy mô lớn tại EMSC:\n" +
      "1. Nhân sự (HR): Quản lý vòng đời nhân sự (onboarding, biến động, hợp đồng), tối ưu CSDL lớn, sơ đồ tổ chức đa tầng, phân quyền theo phòng ban/chi nhánh.\n" +
      "2. Tuyển dụng (Recruitment): Quản lý tuyển dụng end-to-end, tự động hóa luồng ứng viên từ cổng việc làm, lập lịch phỏng vấn, email tự động và báo cáo thời gian thực.\n" +
      "3. Chấm công (Timekeeping): Tích hợp chấm công, tính lương, KPIs, Dashboard/BI và API đồng bộ dữ liệu hiệu suất cao.\n" +
      "4. Đào tạo (Training / E-learning): Số hóa khóa học, lộ trình đào tạo nội bộ và đánh giá trắc nghiệm trực tuyến.",
    url: "/projects",
  },
  {
    type: "SITE",
    title: "Các trang trên website (Nguồn: components/layout/nav.tsx & app/)",
    content:
      "/: Trang chủ (giới thiệu tổng quan, dự án nổi bật và thẻ liên hệ). " +
      "/projects: Danh sách chi tiết các dự án doanh nghiệp & hệ thống HRIS. " +
      "/about: Giới thiệu chi tiết (có nút nghe audio), kinh nghiệm, học vấn, chuyên môn và stack công nghệ. " +
      "[Placeholder: bổ sung link CV nếu có, hiện chưa thấy trang /contact hay /blog riêng].",
  },
  {
    type: "FAQ",
    title: "Cách liên hệ (Nguồn: components/contact/contact-button.tsx & contact-card.tsx)",
    content:
      "Email: thoainguyen.240899@gmail.com (có nút sao chép nhanh trên trang chủ và thẻ liên hệ). " +
      "[Placeholder: cập nhật link LinkedIn và X cụ thể nếu muốn bot chia sẻ; hiện trên card chỉ trỏ tới linkedin.com và x.com].",
    url: "/about",
  },
] as const;

