const initialState = { 
  baseItems: [], 
  displayItems: [], 
  sortOption: { type: 'none', elv: 'none' },
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    // All relevant items post search/category
    case 'SET_SEARCH_RESULTS': {
      return { 
        ...state, 
        baseItems: action.products, 
      };
    }
    // Items to display (after filters for example)
    case 'SET_DISPLAY_ITEMS': {
      return { ...state, displayItems: action.products };
    }
    case 'FILTER_ITEMS': {
      if (state.baseItems) {
        // filter out which values are 'true' from the action.filters object.
        // For category
        const categoryFilter = Object.keys(action.filters.category).filter(
          (filter) => {
            //if filter is set to 'All', disregard the 'All' key
            return action.filters.category[(filter!=='All')? filter: ''];
          }
        );
        // For body location
        const bodyFilter = Object.keys(action.filters.bodyLocation).filter(
          (filter) => {
            return action.filters.bodyLocation[filter];
          }
        );
        // For price
        const priceFilter = Object.keys(action.filters.price).filter(
          (filter) => {
            return action.filters.price[filter];
          }
        );

        let initialItems = [...state.baseItems];
        //function to filter by selected price ranges
        const priceFiltering = (initialItems) => {
        if(priceFilter.length) {
          let newPricedItems = initialItems.filter((item) => {
            let numPrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return (
            ( ( priceFilter.includes('$0 - $25') ) ? ( 0 < numPrice && numPrice <= 20 ): false)  ||
            ( ( priceFilter.includes('$25 - $50') ) ? ( 20 < numPrice && numPrice <= 50 ): false)  ||
            ( ( priceFilter.includes('$50 - $100') ) ? ( 50 < numPrice && numPrice <= 100 ): false)  ||
            ( ( priceFilter.includes('$100 and up') ) ? ( 100 < numPrice ): false)  
            )
          });
          return newPricedItems;
          
        } else { return initialItems}
        };
        
        //due to increased combination complexity, opted to filter price first if applicable, then feed that result to the other filters.
        const filteredItems = (priceFiltering(initialItems)).filter((item) => {

          // If both we have filters on both conditions
          if (categoryFilter.length && bodyFilter.length) {
            return (
              item.category === categoryFilter[0] &&
              bodyFilter.includes(item.body_location)
            );
            // if we have conditions only on the category
          } else if (categoryFilter.length > 0 && !bodyFilter.length) {
            return item.category === categoryFilter[0];
            // if we have conditions only on the body location (multiple possible)
          } else if (!categoryFilter.length && bodyFilter.length) {
            return bodyFilter.includes(item.body_location);
            // #nofilter
          } else if (!categoryFilter.length 
            && !bodyFilter.length 
            ) {
            return true;
          }
        });
        // the console log is a placeholder for the values which we will put in state once we have a stable post-search state
        return { ...state, displayItems: filteredItems };
      }
      return state;
    }
    case 'SORT_ITEMS': {
      //value passed is stringified object {type: '.', elv: '.'}, must parse to use.
      const variable = JSON.parse(action.sortVar);
      
      if (variable.type === 'none' 
      || state.baseItems === null 
      || state.displayItems === null) {
        return {...state, sortOption: variable }
      };
      let sortedItems = [...state.displayItems];
      if (variable.type === 'price') 
        sortedItems = sortedItems.sort((a, b) => {
        //removes "$" , turns price string into number, then sorts
          return ( 
            parseFloat((b.price).replace(/[^\d.]/g, '')) - 
            parseFloat((a.price).replace(/[^\d.]/g, '')) )
        });
      //lower case to avoid uppercase chars messing result
      if (variable.type === 'name') {
        sortedItems = sortedItems.sort((a, b) => 
        ((a.name).toLowerCase() < (b.name).toLowerCase()) ? 1 : -1);
      };
    //default sorts are descending, simple reverse for ascending
      if (variable.elv === 'ascending') {
        sortedItems = sortedItems.reverse();
      } ;
      
      return { ...state, displayItems: sortedItems, sortOption: variable };
    }
    default: {
      return state;
    }
  }
}
