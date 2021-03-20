import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useClaimReward = () => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleclaimReward = useCallback(() => {
    handleTransactionReceipt(basisCash.claimReward(), 'Initiate Rewards Claim from Boardroom');
  }, [basisCash]);

  return { claimReward: handleclaimReward };
};

export default useClaimReward;
