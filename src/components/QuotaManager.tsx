
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, AlertTriangle } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

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
  const usagePercentage = (currentUsage / maxQuota) * 100;
  const remainingQuota = maxQuota - currentUsage;
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = currentUsage >= maxQuota;

  const formatResetDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isAtLimit) {
    return (
      <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 animate-bounce-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
              Weekly Limit Reached
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              You've used all {maxQuota} messages this week. Your quota resets on {formatResetDate(resetDate)}.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onUpgradeClick}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 animate-glow"
            >
              <Zap className="h-4 w-4 mr-2" />
              Upgrade for Unlimited Messages
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Resets {formatResetDate(resetDate)}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 transition-all duration-300 ${
      isNearLimit 
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
        : 'bg-card dark:bg-gray-800 border-border dark:border-gray-700'
    }`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Weekly Usage</h3>
            <InfoTooltip content="Track your weekly message quota. Free users get 7 messages per week, resetting every Sunday. Upgrade for unlimited access." />
          </div>
          <Badge 
            variant={isNearLimit ? "destructive" : "secondary"}
            className="animate-fade-in"
          >
            {remainingQuota} left
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{currentUsage} / {maxQuota} messages</span>
            <span>{usagePercentage.toFixed(0)}% used</span>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className={`h-2 transition-all duration-500 ${
              isNearLimit ? 'animate-pulse' : ''
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Resets {formatResetDate(resetDate)}</span>
          </div>
          
          {isNearLimit && (
            <Button 
              onClick={onUpgradeClick}
              size="sm"
              variant="outline"
              className="text-xs h-6 px-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"
            >
              <Zap className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuotaManager;
