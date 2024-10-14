import React, { useState, useEffect } from 'react';
import useAuthCheck from '../Hooks/useAuthCheck';
import styles from './MyBookings.module.scss';
import ServiceIcon from '../Homepage/ServiceIcon/ServiceIcon';
import { User, Category } from '../types/interfaces';

const MyBookings: React.FC = () => {
  useAuthCheck();
  const [userData, setUserData] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch user data
        const userResponse = await fetch('http://localhost:3000/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUserData(userData.user);

        console.log(userData);

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:3000/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        console.log(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!userData) {
    return <div className={styles.error}>No user data found</div>;
  }

  const getCategoryIcon = (categoryName: string) => {
    return categories.find((category) => category.text === categoryName);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Bookings</h1>
      {userData.appointments.length === 0 ? (
        <p className={styles.noBookings}>You have no bookings yet.</p>
      ) : (
        <ul className={styles.bookingsList}>
          {userData.appointments.map((appointment) => {
            const categoryIcon = getCategoryIcon(appointment.category || '');
            return (
              <li key={appointment._id} className={styles.bookingItem}>
                <div className={styles.bookingInfo}>
                  <span className={styles.date}>Date: {appointment.date}</span>
                  <span className={styles.time}>Time: {appointment.time}</span>
                </div>
                {categoryIcon && (
                  <ServiceIcon
                    source={categoryIcon.source}
                    text={categoryIcon.text}
                    onClick={() => {}} // You can add a click handler if needed
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
