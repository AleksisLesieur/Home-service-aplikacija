import React from 'react';
import stylesSearch from './ServiceIconSearch.module.scss';
import stylesHome from './ServiceIconHome.module.scss';
import { ServiceIconProps } from '../../types/interfaces';

function ServiceIcon({ source, text, onClick }: ServiceIconProps): React.ReactElement {
  const isSearchPage = window.location.href.includes('/search');

  const currentRoute = window.location.href.split('/').pop();

  const applyBG = currentRoute === text;

  const styles = isSearchPage ? stylesSearch : stylesHome;

  return (
    <div onClick={onClick} className={`${styles.icon} ${applyBG ? styles.active : ''}`}>
      <img src={source} width={'48px'} height={'48px'} alt={text} />
      <span>{text}</span>
    </div>
  );
}

export default ServiceIcon;
