import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './BusinessPage.module.scss';
import { BusinessCardProps } from './BusinessCard';
import BookingModal from '../../common/BookingModal';

function BusinessPage(): React.ReactElement {
  const location = useLocation();
  const { source, alt, service, title, name, address, btnText } = location.state as BusinessCardProps;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.businessPage}>
      <h1>{name}</h1>
      <img src={source} alt={alt} />
      <p>Service: {service}</p>
      <p>Title: {title}</p>
      <p>Address: {address}</p>
      <p>Button Text: {btnText}</p>
      <button onClick={openModal}>Book a Service</button>
      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default BusinessPage;
