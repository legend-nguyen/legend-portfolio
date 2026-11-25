// Đặt tại: lib/chat/knowledge.ts
// Toàn bộ "kiến thức" của chatbot nằm ở đây. Chỉ cần sửa file này để cập nhật bot.
// Giữ tổng nội dung ngắn gọn (khoảng 1.500-2.500 token) vì free tier giới hạn token/phút.
// Lưu ý: Toàn bộ thông tin dưới đây được tổng hợp trực tiếp từ nội dung hiện tại trên website.

export type KnowledgeType =
  | "PROFILE"
  | "PROJECT"
  | "EXPERIENCE"
  | "SKILLS"
  | "SITE"
  | "FAQ";

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
      "Nguyễn Huyền Thoại là Senior Full-Stack .NET & AI Developer (Senior Software Engineer), hiện đang sống tại TP. Hồ Chí Minh, Việt Nam. " +
      "Anh có hơn 5 năm kinh nghiệm thiết kế kiến trúc hệ thống doanh nghiệp (đặc biệt là hệ thống HRIS quy mô lớn), " +
      "phát triển .NET hiệu năng cao và tích cực ứng dụng AI (AI agents, LLMs, tự động hóa quy trình kỹ thuật) vào lập trình hàng ngày.",
    url: "/about",
  },
  {
    type: "EXPERIENCE",
    title: "Kinh nghiệm & Học vấn (Nguồn: trang /about)",
    content:
      "- EMS Corporation: Senior Software Engineer (Thg 11 2020 – Hiện tại). Thiết kế, phát triển và tối ưu các phân hệ cốt lõi trong hệ thống HRIS doanh nghiệp.\n" +
      "- DV Software: Intern Software Engineer (Thg 2 2020 – Thg 6 2020).\n" +
      "- Học vấn: Cao Thang Technical College — Cử nhân Công nghệ thông tin (2017 – 2020).",
    url: "/about",
  },
  {
    type: "SKILLS",
    title: "Chuyên môn & Công nghệ (Nguồn: trang / và /about)",
    content:
      "Chuyên môn: Phát triển phần mềm hỗ trợ bởi AI (AI-Assisted Development), Thiết kế UI/UX, Hệ thống Thiết kế (Design Systems), " +
      "Phát triển Frontend, Phát triển Backend, Business Analyst (BA), Thiết kế Tương tác (Interaction Design), Tối ưu Hiệu năng (Performance Tuning).\n" +
      "Công nghệ (Stack): React, Next.js, TypeScript, .NET Core, C# & SQL Server, Tailwind CSS, GSAP, Angular, JavaScript, GitHub, Claude.",
    url: "/about",
  },
  {
    type: "PROJECT",
    title:
      "Nền tảng Nhân sự & Tổ chức Cốt lõi — Core HR (Nguồn: trang /projects)",
    content:
      "Phân hệ HRIS Cốt lõi tại EMSC. Quản lý vòng đời nhân sự (onboarding, biến động, hợp đồng), sơ đồ tổ chức phân cấp đa tầng và phân quyền chi tiết theo phòng ban/chi nhánh. " +
      "Vai trò: Kiến trúc sư phân hệ cốt lõi & Kỹ sư Full-Stack. " +
      "Tác động: Chuẩn hóa dữ liệu nhân sự cho doanh nghiệp đa chi nhánh, tăng tốc tải sơ đồ tổ chức và bảo mật phân quyền chặt chẽ. " +
      "Công nghệ: C#, ASP.NET Core, SQL Server, Entity Framework, Hierarchical CTEs, Multi-Tenant RBAC, TypeScript.",
    url: "/projects",
  },
  {
    type: "PROJECT",
    title:
      "Hệ thống Tuyển dụng Tự động — Automated Recruitment Pipeline (Nguồn: trang /projects)",
    content:
      "Phân hệ Tự động hóa & AI tại EMSC. Quản lý tuyển dụng end-to-end: đồng bộ ứng viên tự động từ các cổng việc làm, lập lịch phỏng vấn thông minh, mẫu email động và báo cáo nguồn tuyển thời gian thực. " +
      "Vai trò: Kỹ sư .NET Full-Stack. " +
      "Tác động: Loại bỏ nhập liệu hồ sơ thủ công, rút ngắn thời gian lên lịch phỏng vấn và minh bạch hiệu suất kênh tuyển dụng. " +
      "Công nghệ: ASP.NET Core, Background Workers, Job Portal Webhooks, Dynamic Email Templates, SQL Server, REST APIs.",
    url: "/projects",
  },
  {
    type: "PROJECT",
    title: "Chấm công, Tính lương & BI — Timekeeping, Payroll & BI (Nguồn: trang /projects)",
    content:
      "Phân hệ Phân tích & BI tại EMSC. Xây dựng API đồng bộ hiệu suất cao kết nối chấm công, tính lương, đánh giá KPIs và hệ thống báo cáo quản trị Dashboard/BI. " +
      "Vai trò: Kỹ sư Backend & Tích hợp. " +
      "Tác động: Đảm bảo nhất quán dữ liệu thời gian thực giữa chấm công, KPIs và bảng lương, giảm đáng kể độ trễ báo cáo cuối kỳ. " +
      "Công nghệ: .NET Core, High-Throughput Sync APIs, SQL Server Indexing, Payroll Engine, KPI Aggregation, BI Dashboards.",
    url: "/projects",
  },
  {
    type: "PROJECT",
    title:
      "Nền tảng Đào tạo Nội bộ — LMS / Enterprise Learning Platform (Nguồn: trang /projects)",
    content:
      "Phân hệ Tự động hóa & AI tại EMSC. Số hóa danh mục khóa học, quản lý kế hoạch đào tạo, theo dõi lộ trình phát triển kỹ năng và chấm điểm trắc nghiệm trực tuyến tự động. " +
      "Vai trò: Kỹ sư Full-Stack. " +
      "Tác động: Chuyển đổi hoàn toàn quy trình đào tạo nội bộ sang nền tảng số với lộ trình rõ ràng và kết quả đánh giá năng lực đo lường được. " +
      "Công nghệ: ASP.NET, Course Catalog Engine, Automated Quiz Scoring, Skill Pathway Tracking, SQL Server, Reporting.",
    url: "/projects",
  },
  {
    type: "SITE",
    title: "Các trang trên website (Nguồn: components/layout/nav.tsx & app/)",
    content:
      "/: Trang chủ (giới thiệu tổng quan, điểm nổi bật về kinh nghiệm/AI/stack, các phân hệ HRIS tiêu biểu và thẻ liên hệ). " +
      "/projects: Danh sách chi tiết các dự án doanh nghiệp & hệ thống HRIS (có bộ lọc theo nhóm và modal xem chi tiết vai trò, tác động, công nghệ). " +
      "/about: Tổng quan (địa điểm, kinh nghiệm, vị trí, trọng tâm), giới thiệu chi tiết (có nút nghe audio), kinh nghiệm, học vấn, chuyên môn và stack công nghệ tương tác.",
  },
  {
    type: "FAQ",
    title: "Cách liên hệ & Mạng xã hội (Nguồn: components/contact/contact-card.tsx)",
    content:
      "Email: thoainguyen.240899@gmail.com (có nút sao chép nhanh trên trang chủ và thẻ liên hệ).\n" +
      "LinkedIn: https://www.linkedin.com/in/nguyen-thoai-745390442/\n" +
      "Zalo: 0983370065\n" +
      "Facebook: https://www.facebook.com/legend.0824\n" +
      "TikTok: https://www.tiktok.com/@nguyenthoai99",
    url: "/about",
  },
] as const;
