export class CourseEnrolledEvent {
  constructor(
    public readonly userId: string,
    public readonly courseId: string,
    public readonly courseTitle: string,
    public readonly teacherId: string,
    public readonly studentName: string,
  ) {}
}
