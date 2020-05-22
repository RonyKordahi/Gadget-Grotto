import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { filterItems, sortItems } from '../../actions';
import { FaFilter } from 'react-icons/fa';
import ChangeDesignButton from '../ChangeDesignButton';

import ItemSorter from '../ItemSorter';

const FilterBar = () => {
  const COLORS = useSelector((state) => state.designSetting);
  const baseItems = useSelector((state) => state.filters.baseItems);
  const sortOption = useSelector((state) => state.filters.sortOption);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    bodyLocation: {
      Wrist: false,
      Arms: false,
      Head: false,
      Waist: false,
      Chest: false,
      Hands: false,
      Neck: false,
      Feet: false,
      Torso: false,
    },
    category: {
      All: true,
      Fitness: false,
      Medical: false,
      Lifestyle: false,
      Entertainment: false,
      Industrial: false,
      PetsAndAnimals: false,
      Gaming: false,
    },
    price: {
      '$0 - $25': false,
      '$25 - $50': false,
      '$50 - $100': false,
      '$100 and up': false,
    },
  });
  // useEffect to dispatch whenever any value of the filters change
  useEffect(() => {
    dispatch(filterItems(filter));
    dispatch( sortItems(JSON.stringify(sortOption)) );
  }, [filter]);

  useEffect(() => {
    setFilter({
      bodyLocation: {
        Wrist: false,
        Arms: false,
        Head: false,
        Waist: false,
        Chest: false,
        Hands: false,
        Neck: false,
        Feet: false,
        Torso: false,
      },
      category: {
        All: true,
        Fitness: false,
        Medical: false,
        Lifestyle: false,
        Entertainment: false,
        Industrial: false,
        PetsAndAnimals: false,
        Gaming: false,
      },
      price: {
        '$0 - $25': false,
        '$25 - $50': false,
        '$50 - $100': false,
        '$100 and up': false,
      },
    });
    
  }, [baseItems]);

  // function to handle radio button (category) filters
  const handleRadio = (e, origin) => {
    const key = e.target.value;
    if (key === 'All') {
      setFilter({
        ...filter,
        category: { ...categoryDefault },
      });
      return;
    }
    setFilter({
      ...filter,
      category: {
        ...categoryDefault,
        [key]: e.target.checked,
        All: false,
      },
    });
    return;
  };
  // function to handle checkboxes (body location) filters
  const handleBodyCheckbox = (e) => {
    const key = e.target.name;
    setFilter({
      ...filter,
      bodyLocation: {
        ...filter['bodyLocation'],
        [key]: !filter['bodyLocation'][key],
      },
    });
    return;
  };
  const handlePriceCheckbox = (e) => {
    const key = e.target.name;
    setFilter({
      ...filter,
      price: {
        ...filter['price'],
        [key]: !filter['price'][key],
      },
    });
    return;
  };

  // reset for categories
  const categoryDefault = {
    All: true,
    Fitness: false,
    Medical: false,
    Lifestyle: false,
    Entertainment: false,
    Industrial: false,
    PetsAndAnimals: false,
    Gaming: false,
  };

  // these states are just used to toggle the filter collapsibles
  const [catdrop, setCatdrop] = React.useState(false);
  const [locdrop, setLocdrop] = React.useState(false);
  const [pridrop, setPridrop] = React.useState(false);

  return (
    <StyledDiv COLORS={COLORS}>
      <Sorters>
        <ItemSorter />
        <ToggleSvg>
          <FaFilter />
        </ToggleSvg>
        <p>
          <button onClick={() => setCatdrop(!catdrop)}>
            {catdrop ? '⮟' : '⮞'}
          </button>
          Category
        </p>
        <StyledUl
          style={{
            maxHeight: catdrop ? 'fit-content' : 0,
            border: catdrop ? '1px solid black' : 0,
          }}
          COLORS={COLORS}
        >
          {Object.keys(filter.category).map((location) => {
            const origin = 'category';
            return (
              <li>
                <input
                  type={'radio'}
                  name={`${location}`}
                  id={`${location}`}
                  value={location}
                  onChange={(e) => handleRadio(e, origin)}
                  checked={filter.category[location]}
                ></input>
                <label for={`${location}`}>{location}</label>
              </li>
            );
          })}
        </StyledUl>
        <p>
          <button onClick={() => setLocdrop(!locdrop)}>
            {locdrop ? '⮟' : '⮞'}
          </button>
          Body Location
        </p>
        <StyledUl
          style={{
            maxHeight: locdrop ? 'fit-content' : 0,
            border: locdrop ? '1px solid black' : 0,
          }}
          COLORS={COLORS}
        >
          {Object.keys(filter.bodyLocation).map((location) => {
            return (
              <li key={Math.random() * 10000000}>
                <input
                  type={'checkbox'}
                  name={`${location}`}
                  id={`${location}`}
                  onChange={handleBodyCheckbox}
                  checked={filter['bodyLocation'][location]}
                ></input>
                <label for={`${location}`}>{location}</label>
              </li>
            );
          })}
        </StyledUl>
        <p>
          <button onClick={() => setPridrop(!pridrop)}>
            {pridrop ? '⮟' : '⮞'}
          </button>
          Price
        </p>
        <StyledUl
          style={{ maxHeight: pridrop ? 'fit-content' : 0 }}
          COLORS={COLORS}
        >
          {Object.keys(filter.price).map((range) => {
            return (
              <li key={Math.random() * 10000000}>
                <input
                  type={'checkbox'}
                  name={`${range}`}
                  id={`${range}`}
                  onChange={handlePriceCheckbox}
                  checked={filter['price'][range]}
                ></input>
                <label for={`${range}`}>{range}</label>
              </li>
            );
          })}
        </StyledUl>
      </Sorters>
      <ChangeDesignButton className='styles' style={{ gridArea: 'styles' }} />
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  font-size: 0.75rem;
  padding: 0.25rem;
  min-width: 128px;
  p {
    font-weight: bold;
    font-size: 0.85rem;
    color: ${(props) => props.COLORS.background};
    margin: 0.75rem 0 0.25rem;
  }
  button {
    background: none;
    border: none;
  }
  @media (max-width: 540px) {
    height: auto;
    display: grid;
    grid-template-areas:
      'sorters'
      'styles';
  }
  @media (max-width: 390px) {
    flex-direction: column;
  }
`;
const ToggleSvg = styled.div`
  @media (max-width: 540px) {
    display: none;
  }
`;

const Sorters = styled.div`
  @media (max-width: 540px) {
    display: flex;
    grid-area: sorters;
  }
  @media (max-width: 390px) {
    flex-direction: column;
  }
`;

const StyledUl = styled.ul`
  overflow: hidden;
  width: 90%;
  min-width: fit-content;
  margin: 0 auto;
  background: ${(props) => props.COLORS.background};
  border-radius: 5px;
  @media (max-width: 540px) {
    position: relative;
    right: 72px;
    top: 56px;
    z-index: 2;
    min-width: 0px;
  }
`;

// ⯈ ⮞ ⮚
// ⯆ ⮟ ⮛

export default FilterBar;
