
export function hexlify(script) {
    function hexlify(ar) {
        var result = '';
        for (var i = 0; i < ar.length; ++i) {
            if (ar[i] < 16) {
                result += '0';
            }
            result += ar[i].toString(16);
        }
        return result;
    }
    // add header, pad to multiple of 16 bytes
    var data = new Uint8Array(4 + script.length + (16 - (4 + script.length) % 16));
    data[0] = 77; // 'M'
    data[1] = 80; // 'P'
    data[2] = script.length & 0xff;
    data[3] = (script.length >> 8) & 0xff;
    for (var i = 0; i < script.length; ++i) {
        data[4 + i] = script.charCodeAt(i);
    }
    // check data.length < 0x2000
    if(data.length > 8192) {
        throw new RangeError('Too long');
    }
    // convert to .hex format
    var addr = 0x3e000; // magic start address in flash
    var chunk = new Uint8Array(5 + 16);
    var output = [];
    for (var i = 0; i < data.length; i += 16, addr += 16) {
        chunk[0] = 16; // length of data section
        chunk[1] = (addr >> 8) & 0xff; // high byte of 16-bit addr
        chunk[2] = addr & 0xff; // low byte of 16-bit addr
        chunk[3] = 0; // type (data)
        for (var j = 0; j < 16; ++j) {
            chunk[4 + j] = data[i + j];
        }
        var checksum = 0;
        for (var j = 0; j < 4 + 16; ++j) {
            checksum += chunk[j];
        }
        chunk[4 + 16] = (-checksum) & 0xff;
        output.push(':' + hexlify(chunk).toUpperCase())
    }
    return output.join('\n');
};

// // Generates a hex file containing the user's Python from the firmware.
// export function getHexFile(firmware) {
//     var hexlified_python = this.hexlify(this.getCode());
//     var insertion_point = ":::::::::::::::::::::::::::::::::::::::::::";
//     return firmware.replace(insertion_point, hexlified_python);
// }

// Takes a hex blob and turns it into a decoded string.
export function unhexlify(data) {

    var hex2str = function(str) {
        var result = '';
        for (var i=0, l=str.length; i<l; i+=2) {
            result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
        }
        return result;
    };

    var lines = data.trimRight().split(/\r?\n/);
    if (lines.length > 0) {
        var output = [];
        for (var i=0; i<lines.length; i++) {
            var line = lines[i];
            output.push(hex2str(line.slice(9, -2)));
        }
        output[0] = output[0].slice(4);
        var last = output.length - 1;
        output[last] = output[last].replace(/\0/g, '');
        return output.join('');
    } else {
        return '';
    }
}

// Given an existing hex file, return the Python script contained therein.
export function scriptify(hexfile) {
    var hex_lines = hexfile.trimRight().split(/\r?\n/);
        var start_line = hex_lines.lastIndexOf(':020000040003F7');
        if (start_line > 0) {
            var lines = hex_lines.slice(start_line + 1, -2);
            var blob = lines.join('\n');
            if (blob==='') {
                return '';
            } else {
                return unhexlify(blob);
            }
        } else {
            return '';
        }
}
