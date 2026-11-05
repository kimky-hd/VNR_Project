import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Compass,
  GraduationCap,
  Sparkles,
  BookOpen,
  X,
} from 'lucide-react';
import { PROJECT_INFO } from '../data/teamData';

interface ProjectIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInitialIntro?: boolean;
}

export const ProjectIntroModal: React.FC<ProjectIntroModalProps> = ({
  isOpen,
  onClose,
  isInitialIntro = false,
}) => {
  // Xóa sạch cache cũ nếu trình duyệt từng lưu
  useEffect(() => {
    try {
      localStorage.removeItem('vnr_project_team_info');
    } catch {
      // bỏ qua nếu browser chặn
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl my-auto rounded-3xl museum-panel border border-[#C6A87C]/35 bg-[#141815]/95 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          {/* Họa tiết vầng sáng nền trang nhã */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-48 bg-gradient-to-b from-[#C6A87C]/15 to-transparent blur-3xl pointer-events-none" />

          {/* Nút đóng góc phải nếu không phải màn intro đầu tiên */}
          {!isInitialIntro && (
            <button
              type="button"
              onClick={onClose}
              title="Đóng thông tin nhóm"
              className="absolute top-4 right-4 z-10 p-2 rounded-xl text-[#A8A29E] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="p-5 sm:p-8 space-y-6">
            {/* Header: Huy hiệu học phần & Tiêu đề đề tài */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6A87C]/10 border border-[#C6A87C]/30 text-xs text-[#DFC8A5]">
                <GraduationCap className="w-3.5 h-3.5 text-[#C6A87C]" />
                <span className="font-semibold uppercase tracking-wider">
                  Báo Cáo Sản Phẩm Sáng Tạo
                </span>
                <span>•</span>
                <span>Học phần: {PROJECT_INFO.subjectCode} - {PROJECT_INFO.subjectName}</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-medium text-[#C6A87C] uppercase tracking-widest">
                  {PROJECT_INFO.groupName}
                </div>
                <h1 className="text-xl sm:text-3xl font-editorial font-bold text-[#FAF6EE] leading-tight max-w-2xl mx-auto">
                  {PROJECT_INFO.topicTitle}
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-[#C8C2B6] max-w-2xl mx-auto leading-relaxed">
                {PROJECT_INFO.description}
              </p>
            </div>

            {/* Bảng danh sách 9 thành viên nhóm chính thức */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#D6CBB8]/15 pb-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C6A87C]">
                  <Users className="w-4 h-4" />
                  <span>Danh sách thành viên nhóm thực hiện ({PROJECT_INFO.members.length} thành viên)</span>
                </div>
                <span className="text-[11px] font-medium text-[#A8A29E]">
                  {PROJECT_INFO.groupName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {PROJECT_INFO.members.map((member, idx) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-[#D6CBB8]/15 hover:border-[#C6A87C]/40 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#C6A87C]/15 border border-[#C6A87C]/30 flex items-center justify-center text-xs font-bold text-[#E5DEC9] shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-[13px] font-semibold text-[#FAF6EE] truncate">
                        {member.name}
                      </h4>
                      <span className="text-[11px] font-mono font-medium text-[#C6A87C] bg-black/40 px-2 py-0.5 rounded border border-[#C6A87C]/25 shrink-0">
                        {member.studentId}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mục tiêu & Điểm nổi bật của sản phẩm */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#212622] via-[#2A312B] to-[#212622] border border-[#C6A87C]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C6A87C]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Điểm nhấn công nghệ &amp; giáo dục</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#E5DEC9] leading-relaxed">
                  Không gian 3D tương tác chân thực • Mặt cắt kiến trúc Tầng 1 &amp; Tầng 2 • 
                  Thuyết minh song hành tư tưởng Hồ Chí Minh • Bộ câu hỏi trắc nghiệm ôn tập.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] text-[#A8A29E] flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-[#C6A87C]" />
                  <span>{PROJECT_INFO.subjectCode}</span>
                </div>
              </div>
            </div>

            {/* Nút hành động chính: Bắt đầu trải nghiệm tham quan */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-[#8C6747] via-[#A87954] to-[#8C6747] hover:from-[#9D7450] hover:to-[#9D7450] text-[#FAF6EE] text-sm sm:text-base font-semibold shadow-[0_8px_25px_rgba(140,103,71,0.45)] hover:shadow-[0_10px_30px_rgba(140,103,71,0.6)] flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#FFF3DC]" />
                <span>Bắt đầu trải nghiệm tham quan 3D</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectIntroModal;
