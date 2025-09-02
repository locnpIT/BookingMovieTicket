export type Movie = {
  id: number
  title: string
  posterUrl: string
  rating?: number
  duration: number
  genres: string[]
  status: 'NOW_SHOWING' | 'COMING_SOON'
  releaseDate: string
  language: string
  ageRating: string
}

export const locations = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
]

export const heroSlides = [
  {
    imageUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963f?q=80&w=1600&auto=format&fit=crop',
    title: 'Bom tấn tháng này',
    subtitle: 'Đặt vé nhanh – ưu đãi hấp dẫn tại PhuocLocCine',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1600&auto=format&fit=crop',
    title: 'Trải nghiệm rạp chuẩn',
    subtitle: 'Màn hình khủng, âm thanh sống động – đặt chỗ ngay',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop',
    title: 'Suất chiếu đặc biệt',
    subtitle: 'Ưu đãi thành viên – tích điểm đổi quà cực chất',
  },
]

export const movies: Movie[] = [
  {
    id: 1,
    title: 'Hành Trình Cuối Cùng',
    posterUrl:
      'https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=800&auto=format&fit=crop',
    rating: 8.5,
    duration: 126,
    genres: ['Hành động', 'Phiêu lưu'],
    status: 'NOW_SHOWING',
    releaseDate: '2025-08-20',
    language: 'Việt/Eng',
    ageRating: 'T16',
  },
  {
    id: 2,
    title: 'Bí Ẩn Trong Bóng Đêm',
    posterUrl:
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop',
    rating: 7.9,
    duration: 112,
    genres: ['Kinh dị', 'Tâm lý'],
    status: 'NOW_SHOWING',
    releaseDate: '2025-08-05',
    language: 'Việt/Eng',
    ageRating: 'T18',
  },
  {
    id: 3,
    title: 'Giai Điệu Mùa Hè',
    posterUrl:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop',
    rating: 8.1,
    duration: 98,
    genres: ['Âm nhạc', 'Lãng mạn'],
    status: 'NOW_SHOWING',
    releaseDate: '2025-07-28',
    language: 'Việt/Eng',
    ageRating: 'P',
  },
  {
    id: 4,
    title: 'Biệt Đội Không Gian',
    posterUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    rating: 8.9,
    duration: 140,
    genres: ['Khoa học viễn tưởng', 'Hành động'],
    status: 'NOW_SHOWING',
    releaseDate: '2025-08-10',
    language: 'Việt/Eng',
    ageRating: 'T13',
  },
  {
    id: 5,
    title: 'Ngày Em Đến',
    posterUrl:
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=800&auto=format&fit=crop',
    duration: 104,
    genres: ['Tình cảm', 'Hài'],
    status: 'COMING_SOON',
    releaseDate: '2025-09-15',
    language: 'Việt/Eng',
    ageRating: 'T13',
  },
  {
    id: 6,
    title: 'Bầu Trời Xanh Thẳm',
    posterUrl:
      'https://images.unsplash.com/photo-1514388619271-e4d0cfd5eb26?q=80&w=800&auto=format&fit=crop',
    duration: 121,
    genres: ['Drama'],
    status: 'COMING_SOON',
    releaseDate: '2025-09-05',
    language: 'Việt/Eng',
    ageRating: 'T16',
  },
  {
    id: 7,
    title: 'Cơn Lốc 4.0',
    posterUrl:
      'https://images.unsplash.com/photo-1494883759339-0b042055a4ee?q=80&w=800&auto=format&fit=crop',
    duration: 110,
    genres: ['Giật gân', 'Hành động'],
    status: 'COMING_SOON',
    releaseDate: '2025-10-01',
    language: 'Việt/Eng',
    ageRating: 'T18',
  },
  {
    id: 8,
    title: 'Thế Giới Song Song',
    posterUrl:
      'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop',
    duration: 132,
    genres: ['Khoa học viễn tưởng'],
    status: 'COMING_SOON',
    releaseDate: '2025-09-28',
    language: 'Việt/Eng',
    ageRating: 'T13',
  },
]

