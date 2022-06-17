import { useContext, useEffect, useState } from 'react';

import Sort from '../components/Sort';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';

function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { searchValue } = useContext(SearchContext);

  const [catigoryId, setCatigoryId] = useState(0);
  const [sortType, setSortType] = useState({ name: 'популярности', sortProperty: 'rating' });

  useEffect(() => {
    setIsLoading(true);

    const category = catigoryId > 0 ? `category=${catigoryId}` : '';
    const search = searchValue > 0 ? `search=${searchValue}` : '';
    const sortBy = sortType.sortProperty;

    fetch(
      `https://62a7355997b6156bff8a2c29.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=desc&${search}`,
    )
      .then((res) => res.json())
      .then((json) => {
        setItems(json);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [catigoryId, sortType, searchValue, currentPage]);

  const sceletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);
  const pizzas = items
    .filter((obj) => {
      return obj.title.toLowerCase().includes(searchValue.toLowerCase());
    })
    .map((obj) => <PizzaBlock key={obj.id} {...obj} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={catigoryId} onClickCataegory={(id) => setCatigoryId(id)} />
        <Sort value={sortType} onChangeSort={(id) => setSortType(id)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? sceletons : pizzas}</div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  );
}

export default Home;
