export type ArchitecturalViewMode = 'overview' | 'floor1' | 'floor2';

export interface ArtifactDetail {
  name: string;
  origin: string;
  description: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface TourSpot {
  id: number;
  shortLabel: string;
  title: string;
  subtitle: string;
  zone: string;
  /** Chế độ mặt cắt kiến trúc tương ứng khi chọn điểm này */
  recommendedViewMode: ArchitecturalViewMode;
  /** Tọa độ điểm đánh dấu 3D */
  position: [number, number, number];
  /** Tọa độ Camera khi di chuyển tới địa điểm */
  cameraPos: [number, number, number];
  /** Điểm nhìn (Target) của Camera */
  cameraTarget: [number, number, number];
  /** Ảnh thực tế chính */
  imageUrl: string;
  /** Chú thích ảnh chính */
  imageCaption: string;
  /** Bộ sưu tập ảnh thực tế đã kiểm chứng */
  gallery: GalleryImage[];
  /** Danh sách hiện vật / công trình tiêu biểu */
  artifacts: string[];
  /** Chi tiết từng hiện vật / hạng mục */
  artifactDetails: ArtifactDetail[];
  /** Câu chuyện lịch sử xác thực */
  historicalStory: string;
  /** Liên hệ Tư tưởng Hồ Chí Minh */
  hcmThoughtConnection: string;
  /** Trích dẫn tiêu biểu */
  keyQuote: {
    quote: string;
    context: string;
  };
  /** Từ khóa giá trị cốt lõi */
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

/** Góc nhìn chuẩn cho 3 chế độ kiến trúc */
export const VIEW_MODE_CAMERAS: Record<
  ArchitecturalViewMode,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    position: [13.2, 8.2, 16.8],
    target: [-0.4, 1.2, 2.0],
  },
  floor1: {
    position: [4.8, 3.8, 5.2],
    target: [0.2, 0.9, -0.4],
  },
  floor2: {
    position: [0.0, 6.4, 4.8],
    target: [0.0, 2.85, -0.55],
  },
};

export const OVERVIEW_CAMERA = VIEW_MODE_CAMERAS.overview;

