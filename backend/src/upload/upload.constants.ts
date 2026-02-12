export const UPLOAD_LIMITS = {
  VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  FILE_SIZE: 50 * 1024 * 1024, // 50MB
  USER_QUOTA: 500 * 1024 * 1024, // 500MB
}

export const ALLOWED_EXTENSIONS = {
  STATIC: /\.(pdf|doc|docx|zip|rar|7z|txt|py|js|ts)$/i,
  VIDEO: /\/(mp4|quicktime|x-msvideo|x-matroska)$/,
}
