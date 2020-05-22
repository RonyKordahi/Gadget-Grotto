import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const OrderSearch = () => {
  const COLORS = useSelector((state) => state.designSetting);
  const [orderNum, setOrderNum] = React.useState('');
  const history = useHistory();

  //function just redirects to OrderInfo page with new url params
  const submitHandle = (ev) => {
    ev.preventDefault();
    history.push(`/order-confirm/${orderNum}`);
  };

  return (
    <StyledDiv COLORS={COLORS}>
      <h3>Order Search</h3>
      Please input the id number for the order you wish to retrieve:
      <form
        onSubmit={(ev) => {
          submitHandle(ev);
        }}
      >
        <input
          type="text"
          required
          placeholder="#"
          onChange={(ev) => setOrderNum(ev.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  width: 90%;
  height: 90%;
  background: ${(props) => props.COLORS.background};
  box-shadow: 2px 5px 10px 0px #0b325e;
  border-radius: 5px;
  margin: 2.5% auto;
  padding: 1rem;
  h3 {
    margin-bottom: 1rem;
  }
  form {
    margin: 0.5rem 0;
  }
  input {
    border-radius: 5px;
  }
  button {
    border-radius: 5px;
    font-weight: bold;
    padding: 0.25rem 0.5rem;
    margin: 0 0.5rem;
    color: ${(props) => props.COLORS.background};
    background: ${(props) => props.COLORS.filter};
    border: none;
    &:hover {
      cursor: pointer;
    }
  }
`;

export default OrderSearch;
