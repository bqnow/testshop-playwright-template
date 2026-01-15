
import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

interface TestDetails {
    title: string;
    browser: string;
    status: string;
    duration: number;
    error?: string;
    timestamp: number;
}

/**
 * Grafana Per-Test Reporter
 * 
 * Sends detailed metrics for each individual test to Grafana Loki.
 * Enables granular dashboards showing:
 * - Per-test pass/fail rates
 * - Slowest tests
 * - Flaky tests
 * - Browser-specific failures
 */
class GrafanaReporter implements Reporter {
    private tests: TestDetails[] = [];

    onBegin(config: FullConfig, suite: Suite) {
        console.log(`\n[GrafanaReporter] 🚀 Starting test run with ${suite.allTests().length} tests`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        // Extract browser from project name (e.g., "chromium", "firefox", "webkit")
        const browser = test.parent.project()?.name || 'unknown';

        // Collect test details
        const testDetail: TestDetails = {
            title: test.title,
            browser: browser,
            status: result.status, // 'passed', 'failed', 'skipped', 'timedout'
            duration: result.duration,
            error: result.error?.message,
            timestamp: Date.now()
        };

        this.tests.push(testDetail);
    }

    async onEnd(result: FullResult) {
        console.log(`\n[GrafanaReporter] 🏁 Test run finished with status: ${result.status}`);
        console.log(`[GrafanaReporter] 📊 Collected ${this.tests.length} test results`);

        // Build Loki payload with individual test entries
        const lokiPayload = {
            streams: this.tests.map(test => ({
                stream: {
                    app: 'testshop-e2e',
                    environment: process.env.TEST_ENV || 'local',
                    kind: 'test_result',  // Changed from 'test_report' to 'test_result' for per-test data
                    test_name: test.title,
                    browser: test.browser,
                    status: test.status
                },
                values: [
                    [
                        String(test.timestamp * 1000000), // Nanoseconds timestamp
                        JSON.stringify({
                            event: 'test_completed',
                            test_name: test.title,
                            browser: test.browser,
                            status: test.status,
                            duration_ms: test.duration,
                            error: test.error || null,
                            user: process.env.USER || 'ci-runner'
                        })
                    ]
                ]
            }))
        };

        // Showcase Output (only show first 3 tests to avoid spam)
        console.log('\n----------------------------------------');
        console.log('📊 GRAFANA PER-TEST METRICS');
        console.log('----------------------------------------');
        console.log(`Sending ${this.tests.length} individual test results to Grafana Loki`);
        console.log('\nSample (first 3 tests):');
        this.tests.slice(0, 3).forEach((test, i) => {
            console.log(`  ${i + 1}. ${test.title} [${test.browser}]: ${test.status} (${test.duration}ms)`);
        });
        console.log('----------------------------------------\n');

        // Send to Grafana
        if (process.env.GRAFANA_LOKI_URL && process.env.GRAFANA_LOKI_USER && process.env.GRAFANA_LOKI_KEY) {
            try {
                console.log(`📡 Sending ${this.tests.length} test metrics to Grafana Loki...`);
                const auth = Buffer.from(process.env.GRAFANA_LOKI_USER + ':' + process.env.GRAFANA_LOKI_KEY).toString('base64');

                const response = await fetch(process.env.GRAFANA_LOKI_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + auth
                    },
                    body: JSON.stringify(lokiPayload)
                });

                if (response.ok) {
                    console.log(`✅ Successfully sent ${this.tests.length} test results to Grafana!`);
                } else {
                    const errorBody = await response.text();
                    console.error(`❌ Grafana API Error (${response.status}):`, errorBody);
                }
            } catch (error) {
                console.error('❌ Failed to send metrics to Grafana:', error);
            }
        } else {
            console.warn('⚠️ Grafana env vars missing. Skipping upload.');
        }
    }
}

export default GrafanaReporter;
