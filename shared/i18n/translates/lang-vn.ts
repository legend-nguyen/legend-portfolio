import type { TranslationDictionary } from "../translation-keys";

export const langVn: TranslationDictionary = {
  site: {
    name: "Portfolio",
    description:
      "Mẫu portfolio hiện đại, chuẩn accessibility được xây dựng với Next.js, Tailwind CSS và TypeScript.",
  },
  common: {
    skipToContent: "Bỏ qua đến nội dung chính",
  },
  nav: {
    ariaLabel: "Điều hướng chính",
    home: "Trang chủ",
    projects: "Dự án",
    about: "Giới thiệu",
  },
  theme: {
    switchToLight: "Chuyển sang giao diện sáng",
    switchToDark: "Chuyển sang giao diện tối",
    toggle: "Đổi giao diện",
  },
  motion: {
    disableAnimations: "Tắt hiệu ứng (mượt hơn cho máy cấu hình yếu)",
    enableAnimations: "Bật hiệu ứng chuyển động",
    toggle: "Bật/tắt hiệu ứng",
  },
  language: {
    ariaLabel: "Chọn ngôn ngữ",
    selectOption: "Chuyển ngôn ngữ sang {language}",
  },
  home: {
    metaTitle: "Trang chủ",
    highlights: {
      expLabel: "Kinh nghiệm",
      expValue: "5+ Năm Hệ thống HRIS",
      expDetail:
        "Phân hệ nhân sự, tuyển dụng, chấm công & tính lương quy mô lớn.",
      aiLabel: "Quy trình",
      aiValue: "Quy trình Phát triển AI",
      aiDetail: "AI agents, LLMs & tự động hóa quy trình kỹ thuật.",
      stackLabel: "Công nghệ",
      stackValue: "Full-Stack .NET & Next.js",
      stackDetail: "Kiến trúc tinh gọn, TypeScript & tối ưu SQL Server.",
    },
    featured: {
      headline: "Các phân hệ HRIS doanh nghiệp",
      subheadline:
        "Các phân hệ sản phẩm cốt lõi được thiết kế, xây dựng và tối ưu hóa ở quy mô doanh nghiệp tại EMSC.",
    },
  },
  hero: {
    greetingPrefix: "Xin chào",
    greetingSuffix: ", tôi là Nguyễn Huyền Thoại",
    headlineLine1: "Full-Stack .NET",
    headlineLine2: "& AI Developer",
    subtitle:
      "Kỹ sư Senior Full-Stack .NET với hơn 5 năm kinh nghiệm thiết kế kiến trúc hệ thống tinh gọn, hiệu năng cao cùng quy trình phát triển tối ưu hóa bằng AI.",
    portraitAlt: "Ảnh chân dung Thoại",
    viewWork: "Xem dự án",
  },
  contact: {
    buttonLabel: "Liên hệ",
    emailCopied: "Đã sao chép email",
    copyEmail: "Sao chép {email}",
    copyEmailLabel: "Sao chép email",
    copied: "Đã sao chép",
    showEmail: "Hiện email",
  },
  projects: {
    metaTitle: "Dự án",
    metaDescription: "Các dự án tiêu biểu và nghiên cứu tình huống.",
    pageTitle: "Dự án Doanh nghiệp & Hệ thống HRIS",
    pageSubtitle:
      "Các phân hệ cốt lõi phục vụ quản trị nguồn nhân lực quy mô lớn tại EMSC, nơi tôi trực tiếp thiết kế, phát triển và tối ưu hóa các module nghiệp vụ chuyên sâu.",
    headline: "Dự án Doanh nghiệp & Hệ thống HRIS",
    subheadline:
      "Các phân hệ cốt lõi phục vụ quản trị nguồn nhân lực quy mô lớn tại EMSC, nơi tôi trực tiếp thiết kế, phát triển và tối ưu hóa các module nghiệp vụ chuyên sâu.",
    viewAll: "Xem tất cả dự án",
    detailsCue: "Chi tiết",
    filters: {
      all: "Tất cả",
      hris: "HRIS Cốt lõi",
      automation: "Tự động hóa & AI",
      analytics: "Phân tích & BI",
    },
    modal: {
      roleHeading: "Vai trò Kiến trúc",
      impactHeading: "Tác động Nghiệp vụ",
      stackHeading: "Công nghệ sử dụng",
      close: "Đóng",
    },
    items: {
      hr: {
        iconLabel: "Nhân sự",
        categoryLabel: "HRIS Cốt lõi",
        title: "Nền tảng Nhân sự & Tổ chức Cốt lõi",
        summary:
          "Quản lý vòng đời nhân sự, sơ đồ tổ chức đa tầng và phân quyền chi tiết theo phòng ban, chi nhánh quy mô doanh nghiệp.",
        description:
          "Thiết kế và phát triển các phân hệ cốt lõi phục vụ việc quản lý vòng đời nhân sự (onboarding, biến động nhân sự, hợp đồng lao động). Tối ưu hóa cấu trúc cơ sở dữ liệu lớn, xây dựng cây sơ đồ tổ chức phân cấp đa tầng và hệ thống phân quyền linh hoạt theo phòng ban, chi nhánh.",
        role: "Kiến trúc sư phân hệ cốt lõi & Kỹ sư Full-Stack — tối ưu hóa cấu trúc CSDL quy mô lớn, truy vấn cây sơ đồ tổ chức đa cấp và hệ thống phân quyền theo chi nhánh.",
        impact:
          "Chuẩn hóa dữ liệu nhân sự tập trung cho doanh nghiệp đa chi nhánh, tăng tốc độ tải sơ đồ tổ chức và đảm bảo bảo mật phân quyền chặt chẽ.",
        meta: "",
        imageAlt: "Biểu đồ tổng quan nhân sự",
      },
      recruitment: {
        iconLabel: "Tuyển dụng",
        categoryLabel: "Tự động hóa & AI",
        title: "Hệ thống Tuyển dụng Tự động",
        summary:
          "Đồng bộ ứng viên tự động từ cổng việc làm, lập lịch phỏng vấn thông minh, mẫu email tự động và báo cáo nguồn tuyển thời gian thực.",
        description:
          "Xây dựng và tối ưu hóa hệ thống quản lý tuyển dụng end-to-end cho phân khúc doanh nghiệp lớn. Tích hợp tính năng tự động hóa luồng thông tin ứng viên từ các cổng thông tin việc làm, lập lịch phỏng vấn thông minh, quản lý biểu mẫu email thông báo tự động và báo cáo phân tích hiệu suất nguồn tuyển theo thời gian thực.",
        role: "Kỹ sư .NET Full-Stack — xây dựng pipeline đồng bộ dữ liệu ứng viên, luồng tự động hóa quy trình tuyển dụng và hệ thống mẫu email động.",
        impact:
          "Loại bỏ thao tác nhập liệu hồ sơ thủ công từ các cổng việc làm, rút ngắn thời gian lên lịch phỏng vấn và minh bạch hiệu suất từng kênh tuyển dụng.",
        meta: "",
        imageAlt: "Giao diện kho ứng viên",
      },
      timekeeping: {
        iconLabel: "Chấm công",
        categoryLabel: "Phân tích & BI",
        title: "Chấm công, Tính lương & BI",
        summary:
          "API đồng bộ hiệu suất cao kết nối chấm công, tính lương, đánh giá KPIs và hệ thống báo cáo quản trị Dashboard/BI.",
        description:
          "Tham gia phát triển và tích hợp chéo các phân hệ phụ trợ quan trọng bao gồm quản lý chấm công, tính lương, đánh giá hiệu suất KPIs và hệ thống báo cáo thông minh (Dashboard/BI). Xây dựng các API đồng bộ dữ liệu hiệu suất cao, đảm bảo tính liền mạch giữa các module trong hệ thống HRM tổng thể.",
        role: "Kỹ sư Backend & Tích hợp — thiết kế API đồng bộ liên phân hệ, tối ưu hóa truy vấn tổng hợp công/lương lớn và dữ liệu báo cáo BI.",
        impact:
          "Đảm bảo tính nhất quán dữ liệu thời gian thực giữa chấm công, KPIs và bảng lương, giảm đáng kể độ trễ xử lý báo cáo cuối kỳ.",
        meta: "",
        imageAlt: "Biểu đồ chấm công",
      },
      elearning: {
        iconLabel: "Đào tạo",
        categoryLabel: "Tự động hóa & AI",
        title: "Nền tảng Đào tạo Nội bộ (LMS)",
        summary:
          "Số hóa danh mục khóa học, xây dựng lộ trình phát triển kỹ năng và đánh giá bài kiểm tra trực tuyến tự động.",
        description:
          "Phát triển các module quản lý chương trình đào tạo tại chỗ và ngoài doanh nghiệp, số hóa danh mục khóa học, quản lý kế hoạch đào tạo từ cơ bản đến nâng cao. Tích hợp tính năng theo dõi lộ trình phát triển kỹ năng, đánh giá kết quả kiểm tra/trắc nghiệm trực tuyến giúp tối ưu hóa chất lượng nguồn nhân lực.",
        role: "Kỹ sư Full-Stack — phát triển quy trình quản lý danh mục khóa học, hệ thống chấm điểm trắc nghiệm tự động và theo dõi ma trận kỹ năng.",
        impact:
          "Chuyển đổi hoàn toàn quy trình đào tạo nội bộ sang nền tảng số với lộ trình rõ ràng và kết quả đánh giá năng lực đo lường được.",
        meta: "",
        imageAlt: "Bài học trực tuyến",
      },
    },
  },
  contactCard: {
    title: "Cùng kết nối",
    description:
      "Tôi luôn sẵn sàng trao đổi về các dự án mới, ý tưởng sáng tạo hoặc cơ hội đồng hành cùng tầm nhìn của bạn. Hãy liên hệ nhé!",
    seeProjects: "Xem dự án",
    copyright: "© 2026 Nguyễn Huyền Thoại",
    credit: "Xây dựng với Next.js & TypeScript",
    social: {
      email: "Email",
      linkedin: "LinkedIn",
      zalo: "Zalo",
      facebook: "Facebook",
      tiktok: "Tiktok",
    },
  },
  about: {
    metaTitle: "Giới thiệu",
    metaDescription: "Giới thiệu bản thân, kinh nghiệm và cách liên hệ.",
    pageTitle: "Giới thiệu & Nền tảng Kỹ thuật",
    pageSubtitle:
      "Hơn 5 năm kiến trúc hệ thống HRIS doanh nghiệp, phát triển .NET hiệu năng cao và quy trình kỹ thuật tích hợp AI.",
    listenIntro: "Nghe giới thiệu",
    stopListening: "Dừng nghe",
    listenShort: "Nghe",
    pauseShort: "Dừng",
    audioUnavailable: "Không thể phát âm thanh giới thiệu",
    quickInfo: {
      title: "Tổng quan",
      locationLabel: "Địa điểm",
      locationValue: "TP. Hồ Chí Minh, VN",
      experienceLabel: "Kinh nghiệm",
      experienceValue: "5+ Năm",
      roleLabel: "Vị trí",
      roleValue: "Senior Software Engineer",
      focusLabel: "Trọng tâm",
      focusValue: "HRIS & Quy trình AI",
    },
    intro: {
      greetingPrefix: "Xin chào! Tôi là ",
      name: "Nguyễn Huyền Thoại",
      p1Part1: "Một ",
      p1Highlight1: "lập trình viên full-stack hơn 5 năm kinh nghiệm",
      p1Part2:
        " chuyên phát triển hệ thống doanh nghiệp và tối ưu hóa vận hành. Với nền tảng vững chắc về ",
      p1Highlight2: "kiến trúc ứng dụng web",
      p1Part3: " và ",
      p1Highlight3: "phát triển phân hệ chuyên sâu",
      p1Part4:
        ", tôi kết hợp tư duy logic kỹ thuật cùng khả năng hiện thực hóa các giải pháp nghiệp vụ phức tạp.",
      p2Part1: "Bên cạnh chuyên môn kỹ thuật, tôi có niềm đam mê sâu sắc với ",
      p2Highlight1:
        "trí tuệ nhân tạo (AI) và các quy trình phát triển hiện đại",
      p2Part2:
        ". Tôi tích cực ứng dụng AI agents, LLMs và các công cụ thông minh vào quy trình lập trình hàng ngày, giúp tăng tốc độ triển khai, tự động hóa tác vụ và giải quyết bài toán phức tạp với hiệu suất cao nhất.",
      p3Part1:
        "Hiện đang tham gia phát triển các phân hệ cốt lõi tại hệ sinh thái phần mềm nhân sự như ",
      p3Highlight1: "hệ thống HRIS doanh nghiệp",
      p3Part2:
        ", tôi luôn không ngừng khám phá giao thoa giữa công nghệ phần mềm và AI để ",
      p3Highlight2:
        "kiến tạo các giải pháp tự động hóa thông minh và xây dựng hệ thống bền vững",
      p3Part3: ".",
      listenIntro: "Nghe giới thiệu",
      stopListening: "Dừng nghe",
      audioUnavailable: "Không thể phát âm thanh giới thiệu",
    },
    experience: {
      title: "Kinh nghiệm",
      showLess: "Thu gọn",
      showMore: "Xem thêm {count} mục",
      items: {
        emsc: {
          company: "EMS Corporation",
          role: "Senior Software Engineer",
          period: "Thg 11 2020 – Hiện tại",
        },
        dvs: {
          company: "DV Software",
          role: "Intern Software Engineer",
          period: "Thg 2 2020 – Thg 6 2020",
        },
      },
    },
    education: {
      title: "Học vấn",
      items: {
        ct: {
          school: "Cao Thang Technical College",
          degree: "Cử nhân Công nghệ thông tin",
          period: "2017 – 2020",
        },
      },
    },
    skills: {
      title: "Chuyên môn",
      items: {
        aiaD: "Phát triển phần mềm hỗ trợ bởi AI",
        uiUx: "Thiết kế UI/UX",
        designSystems: "Hệ thống Thiết kế",
        frontendDev: "Phát triển Frontend",
        backendDev: "Phát triển Backend",
        businessAnalyst: "BA - Chuyên viên phân tích nghiệp vụ",
        interactionDesign: "Thiết kế Tương tác",
        performanceTuning: "Tối ưu Hiệu năng",
      },
    },
    stack: {
      title: "Công nghệ",
      resetAriaLabel: "Đặt lại danh sách công nghệ",
    },
  },
  chat: {
    openLabel: "Mở chat",
    closeLabel: "Đóng chat",
    buttonLabel: "Hỏi AI",
    title: "Hỏi về Thoại",
    sectionAriaLabel: "Trò chuyện với trợ lý AI",
    clear: "Xóa",
    welcome:
      "Xin chào! Bạn có thể hỏi về hồ sơ, dự án, kỹ năng hoặc nội dung website này.",
    inputPlaceholder: "Nhập câu hỏi…",
    inputAriaLabel: "Câu hỏi của bạn",
    send: "Gửi",
    thinking: "Đang suy nghĩ",
    disclaimer: "Trợ lý AI có thể sai. Hãy kiểm tra thông tin quan trọng.",
    genericError: "Có lỗi xảy ra, vui lòng thử lại.",
    emptyResponseError: "Bot chưa trả lời được, bạn thử hỏi lại nhé.",
    suggestions: {
      s1: "Thoại là ai và làm nghề gì?",
      s2: "Dự án nổi bật nhất là gì?",
      s3: "Thoại dùng công nghệ nào?",
      s4: "Làm sao để liên hệ?",
    },
  },
};
