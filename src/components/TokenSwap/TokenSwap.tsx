import React from 'react'
import styled from 'styled-components'

import Button from '../Button'
import Input, { InputProps } from '../Input'


interface TokenSwapProps extends InputProps {
  max: number | string,
  pricemic: number | string,
  USDT: number | string,
  TAX: number | string,
  symbol: string,
  onSelectMax?: () => void,
}

const TokenSwap: React.FC<TokenSwapProps> = ({
  max,
  pricemic,
  USDT,
  TAX,
  symbol,
  onChange,
  onSelectMax,
  value,
}) => {
  return (
    <StyledTokenSwap>
      <StyledMaxTexts>
        <StyledMaxText>{symbol} Available</StyledMaxText>
        <StyledMaxText>{max.toLocaleString()}</StyledMaxText>
        {/* <StyledMaxText>test</StyledMaxText> */}
      </StyledMaxTexts>
      
      <Input
        startAdornment={(<StyledTokenSymbol>{symbol}</StyledTokenSymbol>)}
        endAdornment={(
          <StyledTokenAdornmentWrapper>
            <div>
            <Button size="sm" text="Max" onClick={onSelectMax} />
            </div>
          </StyledTokenAdornmentWrapper>
        )}
        onChange={onChange}
        placeholder="0"
        value={value}/>
        <StyledMaxTexts>
      <StyledMaxText></StyledMaxText>
      </StyledMaxTexts>
      <StyledMaxTexts>
      <StyledMaxText>Estimated USDT recieved: ${USDT}  </StyledMaxText>
      </StyledMaxTexts>
      <StyledMaxTexts>
      <StyledMaxText>Current MIC Price: ${pricemic}  </StyledMaxText>
      </StyledMaxTexts>
      <StyledMaxTexts>
      <StyledMaxText>Tax at Current Price: {TAX}%  </StyledMaxText>
      </StyledMaxTexts>
    </StyledTokenSwap>
  )
}

const StyledTokenSwap = styled.div`

`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-left: ${props => props.theme.spacing[3]}px;
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

const StyledTokenSymbol = styled.span`
  font-weight: 700;
`

export default TokenSwap