export const TOUR_SPOTS: TourSpot[] = [
  {
    id: 1,
    shortLabel: 'Ao cá Bác Hồ',
    title: 'Ao Cá Bác Hồ, Cầu Ao & Cảnh Quan Quanh Hồ',
    subtitle: 'Không gian mặt nước tự nhiên phía trước Nhà sàn & Tâm hồn hòa hợp thiên nhiên',
    zone: 'Khu vực Ao cá & Vườn cây',
    recommendedViewMode: 'overview',
    position: [0.2, 0.45, 5.5],
    cameraPos: [4.8, 3.4, 12.6],
    cameraTarget: [0.0, 0.3, 4.2],
    imageUrl: './images/heritage/cottage-3.jpg',
    imageCaption:
      'Toàn cảnh Ao cá Bác Hồ nhìn về phía Nhà sàn với mặt hồ tự nhiên, bậc cầu ao sơn vàng kem, hàng rào dâm bụt và hàng cây cổ thụ quét vôi trắng.',
    gallery: [
      {
        url: './images/heritage/cottage-3.jpg',
        caption:
          'Mặt nước Ao cá Bác Hồ, bậc cầu ao bên trái và Nhà sàn ẩn dưới tán cây xanh.',
      },
      {
        url: './images/heritage/nha-san-can-canh.jpg',
        caption:
          'Bờ Ao cá Bác Hồ uốn lượn với hàng lan can vàng kem phía trước Nhà 54.',
      },
      {
        url: './images/heritage/nha-san-toan-canh.jpg',
        caption:
          'Lối đi lát gạch từ bờ Ao cá qua hàng dâm bụt dẫn vào chính diện Nhà sàn Bác Hồ.',
      },
    ],
    artifacts: [
      'Ao cá Bác Hồ (diện tích hơn 3.300m²)',
      'Bậc cầu ao nơi Bác vỗ tay gọi cá',
      'Hàng rào dâm bụt & Rễ cây bụt mọc ven hồ',
      'Cây vú sữa miền Nam bên hông Nhà sàn',
    ],
    artifactDetails: [
      {
        name: 'Ao cá Bác Hồ & Cầu ao',
        origin: 'Phía trước Nhà sàn Bác Hồ',
        description:
          'Từ một đầm nước tù đọng, Bác đã cùng anh em cải tạo thành ao nuôi nhiều giống cá (cá chép, cá trắm, cá mè, cá rô phi...). Mỗi chiều sau giờ làm việc, Bác thường ra bậc cầu ao vỗ tay gọi cá lên ăn.',
      },
      {
        name: 'Hàng rào dâm bụt & Rễ cây bụt mọc',
        origin: 'Ven bờ Ao cá và lối vào Nhà sàn',
        description:
          'Quanh bờ ao là những chùm rễ cây bụt mọc nhô lên mặt đất và hàng dâm bụt gợi nhớ quê hương Làng Sen, Nghệ An.',
      },
      {
        name: 'Cây vú sữa miền Nam',
        origin: 'Đồng bào miền Nam kính tặng (1954)',
        description:
          'Trồng bên hông Nhà sàn, được Bác chăm sóc hàng ngày như biểu tượng của miền Nam ruột thịt luôn ở trong trái tim Người.',
      },
    ],
    historicalStory:
      'Ao cá nằm ngay phía trước Nhà sàn Bác Hồ, có bờ ao uốn lượn tự nhiên dưới bóng cây cổ thụ, kết nối hài hòa giữa mặt nước, vườn cây và kiến trúc gỗ. Sinh thời, sau mỗi ngày làm việc, Bác thường ra bậc cầu ao vỗ tay cho cá ăn. Tiếng vỗ tay quen thuộc của Người đã trở thành phản xạ tự nhiên khiến đàn cá từ khắp mặt hồ bơi về quây quần.',
    hcmThoughtConnection:
      'Phản ánh cơ sở hình thành Tư tưởng Hồ Chí Minh từ truyền thống văn hóa tốt đẹp của dân tộc Việt Nam và phẩm chất nhân văn cao đẹp của Người. Không gian Ao cá – Vườn cây – Nhà sàn thể hiện quan điểm về mối quan hệ hài hòa giữa con người với thiên nhiên, cùng tính dân tộc và tính đại chúng trong văn hóa.',
    keyQuote: {
      quote:
        '“Ngôi nhà sàn của Bác vẻn vẹn chỉ có vài phòng, trong lúc tâm hồn của Bác lộng gió thời đại.”',
      context: 'Thủ tướng Phạm Văn Đồng viết về Chủ tịch Hồ Chí Minh',
    },
    coreValues: [
      'Hòa hợp thiên nhiên',
      'Cội nguồn văn hóa dân tộc',
      'Tình cảm Bắc – Nam thống nhất',
      'Phong cách sống giản dị',
    ],
  },
  {
    id: 2,
    shortLabel: 'Đường Xoài, Nhà 54 & 67',
    title: 'Đường Xoài, Nhà 54 & Nhà 67 trong Quần Thể Khu Di Tích',
    subtitle: 'Dấu ấn 15 năm Bác Hồ sống và làm việc tại Khu Phủ Chủ tịch (1954 – 1969)',
    zone: 'Quần thể kiến trúc quanh Nhà sàn',
    recommendedViewMode: 'overview',
    position: [-6.4, 1.4, 2.0],
    cameraPos: [-11.2, 4.8, 8.6],
    cameraTarget: [-5.2, 1.1, 0.6],
    imageUrl: './images/heritage/nha-san-can-canh.jpg',
    imageCaption:
      'Ngôi Nhà 54 màu vàng kem và hàng lan can uốn cong dọc bờ Ao cá Bác Hồ nối liền với Đường Xoài.',
    gallery: [
      {
        url: './images/heritage/nha-san-can-canh.jpg',
        caption:
          'Toàn cảnh Nhà 54 soi bóng xuống mặt nước Ao cá Bác Hồ và đầu Đường Xoài.',
      },
      {
        url: './images/heritage/nha-54.jpg',
        caption:
          'Mặt trước ngôi Nhà 54 – nơi Bác Hồ ở và làm việc từ tháng 12/1954 đến tháng 5/1958.',
      },
      {
        url: './images/heritage/vuon-cay-duong-xoai.jpg',
        caption:
          'Không gian vườn cây cổ thụ xanh mát bao quanh Nhà sàn và khu Nhà 67.',
      },
    ],
    artifacts: [
      'Đường Xoài lịch sử dọc bờ Ao cá',
      'Nhà 54 (nơi Bác ở giai đoạn 1954 – 1958)',
      'Nhà 67 (nơi Bác điều trị bệnh năm 1969)',
      'Lan can bờ ao trước Nhà 54',
    ],
    artifactDetails: [
      {
        name: 'Nhà 54',
        origin: 'Giai đoạn 12/1954 – 5/1958',
        description:
          'Vốn là ngôi nhà của người thợ điện phục vụ Phủ Toàn quyền cũ. Bác chọn ở đây thay vì tòa Dinh thự lớn. Dù chuyển sang Nhà sàn năm 1958, Bác vẫn dùng cơm và kiểm tra sức khỏe tại Nhà 54 đến năm 1969.',
      },
      {
        name: 'Đường Xoài',
        origin: 'Trục đường nối Nhà 54 dọc bờ Ao cá tới Nhà sàn',
        description:
          'Con đường rợp bóng những cây xoài cổ thụ chạy dọc bờ Ao cá, nơi Bác đi bộ, tập thể dục mỗi sáng và đón tiếp khách quý.',
      },
      {
        name: 'Nhà 67',
        origin: 'Xây dựng năm 1967 phía sau Nhà sàn',
        description:
          'Ngôi nhà kiên cố do Bộ Chính trị xây dựng để bảo vệ Bác trong những năm chiến tranh phá hoại của không quân Mỹ, cũng là nơi Bác qua đời lúc 9 giờ 47 phút ngày 2/9/1969.',
      },
    ],
    historicalStory:
      'Tháng 12/1954, khi trở về Thủ đô Hà Nội, Chủ tịch Hồ Chí Minh kiên quyết dành tòa Phủ Toàn quyền Đông Dương làm nơi làm việc của Chính phủ và đón tiếp khách ngoại giao, còn mình chỉ ở tại ngôi Nhà 54 nhỏ bé bên bờ ao, đi lại trên Đường Xoài rợp bóng mát dẫn sang Nhà sàn (1958) và Nhà 67 (1967).',
    hcmThoughtConnection:
      'Khẳng định tư tưởng xuyên suốt của Hồ Chí Minh về bản chất của Đảng cầm quyền và Nhà nước cách mạng: quyền lực thuộc về nhân dân, người đứng đầu nhà nước tuyệt đối không màng danh lợi hay hưởng thụ cá nhân, đặt lợi ích của Tổ quốc và nhân dân lên trên hết.',
    keyQuote: {
      quote:
        '“Cả đời tôi chỉ có một mục đích, là phấn đấu cho quyền lợi Tổ quốc, và hạnh phúc của quốc dân.”',
      context: 'Chủ tịch Hồ Chí Minh trả lời báo chí (Năm 1946)',
    },
    coreValues: [
      'Phụng sự Tổ quốc và Nhân dân',
      'Khiêm tốn & Tiết kiệm',
      'Gắn bó với tập thể',
      'Chí công vô tư',
    ],
  },
  {
    id: 3,
    shortLabel: 'Tầng 1: Phòng họp',
    title: 'Tầng 1 Nhà Sàn: Phòng Họp Bộ Chính Trị',
    subtitle: 'Không gian mở minh bạch – Nhà nước của nhân dân, do nhân dân, vì nhân dân',
    zone: 'Tầng 1 Nhà sàn Bác Hồ',
    recommendedViewMode: 'floor1',
    position: [-0.25, 1.15, -0.5],
    cameraPos: [4.4, 3.5, 4.6],
    cameraTarget: [-0.2, 0.85, -0.5],
    imageUrl: './images/heritage/tang-1-phong-hop.jpg',
    imageCaption:
      'Không gian Tầng 1 Nhà sàn Bác Hồ với bàn họp Bộ Chính trị, chiếc ghế mây đầu bàn và bục ngồi xi-măng mặt gỗ bao quanh.',
    gallery: [
      {
        url: './images/heritage/tang-1-phong-hop.jpg',
        caption:
          'Bàn họp Bộ Chính trị, hàng ghế gỗ, chiếc ghế mây đầu bàn và bục ngồi mặt gỗ tại Tầng 1.',
      },
      {
        url: './images/heritage/ao-ca-bac-ho.jpg',
        caption:
          'Tầng 1 nhìn từ bên ngoài với bể cá vàng nhỏ đặt ở cột góc phải và các tấm mành trúc.',
      },
    ],
    artifacts: [
      'Bàn họp Bộ Chính trị bằng gỗ',
      'Chiếc ghế mây đầu bàn & hàng ghế gỗ',
      'Chiếc điện thoại bàn & Máy đánh chữ',
      'Bể cá vàng nhỏ ở cột góc phải',
    ],
    artifactDetails: [
      {
        name: 'Bàn họp Bộ Chính trị & Ghế mây',
        origin: 'Trung tâm Tầng 1 Nhà sàn',
        description:
          'Nơi Bác cùng các đồng chí trong Bộ Chính trị họp bàn những quyết sách trọng đại về xây dựng miền Bắc XHCN và đấu tranh giải phóng miền Nam.',
      },
      {
        name: 'Bục xi-măng mặt gỗ bao quanh',
        origin: 'Xung quanh hàng cột tầng 1',
        description:
          'Bác dặn thiết kế bục ngồi rộng quanh tầng 1 để mỗi khi các cháu thiếu nhi hay đoàn đại biểu đồng bào các dân tộc vào thăm có chỗ ngồi quây quần bên Bác.',
      },
      {
        name: 'Chiếc điện thoại làm việc trực chiến',
        origin: 'Đặt trên bàn tầng 1',
        description:
          'Kết nối trực tiếp với Bộ Tổng Tư lệnh và Quân chủng Phòng không – Không quân để Bác nắm tình hình chiến trường từng giờ.',
      },
    ],
    historicalStory:
      'Hoàn thành ngày 17/5/1958, tầng 1 Nhà sàn được thiết kế hoàn toàn mở bốn phía, đón gió mát từ Ao cá thổi vào. Đây vừa là phòng họp của Bộ Chính trị, vừa là nơi Bác thân mật tiếp đón các đoàn đại biểu anh hùng, chiến sĩ thi đua, khách quốc tế và các cháu thiếu nhi.',
    hcmThoughtConnection:
      'Thể hiện Tư tưởng Hồ Chí Minh về Nhà nước của nhân dân, do nhân dân, vì nhân dân. Bác khẳng định cán bộ nhà nước không phải là "quan cách mạng" mà là "công bộc, đầy tớ" của nhân dân. Không gian tầng 1 mở thoáng 4 bề là biểu tượng cho một chính phủ minh bạch, gần dân, kiên quyết chống "giặc nội xâm" (tham ô, lãng phí, quan liêu).',
    keyQuote: {
      quote:
        '“Việc gì lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh. Chúng ta phải yêu dân, kính dân thì dân mới yêu ta, kính ta.”',
      context: 'Thư gửi Ủy ban nhân dân các kỳ, tỉnh, huyện và làng (10/1945)',
    },
    coreValues: [
      'Nhà nước của dân, do dân, vì dân',
      'Cán bộ là công bộc của dân',
      'Dân chủ & Minh bạch',
      'Phòng chống tham ô, quan liêu',
    ],
  },
  {
    id: 4,
    shortLabel: 'Cầu thang & Đôi dép',
    title: 'Chân Cầu Thang Gỗ & Đôi Dép Cao Su Huyền Thoại',
    subtitle: 'Chuẩn mực Đạo đức Cách mạng: Cần, Kiệm, Liêm, Chính, Chí công vô tư',
    zone: 'Lối lên Tầng 2 Nhà sàn',
    recommendedViewMode: 'floor1',
    position: [2.85, 1.15, 0.6],
    cameraPos: [5.6, 2.8, 3.8],
    cameraTarget: [2.5, 0.95, 0.2],
    imageUrl: './images/heritage/cottage-2.jpg',
    imageCaption:
      'Hành lang tầng 1 và lối cầu thang gỗ dẫn lên tầng 2 tại Nhà sàn Bác Hồ.',
    gallery: [
      {
        url: './images/heritage/cottage-2.jpg',
        caption:
          'Hành lang tầng 1 lát xi-măng phẳng phiu và hệ cột gỗ lim vững chãi.',
      },
      {
        url: './images/heritage/ao-ca-nha-san.jpg',
        caption:
          'Cầu thang gỗ mộc dẫn lên hành lang tầng 2 Nhà sàn Bác Hồ.',
      },
    ],
    artifacts: [
      'Đôi dép cao su cắt từ lốp xe quân sự (1947)',
      'Cầu thang gỗ mộc dẫn lên tầng 2',
      'Chiếc mũ cối gắn liền các chuyến công tác',
    ],
    artifactDetails: [
      {
        name: 'Đôi dép cao su bốn quai',
        origin: 'Chiến khu Việt Bắc (Năm 1947)',
        description:
          'Được cắt từ lốp xe ô tô quân sự Pháp thu được tại Đèo Khế. Đôi dép đã cùng Bác đi khắp các chiến dịch và cả trong những chuyến thăm chính thức nước ngoài.',
      },
      {
        name: 'Cầu thang gỗ Nhà sàn',
        origin: 'Thiết kế truyền thống nhà sàn Việt Bắc',
        description:
          'Kết nối không gian làm việc chung ở tầng 1 với không gian nghiên cứu, nghỉ ngơi tĩnh lặng ở tầng 2.',
      },
    ],
    historicalStory:
      'Đôi dép cao su ra đời năm 1947 tại chiến khu Việt Bắc đã gắn bó với Bác Hồ suốt hơn hai thập kỷ. Khi quai dép mòn tuột, Bác bảo các đồng chí phục vụ đóng đinh sửa lại để dùng tiếp, trở thành biểu tượng xúc động về đức tính tiết kiệm và thanh cao của vị lãnh tụ.',
    hcmThoughtConnection:
      'Minh chứng sống động cho Tư tưởng Hồ Chí Minh về Đạo đức cách mạng với chuẩn mực cốt lõi "Cần, kiệm, liêm, chính, chí công vô tư". Bác chỉ rõ đạo đức là cái gốc của người cách mạng: không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân.',
    keyQuote: {
      quote:
        '“Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân.”',
      context: 'Tác phẩm “Sửa đổi lối làm việc” (Tháng 10/1947)',
    },
    coreValues: [
      'Cần, Kiệm, Liêm, Chính',
      'Chí công vô tư',
      'Đạo đức là gốc của cách mạng',
      'Nói đi đôi với làm',
    ],
  },
  {
    id: 5,
    shortLabel: 'Tầng 2: Phòng làm việc',
    title: 'Tầng 2 – Phòng Làm Việc: Bàn Gỗ, Đèn Bàn & Bản Thảo Di Chúc',
    subtitle: 'Đại đoàn kết toàn dân tộc, Đoàn kết quốc tế & Mặt trận văn hóa',
    zone: 'Tầng 2 Nhà sàn (Phòng bên trái)',
    recommendedViewMode: 'floor2',
    position: [-1.4, 3.1, -0.55],
    cameraPos: [-2.8, 5.8, 3.4],
    cameraTarget: [-1.35, 2.85, -0.55],
    imageUrl: './images/heritage/tang-2-phong-lam-viec.jpg',
    imageCaption:
      'Phòng làm việc của Bác Hồ ở tầng 2 với chiếc đèn bàn chụp vải xếp ly, ghế tựa mây và khung cửa sổ nhìn thẳng ra Ao cá Bác Hồ.',
    gallery: [
      {
        url: './images/heritage/tang-2-phong-lam-viec.jpg',
        caption:
          'Bàn làm việc gỗ, chiếc ghế tựa mây, cây đèn bàn chụp vải và cửa sổ nhìn ra Ao cá.',
      },
      {
        url: './images/heritage/nha-san-toan-canh.jpg',
        caption:
          'Mặt trước tầng 2 Nhà sàn với hành lang gỗ và hệ cửa sổ thông thoáng.',
      },
    ],
    artifacts: [
      'Bàn làm việc gỗ & Ghế tựa mây',
      'Chiếc đèn bàn chụp vải xếp ly',
      'Bản thảo Di chúc lịch sử (1965 – 1969)',
      'Bút chì đỏ - xanh & Giá sách đa ngôn ngữ',
    ],
    artifactDetails: [
      {
        name: 'Bản thảo Di chúc lịch sử',
        origin: 'Khởi thảo ngày 10/5/1965 tại phòng làm việc tầng 2',
        description:
          'Văn kiện lịch sử vô giá kết tinh toàn bộ tư tưởng, đạo đức, phong cách Hồ Chí Minh và định hướng chiến lược cho cách mạng Việt Nam.',
      },
      {
        name: 'Đèn bàn chụp vải & Bút chì đỏ - xanh',
        origin: 'Hiện vật nguyên bản trên bàn làm việc',
        description:
          'Dưới ánh đèn này, Bác đọc báo hàng ngày, dùng bút chì đỏ - xanh đánh dấu các tấm gương "Người tốt, việc tốt" để gửi tặng huy hiệu khen thưởng.',
      },
    ],
    historicalStory:
      'Căn phòng làm việc ở tầng 2 có cửa sổ nhìn thẳng ra Ao cá Bác Hồ và hàng cây xanh mát. Chính tại chiếc bàn gỗ nhỏ này, vào những ngày tháng 5 từ năm 1965 đến năm 1969, Bác đã tập trung trí tuệ viết và sửa chữa bản Di chúc lịch sử để lại cho toàn Đảng, toàn dân và toàn quân.',
    hcmThoughtConnection:
      'Thể hiện Tư tưởng Hồ Chí Minh về Đại đoàn kết toàn dân tộc, xây dựng Đảng trong sạch vững mạnh và Đoàn kết quốc tế trên nguyên tắc độc lập, tự chủ ("Thực lực là cái chiêng mà ngoại giao là cái tiếng"). Đồng thời khẳng định quan điểm "Văn hóa nghệ thuật cũng là một mặt trận".',
    keyQuote: {
      quote:
        '“Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta. Các đồng chí từ Trung ương đến các chi bộ cần phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình.”',
      context: 'Di chúc của Chủ tịch Hồ Chí Minh (1969)',
    },
    coreValues: [
      'Đại đoàn kết toàn dân tộc',
      'Giữ gìn sự đoàn kết trong Đảng',
      'Đoàn kết quốc tế & Tự lực tự cường',
      'Văn hóa là một mặt trận',
    ],
  },
  {
    id: 6,
    shortLabel: 'Tầng 2: Phòng ngủ',
    title: 'Tầng 2 – Phòng Ngủ: Giường Đơn, Quạt Lá Cọ & Đài Radio',
    subtitle: 'Trung với nước, hiếu với dân & Thống nhất lý luận với thực tiễn',
    zone: 'Tầng 2 Nhà sàn (Phòng bên phải)',
    recommendedViewMode: 'floor2',
    position: [1.4, 3.1, -0.55],
    cameraPos: [2.8, 5.8, 3.4],
    cameraTarget: [1.35, 2.85, -0.55],
    imageUrl: './images/heritage/tang-2-phong-ngu.jpg',
    imageCaption:
      'Phòng ngủ của Bác Hồ nhìn qua khung cửa chớp gỗ với bàn đặt chiếc mũ cối, đài Radio, lọ hoa tươi và đèn ngủ cạnh giường.',
    gallery: [
      {
        url: './images/heritage/tang-2-phong-ngu.jpg',
        caption:
          'Cửa chớp gỗ mở vào phòng ngủ của Bác với bàn đặt chiếc mũ cối, đài Radio, lọ hoa và đèn ngủ.',
      },
      {
        url: './images/heritage/ao-ca-bac-ho.jpg',
        caption:
          'Góc phải tầng 2 Nhà sàn nơi đặt phòng ngủ giản dị của Chủ tịch Hồ Chí Minh.',
      },
    ],
    artifacts: [
      'Chiếc giường gỗ đơn trải chiếu cói',
      'Đài Radio bán dẫn nghe tin miền Nam',
      'Chiếc quạt lá cọ & Chiếc mũ cối',
      'Đồng hồ báo thức & Đèn ngủ nhỏ',
    ],
    artifactDetails: [
      {
        name: 'Giường đơn trải chiếu cói & Quạt lá cọ',
        origin: 'Phòng ngủ tầng 2 (diện tích chỉ hơn 10m²)',
        description:
          'Nơi nghỉ ngơi của vị Chủ tịch nước vô cùng mộc mạc với chiếc giường đơn trải chiếu cói, chiếc chăn chiên và chiếc quạt lá cọ quê hương.',
      },
      {
        name: 'Đài Radio bán dẫn & Chiếc mũ cối',
        origin: 'Đặt trên bàn gỗ cạnh cửa sổ phòng ngủ',
        description:
          'Mỗi tối trước khi nghỉ và mỗi sáng thức dậy, Bác đều mở đài Radio để theo dõi tin tức chiến đấu của đồng bào, chiến sĩ cả nước.',
      },
    ],
    historicalStory:
      'Phòng ngủ của Bác ngăn cách với phòng làm việc bằng một vách gỗ nhỏ, rộng vỏn vẹn hơn 10m². Qua khung cửa chớp gỗ mộc mạc là chiếc bàn đặt chiếc mũ cối, chiếc đài Radio, lọ hoa nhỏ và chiếc giường đơn trải chiếu cói giản dị như bất kỳ ngôi nhà nào của người dân Việt Nam.',
    hcmThoughtConnection:
      'Thể hiện chuẩn mực đạo đức cốt lõi "Trung với nước, hiếu với dân" và "Thương yêu con người, sống có tình có nghĩa". Nếp sống của Bác là bài học mẫu mực về phương pháp học tập Tư tưởng Hồ Chí Minh: sự thống nhất trọn vẹn giữa lý luận và thực tiễn, nói đi đôi với làm.',
    keyQuote: {
      quote:
        '“Tôi chỉ có một sự ham muốn, ham muốn tột bậc, là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành.”',
      context: 'Chủ tịch Hồ Chí Minh trả lời các nhà báo (Tháng 1/1946)',
    },
    coreValues: [
      'Trung với nước, hiếu với dân',
      'Thương yêu con người',
      'Thống nhất lý luận và thực tiễn',
      'Tấm gương đạo đức trong sáng',
    ],
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    spotId: 1,
    category: 'Cơ sở hình thành & Văn hóa',
    question:
      'Không gian Ao cá Bác Hồ, hàng rào dâm bụt và ngôi Nhà sàn giản dị giữa lòng Thủ đô phản ánh rõ nhất cơ sở nào trong sự hình thành Tư tưởng Hồ Chí Minh?',
    options: [
      'Sự kế thừa truyền thống văn hóa tốt đẹp của dân tộc kết hợp với phẩm chất cao đẹp, gắn bó máu thịt với nhân dân của Bác',
      'Sự sao chép nguyên bản mô hình kiến trúc phương Tây hiện đại vào Việt Nam',
      'Chủ trương tách biệt hoạt động lãnh đạo khỏi đời sống thực tiễn xã hội',
      'Quan điểm chỉ coi trọng kinh tế nông nghiệp truyền thống hơn công nghiệp',
    ],
    correctIndex: 0,
    quoteReference:
      'Không gian Nhà sàn và Ao cá thể hiện tính dân tộc, tính đại chúng và sự hòa hợp với thiên nhiên, bắt nguồn từ truyền thống văn hóa dân tộc và nhân격 Hồ Chí Minh.',
    explanation:
      'Ngôi nhà sàn, hàng dâm bụt, ao cá thể hiện sự kế thừa giá trị truyền thống văn hóa dân tộc (nhân văn, giản dị, hòa hợp thiên nhiên) và nhân tố chủ quan là tâm hồn của một nhà yêu nước chân chính luôn hòa mình với nhân dân.',
  },
  {
    id: 2,
    spotId: 2,
    category: 'Đạo đức & Phong cách Người đứng đầu',
    question:
      'Khi tiếp quản Thủ đô năm 1954, việc Bác Hồ từ chối ở tòa Dinh thự Toàn quyền Đông Dương để làm việc tại ngôi Nhà 54 nhỏ bé bên Đường Xoài thể hiện quan điểm nào về quyền lực nhà nước?',
    options: [
      'Quyền lực thuộc về nhân dân, người lãnh đạo là công bộc tận tụy phục vụ Tổ quốc và nhân dân, không màng danh lợi hay đặc quyền cá nhân',
      'Trụ sở cơ quan nhà nước không cần sử dụng các công trình kiến trúc lớn',
      'Mọi hoạt động ngoại giao đều chỉ diễn ra trong phạm vi nhỏ hẹp',
      'Tách rời nơi ở của lãnh đạo khỏi các cơ quan trung ương',
    ],
    correctIndex: 0,
    quoteReference:
      '“Cả đời tôi chỉ có một mục đích, là phấn đấu cho quyền lợi Tổ quốc, và hạnh phúc của quốc dân.”',
    explanation:
      'Bác dành tòa Dinh thự lớn làm nơi làm việc chung của Chính phủ và đón khách quốc tế, còn bản thân chọn ngôi nhà nhỏ của người thợ điện cũ (Nhà 54), nêu gương sáng về chí công vô tư, không hưởng thụ đặc quyền.',
  },
  {
    id: 3,
    spotId: 3,
    category: 'Tư tưởng về Nhà nước',
    question:
      'Không gian Tầng 1 Nhà sàn để mở thoáng 4 bề – nơi họp Bộ Chính trị và đón tiếp các đoàn đại biểu nhân dân, thiếu nhi – gắn liền với luận điểm nào của Hồ Chí Minh về cán bộ nhà nước?',
    options: [
      'Cán bộ nhà nước là những "quan cách mạng" đứng trên nhân dân',
      'Cán bộ không phải là "quan cách mạng" mà là "công bộc, đầy tớ" của nhân dân, kiên quyết chống tham ô, lãng phí, quan liêu',
      'Bộ máy nhà nước chỉ cần tập trung vào công tác quân sự và đối ngoại',
      'Các quyết sách chiến lược không cần xuất phát từ lợi ích của nhân dân',
    ],
    correctIndex: 1,
    quoteReference:
      '“Việc gì lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh.”',
    explanation:
      'Theo Tư tưởng Hồ Chí Minh về Nhà nước của nhân dân, do nhân dân, vì nhân dân, đội ngũ cán bộ là công bộc phục vụ nhân dân, nhà nước phải minh bạch, gần dân và kiên quyết đấu tranh chống "giặc nội xâm" (tham ô, lãng phí, quan liêu).',
  },
  {
    id: 4,
    spotId: 4,
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
    id: 5,
    spotId: 5,
    category: 'Di chúc lịch sử & Xây dựng Đảng',
    question:
      'Trong bản Di chúc lịch sử được Bác Hồ soạn thảo tại bàn làm việc Tầng 2 Nhà sàn (1965 – 1969), điều đầu tiên Bác căn dặn toàn Đảng là gì?',
    options: [
      'Phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình, thực hành dân chủ rộng rãi, tự phê bình và phê bình',
      'Chỉ tập trung phát triển công nghiệp nặng ngay sau khi chiến tranh kết thúc',
      'Hạn chế mở rộng quan hệ ngoại giao với các quốc gia khác thể chế chính trị',
      'Thay đổi toàn bộ hệ thống tổ chức của các đoàn thể quần chúng',
    ],
    correctIndex: 0,
    quoteReference:
      '“Các đồng chí từ Trung ương đến các chi bộ cần phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình.”',
    explanation:
      'Mở đầu bản Di chúc, Bác nói về Đảng và nhấn mạnh "Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta", đòi hỏi mỗi cán bộ, đảng viên phải giữ gìn sự đoàn kết nhất trí và có tình đồng chí thương yêu lẫn nhau.',
  },
  {
    id: 6,
    spotId: 6,
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
