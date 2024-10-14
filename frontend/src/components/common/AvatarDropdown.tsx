import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AvatarDropdown.module.scss';
import useOutsideClick from '../Hooks/useOutsideClick';

const AvatarDropdown: React.FC = () => {
  const { ref, isVisible: dropdownOpen, setIsVisible: setDropdownOpen } = useOutsideClick<HTMLDivElement>(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className={styles.avatarContainer}>
      {user ? (
        <button onClick={toggleDropdown}>{user?.toUpperCase()[0]}</button>
      ) : (
        <button className={styles.loggedOutButton}>
          <Link to="/Login" style={{ color: 'white' }}>
            Login / Sign Up
          </Link>
        </button>
      )}
      {dropdownOpen && (
        <div ref={ref} className={styles.dropdownMenu}>
          <ul>
            <li>
              <Link to="/myaccount">My Account</Link>
            </li>
            <li>
              <Link to="/mybookings">My bookings</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
