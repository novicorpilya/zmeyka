export class HomeworkReviewedEvent {
  constructor(
    public readonly homeworkId: string,
    public readonly studentId: string,
    public readonly lessonId: string,
    public readonly status: string,
    public readonly score: number | null | undefined,
    public readonly feedback: string | null | undefined,
    public readonly isCertain: boolean,
  ) {}
}
