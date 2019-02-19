import React, { Component } from 'react';
import { hexlify, scriptify } from './Utils/ConvertionUtils';

const ReadInputFile = () => {
    let reader;
  
    const handleFileRead = (e) => {
      const content = reader.result;
      console.log(content)
      const hexContent = scriptify(content);
      console.log(hexContent);
    };
  
    const handleFileSelect = (file) => {
      reader = new FileReader();
      reader.onloadend = handleFileRead;
      reader.readAsText(file, "UTF-8");
    }
  
    return <div className='upload-python-file'>
      <input type ='file' 
            id='file' 
            className='input-file' 
            accept='.hex' 
            onChange={e => handleFileSelect(e.target.files[0])} 
      />
    </div>;
  }

  export default ReadInputFile;