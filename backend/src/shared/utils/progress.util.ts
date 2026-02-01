interface ProgressEntry {
  isCompleted: boolean
}

interface LessonWithProgress {
  id: string
  progress?: ProgressEntry[]
}

interface ModuleWithLessons {
  id: string
  lessons: LessonWithProgress[]
}

export class ProgressUtil {
  static calculateProgress(modules: ModuleWithLessons[], userId?: string) {
    let totalLessons = 0
    let completedLessons = 0

    modules.forEach((module) => {
      if (!module.lessons) return
      totalLessons += module.lessons.length

      if (userId) {
        completedLessons += module.lessons.filter(
          (l: LessonWithProgress) =>
            l.progress && l.progress.length > 0 && l.progress[0].isCompleted,
        ).length
      }
    })

    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    const xp = completedLessons * 10

    return {
      totalLessons,
      completedLessons,
      progress,
      xp,
    }
  }
}
