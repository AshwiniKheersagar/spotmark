import React, { useRef,useState,useEffect } from "react";
import "./ImageUpload.css";
import Button from "../FormElements/Button";

const ImageUpload = (props) => {
  
  const [file,setFile]=useState();
  const [previewUrl,setPreviewUrl]=useState();
  const[isValid,setIsValid]=useState(false);

  const filePickerRef = useRef(null); // Ensure ref is initialized
  
  useEffect(()=>{
    if(!file)
    {
      return;
    }
    const fileReader =new FileReader();
    fileReader.onload=()=>{
      setPreviewUrl(fileReader.result);
    }
    fileReader.readAsDataURL(file);
  },[file])

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid =isValid;
    if(event.target.files && event.target.files.length ===1){
       pickedFile =event.target.files[0];
       setFile(pickedFile);
       setIsValid(true);
       fileIsValid=true;
    }
    else
    {
      setIsValid(false);
      fileIsValid=false;
    }
    props.onInput(props.id,pickedFile,fileIsValid);
  };

  const pickImageHandle = () => {
    if (filePickerRef.current) {
      filePickerRef.current.click(); // Ensure ref is available before clicking
    } else {
      console.error("File input ref is not assigned yet.");
    }
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef} // Attach ref to input
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
        {previewUrl && <img src={previewUrl} alt="preview" />}
        {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandle}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
