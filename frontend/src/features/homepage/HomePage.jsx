import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../common/PageLayout";
import Banner from "./Banner";
import AboutUs from "./AboutUs";

const HomePage = () => {
  return (
    <PageLayout>
      <Banner />
      <AboutUs />
    </PageLayout>
  );
};

export default HomePage;
