/**
 * Timer Service
 * Handles response timing and performance metrics
 */

export class TimerService {
  private static instance: TimerService;
  private activeTimers: Map<string, number> = new Map();
  private timerHistory: Array<{
    id: string;
    startTime: number;
    endTime: number;
    duration: number;
    operation: string;
  }> = [];

  private constructor() {}

  public static getInstance(): TimerService {
    if (!TimerService.instance) {
      TimerService.instance = new TimerService();
    }
    return TimerService.instance;
  }

  public startTimer(id: string, operation: string = 'general'): void {
    const startTime = Date.now();
    this.activeTimers.set(id, startTime);
    
    console.log(`⏱️ Timer started for ${operation} (ID: ${id})`);
  }

  public stopTimer(id: string, operation: string = 'general'): number {
    const startTime = this.activeTimers.get(id);
    if (!startTime) {
      console.warn(`Timer with ID ${id} not found`);
      return 0;
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Record in history
    this.timerHistory.push({
      id,
      startTime,
      endTime,
      duration,
      operation
    });

    // Keep only last 100 records
    if (this.timerHistory.length > 100) {
      this.timerHistory = this.timerHistory.slice(-100);
    }

    // Remove from active timers
    this.activeTimers.delete(id);

    console.log(`⏱️ Timer stopped for ${operation} (ID: ${id}): ${duration}ms`);
    return duration;
  }

  public getElapsedTime(id: string): number {
    const startTime = this.activeTimers.get(id);
    if (!startTime) {
      return 0;
    }
    return Date.now() - startTime;
  }

  public isTimerActive(id: string): boolean {
    return this.activeTimers.has(id);
  }

  public getTimerHistory(operation?: string): Array<{
    id: string;
    startTime: number;
    endTime: number;
    duration: number;
    operation: string;
  }> {
    if (operation) {
      return this.timerHistory.filter(record => record.operation === operation);
    }
    return [...this.timerHistory];
  }

  public getAverageResponseTime(operation?: string): number {
    const history = this.getTimerHistory(operation);
    if (history.length === 0) return 0;

    const totalDuration = history.reduce((sum, record) => sum + record.duration, 0);
    return Math.round(totalDuration / history.length);
  }

  public getPerformanceStats(): {
    totalRequests: number;
    averageResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
    responseTimeDistribution: {
      fast: number; // < 1s
      medium: number; // 1-3s
      slow: number; // > 3s
    };
  } {
    const history = this.timerHistory;
    
    if (history.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        fastestResponse: 0,
        slowestResponse: 0,
        responseTimeDistribution: { fast: 0, medium: 0, slow: 0 }
      };
    }

    const durations = history.map(record => record.duration);
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    const averageResponseTime = Math.round(totalDuration / durations.length);
    const fastestResponse = Math.min(...durations);
    const slowestResponse = Math.max(...durations);

    const distribution = durations.reduce(
      (acc, duration) => {
        if (duration < 1000) acc.fast++;
        else if (duration < 3000) acc.medium++;
        else acc.slow++;
        return acc;
      },
      { fast: 0, medium: 0, slow: 0 }
    );

    return {
      totalRequests: history.length,
      averageResponseTime,
      fastestResponse,
      slowestResponse,
      responseTimeDistribution: distribution
    };
  }

  public clearHistory(): void {
    this.timerHistory = [];
    console.log('Timer history cleared');
  }

  public clearActiveTimers(): void {
    this.activeTimers.clear();
    console.log('Active timers cleared');
  }

  public formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(1)}s`;
    } else {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = ((milliseconds % 60000) / 1000).toFixed(1);
      return `${minutes}m ${seconds}s`;
    }
  }
}

export const timerService = TimerService.getInstance();
