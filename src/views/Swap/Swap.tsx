import React, { useCallback, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import useBasisCash from '../../hooks/useBasisCash';

import TokenInput from '../../components/TokenInput';
import TokenSwap from '../../components/TokenSwap';
import useTokenBalance from '../../hooks/useTokenBalance';
import Button from '../../components/Button';
import { getDisplayBalance } from '../../utils/formatBalance';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import { useWallet } from 'use-wallet';
import useCurvDeposit from '../../hooks/useCurvDeposit';
import useCurvSwap from '../../hooks/useCurvSwap';
import useTaxStats from '../../hooks/useTaxStats';
import useCashStats from '../../hooks/useCashStats';
import { couldStartTrivia } from 'typescript';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';

const swapMic = '0x9b29c7DB8026b146029a59Ac50881bA752EB7a51';

const Swap: React.FC = () => {
  const { account } = useWallet();
  const basisCash = useBasisCash();
  const micStats = useCashStats();
  const taxStats = useTaxStats();

  const mic2Balance = useTokenBalance(basisCash.MIC2);
  const usdtBalance = useTokenBalance(basisCash.USDT);
  const one = '1';
  const square = '2';
  var PRICE = '';
  var PRICEMIC;
  var fee1;

  const [usdtVal, setUsdtVal] = useState('')
  const [mic2Val, setMic2Val] = useState('')
  
  
  const handleUsdtChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setUsdtVal(e.currentTarget.value);
    let usdtVal = e.currentTarget.value;
    if(usdtVal == '') usdtVal = '0';
    if (basisCash && micStats) {
      setMic2Val( (parseFloat(usdtVal) / parseFloat(micStats.priceInUSDT) ).toString());
      PRICEMIC = parseFloat(micStats.priceInUSDT);
       //PRICE = micStats.priceInUSDT;
    }
    else{
      setMic2Val('0')
    }
  }, [basisCash,micStats, setMic2Val, setUsdtVal])

  const handleMic2Change = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setMic2Val(e.currentTarget.value);
    let mic2Val = e.currentTarget.value;
    if(mic2Val == '') mic2Val = '0';
    if (basisCash && micStats) {
      setUsdtVal( (parseFloat(micStats.priceInUSDT) * parseFloat(mic2Val)).toString());
      PRICEMIC = parseFloat(micStats.priceInUSDT);
    }
    else{
      setUsdtVal('0')
    }
  }, [basisCash,micStats, setMic2Val, setUsdtVal])

  const mic2FullBalance = useMemo(() => {
    return getDisplayBalance(mic2Balance, 18, 6)
  }, [mic2Balance])

  const usdtFullBalance = useMemo(() => {
    return getDisplayBalance(usdtBalance, 6, 6)
  }, [usdtBalance])

  const handleSelectMic2Max = useCallback(() => {
    setMic2Val(mic2FullBalance)
    if (basisCash && micStats) {
      setUsdtVal( (parseFloat(micStats.priceInUSDT) * parseFloat(mic2FullBalance)).toString());
    }
    else{
      setUsdtVal('0')
    }
  }, [mic2FullBalance, basisCash,micStats, setMic2Val, setUsdtVal])

  const [mic2ApproveStatus, approveMic2] = useApprove(basisCash.MIC2, basisCash.curvDepositor.address);

  const depositReady = useMemo(() => {
    return mic2ApproveStatus === ApprovalState.APPROVED
    &&  mic2Val !== ''
    && mic2Val !== '0'
  }, [mic2ApproveStatus, mic2Val, usdtVal]);

  if (basisCash && micStats && taxStats){
    PRICEMIC = parseFloat(micStats.priceInUSDT);
    fee1 = parseFloat(taxStats.tax);
 }
 
  const fee3 = fee1 / 1000000000000000000000000000000000000;
  const fee =  parseInt(one) - (PRICEMIC * PRICEMIC);
  const USDTrec = (parseInt(mic2Val) * ((1-fee3) * PRICEMIC)); 
  PRICE = USDTrec.toString();
  if (PRICE == 'NaN') PRICE = '0';
  var USDTrec1 = parseFloat(PRICE);
  const fee2 = fee1 / 10000000000000000000000000000000000;
 
  
  const { onSwap } = useCurvSwap();

  return (
    <Page>
      {!!account ? (
        <Card>
          
          <CardTitle>Sell MIC</CardTitle>
          
          <TokenSwap
            max={mic2FullBalance}
            pricemic={PRICEMIC}
            USDT={USDTrec1.toFixed(3)}
            TAX={fee2.toFixed(3)}
            symbol='MIC'
            onChange={handleMic2Change}
            onSelectMax={handleSelectMic2Max}
            value={mic2Val} />

          {mic2ApproveStatus !== ApprovalState.APPROVED && (
            <ButtonWrapper>
              <Button text='Approve MIC' onClick={approveMic2} />
            </ButtonWrapper>
          )}

          <ButtonWrapper>
            <Button text='Sell MIC' disabled={!depositReady} onClick={() => onSwap(mic2Val, usdtVal)} />
          </ButtonWrapper>
          <Link href="https://crv.finance/swap">Buy MIC on crv.finance</Link>
          {/* <StyledFootTitle>Once exited, click  <a href="https://mith.cash/migration">here</a>  to migrate your LP to the V2 Curve Pool</StyledFootTitle> */}
        </Card>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Link = styled.a`
  padding-top: ${props => props.theme.spacing[4]}px;
  color: white;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #426687;
  border-radius: 20px;
  padding: ${props => props.theme.spacing[4]}px;
`

const CardTitle = styled.div`
  color: white;
  font-size: 22px;
  font-weight: 700;
`

const ButtonWrapper = styled.div`
  padding-top: ${props => props.theme.spacing[4]}px;
`

export default Swap;
