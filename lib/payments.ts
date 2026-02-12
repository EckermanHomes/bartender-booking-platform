import { env } from '@/lib/env';

export function calcDeposit(totalEstimate: number) {
  if (env.depositMode === 'percent') {
    return Math.round((totalEstimate * env.depositPercent) / 100);
  }
  return env.depositAmount;
}
