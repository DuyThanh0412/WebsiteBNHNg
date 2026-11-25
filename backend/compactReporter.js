const path = require('path');

const stripAnsi = (s = '') => s.replace(/\u001b\[[0-9;]*m/g, '');
const fmt = (v) => (typeof v === 'string' ? `"${v}"` : JSON.stringify(v));

class CompactReporter {
  onTestResult(test, result) {
    const file = path.relative(process.cwd(), result.testFilePath).replace(/\\/g, '/');
    const hasFail = result.numFailingTests > 0 || result.testExecError;
    console.log(`\n${hasFail ? 'FAIL' : 'PASS'} ${file}\n`);

    // Lỗi khi load file (ví dụ require sai, thiếu module...)
    if (result.testExecError || (result.failureMessage && result.testResults.length === 0)) {
      const msg = stripAnsi(result.failureMessage || result.testExecError.message);
      console.log(msg.split('\n').slice(0, 6).join('\n'));
      return;
    }

    for (const t of result.testResults) {
      if (t.status === 'passed') {
        console.log(`✓ ${t.title}`);
        continue;
      }
      if (t.status !== 'failed') continue;

      console.log(`✕ ${t.title}\n`);

      const detail = (t.failureDetails || [])[0] || {};
      const matcher = detail.matcherResult;

      if (matcher && 'expected' in matcher) {
        console.log(`Expected: ${fmt(matcher.expected)}`);
        console.log(`Received: ${fmt(matcher.actual)}`);
      } else {
        // Lỗi không phải do expect (TypeError, throw new Error...)
        const first = stripAnsi(t.failureMessages[0] || '').split('\n')[0];
        console.log(first);
      }

      // Lấy vị trí dòng lỗi trong file test
      const stack = stripAnsi(t.failureMessages[0] || '');
      const escaped = result.testFilePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const loc = stack.match(new RegExp(`${escaped}:(\\d+):(\\d+)`));
      if (loc) console.log(`\nat ${file}:${loc[1]}:${loc[2]}`);
      console.log('');
    }
  }

  onRunComplete(_, r) {
    console.log(`\nTổng: ${r.numPassedTests} đạt, ${r.numFailedTests} lỗi, ${r.numTotalTests} test`);
  }
}

module.exports = CompactReporter;