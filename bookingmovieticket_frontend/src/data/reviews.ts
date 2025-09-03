export type Review = {
  id: number
  name: string
  avatarUrl: string
  rating: number
  comment: string
  location: string
}

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
    rating: 5,
    comment:
      'Âm thanh cực chất, màn hình siêu nét. Nhân viên nhiệt tình, đặt vé online rất nhanh!',
    location: 'Hà Nội',
  },
  {
    id: 2,
    name: 'Trần Hải Đăng',
    avatarUrl: 'https://i.pravatar.cc/100?img=32',
    rating: 4,
    comment:
      'Ghế ngồi êm, phòng chiếu sạch sẽ. Có nhiều suất IMAX – đáng để trải nghiệm!',
    location: 'TP. Hồ Chí Minh',
  },
  {
    id: 3,
    name: 'Lê Thuỳ Dương',
    avatarUrl: 'https://i.pravatar.cc/100?img=5',
    rating: 5,
    comment:
      'Đặt vé trên web mượt, có thể chọn ghế dễ dàng. Sẽ quay lại nhiều lần nữa.',
    location: 'Đà Nẵng',
  },
  {
    id: 4,
    name: 'Phạm Quốc Huy',
    avatarUrl: 'https://i.pravatar.cc/100?img=20',
    rating: 4,
    comment:
      'Combo bắp nước ngon, giá ổn. Rạp mới, trang thiết bị hiện đại.',
    location: 'Hải Phòng',
  },
  {
    id: 5,
    name: 'Võ Bảo Ngọc',
    avatarUrl: 'https://i.pravatar.cc/100?img=15',
    rating: 5,
    comment:
      'Không gian đẹp, chỗ gửi xe thuận tiện. Chương trình ưu đãi thành viên hấp dẫn.',
    location: 'Cần Thơ',
  },
  {
    id: 6,
    name: 'Đặng Thanh Tùng',
    avatarUrl: 'https://i.pravatar.cc/100?img=25',
    rating: 4,
    comment:
      'Trang chủ gọn gàng, dễ tìm phim. Trải nghiệm tổng thể rất tốt!',
    location: 'Huế',
  },
]
