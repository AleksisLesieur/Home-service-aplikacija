import ServiceIconList from '../Homepage/ServiceIcon/ServiceIconList';
import BusinessCardList from '../Homepage/BusinessCard/BusinessCardList';
import styles from './SearchResult.module.scss';
import { useLocation } from 'react-router-dom';

function SearchResult(): React.ReactElement {
  const location = useLocation();

  const service = location.pathname.split('/').pop() || '';

  return (
    <div className={styles.searchResult}>
      <div className={styles.titles}>
        <div className={styles.mainTitle}>Categories</div>
        <div className={styles.serviceTitle}>{service}</div>
      </div>
      <div className={styles.container}>
        <div className={styles.service}>
          <ServiceIconList />
        </div>
        <div className={styles.businessCards}>
          <BusinessCardList service={service} />
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
