import React, { useState, useEffect } from 'react';
import BusinessCard from './BusinessCard';
import homeStyles from './BusinessCardListHome.module.scss';
import searchStyles from './BusinessCardListSearch.module.scss';
import { BusinessCardProps } from './BusinessCard';
import { useLocation } from 'react-router-dom';

function BusinessCardList({ service }: { service?: string }): React.ReactElement {
  const [businesses, setBusinesses] = useState<BusinessCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const styles = isLandingPage ? homeStyles : searchStyles;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('http://localhost:3000/businesses');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBusinesses(data);
        setIsLoading(false);
      } catch (e) {
        setError('Failed to fetch businesses');
        setIsLoading(false);
        console.error('There was a problem fetching the businesses:', e);
      }
    };

    fetchBusinesses();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredBusinesses = service
    ? businesses.filter((business) => business.service?.toLowerCase() === service.toLowerCase())
    : businesses;

  return (
    <>
      {isLandingPage && <div className={styles.disclaimer}>Popular businesses</div>}
      <div className={styles.businessCards}>
        {filteredBusinesses.map((business, index) => (
          <BusinessCard key={index} {...business} />
        ))}
      </div>
    </>
  );
}

export default BusinessCardList;
