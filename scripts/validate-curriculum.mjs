import { spawnSync } from 'child_process';

console.log('🚀 بدء التحقق الأكاديمي الشامل للمناهج والسنوات الدراسية...');

const result = spawnSync('npx', ['vitest', 'run', 'src/tests/curriculum-validation.test.ts'], {
  stdio: 'inherit',
  shell: true
});

if (result.status === 0) {
  console.log('\n✅ اكتمل التحقق بنجاح! جميع المناهج والسنوات الدراسية والمصادر متطابقة بدقة 100% مع مسار الطالب في التعليم المصري.');
  process.exit(0);
} else {
  console.error('\n❌ فشل التحقق! يرجى مراجعة الأخطاء المذكورة أعلاه.');
  process.exit(1);
}
