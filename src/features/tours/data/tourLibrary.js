// Tour Library - Định nghĩa tất cả các tours có sẵn
export const TOURS = [
    {
        id: 'solar-system-101',
        title: 'Hành Trình Khám Phá Hệ Mặt Trời',
        description: 'Tổng quan về hệ Mặt Trời - Tour dành cho người mới bắt đầu',
        difficulty: 'beginner',
        duration: '4 phút',
        estimatedTime: 240, // seconds
        thumbnail: '/tours/solar-101.jpg',
        color: '#FFD700',
        stops: [
            {
                id: 'stop-overview',
                target: null, // View tổng quan, không focus vào planet cụ thể
                cameraPos: { x: 200, y: 150, z: 200 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 8000, // Thời gian narration (ms)
                flyDuration: 3000, // Thời gian bay camera (ms)
                title: 'Chào Mừng Đến Hệ Mặt Trời',
                narration: 'Chào mừng bạn đến với hành trình khám phá hệ Mặt Trời! Đây là ngôi nhà của chúng ta trong vũ trụ bao la. Hệ Mặt Trời bao gồm 8 hành tinh quay quanh ngôi sao trung tâm - Mặt Trời.',
                facts: [
                    'Hệ Mặt Trời được hình thành cách đây 4.6 tỷ năm',
                    'Mặt Trời chiếm 99.86% khối lượng toàn bộ hệ',
                    'Tất cả các hành tinh đều quay theo cùng chiều'
                ],
                dataPoints: []
            },
            {
                id: 'stop-sun',
                target: 'Sun',
                cameraPos: { x: 80, y: 50, z: 80 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 10000,
                flyDuration: 4000,
                title: 'Mặt Trời - Nguồn Năng Lượng Sống',
                narration: 'Đây là Mặt Trời - trái tim của hệ. Mặt Trời là một ngôi sao, không phải hành tinh! Nó tạo ra năng lượng bằng cách kết hợp hydro thành helium ở lõi với nhiệt độ lên đến 15 triệu độ C.',
                facts: [
                    'Đường kính: 1.392.000 km (109 lần Trái Đất)',
                    'Nhiệt độ bề mặt: 5.500°C',
                    'Ánh sáng mất 8 phút 20 giây để đến Trái Đất',
                    'Mặt Trời có thể chứa 1.3 triệu Trái Đất'
                ],
                dataPoints: ['mass', 'temperature', 'luminosity']
            },
            {
                id: 'stop-earth-moon',
                target: 'Earth',
                cameraPos: { x: 30, y: 20, z: 30 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 12000,
                flyDuration: 5000,
                title: 'Trái Đất & Mặt Trăng - Ngôi Nhà Của Chúng Ta',
                narration: 'Chào mừng về nhà! Đây là Trái Đất - hành tinh duy nhất có sự sống mà chúng ta biết. Khoảng 71% bề mặt được bao phủ bởi nước, tạo nên màu xanh đặc trưng. Mặt Trăng - vệ tinh tự nhiên của chúng ta - đang quay quanh đó kìa!',
                facts: [
                    'Tuổi: 4.5 tỷ năm',
                    'Khoảng cách từ Mặt Trời: 150 triệu km (1 AU)',
                    'Mặt Trăng cách Trái Đất 384.400 km',
                    'Trái Đất là hành tinh đá lớn nhất trong hệ Mặt Trời'
                ],
                dataPoints: ['diameter', 'gravity', 'temperature', 'moons']
            },
            {
                id: 'stop-jupiter',
                target: 'Jupiter',
                cameraPos: { x: 50, y: 30, z: 50 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 12000,
                flyDuration: 6000,
                title: 'Sao Mộc - Gã Khổng Lồ Khí',
                narration: 'Đây là Sao Mộc - hành tinh lớn nhất trong hệ Mặt Trời! Nó là một "gã khổng lồ khí" - không có bề mặt rắn như Trái Đất. Bạn có thấy vết đỏ lớn không? Đó là một cơn bão khổng lồ đã tồn tại hơn 300 năm!',
                facts: [
                    'Lớn gấp 1.300 lần Trái Đất về thể tích',
                    'Có 95 vệ tinh đã được phát hiện',
                    'Vết Đỏ Lớn (Great Red Spot) lớn hơn Trái Đất',
                    'Một ngày trên Sao Mộc chỉ dài 10 giờ!',
                    'Có từ trường mạnh nhất trong hệ Mặt Trời'
                ],
                dataPoints: ['diameter', 'gravity', 'moons', 'dayLength']
            },
            {
                id: 'stop-saturn',
                target: 'Saturn',
                cameraPos: { x: 60, y: 5, z: 60 }, // Camera thấp để nhìn vành đai đẹp
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 12000,
                flyDuration: 6000,
                title: 'Sao Thổ - Chúa Tể Của Những Chiếc Nhẫn',
                narration: 'Chào mừng đến với Sao Thổ - hành tinh đẹp nhất trong hệ Mặt Trời! Vành đai huy hoàng của nó được tạo thành từ hàng tỷ mảnh băng và đá, một số nhỏ như hạt cát, một số lớn như ngôi nhà!',
                facts: [
                    'Vành đai rộng 282.000 km nhưng chỉ dày vài trăm mét',
                    'Có 146 vệ tinh - nhiều nhất trong hệ Mặt Trời',
                    'Titan - vệ tinh lớn nhất có bầu khí quyển dày',
                    'Sao Thổ nhẹ đến mức có thể nổi trên nước!',
                    'Có cơn bão hình lục giác kỳ lạ ở cực Bắc'
                ],
                dataPoints: ['diameter', 'gravity', 'moons', 'temperature']
            },
            {
                id: 'stop-conclusion',
                target: null,
                cameraPos: { x: 300, y: 200, z: 300 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 10000,
                flyDuration: 5000,
                title: 'Kết Luận - Tiếp Tục Khám Phá!',
                narration: 'Chúng ta đã hoàn thành hành trình khám phá cơ bản! Nhưng còn nhiều điều kỳ diệu đang chờ bạn: Sao Hỏa với núi lửa cao nhất, Sao Thiên Vương quay nghiêng kỳ lạ, và Sao Hải Vương với cơn bão nhanh nhất... Hãy tự do khám phá bằng chuột hoặc thử các tour khác!',
                facts: [
                    'Còn 3 hành tinh nữa chưa được khám phá trong tour này',
                    'Hãy thử tìm vành đai tiểu hành tinh giữa Sao Hỏa và Sao Mộc',
                    'Sử dụng tính năng tìm kiếm để tìm hiểu từng hành tinh chi tiết'
                ],
                dataPoints: []
            }
        ]
    },
    {
        id: 'rocky-planets',
        title: 'Các Hành Tinh Đá',
        description: 'Khám phá sâu về 4 hành tinh đất đá',
        difficulty: 'intermediate',
        duration: '3.5 phút',
        estimatedTime: 210,
        thumbnail: '/tours/rocky-planets.jpg',
        color: '#E27B58',
        stops: [
            {
                id: 'stop-intro',
                target: null,
                cameraPos: { x: 100, y: 80, z: 100 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 8000,
                flyDuration: 3000,
                title: 'Các Hành Tinh Đất Đá',
                narration: 'Trong hệ Mặt Trời, có 4 hành tinh được gọi là "hành tinh đất đá" hay "hành tinh trái đất" - đó là Sao Thủy, Sao Kim, Trái Đất và Sao Hỏa. Chúng đều có bề mặt rắn và gần Mặt Trời hơn so với các hành tinh khí.',
                facts: [
                    'Tất cả đều có bề mặt rắn có thể đứng lên được',
                    'Nhỏ hơn nhiều so với các hành tinh khí',
                    'Có ít vệ tinh hoặc không có vệ tinh'
                ],
                dataPoints: []
            },
            {
                id: 'stop-mercury',
                target: 'Mercury',
                cameraPos: { x: 25, y: 15, z: 25 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 10000,
                flyDuration: 4000,
                title: 'Sao Thủy - Tốc Độ Và Nhiệt Độ Cực Đoan',
                narration: 'Sao Thủy là hành tinh nhỏ nhất và gần Mặt Trời nhất. Tên của nó đặt theo thần tốc độ La Mã - rất hợp lý vì nó quay quanh Mặt Trời nhanh nhất! Nhiệt độ ban ngày lên đến 430°C, nhưng ban đêm xuống -180°C!',
                facts: [
                    'Một năm chỉ dài 88 ngày Trái Đất',
                    'Nhưng một ngày lại dài 59 ngày Trái Đất!',
                    'Không có khí quyển để giữ nhiệt',
                    'Bề mặt đầy hố va chạm giống Mặt Trăng'
                ],
                dataPoints: ['diameter', 'temperature', 'dayLength', 'distance']
            },
            {
                id: 'stop-venus',
                target: 'Venus',
                cameraPos: { x: 28, y: 18, z: 28 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 11000,
                flyDuration: 4000,
                title: 'Sao Kim - Địa Ngục Nóng Bỏng',
                narration: 'Sao Kim là hành tinh nóng nhất trong hệ Mặt Trời - còn nóng hơn cả Sao Thủy! Khí quyển dày đặc CO2 tạo hiệu ứng nhà kính cực mạnh, giữ nhiệt ở 464°C. Mưa axit sulfuric và áp suất cao gấp 90 lần Trái Đất!',
                facts: [
                    'Tự quay ngược chiều so với hầu hết các hành tinh',
                    'Một ngày dài hơn một năm (243 vs 225 ngày Trái Đất)',
                    'Áp suất bề mặt như ở độ sâu 900m dưới đại dương',
                    'Đôi khi được gọi là "hành tinh tương tự Trái Đất"'
                ],
                dataPoints: ['diameter', 'temperature', 'gravity', 'dayLength']
            },
            {
                id: 'stop-mars',
                target: 'Mars',
                cameraPos: { x: 35, y: 22, z: 35 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 12000,
                flyDuration: 5000,
                title: 'Sao Hỏa - Hành Tinh Đỏ',
                narration: 'Sao Hỏa - hành tinh đỏ - là mục tiêu tiếp theo cho sứ mệnh có người lái! Màu đỏ đến từ oxit sắt (gỉ sắt) trên bề mặt. Sao Hỏa có núi Olympus Mons - núi lửa cao nhất hệ Mặt Trời (25km), gần gấp 3 lần Everest!',
                facts: [
                    'Có bằng chứng về nước lỏng trong quá khứ',
                    'Có 2 mặt trăng nhỏ: Phobos và Deimos',
                    'Một ngày dài 24.6 giờ - gần giống Trái Đất',
                    'NASA có 3 tàu thám hiểm đang hoạt động trên sao Hỏa',
                    'Có khí quyển mỏng chỉ 1% Trái Đất'
                ],
                dataPoints: ['diameter', 'temperature', 'moons', 'gravity']
            },
            {
                id: 'stop-comparison',
                target: 'Earth',
                cameraPos: { x: 150, y: 50, z: 0 }, // View từ bên để so sánh
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 10000,
                flyDuration: 5000,
                title: 'So Sánh - Tại Sao Chỉ Trái Đất Có Sự Sống?',
                narration: 'Trong 4 hành tinh đá, chỉ Trái Đất có sự sống. Tại sao? Trái Đất ở "vùng Goldilocks" - không quá nóng, không quá lạnh. Có nước lỏng, khí quyển bảo vệ, và từ trường chặn bức xạ. Sao Hỏa đang được nghiên cứu như ứng viên tiềm năng!',
                facts: [
                    'Trái Đất lớn nhất trong 4 hành tinh đá',
                    'Sao Thủy nhỏ nhất - chỉ bằng 38% Trái Đất',
                    'Sao Kim gần giống Trái Đất nhất về kích thước',
                    'Tất cả đều có lõi kim loại'
                ],
                dataPoints: []
            }
        ]
    },
    {
        id: 'gas-giants',
        title: 'Những Gã Khổng Lồ Khí',
        description: 'Khám phá 4 hành tinh khổng lồ bên ngoài',
        difficulty: 'advanced',
        duration: '4.5 phút',
        estimatedTime: 270,
        thumbnail: '/tours/gas-giants.jpg',
        color: '#C88B3A',
        stops: [
            {
                id: 'stop-intro',
                target: null,
                cameraPos: { x: 250, y: 150, z: 250 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 9000,
                flyDuration: 3000,
                title: 'Vương Quốc Của Những Gã Khổng Lồ',
                narration: 'Chào mừng đến với phần ngoài của hệ Mặt Trời - nơi ở của 4 hành tinh khổng lồ! Sao Mộc và Sao Thổ là "hành tinh khí", còn Sao Thiên Vương và Sao Hải Vương là "hành tinh băng". Chúng chiếm 99% khối lượng hành tinh trong hệ!',
                facts: [
                    'Tất cả đều không có bề mặt rắn',
                    'Có hệ thống vành đai (Saturn nổi bật nhất)',
                    'Có rất nhiều vệ tinh',
                    'Quay rất nhanh dù rất lớn'
                ],
                dataPoints: []
            },
            {
                id: 'stop-jupiter-detail',
                target: 'Jupiter',
                cameraPos: { x: 45, y: 28, z: 45 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 13000,
                flyDuration: 5000,
                title: 'Sao Mộc - Người Bảo Vệ Trái Đất',
                narration: 'Sao Mộc không chỉ lớn nhất - nó còn bảo vệ Trái Đất! Lực hấp dẫn khổng lồ của nó hút các tiểu hành tinh và sao chổi, ngăn chúng va vào hành tinh trong. Europa - một vệ tinh của Sao Mộc - có thể có đại dương dưới lớp băng dày!',
                facts: [
                    'Khối lượng gấp 2.5 lần tất cả hành tinh khác cộng lại',
                    'Có từ trường mạnh gấp 20.000 lần Trái Đất',
                    'Europa có thể có sự sống dưới đại dương băng',
                    'Ganymede - vệ tinh lớn nhất hệ Mặt Trời',
                    'Io - vệ tinh có núi lửa hoạt động mạnh nhất'
                ],
                dataPoints: ['diameter', 'mass', 'moons', 'gravity']
            },
            {
                id: 'stop-saturn-rings',
                target: 'Saturn',
                cameraPos: { x: 70, y: 3, z: 70 }, // Góc thấp để ngắm vành đai
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 13000,
                flyDuration: 6000,
                title: 'Sao Thổ - Bí Ẩn Vành Đai Huyền Thoại',
                narration: 'Vành đai Sao Thổ - một trong những cảnh đẹp nhất vũ trụ! Được phát hiện năm 1610 bởi Galileo. Titan - vệ tinh lớn nhất của Sao Thổ - có khí quyển dày hơn Trái Đất và hồ hydrocarbon lỏng. Enceladus phun vòi nước băng vào không gian!',
                facts: [
                    'Vành đai chủ yếu là băng sạch như tuyết',
                    'Có 7 vành chính và hàng nghìn vành nhỏ',
                    'Titan - nơi duy nhất ngoài Trái Đất có chất lỏng trên bề mặt',
                    'Enceladus có đại dương nước mặn dưới bề mặt',
                    'Sao Thổ có mật độ thấp nhất - nhẹ hơn nước!'
                ],
                dataPoints: ['diameter', 'moons', 'gravity', 'dayLength']
            },
            {
                id: 'stop-uranus',
                target: 'Uranus',
                cameraPos: { x: 55, y: 35, z: 55 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 11000,
                flyDuration: 6000,
                title: 'Sao Thiên Vương - Hành Tinh Nghiêng 98°',
                narration: 'Sao Thiên Vương là hành tinh kỳ lạ nhất! Nó quay nghiêng 98° - gần như nằm ngang so với quỹ đạo. Các nhà khoa học nghĩ một va chạm khổng lồ trong quá khứ đã làm nó lật nghiêng. Màu xanh cyan đến từ methane trong khí quyển.',
                facts: [
                    'Quay nghiêng nên cực Bắc/Nam luân phiên hướng về Mặt Trời',
                    'Một mùa dài 21 năm Trái Đất!',
                    'Có 13 vành đai mờ',
                    'Lạnh nhất trong các hành tinh - xuống -224°C',
                    'Có 27 vệ tinh được đặt tên theo nhân vật Shakespeare'
                ],
                dataPoints: ['diameter', 'temperature', 'moons', 'dayLength']
            },
            {
                id: 'stop-neptune',
                target: 'Neptune',
                cameraPos: { x: 58, y: 37, z: 58 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 12000,
                flyDuration: 6000,
                title: 'Sao Hải Vương - Thế Giới Của Cơn Bão',
                narration: 'Chào mừng đến hành tinh xa nhất! Sao Hải Vương có gió mạnh nhất hệ Mặt Trời - lên đến 2.100 km/h! "Vết Đen Lớn" - cơn bão khổng lồ - đã biến mất vào năm 1994. Triton - vệ tinh lớn nhất - quay ngược chiều và có mưa nitơ lỏng!',
                facts: [
                    'Mất 164 năm Trái Đất để quay quanh Mặt Trời',
                    'Một ngày chỉ dài 16 giờ',
                    'Có 14 vệ tinh đã biết',
                    'Triton có geyser nitrogen phun cao 8km',
                    'Được phát hiện bằng toán học trước khi quan sát!'
                ],
                dataPoints: ['diameter', 'distance', 'moons', 'temperature']
            },
            {
                id: 'stop-conclusion',
                target: null,
                cameraPos: { x: 400, y: 250, z: 400 },
                lookAt: { x: 0, y: 0, z: 0 },
                duration: 10000,
                flyDuration: 7000,
                title: 'Kết Thúc Hành Trình - Vũ Trụ Rộng Lớn',
                narration: 'Chúng ta đã hoàn thành hành trình qua 4 gã khổng lồ! Nhưng hệ Mặt Trời chưa kết thúc ở đây. Ngoài Sao Hải Vương còn có vành đai Kuiper với hàng nghìn thiên thể băng, trong đó có Pluto. Tiếp tục khám phá nhé!',
                facts: [
                    '4 hành tinh khí chiếm 99% khối lượng hành tinh',
                    'Tất cả đều có vành đai, nhưng Saturn nổi bật nhất',
                    'Tổng cộng có 282 vệ tinh của 4 hành tinh này',
                    'Còn rất nhiều bí ẩn chưa được khám phá'
                ],
                dataPoints: []
            }
        ]
    }
];

// Helper function để lấy tour theo ID
export const getTourById = (tourId) => {
    return TOURS.find(tour => tour.id === tourId);
};

// Helper function để lấy tất cả tours theo difficulty
export const getToursByDifficulty = (difficulty) => {
    return TOURS.filter(tour => tour.difficulty === difficulty);
};
