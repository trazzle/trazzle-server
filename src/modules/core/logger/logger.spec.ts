import { performance } from "perf_hooks";
import { enhanceLogLevel } from "src/modules/core/logger/logger.helper";

describe("LoggerModule", () => {
  it("성능 테스트", () => {
    const testLevel = "\x1B[32minfo\x1B[39m";
    const iterations = 1000000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      enhanceLogLevel(testLevel);
    }
    const end = performance.now();

    const averageTimePerIteration = (end - start) / iterations;
    console.log(`Average time per iteration: ${averageTimePerIteration.toFixed(6)} ms`);
  });
});
