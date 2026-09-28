import { MathFormula } from '../types';
import { OFFICIAL_SOURCES } from '../sources';

export const EXTRA_FORMULAS: MathFormula[] = [
  {
    id: 'form_extra_heron_formula',
    name: 'صيغة هيرون لحساب مساحة المثلث بمعلومية أطوال أضلاعه الثلاثة',
    name_en: "Heron's Formula for Triangle Area",
    latex: 'A = \\sqrt{s(s - a)(s - b)(s - c)}, \\quad s = \\frac{a + b + c}{2}',
    grade_id: 'sec_1',
    grade_name: 'إضافات رياضية خارج المنهج',
    stage_id: 'secondary',
    academic_year: '2026/2027',
    curriculum_version: 'extra_curricular',
    branch: 'هندسة إثرائية متقدمة',
    unit_name: 'إضافات خارج المنهج',
    topic: 'مساحات متقدمة',
    symbol_definitions: [
      { symbol: 'a, b, c', meaning: 'أطوال أضلاع المثلث الثلاثة' },
      { symbol: 's', meaning: 'نصف محيط المثلث (Semi-perimeter)' },
      { symbol: 'A', meaning: 'مساحة المثلث' }
    ],
    meaning_explanation: 'طريقة عبقرية لحساب مساحة أي مثلث دون الحاجة لمعرفة أي ارتفاع أو زاوية، بالاعتماد الكلي على نصف المحيط وأطوال الأضلاع.',
    when_to_use: [
      'عند معرفة أطوال أضلاع المثلث الثلاثة فقط دون وجود زاوية قائمة أو ارتفاع مباشر.'
    ],
    solution_steps: [
      'حساب نصف المحيط: s = (a + b + c) / 2.',
      'حساب الفروق: (s - a)، (s - b)، (s - c).',
      'ضرب s في الفروق الثلاثة ثم أخذ الجذر التربيعي.'
    ],
    example: {
      problem: 'احسب مساحة مثلث أطوال أضلاعه 5 سم، 6 سم، 7 سم.',
      solution_steps: [
        'المحيط = 5 + 6 + 7 = 18 سم ⟹ s = 9 سم.',
        's - a = 9 - 5 = 4.',
        's - b = 9 - 6 = 3.',
        's - c = 9 - 7 = 2.',
        'المساحة = √(9 × 4 × 3 × 2) = √(216) = 6√6 ≈ 14.7 سم².'
      ],
      answer: '6√6 ≈ 14.7 سم²'
    },
    notes: [
      'هذه الصيغة إثرائية خارج المنهج المدرسي الأساسي ووضعت للإفادة الرياضية وتطوير المهارات.'
    ],
    is_extra_curricular: true,
    source: OFFICIAL_SOURCES.extra_curricular_ref
  },
  {
    id: 'form_extra_shoelace_formula',
    name: 'صيغة رباط الحذاء لحساب مساحة أي مضلع إحداثي',
    name_en: "Shoelace Formula (Gauss Area Formula)",
    latex: 'A = \\frac{1}{2} \\left| \\sum_{i=1}^{n-1} (x_i y_{i+1} - x_{i+1} y_i) + (x_n y_1 - x_1 y_n) \\right|',
    grade_id: 'sec_1',
    grade_name: 'إضافات رياضية خارج المنهج',
    stage_id: 'secondary',
    academic_year: '2026/2027',
    curriculum_version: 'extra_curricular',
    branch: 'هندسة تحليلية متقدمة',
    unit_name: 'إضافات خارج المنهج',
    topic: 'مساحات المضلعات الإحداثية',
    symbol_definitions: [
      { symbol: '(x_i, y_i)', meaning: 'إحداثيات رؤوس المضلع مرتبة بالترتيب الدوري' }
    ],
    meaning_explanation: 'طريقة هندسية جبرية سريعة جداً لحساب مساحة أي مثلث أو شكل رباعي أو مضلع مغلق بمعلومية إحداثيات رؤوسه في المستوي.',
    when_to_use: [
      'لحساب مساحة أي مضلع مرسوم في شبكة إحداثية متعامدة بسرعة فائقة بدون براهين مطولة.'
    ],
    solution_steps: [
      'رص الإحداثيات رأسياً وتكرار النقطة الأولى في النهاية.',
      'حساب حاصل ضرب الأقطار من أعلى اليسار لأسفل اليمين وجمعها.',
      'حساب حاصل ضرب الأقطار العكسية وجمعها ثم طرح المجموعين وأخذ نصف القيمة المطلقة.'
    ],
    example: {
      problem: 'احسب مساحة المثلث الذي رؤوسه (0، 0)، (4، 0)، (0، 3).',
      solution_steps: [
        'النقاط: (0,0)، (4,0)، (0,3)، (0,0).',
        'الضرب المائل الأول = (0×0) + (4×3) + (0×0) = 12.',
        'الضرب المائل الثاني = (0×4) + (0×0) + (3×0) = 0.',
        'المساحة = 1/2 |12 - 0| = 6 وحدات مربعة.'
      ],
      answer: '6 وحدات مربعة'
    },
    notes: [
      'هذه الصيغة خارج المنهج وتستخدم في الأولمبياد والمسابقات الرياضية.'
    ],
    is_extra_curricular: true,
    source: OFFICIAL_SOURCES.extra_curricular_ref
  }
];
