import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setQty, removeItem } from '../../actions';

const CartItem = ({ id, name, price, quantity, stock, imageSrc }) => {
  const COLORS = useSelector((state) => state.designSetting);
  const dispatch = useDispatch();
  let amount = quantity;

  // Styled components:

  return (
    <StyledDiv COLORS={COLORS}>
      <img src={imageSrc} alt="item" />
      <InfoDiv>
        <Title>
          <StyledLink to={`/product/${id}`}>{name}</StyledLink>
          <StyledButton
            onClick={() => {
              dispatch(removeItem(id));
            }}
            COLORS={COLORS}
          >
            X
          </StyledButton>
        </Title>
        <p>
          <QtyField>
            <span style={{ gridArea: 'qty' }}>Quantity:</span>{' '}
            <span
              style={{
                gridArea: 'num',
                fontSize: '2em',
                textAlign: 'center',
              }}
            >
              {amount}
            </span>
            <StyledButton
              style={{ gridArea: 'more', position: 'relative', top: 14 }}
              onClick={() => {
                //stops increasing beyond stock levels (Maxspan appears when at max)
                if (amount < stock) {
                  amount++;
                  dispatch(setQty(id, amount));
                }
              }}
              COLORS={COLORS}
            >
              ▲
            </StyledButton>
            <StyledButton
              style={{ gridArea: 'less', position: 'relative', top: 14 }}
              onClick={() => {
                //stops decreasing below 1
                if (amount > 0) {
                  amount--;
                  dispatch(setQty(id, amount));
                }
              }}
              COLORS={COLORS}
            >
              ▼
            </StyledButton>
          </QtyField>
          <MaxSpan
            style={{ visibility: amount === stock ? 'visible' : 'hidden' }}
          >
            max
          </MaxSpan>
        </p>
        <p>@ {price}</p>
      </InfoDiv>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 0.25rem 0;
  padding: 0.5rem;
  border: 1px solid gray;
  background: ${(props) => props.COLORS.background};
  font-size: 0.65rem;
  img {
    max-height: 3rem;
    max-width: 3rem;
    margin-right: 0.5rem;
    @media (max-width: 776px) {
      display: none;
    }
    @media (max-width: 400px) {
      display: initial;
    }
  }
`;
const InfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    font-weight: bold;
    margin-right: 0.5rem;
    text-decoration: underline;
  }
`;
const Title = styled.p`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid gray;
  font-size: 0.7rem;
`;
const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
//need to make some standardized button css or component
const StyledButton = styled.button`
  border-radius: 50%;
  height: 0.8rem;
  width: 0.8rem;
  margin-right: 0.1rem;
  font-size: 0.4rem;
  font-weight: bold;
  background: ${(props) => props.COLORS.filter};
  border: none;
  color: ${(props) => props.COLORS.background};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`;
const QtyField = styled.div`
  display: grid;
  grid-template-areas:
    'qty more'
    'num less';
`;
//if keeping; alter so does not push "quantity" over on appearance
const MaxSpan = styled.span`
  font-size: 0.5rem;
  text-decoration: none;
  color: maroon;
`;

export default CartItem;
