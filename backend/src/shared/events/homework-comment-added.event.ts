export class HomeworkCommentAddedEvent {
  constructor(
    public readonly homeworkId: string,
    public readonly commentId: string,
    public readonly authorId: string,
    public readonly text: string,
    public readonly authorName: string,
    public readonly recipientId: string, // Who should receive the notification
  ) {}
}
