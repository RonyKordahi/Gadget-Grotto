import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Spinner from '../Spinner';
import { 
  submitOrder, 
  submitOrderError, 
  submitOrderSuccess, 
  } from '../../actions';

//styles for the modal elements(neccessary for material-ui modal)
const useStyles = makeStyles({
  text: {
    margin:'.5rem',
  },
});

const ModalForm = ({ cartItems, total }) => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.cartItems.status);
  const COLORS = useSelector((state) => state.designSetting);

//storing form inputs onChange to be sent in fetch
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [creditCard, setCreditCard] = React.useState('');
  const [expiration, setExpiration] = React.useState('');

  const submitPurchase = (ev) => {
    ev.preventDefault();
  //sets status to 'submitting-order', which replaces form with spinner
    dispatch(submitOrder()); 
  //order object to be sent with POST to purchasing endpoint
    const order = {
      cartItems,
      'user': {
        name,
        address,
        email,
      },
      'payment': {
        creditCard, 
        expiration,
      },
      'total': total,
    }
    fetch('/purchase', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept" : "application/json"
      },
      body:JSON.stringify({order})
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 200) {
        let confirmId = res.confirmation
        //redirects page to order confirmation page
        window.location.href = `/order-confirm/${confirmId}`;
        //changes status to 'purchased', which closes modal
        dispatch(submitOrderSuccess()); 
      } else {
        //changes status to 'error'; need to build in showing error on modal
        dispatch(submitOrderError()); 
      }
    }).catch((err) => {
      console.error('purchase error ', err);
      dispatch(submitOrderError());
    })
  };

// when order is being processed or successful, replaces form with spinner
  const classes=useStyles();
  return( (status === 'submitting-order' || status === 'purchased')? 
  <Spinner size={30} /> :
    <FormControl>
      <StyledForm COLORS={COLORS}
      onSubmit={(ev)=>submitPurchase(ev)}
      >
        <p>Enter user details</p>
        <TextField 
        className={classes.text} 
        required 
        id="name" 
        name='name' 
        label="Name" 
        variant="outlined"
        onChange={(ev)=> setName(ev.target.value)}
        />
        <TextField 
        className={classes.text} 
        required 
        id="address" 
        name='address' 
        label="Address" 
        variant="outlined"
        onChange={(ev)=> setAddress(ev.target.value)}
        />
        <TextField 
        className={classes.text} 
        required 
        id="email" 
        name='email'
        type='email' 
        label="email" 
        variant="outlined"
        onChange={(ev)=> setEmail(ev.target.value)}
        />
        <p>Enter payment details</p>
        <TextField 
        className={classes.text} 
        required 
        id="card-number" 
        name='card-number' 
        label="Credit card" 
        variant="outlined"
        onChange={(ev)=> setCreditCard(ev.target.value)}
        />
        <TextField 
        className={classes.text} 
        required 
        id="card-exp" 
        name='card-exp' 
        label="Expiration" 
        variant="outlined"
        onChange={(ev)=> setExpiration(ev.target.value)}
        />
        <Button 
        type='submit' 
        variant="contained" 
        color="secondary"
        >
          Purchase
        </Button>
      </StyledForm>
    </FormControl>
  )
};

const StyledForm = styled.form`
  margin: 0;
  background-color: lightgray;
  padding: 1rem;
  p {
    margin: .5rem .5rem 0 ;
  }
  Button {
    height: 2.5rem;
    margin: 1rem 1rem 1rem 80%;
    background-color: ${(props) => props.COLORS.addToCartPink};

  }
`;

export default ModalForm;
