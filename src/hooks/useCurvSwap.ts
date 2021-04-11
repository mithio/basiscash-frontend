import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';

const useCurvSwap = () => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwap = useCallback(
    (mic2Amount: string, usdtAmount: string) => {
     // const mic2AmountBn = parseInt(mic2Amount);
      const mic2AmountBn = parseUnits(mic2Amount, 18);
      const usdtAmountBn = parseFloat('0');
      const realmic2 = BigNumber.from(mic2AmountBn);
      const usdtreal = BigNumber.from(usdtAmountBn);

      handleTransactionReceipt(
        basisCash.SwapMic(mic2AmountBn, usdtreal),
        `Swap ${mic2Amount} MIC2 to USDT`
      );
    },
    [basisCash],
  );
  return { onSwap: handleSwap };
};

export default useCurvSwap;
