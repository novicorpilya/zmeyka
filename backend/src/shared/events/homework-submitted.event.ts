export class HomeworkSubmittedEvent {
  constructor(
    public readonly homeworkId: string,
    public readonly studentId: string,
    public readonly courseId: string,
    public readonly teacherId: string,
    public readonly studentName: string,
  ) {}
}
