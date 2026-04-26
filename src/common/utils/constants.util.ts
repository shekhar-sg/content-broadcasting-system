export namespace Constants {
  export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"] as const;
  export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"] as const;
  export const MAX_FILE_SIZE = 10 * 1024 * 1024;

  export const SUBJECTS = [
    "maths",
    "science",
    "english",
    "history",
    "geography",
    "physics",
    "chemistry",
    "biology",
    "computer",
  ] as const;

  export type Subject = (typeof SUBJECTS)[number];
}
