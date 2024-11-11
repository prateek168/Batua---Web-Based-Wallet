// import HomePage from '../HomePage/HomePage.jsx'
import Navbar from "./Navbar.jsx";
import SecretPhrase from "./SecretPhrase.jsx";
import Wallets from "./Wallets.jsx";

const Layout = () => {
  return (
    <div className="bg-zinc-950 h-100vh text-white flex flex-col items-center  ">
      <Navbar />
      <SecretPhrase />
      <Wallets />
    </div>
  );
};

export default Layout;
