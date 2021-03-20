import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';

const usePendingWithdrawalTime = () => {
  const [pendingWithdrawalTime, setPendingWithdrawalTime] = useState(0);
  const basisCash = useBasisCash();

  useCallback(async () => {
    const pendingWithdrawalTime= await basisCash.pendingWithdrawalTime();
    setPendingWithdrawalTime(pendingWithdrawalTime);
  }, [basisCash?.isUnlocked]);

  return pendingWithdrawalTime;
};

export default usePendingWithdrawalTime;
