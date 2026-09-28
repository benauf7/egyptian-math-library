import { MathLesson } from '../types';
import { PRIMARY_LESSONS } from './primary_lessons';
import { PREP_LESSONS } from './prep_lessons';
import { SEC_LESSONS } from './sec_lessons';

export const ALL_LESSONS: MathLesson[] = [
  ...PRIMARY_LESSONS,
  ...PREP_LESSONS,
  ...SEC_LESSONS
];

export const getLessonById = (id: string): MathLesson | undefined => {
  return ALL_LESSONS.find(l => l.id === id);
};

export const getLessonsByGrade = (gradeId: string): MathLesson[] => {
  return ALL_LESSONS.filter(l => l.grade_id === gradeId);
};

export const getLessonsByYear = (academicYear: string): MathLesson[] => {
  return ALL_LESSONS.filter(l => l.academic_year === academicYear);
};
