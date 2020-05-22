import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Spinner from '../Spinner';
import OrderSearch from './OrderSearch';
import { clearPurchase } from '../../actions';

const OrderInfo = () => {
  const { confirmId } = useParams();
  const dispatch = useDispatch();
  const COLORS = useSelector((state) => state.designSetting);
  const [orderInfo, setOrderInfo] = React.useState(null);

  //fetches order info and stores it in state to be used for rendering
  React.useEffect(() => {
    //stops fetch if just order search page
    if (confirmId !== 'search')
      fetch(`/history/${confirmId}`)
        .then((data) => data.json())
        .then((data) => {
          setOrderInfo(data.order);
          dispatch(clearPurchase());
        })
        .catch((err) => {
          console.error('Caught error orderinfo: ', err);
        });
  }, [confirmId]);

  //if this page is rendered from the order history link; just return search input
  if (confirmId === 'search') {
    return <OrderSearch />;
  } else {
    return orderInfo ? (
      <StyledDiv COLORS={COLORS}>
        <h2>Order # {confirmId}</h2>
        {orderInfo.cartItems.map((item) => {
          return (
            <ItemCard key={item.id} COLORS={COLORS}>
              <img src={item.imageSrc} alt="item" />
              <InfoDiv>
                <Title>
                  <StyledLink to={`/product/${item.id}`}>
                    {item.name}
                  </StyledLink>
                </Title>
                <p>
                  Quantity: <span>{item.quantity}</span> @ {item.price}
                </p>
              </InfoDiv>
            </ItemCard>
          );
        })}
        <UserInfo>
          <p>
            Name:<span>{orderInfo.user.name}</span>
          </p>
          <p>
            Address:<span>{orderInfo.user.address}</span>
          </p>
          <p>
            Email:<span>{orderInfo.user.email}</span>
          </p>
          <p>
            Total:<span>${orderInfo.total}</span>
          </p>
        </UserInfo>
      </StyledDiv>
    ) : (
      <Spinner size={40} />
    );
  }
};

const StyledDiv = styled.div`
  width: 90%;
  height: 90%;
  background: ${(props) => props.COLORS.background};
  box-shadow: 2px 5px 10px 0px ${(props) => props.COLORS.header};
  border-radius: 5px;
  margin: 2.5% auto;
  padding: 1rem;
`;

const UserInfo = styled.div`
  margin: 1.5rem 0;
  span {
    font-weight: bold;
    margin: 0 0.5rem;
  }
  p {
    margin: 0.5rem 0;
  }
`;
const ItemCard = styled.div`
  display: flex;
  align-items: center;
  margin: .25rem 0;
  padding: .5rem;
  border-bottom: 1px solid gray;
  background: white;
  font-size: .65rem;
  img {
    max-height: 3rem;
    max-width: 3rem;
    margin-right: 0.5rem;
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

export default OrderInfo;
