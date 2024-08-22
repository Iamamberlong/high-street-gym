import React from 'react';
import { useNavigate } from 'react-router-dom';
import bannerPic from '../../assets/gym-banner-pic.jpg'; 

const Banner = () => {
    const navigate = useNavigate();

    return (
        <section className="relative bg-cover bg-center h-64 flex items-center justify-center" style={{ backgroundImage: `url(${bannerPic})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
                <h1 className="text-4xl font-bold mb-4">Welcome to Our Gym</h1>
                <p className="mb-4 text-center">Join us to achieve your fitness goals!</p>
                <button className="btn btn-primary" onClick={() => navigate('/register')}>Join Us</button>
            </div>
        </section>
    );
};

export default Banner;
