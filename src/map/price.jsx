import React from 'react';

class PriceCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: 0,
            dronePrice: 0,
            price: 0
        };
    }

    calculatePrice = () => {
        const { category, dronePrice } = this.state;
        const price = parseFloat(dronePrice) * parseFloat(category);
        this.setState({ price: price.toFixed(2) });
    }

    componentDidMount() {
        this.calculatePrice();
    }

    render() {
        return (
            <div>
                <label htmlFor="category">Category:</label>
                <select id="category" onChange={(e) => this.setState({ category: e.target.value })}>
                    <option value="1">Category 1</option>
                    <option value="2">Category 2</option>
                    <option value="3">Category 3</option>
                </select>
                <br />
                <label htmlFor="drone">Drone:</label>
                <select id="drone" onChange={(e) => this.setState({ dronePrice: e.target.value })}>
                    <option value="100">Drone 1</option>
                    <option value="200">Drone 2</option>
                    <option value="300">Drone 3</option>
                </select>
                <br />
                <label htmlFor="price">Price:</label>
                <span id="price">{this.state.price} тг.</span>
            </div>
        );
    }
}
export default PriceCalculator