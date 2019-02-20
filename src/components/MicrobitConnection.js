import React, { Component } from 'react'

const MBIT_UART_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e' //to send TO the microbit
const MBIT_UART_RX_CHARACTERISTIC = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E' //to send TO the microbit
const MBIT_UART_TX_CHARACTERISTIC = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'//to receive data FROM the microbit

const ACCELEROMETERSERVICE_SERVICE_UUID = 'E95D0753-251D-470A-A062-FA1922DFA9A8'.toLowerCase()
const ACCELEROMETERDATA_CHARACTERISTIC_UUID = "E95DCA4B-251D-470A-A062-FA1922DFA9A8".toLowerCase();
const ACCELEROMETERPERIOD_CHARACTERISTIC_UUID = "E95DFB24-251D-470A-A062-FA1922DFA9A8".toLowerCase();

const LEDSERVICE_SERVICE_UUID = "E95DD91D-251D-470A-A062-FA1922DFA9A8".toLowerCase();
const LEDMATRIXSTATE_CHARACTERISTIC_UUID = "E95D7B77-251D-470A-A062-FA1922DFA9A8".toLowerCase();
const LEDTEXT_CHARACTERISTIC_UUID = "E95D93EE-251D-470A-A062-FA1922DFA9A8".toLowerCase();
const SCROLLINGDELAY_CHARACTERISTIC_UUID = "E95D0D2D-251D-470A-A062-FA1922DFA9A8".toLowerCase();

var new_bubble_x_position = 0, new_bubble_y_position = 0, new_bubble_diameter = 1;

//micro:bit BLE UUID UART
class MicrobitConnection extends Component {
    constructor(props) {
        super(props)
        this.connect = this.connect.bind(this)
        this.disconnect = this.disconnect.bind(this)
        this.state = {
            LEDService: null,
            writeCharacteristicsLEDMatrix: null
        }
    }

    connect() {
        navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'BBC micro:bit',
            }],
            optionalServices: [LEDSERVICE_SERVICE_UUID]
        })
            .then(device => {
                console.log("Connecting to GATT server...")
                return device.gatt.connect()
            })
            .then(server => {
                console.log(" > Found GATT server")
                let gattServer = server;
                return gattServer.getPrimaryService(LEDSERVICE_SERVICE_UUID);
            })
            .then(service => {
                console.log("> Found command LED server", service)
                this.setState({
                    LEDService: service
                })
                return this.state.LEDService.getCharacteristic(LEDMATRIXSTATE_CHARACTERISTIC_UUID);
            })
            .then(characteristicLEDMatrix => {
                console.log(' > Found write characteristic for LED matrix')
                this.setState({
                    writeCharacteristicsLEDMatrix: characteristicLEDMatrix
                })
              
                characteristicLEDMatrix.startNotifications();
                
            })
            .catch(error => {
                alert("Something went wrong.. ");
                console.log(error);
            });
    }

    disconnect() {
        if (!this.uart_device || !this.uart_device.gatt.connected) return;
        this.uart_device.gatt.disconnect();
    }

    setLeds(LEDMatrix) {
        
    }

    render() {
        return (
            <button onClick={this.connect} >
                Koble til Micro:bit
            </button>
        )
    }
}

export default MicrobitConnection;