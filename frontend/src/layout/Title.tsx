import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Title.module.scss';
import SearchIcon from './../assets/svg/SearchIcon.svg';
import { Category } from '../components/types/interfaces';

function Title(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.text.toLowerCase().startsWith(searchQuery.toLowerCase()));
  }, [categories, searchQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`);
    }
  };

  const handleCategorySelect = (categoryText: string) => {
    setSearchQuery(categoryText);
    setShowDropdown(false);
    handleSearch(categoryText);
  };

  const handleSearchClick = () => {
    handleSearch(searchQuery);
  };

  return (
    <div className={styles.titleContainer}>
      <h1 className={styles.title}>
        Find Home <span>Service/Repair</span> Near You
      </h1>
      <p className={styles.subtitle}>Explore Best Home Service & Repair near you</p>
      <div className={styles.searchField}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <img className={styles.searchIcon} src={SearchIcon} alt="search" onClick={handleSearchClick} />
        {showDropdown && filteredCategories.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredCategories.map((category) => (
              <li key={category._id} onClick={() => handleCategorySelect(category.text)}>
                <img src={category.source} alt={category.text} className={styles.categoryIcon} />
                <span>{category.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Title;
