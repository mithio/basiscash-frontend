import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';
import { Tax } from '../basis-cash/types';
import config from '../config';

const useTaxStats = () => {
  const [stat, setStat] = useState<Tax>();
  const basisCash = useBasisCash();

  const fetchCashPrice = useCallback(async () => {
    setStat(await basisCash.getRealTax());
  }, [basisCash]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch MIC2 Tax: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setStat, basisCash]);

  return stat;
};

export default useTaxStats;
