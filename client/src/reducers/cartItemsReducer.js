// After some deliberation, I think it would be best for the items list to be an object; that way you can query it by name/id etc...
const initialState = {
  items: {},
  status: 'idle',
};
//statuses: idle, start-purchase, submitting-order, purchased

export default function cartItemsReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_ITEM_TO_CART": {
      let qty = 0;
      // clicking add to cart repeatedly increases qty:
      qty = state.items[action.item.id]
        ? (qty = state.items[action.item.id].quantity + 1)
        : (qty = 1);
      // make sure clicking add to cart cannot exceed product availability:
      if (
        state.items[action.item.id] && 
        qty >= state.items[action.item.id].numInStock
        )
        qty = state.items[action.item.id].numInStock;
      return {
        ...state,
        items: {
          ...state.items,
          [action.item.id]: {
          ...action.item,
          quantity: qty,
          },
        }
      };
    }
    case "SET_QUANTITY": {
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: {
          ...state.items[action.id],
          quantity: action.amt,
          },
        }
        
      };
    }
    case "REMOVE_ITEM": {
      // We cannot alter the state directly; instead we must always return a new state, based on a copy we make of the original:
      let stateCopy = { ...state, items:{...state.items} };
      delete stateCopy.items[action.id];
      return stateCopy;
    }
    case "CLEAR_CART": {
      return {...initialState};
    }
    ///statuses
    case 'START-PURCHASE-PROCESS': {
      return {
        ...state,
        status: 'start-purchase',
      };
    }
      
    case 'SUBMIT-ORDER':
    return {
      ...state,
      status: 'submitting-order',
    };
      case 'SUBMIT-ORDER-ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
      };
      case 'SUBMIT-ORDER-SUCCESS':
      return {
        ...initialState,
        status: 'purchased',
      };
      case 'CLEAR-PURCHASE':
      return {
        ...state,
        status: 'idle',
      };
    default: {
      return state;
    }
  }
}
