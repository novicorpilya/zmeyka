export class LevelUpEvent {
  constructor(
    public readonly userId: string,
    public readonly newLevel: number,
  ) {}
}
