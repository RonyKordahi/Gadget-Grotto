// Function will run when the Item Details page is opened, to ensure the correct item is displayed:
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProductDetailsFromFetch,
  updateDetailLoadStatus,
} from '../../../actions';

function FetchItemDetails(productId) {
  const dispatch = useDispatch();

  // On initial load, we'll bring in the featured and sale items...
  fetch(`/product/${productId}`)
    .then((res) => {
      return res.json();
    })
    .then((item) => {
      dispatch(setProductDetailsFromFetch(item));
      // ... then stop this process by setting the load status to 'complete' (this runs an infinite loop otherwise!)
      dispatch(updateDetailLoadStatus('complete'));
    });
  return <></>;
}

export default FetchItemDetails;
