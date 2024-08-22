import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../common/Header"
import Banner from "./Banner"
import Footer from '../../common/Footer';
// import LocationSection from "./LocationSection"
// import TrainerSection from "../users/TrainerSection"

const HomePage = () => {
  return (
    <div>
      <Header />
      <Banner />

      <Footer />
    </div>
  );
};

export default HomePage;
