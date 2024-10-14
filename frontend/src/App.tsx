import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import RootLayout from './layout/RootLayout';
import Services from './components/pages/Services';
import AboutUs from './components/pages/AboutUs';
import SearchResult from './components/categories/SearchResult';
import Login from './components/pages/Login';
import MyBookings from './components/pages/MyBookings';
import MyAccount from './components/pages/MyAccount';
import BusinessPage from './components/Homepage/BusinessCard/BusinessPage';
import ErrorPage from './components/pages/ErrorPage';
// import { ROUTES } from './router/consts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />} errorElement={<ErrorPage />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/search/:category" element={<SearchResult />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/myaccount" element={<MyAccount />} />
          <Route path="/business" element={<BusinessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// testing

// uzduotis nr. 1 use state

// Topbar komponentas: Tai turėtų apimti logotipą ir navigacijos meniu, kuris kol kas gali būti statinis (vėliau bus įtrauktas react-router).
// Paieškos juosta: Centrinė paieškos juosta su mygtuku. Nors interaktyvi paieška dar nebus įgyvendinta, svarbu paruošti input elementą ir paieškos mygtuką.
// Kategorijos kortelė: Paslaugų sekcijoje, kiekviena paslauga (pvz., “Cleaning”, “Repair”) turėtų būti atvaizduojama kaip atskiras komponentas su ikona ir tekstiniu aprašymu.
// Stilius: SCSS modules arba Styled-components
// Responsive design (optional): Naudoti CSS media queries, kad puslapis tinkamai atrodytų įvairaus dydžio įrenginiuose.
// Būsenos valdymas: Nors šioje užduotyje būsenos valdymo galimybių nebus daug, verta paruošti būsimam funkcionalumui su useState. Galima paruošti search inputui.

// uzduotis nr. 2 react router dom

// Topbar komponentas: Įgyvendinti navigaciją react-router-dom pagalba tarp puslapių Home, Services ir About Us. Naudoti Link komponentą
// Login mygtukas: Paspaudus Login/Sign Up mygtuką naviguoti į Login puslapį naudojant useNavigate hooką
// Paslaugų kortelė: Paspaudus ant kortelės naviguoti į /search/:category routą
// Routes: Įgyivendinti naujus maršrutus (routes) tokius kaip: Home, Services, About Us, Login, Register, SearchCategory

// uzduotis nr. 3 custom hooks

// Categories komponentas: Įgyvendinti kategorijų pasirinkimą. Paspaudus ant kitos kategorijos turi pasikeisti ir URL iš /search/cleaning į /search/repair

// Filtravimas: Išfiltruoti tik tas paslaugas kurios įeina į kategoriją

// Save as favorite (optional): Pridėti ant kortelės širdelės arba žymos ikoną, kurią nuspaudus būtų išsaugotą paslauga į localStorage. Galite naudoti useLocalStorage hooksą.

// uzduotis nr 4 useContext

// Login: Sukurti /login route, įgyvendinti savo norimą dizainą ir pridėti inputų validaciją.
// Redirect: Suvedus inputus ir paspaudus Login mygtuką išsaugoti userio informaciją su useContext ir localStorage bei redirectint į pagrindinį / route
// Topbar komponentas: Atnaujinti komponento state kai asmuo yra prisijungęs

// Register (optional): Įgyvendinti /register route ir savo norimą dizainą
