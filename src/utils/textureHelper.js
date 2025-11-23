// Helper để kiểm tra và tải texture
export function getTexturePath(texturePath) {
  if (!texturePath) return null;
  
  // Kiểm tra xem file có tồn tại không (trong production)
  // Trong development, texture sẽ được load và báo lỗi nếu không tìm thấy
  return texturePath;
}

// Tạo canvas texture động nếu không có ảnh
export function createFallbackTexture(color, size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Tạo gradient đơn giản
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, '#000000');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  return canvas;
}
