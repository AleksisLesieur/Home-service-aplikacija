import { useState, useEffect } from 'react';
import styles from './MyAccount.module.scss';
import useAuthCheck from '../Hooks/useAuthCheck';
import { User } from '../types/interfaces';

const MyAccount = () => {
  useAuthCheck();
  const [data, setData] = useState<User | null>(null);
  const [editing, setEditing] = useState<keyof User | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        console.log('Fetched user data:', userData); // Log the fetched data
        setData(userData.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = (field: keyof User) => {
    setEditing(field);
    setEditValue(data?.[field] || '');
  };

  const handleSave = async () => {
    if (data && editing) {
      try {
        const response = await fetch('http://localhost:3000/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            [editing]: editValue,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update user');
        }

        const result = await response.json();
        console.log('Updated user data:', result); // Log the updated data
        setData(result.user);
        localStorage.setItem('user', JSON.stringify(result.user.username));
        setEditing(null);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:3000/user/delete', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete account');
        }

        localStorage.clear();
        window.location.href = '/login';
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const renderField = (field: keyof User) => {
    const isEditing = editing === field;
    const value = field === 'password' ? '••••••••••' : data?.[field] || '';

    return (
      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>{field}:</span>
        {isEditing ? (
          <>
            <input
              type={field === 'password' ? 'password' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={styles.editInput}
              autoFocus
            />
            <button onClick={handleSave} className={`${styles.editButton} ${styles.saveButton}`}>
              Save
            </button>
          </>
        ) : (
          <>
            <span className={styles.infoValue}>{value}</span>
            <button onClick={() => handleEdit(field)} className={styles.editButton}>
              Edit
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.accountCard}>
        <h1 className={styles.accountTitle}>My Account</h1>
        <div className={styles.accountInfo}>
          {data ? (
            <>
              {renderField('name')}
              {renderField('email')}
              {renderField('password')}
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
        <button onClick={handleDeleteAccount} className={`${styles.deleteButton} ${styles.dangerButton}`}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default MyAccount;

// email: gmail@gmail.com
// pass: 123456789
