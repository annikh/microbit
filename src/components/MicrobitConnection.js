import React, { Component } from 'react'


var uart_device;
var uart_characteristic;

const MBIT_UART_SERVICE = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); //to send TO the microbit
const MBIT_UART_RX_CHARACTERISTIC = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); //to send TO the microbit
const MBIT_UART_TX_CHARACTERISTIC = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); //to receive data FROM the microbit

var new_bubble_x_position = 0, new_bubble_y_position = 0, new_bubble_diameter = 1;

//micro:bit BLE UUID UART
class MicrobitConnection extends Component {

    constructor(props) {
        super(props)
        this.connect = this.connect.bind(this)
        this.onReceiveUART = this.onReceiveUART.bind(this)
        this.disconnect = this.disconnect.bind(this)
        this.startReadingFromUART = this.startReadingFromUART.bind(this)
        this.storeDataPoint = this.storeDataPoint.bind(this)
        this.splitKeyValue = this.splitKeyValue.bind(this)
        this.state = {
            microbit_rx_tx: []
        }
    }

    connect() {
        navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'BBC micro:bit',
            }],
            optionalServices: [MBIT_UART_SERVICE]
        })
            .then(device => {
                uart_device = device;
                console.log("device", device);
                return device.gatt.connect();
            })
            .then(server => {
                console.log("server", server)
                return server.getPrimaryService(MBIT_UART_SERVICE);
            })
            .then(service => {
                return Promise.all([service.getCharacteristic(MBIT_UART_RX_CHARACTERISTIC),
                service.getCharacteristic(MBIT_UART_TX_CHARACTERISTIC)])
            }).then(rxandtx => {
                this.startReadingFromUART(rxandtx[0], rxandtx[1])
            })
            .catch(error => {
                alert("Something went wrong.. ");
                console.log(error);
            });
    }

    startReadingFromUART(rxandtx) {
        rxandtx.subscribeToMessages(this.storeDataPoint);
    }

    storeDataPoint(message: String) {
        let kv = this.splitKeyValue(message);
        let key = kv.key
        let value = kv.value

        if (key == "x_accel") {
            console.log("x_accel=" + value);
            new_bubble_x_position = parseInt(value)
        } else if (key == "y_accel") {
            new_bubble_y_position = parseInt(value)
        } else if (key == "st_accel") {
            new_bubble_diameter = parseInt(value)
        } else {
            console.log("got a key we weren't looking for: " + key)
        }
    }

    splitKeyValue(message: String) {
        let [key, value] = message.trim().split(":");
        return { key: key, value: value }
    }

    onReceiveUART(event) {
        var str_arr = [];
        for (var i = 0; i < event.target.value.byteLength; i++) {
            str_arr[i] = event.target.value.getUint8(i);
        }
        var str = String.fromCharCode.apply(null, str_arr);
        console.log('data:' + str);
        document.js.data.value = str;
    }

    disconnect() {
        if (!uart_device || !uart_device.gatt.connected) return;
        uart_device.gatt.disconnect();
    }

    render() {
        return (
            <button onClick={this.connect} >
                Koble til Micro: bit
        </button>
        )
    }
}

export default MicrobitConnection;