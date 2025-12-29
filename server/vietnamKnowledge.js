// Vietnam Space & Astronomy Knowledge Base
export const vietnamSpaceData = [
  {
    id: 'vietnam_astronomy',
    type: 'concept',
    name: 'Thiên văn học Việt Nam',
    text: `thiên văn học việt nam viện vật lý vũ trụ planetarium đài quan sát nha trang đà lạt observatory lịch âm lịch vạn niên sao việt nam ngôi sao nhật thực việt nam nguyệt thực việt nam`,
    data: {
      description: 'Việt Nam có Viện Vật lý Vũ trụ (Institute of Physics), Planetarium ở TP.HCM, và các đài quan sát thiên văn tại Nha Trang và Đà Lạt. Người Việt truyền thống sử dụng lịch âm dựa trên chu kỳ Mặt Trăng.',
      locations: ['TP.HCM', 'Nha Trang', 'Đà Lạt'],
      organizations: ['Viện Vật lý Vũ trụ', 'Hội Thiên văn Việt Nam']
    }
  },
  {
    id: 'vietnam_space_program',
    type: 'concept', 
    name: 'Chương trình vũ trụ Việt Nam',
    text: `vệ tinh việt nam vinasat vnredsat lotosat trung tâm vũ trụ việt nam vietnam space center phạm tuân phi hành gia việt nam astronaut công nghệ vũ trụ space technology vietnam nanodragon`,
    data: {
      description: 'Việt Nam đã phóng nhiều vệ tinh như VNREDSat-1 (quan sát Trái Đất), VINASAT-1 và VINASAT-2 (viễn thông), LOTUSat-1 (IoT). Phi hành gia Phạm Tuân là người Việt Nam đầu tiên bay vào vũ trụ năm 1980 cùng chương trình Interkosmos của Liên Xô.',
      satellites: ['VNREDSat-1', 'VINASAT-1', 'VINASAT-2', 'LOTUSat-1', 'NanoDragon', 'MicroDragon'],
      astronauts: ['Phạm Tuân'],
      achievements: [
        'VNREDSat-1: Vệ tinh quan sát Trái Đất đầu tiên (2013)',
        'VINASAT-1: Vệ tinh viễn thông đầu tiên (2008)', 
        'NanoDragon: Vệ tinh nano do sinh viên chế tạo (2021)'
      ]
    }
  },
  {
    id: 'vietnam_geography_space',
    type: 'concept',
    name: 'Địa lý Việt Nam từ không gian',
    text: `việt nam từ vũ trụ satellite view vietnam from space vịnh hạ long delta sông mekong sông hồng hình chữ s coastline bờ biển vietnam ảnh vệ tinh việt nam earth observation`,
    data: {
      description: 'Từ không gian, Việt Nam có hình chữ S độc đáo dọc theo bờ biển Đông. Các địa hình nổi bật bao gồm Vịnh Hạ Long, đồng bằng sông Hồng và sông Mekong. VNREDSat-1 chụp ảnh vệ tinh của Việt Nam với độ phân giải 2.5m.',
      landmarks: ['Vịnh Hạ Long', 'Đồng bằng Sông Hồng', 'Đồng bằng Sông Cửu Long', 'Dãy Trường Sơn'],
      shape: 'Hình chữ S',
      coastline: '3260 km bờ biển'
    }
  },
  {
    id: 'vietnam_traditional_astronomy',
    type: 'concept',
    name: 'Thiên văn học truyền thống Việt Nam',
    text: `sao hôm sao mai sao băng mưa sao lịch vạn niên lịch âm lịch nguyệt tết nguyên đán rằm trung thu full moon ngày tốt xấu phong thủy sao chiếu mệnh`,
    data: {
      description: 'Người Việt xưa đã quan sát thiên văn để làm lịch canh tác. Lịch âm dựa trên chu kỳ Mặt Trăng, với Tết Nguyên Đán (mùng 1 tháng Giêng) và Tết Trung Thu (rằm tháng 8). Sao Mai và Sao Hôm là tên gọi của Sao Kim vào sáng và chiều.',
      festivals: ['Tết Nguyên Đán', 'Tết Trung Thu', 'Rằm tháng 7', 'Tết Đoan Ngọ'],
      concepts: ['Lịch âm', 'Sao chiếu mệnh', 'Mưa sao băng', 'Thiên can địa chi'],
      stars: {
        'Sao Mai': 'Sao Kim vào buổi sáng',
        'Sao Hôm': 'Sao Kim vào buổi chiều',
        'Sao Thái Bạch': 'Sao Kim trong thiên văn cổ'
      }
    }
  },
  {
    id: 'vietnam_scientists',
    type: 'concept',
    name: 'Các nhà khoa học Việt Nam',
    text: `phạm tuân nhà khoa học việt nam scientist vietnam ngô bảo châu fields medal toán học viện hàn lâm khoa học việt nam vietnam academy tạ quang bửu điện tử`,
    data: {
      description: 'Việt Nam có nhiều nhà khoa học nổi tiếng như Ngô Bảo Châu (giải Fields Medal toán học 2010), Phạm Tuân (phi hành gia), và các nhà nghiên cứu tại Viện Hàn lâm Khoa học và Công nghệ Việt Nam.',
      notableScientists: [
        'Ngô Bảo Châu - Toán học (Fields Medal 2010)',
        'Phạm Tuân - Phi hành gia đầu tiên (1980)',
        'Tạ Quang Bửu - Cha đẻ điện tử học Việt Nam',
        'Hoàng Tụy - Toán học tối ưu hóa toàn cục',
        'Nguyễn Văn Hiệu - Vật lý hạt nhân'
      ],
      institutions: [
        'Viện Hàn lâm Khoa học và Công nghệ Việt Nam',
        'Đại học Quốc gia Hà Nội',
        'Đại học Bách khoa Hà Nội'
      ]
    }
  },
  {
    id: 'pham_tuan_astronaut',
    type: 'person',
    name: 'Phạm Tuân - Phi hành gia Việt Nam',
    text: `phạm tuân phi hành gia việt nam astronaut interkosmos soyuz 37 salyut 6 không gian space flight vietnam cosmonaut`,
    data: {
      description: 'Phạm Tuân (sinh 1947) là phi hành gia đầu tiên và duy nhất của Việt Nam. Ông bay vào vũ trụ ngày 23/7/1980 trên tàu Soyuz 37, làm việc 8 ngày trên trạm vũ trụ Salyut 6 trong chương trình Interkosmos.',
      mission: 'Soyuz 37 / Salyut 6',
      date: '23/7/1980 - 31/7/1980',
      duration: '7 ngày 20 giờ 42 phút',
      achievements: [
        'Phi hành gia châu Á đầu tiên',
        'Thực hiện thí nghiệm trồng cây trong không gian',
        'Chụp ảnh Trái Đất từ vũ trụ',
        'Nghiên cứu tác động của môi trường không trọng lực'
      ]
    }
  }
];

export const vietnamConstellations = [
  {
    id: 'vietnam_zodiac',
    type: 'concept',
    name: '12 con giáp Việt Nam',
    text: `12 con giáp việt nam tý sửu dần mão thìn tỵ ngọ mùi thân dậu tuất hợi chuột trâu hổ mèo rồng rắn ngựa dê khỉ gà chó heo`,
    data: {
      description: '12 con giáp Việt Nam tương ứng với 12 năm trong chu kỳ, khác với Trung Quốc ở con Mèo (thay vì Thỏ). Mỗi con giáp liên quan đến các chòm sao và tính cách.',
      animals: ['Tý (Chuột)', 'Sửu (Trâu)', 'Dần (Hổ)', 'Mão (Mèo)', 'Thìn (Rồng)', 'Tỵ (Rắn)', 'Ngọ (Ngựa)', 'Mùi (Dê)', 'Thân (Khỉ)', 'Dậu (Gà)', 'Tuất (Chó)', 'Hợi (Heo)'],
      difference: 'Việt Nam có con Mèo thay vì con Thỏ như Trung Quốc'
    }
  }
];