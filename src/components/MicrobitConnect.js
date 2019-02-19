import React, { Component } from 'react';

const options = {
    filters: [
        { namePrefix: 'BBC micro:bit' }
    ]
};

class MicrobitConnect extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.setMicroBitName = this.setMicroBitName.bind(this);
        this.state = {
            microbit: null,
            microbitName: "",
            showMicrobit: false
        };
    }

    handleClick() {
        navigator.bluetooth.requestDevice(options)
            .then(device => device.gatt.connect())
            .then(device => console.log(device))
            .then(server => server.
                getPrimaryService(
                    '0000180000001000800000805F9B34FB'))
            .then(server => console.log(server))
            .then(service => {
                chosenMicrobitService = service;
                return Promise.call(
                    service.
                        getCharacteristic(
                            'device_name')
                        .then(this.setMicroBitName),
                );
            });

    }

    setMicroBitName(characteristic) {
        if (characteristic === null) {
            console.log("Unknown sensor location.");
            this.setState({
                microbitName: Promise.resolve(),
                showMicrobit: true
            })
        }
    }


    render() {
        return (
            <div>
                <button type="button"
                    onClick={this.handleClick} >Søk etter enhet</button>

                {this.state.showMicrobit ? <div>Microbit Name: {this.microbitName}</div> : <div></div>}
            </div>
        );
    }
}

export default MicrobitConnect;
