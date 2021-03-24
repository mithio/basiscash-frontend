import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useInitiateRewardClaimFromBoardroom = () => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleinitiateRewardClaim = useCallback(() => {
    handleTransactionReceipt(basisCash.initiateRewardClaim(), 'Initiate Rewards Claim from Boardroom');
  }, [basisCash]);

  return { initiateRewardClaim: handleinitiateRewardClaim };
};

export default useInitiateRewardClaimFromBoardroom;
