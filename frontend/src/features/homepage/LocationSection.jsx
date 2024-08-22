const LocationSection = () => {
    return (
      <section className="my-8">
        <h2 className="text-3xl font-bold text-center mb-6">Our Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LocationCard name="Location 1" address="123 Main St" />
          <LocationCard name="Location 2" address="456 Elm St" />
          {/* Add more LocationCard components as needed */}
        </div>
      </section>
    );
  };
  
  const LocationCard = ({ name, address }) => {
    return (
      <div className="card shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p>{address}</p>
      </div>
    );
  };

export default LocationSection