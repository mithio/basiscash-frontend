import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import useBasisCash from '../../hooks/useBasisCash';
import useCashStats from '../../hooks/useCashStats';
import useTaxStats from '../../hooks/useTaxStats';
import TokenInput from '../../components/TokenInput';
import useTokenBalance from '../../hooks/useTokenBalance';
import Button from '../../components/Button';
import { getDisplayBalance } from '../../utils/formatBalance';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import { useWallet } from 'use-wallet';
import useCurvDeposit from '../../hooks/useCurvDeposit';

const CurvPool: React.FC = () => {
  const { account } = useWallet();

  const basisCash = useBasisCash();
  const micStats = useCashStats();
  const taxStats = useTaxStats();
  var PRICEMIC; 
  var fee1;

  const mic2Balance = useTokenBalance(basisCash.MIC2);
  const usdtBalance = useTokenBalance(basisCash.USDT);

  const [mic2Val, setMic2Val] = useState('')
  const handleMic2Change = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setMic2Val(e.currentTarget.value)
  }, [setMic2Val])

  const [usdtVal, setUsdtVal] = useState('')
  const handleUsdtChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setUsdtVal(e.currentTarget.value)
  }, [setUsdtVal])

  const mic2FullBalance = useMemo(() => {
    return getDisplayBalance(mic2Balance, 18, 6)
  }, [mic2Balance])

  const usdtFullBalance = useMemo(() => {
    return getDisplayBalance(usdtBalance, 6, 6)
  }, [usdtBalance])

  const handleSelectMic2Max = useCallback(() => {
    setMic2Val(mic2FullBalance)
  }, [mic2FullBalance, setMic2Val])

  const handleSelectUsdtMax = useCallback(() => {
    setUsdtVal(usdtFullBalance)
  }, [usdtFullBalance, setUsdtVal])

  const [mic2ApproveStatus1, approveMic2] = useApprove(basisCash.MIC2, basisCash.contracts['ProxyCurve'].address);
  const [usdtApproveStatus1, approveUsdt] = useApprove(basisCash.USDT, basisCash.contracts['ProxyCurve'].address);

  const depositReady = useMemo(() => {
    return mic2ApproveStatus1 === ApprovalState.APPROVED // todo
     // && usdtApproveStatus1 === ApprovalState.APPROVED
      && mic2Val !== ''
      && mic2Val !== '0'
     // && usdtVal !== ''
  }, [mic2ApproveStatus1, usdtApproveStatus1, mic2Val, usdtVal]);

  if (basisCash && micStats && taxStats){
    PRICEMIC = parseFloat(micStats.priceInUSDT);
    fee1 = parseFloat(taxStats.tax);
 }
 const fee =  (1 - (PRICEMIC * PRICEMIC))*100;
  
 const fee2 = fee1 / 10000000000000000000000000000000000;
 
 //const fee2 = fee1;
 

 //const fee2 = getDisplayBalance(fee1, 18);
 
 

  const { onDeposit } = useCurvDeposit();

  return (
    <Page>
      {!!account ? (
        <Card>
          <CardTitle>Add MIC Liqudity</CardTitle>
          <TokenInput
            max={mic2FullBalance}
            symbol='MIC'
            onChange={handleMic2Change}
            onSelectMax={handleSelectMic2Max}
            value={mic2Val} />
          {/* <TokenInput */}
            {/* max={usdtFullBalance} */}
            {/* symbol='USDT' */}
            {/* onChange={handleUsdtChange} */}
            {/* onSelectMax={handleSelectUsdtMax} */}
            {/* value={usdtVal} /> */}

      <StyledMaxTexts>
      <StyledMaxText></StyledMaxText>
      </StyledMaxTexts>
      <StyledMaxTexts>
      <StyledMaxText>Note: Adding single-sided MIC Liquditiy will</StyledMaxText>
      </StyledMaxTexts>
      <StyledMaxTexts>
      <StyledMaxText> incur a tax equvialent to selling MIC.</StyledMaxText>
      </StyledMaxTexts>
      <StyledMaxTexts>
      <StyledMaxText>Tax at Current Price: {fee2.toFixed(3)}%  </StyledMaxText>
      </StyledMaxTexts>


          {mic2ApproveStatus1 !== ApprovalState.APPROVED && (
            <ButtonWrapper>
              <Button text='Approve MIC' onClick={approveMic2} />
            </ButtonWrapper>
          )}
          {/* {usdtApproveStatus1 !== ApprovalState.APPROVED && ( */}
            {/* //<ButtonWrapper> */}
              {/* //<Button text='Approve USDT' onClick={approveUsdt} /> */}
            {/* //</ButtonWrapper> */}
          {/* )} */}
          <ButtonWrapper>
            <Button text='Add Liquidity' disabled={!depositReady} onClick={() => onDeposit(mic2Val, usdtVal)} /> 
            {/* <Button text='Add Liquidity' onClick={() => onDeposit(mic2Val, usdtVal)} /> */}
          </ButtonWrapper>

          


          <Link href="https://crv.finance/liquidity" target={"_blank"} rel={"noopener noreferrer"}>Add Stablecoin Liquidity on crv.finance</Link>
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

const StyledMaxTexts = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${props => props.theme.color.white};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 30px;
  justify-content: flex-end;
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

export default CurvPool;
