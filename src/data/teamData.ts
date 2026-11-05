export interface TeamMember {
  id: number;
  name: string;
  studentId: string;
  role: string;
}

export interface ProjectInfo {
  subjectCode: string;
  subjectName: string;
  groupName: string;
  topicTitle: string;
  academicTerm: string;
  description: string;
  purpose: string;
  members: TeamMember[];
}

export const PROJECT_INFO: ProjectInfo = {
  subjectCode: 'VNR202',
  subjectName: 'Tư tưởng Hồ Chí Minh',
  groupName: 'Chủ đề 6 - VNR202',
  topicTitle: 'Mô hình số hóa tham quan nhà sàn Bác Hồ',
  academicTerm: 'Báo cáo sản phẩm sáng tạo học phần VNR202',
  description:
    'Dự án ứng dụng công nghệ Web 3D Diorama tái hiện chân thực không gian Khu di tích Nhà sàn Bác Hồ tại Phủ Chủ tịch, kết hợp thuyết minh song hành cùng các giá trị lý luận cốt lõi của Tư tưởng Hồ Chí Minh.',
  purpose:
    'Mục tiêu: Đổi mới phương pháp học tập các môn Lý luận chính trị thông qua trải nghiệm không gian di sản số hóa tương tác trực quan, sống động và giàu cảm xúc.',
  members: [
    {
      id: 1,
      name: 'Nguyễn Tuấn Anh',
      studentId: 'HE171401',
      role: 'Nhóm trưởng • Nghiên cứu tư liệu lịch sử',
    },
    {
      id: 2,
      name: 'Lường Văn Duy',
      studentId: 'HE173051',
      role: 'Biên soạn nội dung Tư tưởng HCM & Thuyết minh',
    },
    {
      id: 3,
      name: 'Nguyễn Tiến Đạt',
      studentId: 'HE173498',
      role: 'Phát triển mô hình số hóa 3D & Kiến trúc',
    },
    {
      id: 4,
      name: 'Nguyễn Quỳnh Nhi',
      studentId: 'HS186270',
      role: 'Biên tập kịch bản tham quan & Giọng đọc',
    },
    {
      id: 5,
      name: 'Nguyễn Trường Giang',
      studentId: 'HE160012',
      role: 'Thiết kế cảnh quan di tích & Khảo sát hiện vật',
    },
    {
      id: 6,
      name: 'Vũ Ngọc Linh',
      studentId: 'HE161653',
      role: 'Thiết kế giao diện tương tác & Trải nghiệm',
    },
    {
      id: 7,
      name: 'Trịnh Xuân Huy',
      studentId: 'HE173275',
      role: 'Biên soạn bộ câu hỏi trắc nghiệm ôn tập',
    },
    {
      id: 8,
      name: 'Vũ Kim Kỳ',
      studentId: 'HE182094',
      role: 'Kỹ thuật tương tác WebGL & Tối ưu hiệu năng',
    },
    {
      id: 9,
      name: 'Đặng Tuấn Đạt',
      studentId: 'HE186530',
      role: 'Kiểm thử trải nghiệm & Báo cáo đề tài',
    },
  ],
};

export const DEFAULT_PROJECT_INFO = PROJECT_INFO;
