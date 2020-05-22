import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchResults, setDisplayItems } from '../../actions';
import styled from 'styled-components';
import SearchBar from '../../components/SearchBar';
import ItemDisplay from '../../components/ItemDisplay';

const SearchResults = () => {
  let displayItems = useSelector((state) => state.filters.displayItems);
  const COLORS = useSelector((state) => state.designSetting);
  const { searchTerm } = useParams();
  const [returnValues, setReturnValues] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`/products/search/${searchTerm}`)
      .then((res) => res.json())
      .then((res) => {
        setReturnValues(res);
      });
  }, [searchTerm]);
  useEffect(() => {
    dispatch(searchResults(returnValues));
    dispatch(setDisplayItems(returnValues));
  }, [returnValues]);

  return (
    <>
      <SearchBar />
      <Text COLORS={COLORS}>Results for "{searchTerm}"</Text>
      {displayItems && <ItemDisplay />}
    </>
  );
};

const Text = styled.h2`
  color: ${(props) => props.COLORS.header};
  margin-left: 5px;
`;

export default SearchResults;
