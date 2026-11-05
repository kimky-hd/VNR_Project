export interface ArtifactDetail {
  name: string;
  origin: string;
  description: string;
}

export interface TourSpot {
  id: number;
  shortLabel: string;
  title: string;
  subtitle: string;
  floor: 'Khuôn viên' | 'Tầng 1' | 'Tầng 2';
  /** Tọa độ điểm neo Hotspot 3D trong không gian */
  position: [number, number, number];
  /** Tọa độ đặt máy quay khi bay tới điểm này */
  cameraPos: [number, number, number];
  /** Điểm nhìn (LookAt Target) của CameraControls */
  cameraTarget: [number, number, number];
  /** Tự động kích hoạt chế độ X-Ray mở mái khi xem nội thất tầng 2 */
  requiresXRayRoof: boolean;
  /** Danh sách hiện vật tiêu biểu */
  artifacts: string[];
  /** Chi tiết từng hiện vật tiêu biểu */
  artifactDetails: ArtifactDetail[];
  /** Câu chuyện lịch sử */
  historicalStory: string;
  /** Liên hệ Tư tưởng Hồ Chí Minh */
  hcmThoughtConnection: string;
  /** Trích dẫn nổi bật của Chủ tịch Hồ Chí Minh */
  keyQuote: {
    quote: string;
    context: string;
  };
  /** Từ khóa lý luận cốt lõi */
  coreValues: string[];
}

export interface QuizQuestion {
  id: number;
  spotId: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  quoteReference: string;
  explanation: string;
}

export const OVERVIEW_CAMERA: {
  position: [number, number, number];
  target: [number, number, number];
} = {
  position: [14.5, 9.8, 16.5],
  target: [0, 2.0, 0.5],
};

