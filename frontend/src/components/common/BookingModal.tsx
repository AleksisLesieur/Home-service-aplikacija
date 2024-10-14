import React, { useState, useEffect, useRef } from 'react';
import styles from './BookingModal.module.scss';
import { ModalProps, BookingModalProps, ServiceIconData } from '../types/interfaces';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
      }, 1000); // Match this to your transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`}>
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            ×
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, serviceIcons }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<ServiceIconData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      setUserData(userData.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again.');
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setError(null); // Clear any previous errors
  };
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setError(null); // Clear any previous errors
  };

  const handleServiceSelect = (service: ServiceIconData) => {
    setSelectedService(service);
    setError(null); // Clear any previous errors
  };

  const handleBookService = async () => {
    console.log('Booking attempt:', { selectedDate, selectedTime, selectedService, isLoggedIn });

    if (!isLoggedIn) {
      setError('Please log in to book a service.');
      return;
    }

    if (!selectedDate) {
      setError('Please select a date.');
      return;
    }

    if (!selectedTime) {
      setError('Please select a time.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          service: selectedService,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }

      const result = await response.json();
      console.log('Appointment booked:', result);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(`Failed to book appointment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCalendar = () => {
    // This is a simplified calendar. You'd want to generate this dynamically in a real application
    return (
      <div className={styles.calendarGrid}>
        {Array.from({ length: 31 }, (_, i) => (
          <button
            key={i}
            className={`${styles.calendarDay} ${selectedDate === `2024-03-${i + 1}` ? styles.selected : ''}`}
            onClick={() => handleDateChange(`2024-03-${i + 1}`)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  const renderTimeSlots = () => {
    const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'];
    return (
      <div className={styles.timeSlots}>
        {timeSlots?.map((time) => (
          <button
            key={time}
            className={`${styles.timeSlot} ${selectedTime === time ? styles.selected : ''}`}
            onClick={() => handleTimeChange(time)}
          >
            {time}
          </button>
        ))}
      </div>
    );
  };

  const renderServiceIcons = () => {
    return (
      <div className={styles.serviceIcons}>
        {serviceIcons?.map((service) => (
          <button
            key={service.text}
            className={`${styles.serviceIcon} ${selectedService?.text === service.text ? styles.selected : ''}`}
            onClick={() => handleServiceSelect(service)}
          >
            <img src={service.source} alt={service.text} width="48" height="48" />
            <span>{service.text}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book a Service">
      <div className={styles.bookingForm}>
        <div className={styles.formGroup}>
          <label htmlFor="date">Select Date</label>
          {renderCalendar()}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="time">Select Time Slot</label>
          {renderTimeSlots()}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {bookingSuccess && <p className={styles.successMessage}>Booking successful!</p>}
        <button
          className={`${styles.bookButton} ${!isLoggedIn || isLoading ? styles.disabled : ''}`}
          disabled={!isLoggedIn || isLoading}
          onClick={handleBookService}
        >
          {isLoggedIn ? (isLoading ? 'Booking...' : 'Book Service') : 'Login to Book a Service'}
        </button>
      </div>
    </Modal>
  );
};

export default BookingModal;
