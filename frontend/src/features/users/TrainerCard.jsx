// src/components/TrainerCard.js
import React from 'react';


function TrainerCard({ trainerName, description, photoUrl }) {

  return (
    <div className="card w-full bg-base-100 shadow-xl mb-4">
      <div className="card-body flex items-center">
        <img
          src={photoUrl}
          alt={`${trainerName}'s photo`}
          className="w-32 h-32 rounded-full object-cover mr-4"
        />
        <div>
          <h2 className="card-title text-xl font-bold mb-2">{trainerName}</h2>
          <p className="text-gray-700 mb-2">{description}</p>
         
        </div>
      </div>
    </div>
  );
}

export default TrainerCard;
