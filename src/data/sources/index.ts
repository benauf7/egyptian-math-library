import { SourceReference } from '../types';

export const OFFICIAL_SOURCES: Record<string, SourceReference> = {
  moete_primary_4_old: {
    source_title: 'كتاب الرياضيات - الصف الرابع الابتدائي (الفصلان الدراسيان الأول والثاني)',
    source_url: 'https://moe.gov.eg/ar/elearningenterypage/e-learning?stage=primary&grade=4',
    academic_year: '2020/2021',
    grade: 'الصف الرابع الابتدائي',
    curriculum_version: 'egyptian_old_curriculum',
    official_publisher: 'وزارة التربية والتعليم والتعليم الفني - جمهورية مصر العربية',
    notes: 'النسخة الرسمية المعتمدة قبل تطبيق منظومة التعليم 2.0 - متاحة عبر بوابة التعليم الإلكتروني لوزارة التربية والتعليم المصرية.'
  },
  moete_primary_5_old: {
    source_title: 'كتاب الرياضيات - الصف الخامس الابتدائي (طبعة الأعداد والمساحات الكلاسيكية)',
    source_url: 'https://moe.gov.eg/ar/elearningenterypage/e-learning?stage=primary&grade=5',
    academic_year: '2021/2022',
    grade: 'الصف الخامس الابتدائي',
    curriculum_version: 'egyptian_old_curriculum',
    official_publisher: 'قطاع الكتب - وزارة التربية والتعليم والتعليم الفني',
    notes: 'منهج ط الكلاسيكي والمساحات وحساب محيط الدائرة المعتمد رسمياً.'
  },
  moete_primary_6_old: {
    source_title: 'كتاب الرياضيات المعتمد للشهادة الابتدائية - الصف السادس الابتدائي (النسبة والتناسب والأعداد الصحيحة والحجوم والإحصاء)',
    source_url: 'https://moe.gov.eg/ar/elearningenterypage/e-learning?stage=primary&grade=6',
    academic_year: '2022/2023',
    grade: 'الصف السادس الابتدائي',
    curriculum_version: 'egyptian_old_curriculum',
    official_publisher: 'مركز تطوير المناهج والمواد التعليمية - وزارة التربية والتعليم المصرية',
    notes: 'الشهادة الابتدائية - المنهاج التراثي الكلاسيكي لعام 2022/2023 قبل تطبيق التطوير على الصف السادس.'
  },
  moete_prep_1_old: {
    source_title: 'كتاب الرياضيات المعتمد (الجبر والإحصاء / الهندسة والقياس) - الصف الأول الإعدادي',
    source_url: 'https://moe.gov.eg/ar/elearningenterypage/e-learning?stage=prep&grade=1',
    academic_year: '2023/2024',
    grade: 'الصف الأول الإعدادي',
    curriculum_version: 'egyptian_old_curriculum',
    official_publisher: 'الإدارة المركزية للتعليم الأساسي - وزارة التربية والتعليم المصرية',
    notes: 'آخر عام دراسي للمنهاج القديم الكلاسيكي للصف الأول الإعدادي لعام 2023/2024.'
  },
  moete_prep_2_old: {
    source_title: 'كتاب الرياضيات المعتمد (الجبر والتحليل / الهندسة والمساحات وإقليدس) - الصف الثاني الإعدادي',
    source_url: 'https://moe.gov.eg/ar/elearningenterypage/e-learning?stage=prep&grade=2',
    academic_year: '2024/2025',
    grade: 'الصف الثاني الإعدادي',
    curriculum_version: 'egyptian_old_curriculum',
    official_publisher: 'وزارة التربية والتعليم والتعليم الفني - قطاع الكتب والمناهج',
    notes: 'منهج التحليل الجبري الشامل الكلاسيكي ونظريات المساحات وإقليدس ومتوسطات المثلث.'
  },
  moete_prep_3_old: {
    source_title: 'كتاب الرياضيات المعتمد للشهادة الإعدادية العامة (الجبر والإحصاء / الهندسة وحساب المثلثات وهندسة الدائرة)',
    source_url: 'https://moe.gov.eg/ar/elearningenterypage/e-learning?stage=prep&grade=3',
    academic_year: '2025/2026',
    grade: 'الصف الثالث الإعدادي',
    curriculum_version: 'egyptian_old_curriculum',
    official_publisher: 'وزارة التربية والتعليم والتعليم الفني - الإدارة المركزية للامتحانات والمناهج',
    notes: 'منهج الشهادة الإعدادية الكلاسيكي الشامل (القانون العام، الدائرة، حساب المثلثات للزوايا الحادة، الهندسة التحليلية).'
  },
  moete_sec_1_restructured: {
    source_title: 'كتاب الرياضيات الموحد المطور - الصف الأول الثانوي العام (أولى بكالوريا)',
    source_url: 'https://moe.gov.eg/ar/elearningenterypage/e-learning?stage=secondary&grade=1',
    academic_year: '2026/2027',
    grade: 'الصف الأول الثانوي (أولى بكالوريا)',
    curriculum_version: 'egyptian_restructured_2024_2027',
    official_publisher: 'الإدارة المركزية لتطوير المناهج - وزارة التربية والتعليم والتعليم الفني',
    notes: 'النظام المطور المعتمد رسمياً بعد إعادة هيكلة الثانوية العامة والمناهج الموحدة لعام 2026/2027.'
  },
  extra_curricular_ref: {
    source_title: 'الموسوعة الرياضية المتقدمة والإضافات الإثرائية لطرائق التفكير والحل',
    source_url: 'https://ekb.eg/advanced_math_extensions',
    academic_year: 'متعدد السنوات',
    grade: 'إثرائي / متقدم',
    curriculum_version: 'extra_curricular',
    official_publisher: 'بنك المعرفة المصري بالتعاون مع دور النشر الأكاديمية العالمية',
    notes: 'مفاهيم وقوانين مساعدة خارج الإلزام المدرسي لتوسيع الأفق الرياضي والأولمبياد.'
  }
};
