    
/*
* Valid options are:
* - chunk_read_callback: a function that accepts the read chunk
                        as its only argument. If binary option
                        is set to true, this function will receive
                        an instance of ArrayBuffer, otherwise a String
* - error_callback:      an optional function that accepts an object of type
                        FileReader.error
* - success:             an optional function invoked as soon as the whole file has been
                        read successfully
* - binary:              If true chunks will be read through FileReader.readAsArrayBuffer
*                        otherwise as FileReader.readAsText. Default is false.
* - chunk_size:          The chunk size to be used, in bytes. Default is 64K.
*/
parseFile(file, options) {
    var opts       = typeof options === 'undefined' ? {} : options;
    var fileSize   = file.size;
    var chunkSize  = typeof opts['chunk_size'] === 'undefined' ?  64 * 1024 : parseInt(opts['chunk_size']); // bytes
    var binary     = typeof opts['binary'] === 'undefined' ? false : opts['binary'] == true;
    var offset     = 0;
    var self       = this; // we need a reference to the current object
    var readBlock  = null;
    var chunkReadCallback = typeof opts['chunk_read_callback'] === 'function' ? opts['chunk_read_callback'] : function() {};
    var chunkErrorCallback = typeof opts['error_callback'] === 'function' ? opts['error_callback'] : function() {};
    var success = typeof opts['success'] === 'function' ? opts['success'] : function() {};

    var onLoadHandler = function(evt) {
        if (evt.target.error == null) {
            offset += evt.target.result.length;
            chunkReadCallback(evt.target.result);
        } else {
            chunkErrorCallback(evt.target.error);
            return;
        }
        if (offset >= fileSize) {
            success(file);
            return;
        }

        readBlock(offset, chunkSize, file);
    }

    readBlock = function(_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = onLoadHandler;
        if (binary) {
        r.readAsArrayBuffer(blob);
        } else {
        r.readAsText(blob);
        }
    }

    readBlock(offset, chunkSize, file);
}

parseFile2(file, callback) {
    var table = new Uint32Array(256);

    for(var i=256; i--;) {
        var tmp = i;
        for(var k=8; k--;) {
            tmp = tmp & 1 ? 3988292384 ^ tmp >>> 1 : tmp >>> 1;
        }
        table[i] = tmp;
    }
    var fileSize   = file.size;
    var chunkSize  = 512 * 1024; // bytes
    var offset     = 0;
    var self       = this; // we need a reference to the current object
    var block      = null;
    var crc= -1;
    var r = null;
    var foo = function(evt) {
        if (evt.target.error == null) {
            //console.log(evt, evt.target.result.length);
            offset += evt.loaded;
            r = new Uint8Array(evt.target.result);
            for(var i=0, l=r.length; i<l; i++)
            {
                crc = crc>>>8^table[crc&255^r[i]];
            }
            callback([true, offset]); // callback for handling read chunk
        } else {
            console.log("Read error: " + evt.target.error);
            return;
        }
        if (offset >= fileSize) {
            //console.log("CRC32: " +  );
            callback([false, ((crc^-1)>>>0).toString(16).toUpperCase()]);
            return;
        }

        block(offset, chunkSize, file);
    }

    block = function(_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = foo;
        r.readAsArrayBuffer(blob);
    }

    block(offset, chunkSize, file);
}