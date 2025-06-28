
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, Crown } from 'lucide-react';

interface QuotaManagerProps {
  currentUsage: number;
  maxQuota: number;
  resetDate: Date;
  onUpgradeClick: () => void;
}

const QuotaManager: React.FC<QuotaManagerProps> = ({
  currentUsage,
  maxQuota,
  resetDate,
  onUpgradeClick
}) => {
  const isLimitReached = currentUsage >= maxQuota;
  const usagePercentage = (currentUsage / maxQuota) * 100;
  
  const formatResetDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilReset = () => {
    const now = new Date();
    const diffTime = resetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLimitReached) {
    return (
      <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-2 border-red-200 dark:border-red-800 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500 animate-pulse" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
              Weekly Limit Reached!
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              You've used all {maxQuota} messages this week.
            </p>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Resets in {getDaysUntilReset()} days</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatResetDate(resetDate)}
            </p>
          </div>

          <Button
            onClick={onUpgradeClick}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade for Unlimited Access
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-green-700 dark:text-green-300">Weekly Usage</h4>
          <Badge 
            variant={usagePercentage > 80 ? "destructive" : "secondary"}
            className={usagePercentage > 80 ? "animate-pulse" : ""}
          >
            {currentUsage}/{maxQuota}
          </Badge>
        </div>
        
        <Progress 
          value={usagePercentage} 
          className="h-2 transition-all duration-500"
        />
        
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
          <span>Resets: {formatResetDate(resetDate)}</span>
          <span>{maxQuota - currentUsage} left</span>
        </div>
      </div>
    </Card>
  );
};

export default QuotaManager;
