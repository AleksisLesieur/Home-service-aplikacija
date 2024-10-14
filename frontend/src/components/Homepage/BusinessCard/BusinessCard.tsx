import React, { useState } from 'react';
import styles from './BusinessCard.module.scss';
import { useNavigate } from 'react-router-dom';
import BookingModal from '../../common/BookingModal';

function BusinessCard({ source, alt, service, title, name, address, btnText }: BusinessCardProps): React.ReactElement {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation(); // Stop the event from bubbling up to the parent div
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleBusinessClick() {
    navigate('/business', {
      state: { source, alt, service, title, name, address, btnText },
    });
  }

  return (
    <>
      <div onClick={handleBusinessClick} className={styles.icon}>
        <img className={styles.images} src={source} alt={alt} />
        <div className={styles.infoContainer}>
          <div className={styles.service}>{service}</div>
          <div className={styles.title}>{title}</div>
          <div className={styles.name}>{name}</div>
          <div className={styles.address}>{address}</div>
          <button onClick={handleButtonClick} className={styles.btn}>
            {btnText}
          </button>
        </div>
      </div>
      <BookingModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default BusinessCard;
