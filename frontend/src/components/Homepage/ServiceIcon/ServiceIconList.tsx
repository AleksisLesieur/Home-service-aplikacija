import ServiceIcon from './ServiceIcon';
import { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceIconData } from '../../types/interfaces';

function ServiceIconList(): React.ReactElement {
  // const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = !location.pathname.includes('/search');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1100);
  const [categories, setCategories] = useState<ServiceIconData[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (e) {
        console.error('There was a problem fetching the categories:', e);
      }
    };

    fetchCategories();
  }, []);

  const handleIconClick = (text: string) => {
    navigate(`/search/${text}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles: CSSProperties = isSearchPage
    ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1em',
      }
    : {};

  return (
    <div style={styles}>
      {categories.map((icon) => (
        <ServiceIcon key={icon.text} source={icon.source} text={icon.text} onClick={() => handleIconClick(icon.text)} />
      ))}
    </div>
  );
}

export default ServiceIconList;
