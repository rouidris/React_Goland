// MapSection.jsx
import React, { useState } from 'react';
import Map from '../map/Map.jsx';

const MapSection = () => {
    return (
        <section id="about" className="about">
            <div className="container">
                {/* Rest of your MapSection JSX */}
                <h2>Воспользуйтесь картой для нахождения вашего поля</h2>
                <div className="description">
                    <Map />
                </div>

            </div>
        </section>
    );
};

export default MapSection;
