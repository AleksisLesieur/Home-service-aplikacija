import Logoipsum from './../assets/svg/Logoipsum.svg';
import styles from './Navbar.module.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/consts';
import AvatarDropdown from '../components/common/AvatarDropdown';

const Navbar = () => {
  // const navigate = useNavigate();

  const links = [
    {
      href: ROUTES.HOME,
      label: 'Home',
    },
    {
      href: ROUTES.SERVICES,
      label: 'Services',
    },
    {
      href: ROUTES.ABOUT_US,
      label: 'About Us',
    },
  ];

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const username: string | null = user ? user.username : null;

  return (
    <header>
      <nav className={styles.leftSide}>
        <div>
          <Link to={ROUTES.HOME}>
            <img src={Logoipsum} alt="Logo" />
          </Link>
        </div>
        <nav className={styles.navigation}>
          {links.map((link) => (
            <Link className={styles['nav-items']} key={link.label} to={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </nav>
      <AvatarDropdown />
    </header>
  );
};

export default Navbar;