export const TOUR_SPOTS: TourSpot[] = [
  {
    id: 1,
    shortLabel: 'Khuôn viên & Ao cá',
    title: 'Khuôn viên Vườn cây, Hàng Dâm Bụt & Ao Cá Bác Hồ',
    subtitle: 'Không gian sinh thái văn hóa & Cội nguồn dân tộc',
    floor: 'Khuôn viên',
    position: [0, 0.9, 5.8],
    cameraPos: [6.8, 4.2, 11.8],
    cameraTarget: [0, 0.8, 4.2],
    requiresXRayRoof: false,
    artifacts: [
      'Ao cá Bác Hồ',
      'Cây vú sữa miền Nam',
      'Hàng rào dâm bụt',
      'Tổng thể kiến trúc nhà sàn Việt Bắc',
    ],
    artifactDetails: [
      {
        name: 'Ao cá Bác Hồ',
        origin: 'Khuôn viên trước Nhà sàn (1958)',
        description:
          'Sau giờ làm việc căng thẳng, Bác thường ra bờ ao vỗ tay gọi cá ăn. Đàn cá quen tiếng vỗ tay của Người lại quẫy nước bơi về gần bờ.',
      },
      {
        name: 'Cây vú sữa miền Nam',
        origin: 'Đồng bào miền Nam gửi tặng (1954)',
        description:
          'Được đặt ngay bên hông nhà sàn như hình ảnh đồng bào miền Nam ruột thịt luôn ở trong trái tim Người, được Bác tự tay chăm tưới mỗi ngày.',
      },
      {
        name: 'Hàng rào dâm bụt',
        origin: 'Hình ảnh quê hương Làng Sen, Nghệ An',
        description:
          'Loài cây mộc mạc gắn liền với ký ức tuổi thơ nơi làng Chùa, làng Sen xứ Nghệ, giữ trọn hồn quê Việt Nam giữa lòng Thủ đô.',
      },
      {
        name: 'Kiến trúc Nhà sàn Việt Bắc',
        origin: 'Thiết kế cùng KTS Nguyễn Văn Ninh (Tháng 5/1958)',
        description:
          'Phỏng theo kiểu nhà sàn của đồng bào dân tộc Tày - Thái ở chiến khu Việt Bắc, kết hợp hài hòa ánh sáng, gió trời và cây cỏ.',
      },
    ],
    historicalStory:
      'Hoàn thành tháng 5/1958. Sau khi tiếp quản Thủ đô, Bác Hồ từ chối ở tại dinh thự Toàn quyền Đông Dương nguy nga tráng lệ để chọn ngôi nhà sàn gỗ giản dị bên bờ ao, hòa mình với thiên nhiên và gần gũi với đồng bào. Tại đây, Người đã sống và làm việc trong 11 năm cuối đời (1958 – 1969).',
    hcmThoughtConnection:
      'Phản ánh cơ sở hình thành Tư tưởng Hồ Chí Minh từ truyền thống văn hóa tốt đẹp của dân tộc và nhân tố chủ quan là phẩm chất, tâm hồn của một nhà yêu nước chân chính gắn bó máu thịt với nhân dân. Về văn hóa, không gian sống thể hiện rõ tính dân tộc và tính đại chúng của nền văn hóa mới: giản dị, nhân văn, tôn trọng tự nhiên và không xa rời cội nguồn dân족.',
    keyQuote: {
      quote:
        '“Ngôi nhà sàn của Bác vẻn vẹn chỉ có vài phòng, trong lúc tâm hồn của Bác lộng gió thời đại.”',
      context: 'Thủ tướng Phạm Văn Đồng viết về Chủ tịch Hồ Chí Minh',
    },
    coreValues: [
      'Truyền thống dân tộc',
      'Tính dân tộc & Đại chúng',
      'Hòa hợp thiên nhiên',
      'Gắn bó máu thịt với nhân dân',
    ],
  },
  {
    id: 2,
    shortLabel: 'Phòng họp Bộ Chính trị',
    title: 'Tầng 1: Phòng Họp Bộ Chính Trị & Chiếc Điện Thoại',
    subtitle: 'Nhà nước của nhân dân, do nhân dân, vì nhân dân',
    floor: 'Tầng 1',
    position: [-0.2, 1.45, 0.2],
    cameraPos: [5.4, 2.35, 5.2],
    cameraTarget: [-0.2, 1.0, 0.0],
    requiresXRayRoof: false,
    artifacts: [
      'Bàn họp gỗ dài',
      'Bộ ghế mây thoáng mát',
      'Điện thoại bàn cổ điển màu đen',
      'Máy đánh chữ',
    ],
    artifactDetails: [
      {
        name: 'Bàn họp Bộ Chính trị & 8 ghế mây',
        origin: 'Trung tâm Tầng 1 Nhà sàn',
        description:
          'Nơi Bác Hồ cùng các đồng chí trong Bộ Chính trị họp bàn những quyết sách lịch sử giai đoạn xây dựng CNXH ở miền Bắc và đấu tranh thống nhất miền Nam.',
      },
      {
        name: 'Chiếc điện thoại bàn màu đen',
        origin: 'Đặt ở góc bàn tầng 1',
        description:
          'Phương tiện thông tin trực tiếp kết nối Bác với Bộ Tổng Tư lệnh, Bộ Tư lệnh Phòng không - Không quân để nắm bắt kịp thời tình hình chiến sự.',
      },
      {
        name: 'Máy đánh chữ',
        origin: 'Hiện vật làm việc thường trực',
        description:
          'Dùng để soạn thảo nhanh các bức điện khẩn, thư khen ngợi chiến sĩ, đồng bào và chỉ thị công tác cách mạng.',
      },
    ],
    historicalStory:
      'Tầng 1 nhà sàn là không gian mở hoàn toàn không có tường bao kín, nơi Bác cùng Bộ Chính trị họp bàn các quyết sách chiến lược của cách mạng Việt Nam, tiếp đón các đoàn khách quốc tế, đại biểu anh hùng chiến sĩ thi đua, các cháu thiếu nhi và trực tiếp nghe báo cáo từ các chiến trường qua chiếc điện thoại đặt trên góc bàn.',
    hcmThoughtConnection:
      'Thể hiện Tư tưởng Hồ Chí Minh về Nhà nước của nhân dân, do nhân dân, vì nhân dân. Bác khẳng định cán bộ nhà nước không phải là "quan cách mạng" mà là "công bộc, đầy tớ" của nhân dân, là "người lính vâng mệnh lệnh của quốc dân ra mặt trận". Không gian tầng 1 mở thoáng 4 bề tượng trưng cho nhà nước minh bạch, gần dân, kiên quyết phòng chống "giặc nội xâm" (tham ô, lãng phí, quan liêu, đặc quyền đặc lợi).',
    keyQuote: {
      quote:
        '“Việc gì lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh. Chúng ta phải yêu dân, kính dân thì dân mới yêu ta, kính ta.”',
      context: 'Thư gửi Ủy ban nhân dân các kỳ, tỉnh, huyện và làng (10/1945)',
    },
    coreValues: [
      'Nhà nước của dân, do dân, vì dân',
      'Cán bộ là công bộc của dân',
      'Minh bạch & Gần dân',
      'Chống tham ô, lãng phí, quan liêu',
    ],
  },
  {
    id: 3,
    shortLabel: 'Đôi dép cao su',
    title: 'Chân Cầu Thang Gỗ: Đôi Dép Cao Su Huyền Thoại',
    subtitle: 'Biểu tượng Đạo đức Cách mạng: Cần, Kiệm, Liêm, Chính',
    floor: 'Tầng 1',
    position: [2.85, 1.35, 1.2],
    cameraPos: [6.2, 2.2, 3.8],
    cameraTarget: [2.7, 1.15, 0.8],
    requiresXRayRoof: false,
    artifacts: [
      'Đôi dép cao su cắt từ lốp xe quân sự Pháp',
      'Chiếc mũ cối',
      'Cầu thang gỗ mộc dẫn lên tầng 2',
    ],
    artifactDetails: [
      {
        name: 'Đôi dép cao su bốn quai',
        origin: 'Chiến khu Việt Bắc (Năm 1947)',
        description:
          'Được cắt từ chiếc lốp xe ô tô quân sự của thực dân Pháp bị bộ đội ta phục kích tại Đèo Khế. Khi quai dép mòn tuột, Bác cho đóng đinh sửa lại để dùng tiếp.',
      },
      {
        name: 'Chiếc mũ cối giản dị',
        origin: 'Vật dụng gắn liền các chuyến đi thực tế',
        description:
          'Luôn được đặt ngay ngắn cạnh chân cầu thang để bất cứ lúc nào Bác cũng sẵn sàng lên đường đi thăm đồng bào, chiến sĩ.',
      },
      {
        name: 'Cầu thang gỗ mộc',
        origin: 'Lối lên tầng 2 Nhà sàn',
        description:
          'Gồm những bậc gỗ chắc chắn, có tay vịn nhẵn bóng theo dấu thời gian, kết nối không gian hội họp tầng 1 với nơi ở và làm việc tầng 2.',
      },
    ],
    historicalStory:
      'Đôi dép cao su ra đời năm 1947 tại chiến khu Việt Bắc, đã cùng Bác vượt suối băng rừng đi khắp các chiến dịch kháng chiến, thăm đồng bào công - nông - binh và theo chân Người trong cả những chuyến công du quốc tế đến Ấn Độ, Liên Xô, Trung Quốc... như một biểu tượng bất hủ về phong cách sống thanh cao, giản dị.',
    hcmThoughtConnection:
      'Minh chứng sống động cho Tư tưởng Hồ Chí Minh về Đạo đức, trọng tâm là chuẩn mực "Cần, kiệm, liêm, chính, chí công vô tư". Bác dạy đạo đức là gốc của người cách mạng: "Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân".',
    keyQuote: {
      quote:
        '“Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân.”',
      context: 'Tác phẩm “Sửa đổi lối làm việc” (Tháng 10/1947)',
    },
    coreValues: [
      'Cần, Kiệm, Liêm, Chính',
      'Chí công vô tư',
      'Đạo đức là gốc của cách mạng',
      'Giản dị & Khiêm tốn',
    ],
  },
  {
    id: 4,
    shortLabel: 'Phòng làm việc Tầng 2',
    title: 'Tầng 2 - Phòng Làm Việc: Bàn Gỗ, Kệ Sách & Bản Thảo Di Chúc',
    subtitle: 'Đại đoàn kết toàn dân tộc, Đoàn kết quốc tế & Mặt trận văn hóa',
    floor: 'Tầng 2',
    position: [-1.45, 3.35, -0.15],
    cameraPos: [-3.6, 5.1, 3.8],
    cameraTarget: [-1.45, 3.1, -0.2],
    requiresXRayRoof: true,
    artifacts: [
      'Bàn làm việc nhỏ bằng gỗ',
      'Chiếc đèn bàn tỏa ánh vàng ấm',
      'Bút chì đỏ - xanh',
      'Kệ sách đa ngôn ngữ & Tài liệu quốc tế',
      'Bản thảo Di chúc lịch sử',
    ],
    artifactDetails: [
      {
        name: 'Bản thảo Di chúc lịch sử',
        origin: 'Soạn thảo từ 10/5/1965 đến 1969',
        description:
          'Văn kiện kết tinh tư tưởng, đạo đức và tâm hồn cao đẹp của Bác viết vào những ngày tháng 5 nhân dịp sinh nhật từ năm 1965 đến năm 1969.',
      },
      {
        name: 'Cây bút chì đỏ - xanh & Đèn bàn',
        origin: 'Trên bàn làm việc tầng 2',
        description:
          'Bác dùng bút chì đỏ - xanh để gạch chân những tin tức gương "Người tốt, việc tốt" trên báo chí hàng ngày để tặng huy hiệu động viên nhân dân.',
      },
      {
        name: 'Giá sách đa ngôn ngữ',
        origin: 'Góc phòng làm việc',
        description:
          'Lưu giữ các tác phẩm kinh điển Mác - Lênin, lịch sử, văn học Việt Nam và thế giới bằng tiếng Việt, Nga, Trung, Pháp, Anh, Tây Ban Nha...',
      },
    ],
    historicalStory:
      'Trong căn phòng nhỏ tầng 2 bên trái, dưới ánh đèn bàn ấm áp bất kể ngày đêm, Bác Hồ đã miệt mài nghiên cứu tài liệu, viết hàng trăm bài báo tuyên truyền cách mạng, đọc báo phát hiện tấm gương "Người tốt, việc tốt" và đặc biệt là khởi thảo bản Di chúc lịch sử để lại muôn vàn tình thân yêu cho toàn Đảng, toàn dân, toàn quân.',
    hcmThoughtConnection:
      'Thể hiện Tư tưởng về Đại đoàn kết toàn dân tộc (thông qua công tác Dân vận, tập hợp quần chúng trong Mặt trận, Công đoàn, Hội Nông dân, Đoàn Thanh niên, Hội Phụ nữ) và Đoàn kết quốc tế trên nguyên tắc độc lập, tự chủ: "Thực lực là cái chiêng mà ngoại giao là cái tiếng. Chiêng có to tiếng mới lớn". Đồng thời khẳng định quan điểm "Văn hóa là một mặt trận", ngòi bút là vũ khí sắc bén phục vụ Tổ quốc và quần chúng nhân dân.',
    keyQuote: {
      quote:
        '“Thực lực là cái chiêng mà ngoại giao là cái tiếng. Chiêng có to tiếng mới lớn... Văn hóa nghệ thuật cũng là một mặt trận. Anh chị em là chiến sĩ trên mặt trận ấy.”',
      context: 'Tư tưởng Hồ Chí Minh về Đoàn kết quốc tế & Mặt trận văn hóa',
    },
    coreValues: [
      'Đại đoàn kết toàn dân tộc',
      'Đoàn kết quốc tế & Độc lập tự chủ',
      'Văn hóa là một mặt trận',
      'Công tác Dân vận',
    ],
  },
  {
    id: 5,
    shortLabel: 'Phòng ngủ Tầng 2',
    title: 'Tầng 2 - Phòng Ngủ: Giường Đơn, Quạt Lá Cọ & Đài Radio',
    subtitle: 'Trung với nước, hiếu với dân & Thống nhất lý luận với thực tiễn',
    floor: 'Tầng 2',
    position: [1.35, 3.35, -0.15],
    cameraPos: [3.6, 5.1, 3.8],
    cameraTarget: [1.35, 3.1, -0.2],
    requiresXRayRoof: true,
    artifacts: [
      'Chiếc giường gỗ đơn trải chiếu cói',
      'Chiếc quạt lá cọ mộc mạc',
      'Đài bán dẫn Radio nghe tin miền Nam',
      'Đồng hồ báo thức nhỏ',
    ],
    artifactDetails: [
      {
        name: 'Giường gỗ đơn & Chiếu cói',
        origin: 'Phòng ngủ tầng 2 (rộng hơn 10m²)',
        description:
          'Chiếc giường đơn mộc mạc trải chiếu cói, mùa đông thêm tấm chăn chiên, gối vải giản dị như bao người dân lao động Việt Nam.',
      },
      {
        name: 'Chiếc quạt lá cọ',
        origin: 'Đặt trên bàn nhỏ đầu giường',
        description:
          'Những ngày hè oi bức, Bác vẫn dùng quạt lá cọ để tiết kiệm điện cho sản xuất và sinh hoạt của nhân dân.',
      },
      {
        name: 'Đài Radio bán dẫn Zenit',
        origin: 'Kiều bào Thái Lan kính tặng',
        description:
          'Người bạn thân thiết giúp Bác theo dõi tin tức Đài Tiếng nói Việt Nam và lắng nghe từng nhịp thở cuộc chiến đấu của đồng bào miền Nam mỗi đêm.',
      },
    ],
    historicalStory:
      'Căn phòng ngủ nhỏ chỉ hơn 10m² với những vật dụng hết sức đỗi bình dị của một vị Chủ tịch nước: chiếc giường đơn trải chiếu cói, chiếc quạt lá cọ đặt cạnh đầu giường và chiếc đài Radio bán dẫn luôn mở mỗi tối để nghe tin tức về đồng bào, chiến sĩ miền Nam ruột thịt.',
    hcmThoughtConnection:
      'Thể hiện chuẩn mực đạo đức cốt lõi "Trung với nước, hiếu với dân" và "Thương yêu con người, sống có tình có nghĩa". Nếp sống của Bác là bài học mẫu mực về phương pháp học tập Tư tưởng Hồ Chí Minh: sự thống nhất giữa lý luận và thực tiễn, nói đi đôi với làm, suốt đời phấn đấu hy sinh vì độc lập của Tổ quốc và tự do, hạnh phúc của nhân dân.',
    keyQuote: {
      quote:
        '“Tôi chỉ có một sự ham muốn, ham muốn tột bậc, là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành.”',
      context: 'Trả lời các nhà báo nước ngoài (Tháng 1/1946)',
    },
    coreValues: [
      'Trung với nước, hiếu với dân',
      'Thương yêu con người',
      'Lý luận gắn liền thực tiễn',
      'Nói đi đôi với làm',
    ],
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    spotId: 1,
    category: 'Cơ sở hình thành & Văn hóa',
    question:
      'Việc Chủ tịch Hồ Chí Minh từ chối ở dinh thự Toàn quyền Đông Dương để chọn ngôi nhà sàn giản dị gắn liền với vườn cây, ao cá phản ánh rõ nhất cơ sở nào trong sự hình thành Tư tưởng của Người?',
    options: [
      'Sự kế thừa truyền thống văn hóa tốt đẹp của dân tộc kết hợp với phẩm chất cao đẹp, gắn bó máu thịt với nhân dân của Bác',
      'Sự áp dụng nguyên bản mô hình kiến trúc phương Tây hiện đại vào điều kiện Việt Nam',
      'Chủ trương tách biệt hoàn toàn hoạt động lãnh đạo khỏi đời sống xã hội thường nhật',
      'Quan điểm ưu tiên phát triển kinh tế nông nghiệp truyền thống hơn công nghiệp hóa',
    ],
    correctIndex: 0,
    quoteReference:
      'Không gian Nhà sàn phản ánh tính dân tộc và tính đại chúng của nền văn hóa mới, bắt nguồn từ truyền thống văn hóa dân tộc và phẩm chất chủ quan của Hồ Chí Minh.',
    explanation:
      'Ngôi nhà sàn, hàng dâm bụt, ao cá thể hiện sự kế thừa giá trị truyền thống văn hóa dân tộc (nhân văn, giản dị, hòa hợp thiên nhiên) và nhân tố chủ quan là tâm hồn của một nhà yêu nước chân chính luôn hòa mình với quần chúng nhân dân.',
  },
  {
    id: 2,
    spotId: 2,
    category: 'Tư tưởng về Nhà nước',
    question:
      'Không gian Tầng 1 Nhà sàn để mở thoáng 4 bề – nơi họp Bộ Chính trị và đón tiếp nhân dân – gắn liền với luận điểm nào của Hồ Chí Minh về vị thế của cán bộ nhà nước?',
    options: [
      'Cán bộ nhà nước là những "quan cách mạng" nắm quyền cai trị tối cao',
      'Cán bộ không phải là "quan cách mạng" mà là "công bộc, đầy tớ" của nhân dân, kiên quyết chống "giặc nội xâm"',
      'Bộ máy nhà nước chỉ cần tập trung vào công tác đối ngoại và quốc phòng',
      'Mọi quyết sách chiến lược đều không cần lấy ý kiến từ thực tiễn nhân dân',
    ],
    correctIndex: 1,
    quoteReference:
      'Cán bộ nhà nước là "công bộc, đầy tớ" của nhân dân, là "người lính vâng mệnh lệnh của quốc dân ra mặt trận".',
    explanation:
      'Theo Tư tưởng Hồ Chí Minh về Nhà nước của nhân dân, do nhân dân, vì nhân dân, đội ngũ cán bộ là công bộc phục vụ nhân dân, nhà nước phải minh bạch, gần dân và kiên quyết đấu tranh chống "giặc nội xâm" (tham ô, lãng phí, quan liêu).',
  },
  {
    id: 3,
    spotId: 3,
    category: 'Tư tưởng về Đạo đức',
    question:
      'Hình ảnh đôi dép cao su gắn bó với Bác từ năm 1947 là biểu tượng cho chuẩn mực đạo đức "Cần, kiệm, liêm, chính, chí công vô tư". Trong tác phẩm "Sửa đổi lối làm việc" (1947), Bác đã ví đạo đức của người cách mạng với hình ảnh nào?',
    options: [
      'Như ngọn hải đăng chiếu sáng trên biển lớn và cánh buồm đón gió',
      'Như nguồn của sông, như gốc của cây: không có nguồn thì sông cạn, không có gốc thì cây héo',
      'Như thanh kiếm sắc bén và tấm khiên vững chắc trên chiến trường',
      'Như viên ngọc quý cần được cất giữ cẩn mật trong tháp ngà',
    ],
    correctIndex: 1,
    quoteReference:
      '“Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân.”',
    explanation:
      'Hồ Chí Minh khẳng định đạo đức là cái gốc của người cách mạng. Tài và đức phải thống nhất, trong đó đạo đức là nền tảng vững chắc để người cán bộ hoàn thành sứ mệnh lãnh đạo và phục vụ nhân dân.',
  },
  {
    id: 4,
    spotId: 4,
    category: 'Đoàn kết quốc tế & Ngoại giao',
    question:
      'Tại phòng làm việc Tầng 2 – nơi lưu giữ nhiều tài liệu quốc tế và ngoại giao – Tư tưởng Hồ Chí Minh về kết hợp sức mạnh dân tộc với sức mạnh thời đại được đúc kết qua hình ảnh ẩn dụ nổi tiếng nào?',
    options: [
      '“Thực lực là cái chiêng mà ngoại giao là cái tiếng. Chiêng có to tiếng mới lớn”',
      '“Ngoại giao đi trước mở đường, thực lực trong nước chỉ đóng vai trò phụ trợ”',
      '“Muốn đi nhanh hãy đi một mình, muốn đi xa hãy dựa hoàn toàn vào bên ngoài”',
      '“Cửa đóng then cài để giữ vững sự ổn định tuyệt đối bên trong”',
    ],
    correctIndex: 0,
    quoteReference:
      '“Thực lực là cái chiêng mà ngoại giao là cái tiếng. Chiêng có to tiếng mới lớn.”',
    explanation:
      'Trong Tư tưởng Hồ Chí Minh về Đoàn kết quốc tế, độc lập tự chủ và tự lực tự cường ("thực lực là cái chiêng") luôn là cái gốc quyết định hiệu quả của hoạt động đối ngoại và tranh thủ sự ủng hộ quốc tế ("ngoại giao là cái tiếng").',
  },
  {
    id: 5,
    spotId: 4,
    category: 'Văn hóa & Báo chí Cách mạng',
    question:
      'Với hàng trăm bài báo, bản thảo Di chúc và cây bút chì đỏ - xanh trên bàn làm việc, Chủ tịch Hồ Chí Minh đã xác định vai trò của văn hóa và người làm văn hóa như thế nào?',
    options: [
      'Văn hóa là lĩnh vực giải trí thuần túy, đứng ngoài chính trị và kinh tế',
      'Văn hóa là một mặt trận, người hoạt động văn hóa là chiến sĩ với ngòi bút là vũ khí sắc bén phục vụ Tổ quốc và nhân dân',
      'Văn hóa chỉ dành riêng cho tầng lớp trí thức hàn lâm trong xã hội',
      'Văn hóa chỉ phát triển sau khi đã hoàn thành xong mọi nhiệm vụ quân sự',
    ],
    correctIndex: 1,
    quoteReference:
      '“Văn hóa nghệ thuật cũng là một mặt trận. Anh chị em là chiến sĩ trên mặt trận ấy.”',
    explanation:
      'Bác coi văn hóa là một trong bốn mặt trận quan trọng (chính trị, kinh tế, văn hóa, xã hội). Ngòi bút của Người luôn hướng tới tuyên truyền cách mạng, cổ vũ cái thiện ("Người tốt, việc tốt") và phụng sự Tổ quốc.',
  },
  {
    id: 6,
    spotId: 5,
    category: 'Đạo đức & Phương pháp Cách mạng',
    question:
      'Căn phòng ngủ chỉ hơn 10m² với chiếc giường đơn, quạt lá cọ và chiếc đài Radio nghe tin miền Nam thể hiện chuẩn mực đạo đức cốt lõi nào và nguyên tắc phương pháp luận nào trong học tập Tư tưởng Hồ Chí Minh?',
    options: [
      '"Trung với vua, hiếu với cha mẹ" và phương pháp học thuộc lòng lý thuyết',
      '"Trung với nước, hiếu với dân", "Thương yêu con người" và sự thống nhất giữa lý luận với thực tiễn, nói đi đôi với làm',
      'Chủ nghĩa khổ hạnh cực đoan tách rời khỏi đời sống hiện đại',
      'Ưu tiên lý luận sách vở cao hơn việc rèn luyện đạo đức thực hành hàng ngày',
    ],
    correctIndex: 1,
    quoteReference:
      'Chuẩn mực "Trung với nước, hiếu với dân", "Thương yêu con người, sống có tình có nghĩa" và phương pháp luận "Nói đi đôi với làm, lý luận gắn liền với thực tiễn".',
    explanation:
      'Cuộc đời và nếp sống tại Nhà sàn của Bác là tấm gương sáng ngời về "Trung với nước, hiếu với dân", tình yêu thương đồng bào miền Nam sâu nặng và sự thống nhất trọn vẹn giữa lý luận và thực tiễn, nói đi đôi với làm.',
  },
];

