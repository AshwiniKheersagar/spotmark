import React,{useContext} from 'react';

import Input from '../../shared/components/FormElements/Input';
import './PlaceForm.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHistory } from 'react-router-dom';
import ImageUpload from '../../shared/components/UIElements/ImageUpload'

const NewPlaces = () => {
  const auth=useContext(AuthContext);
  const {isLoading,error,sendRequest,clearError}=useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: { // ✅ Fixed: Changed from "Address" to "address" (lowercase)
        value: '',
        isValid: false
      },
      image:{
        value:'',
        isValid:false
      }
    },
    false
  );

  const history =useHistory();

  const placeSubmitHandler =async event => {
    event.preventDefault();
    try{
      const formData = new FormData();
        formData.append("title", formState.inputs.title.value);
        formData.append("description", formState.inputs.description.value);
        formData.append("address", formState.inputs.address.value);
        formData.append("image", formState.inputs.image.value);
        

        await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places`, 'POST', formData, {
          Authorization: 'Bearer ' + auth.token
        });
        
       history.push('/');
    }
    catch(err){

    }
  }
  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
     <form className="place-form" onSubmit={placeSubmitHandler}>
      {isLoading &&<div className='center_spinner'>
        <LoadingSpinner asOverlay />
        </div>}
      <Input 
        id="title"
        element="input" 
        type="text" 
        label="Title" 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value} // ✅ Added
        initialValid={formState.inputs.title.isValid} // ✅ Added
      />
      <Input 
        id="description"
        element="textarea" 
        label="Description" 
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]} 
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value} // ✅ Added
        initialValid={formState.inputs.description.isValid} // ✅ Added
      />
      <Input 
        id="address"  // ✅ Fixed: Changed from "Address" to "address" (matches state)
        element="input" 
        label="Address" 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText="Please enter a valid address."
        onInput={inputHandler}
        initialValue={formState.inputs.address.value} // ✅ Added
        initialValid={formState.inputs.address.isValid} // ✅ Added
      />
      <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image" />
      <Button 
        type="submit" 
        disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </>
  );
};

export default NewPlaces;


//USING USESTATE
/*import React, { useState, useCallback } from "react";
import Input from "../../shared/components/FormElements/Input";
import "./NewPlace.css";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";

const NewPlaces = () => {
  // State for each form field
  const [formData, setFormData] = useState({
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
    address: { value: "", isValid: false },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  // Function to update state when input changes
  const InputHandler = useCallback((id, value, isValid) => {
    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        [id]: { value, isValid },
      };

      // Check if the entire form is valid
      let overallFormIsValid = true;
      for (const inputId in updatedFormData) {
        overallFormIsValid = overallFormIsValid && updatedFormData[inputId].isValid;
      }

      setFormIsValid(overallFormIsValid);
      return updatedFormData;
    });
  }, []);

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formData); // Send this data to the backend
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={InputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={InputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={InputHandler}
      />
      <Button type="submit" disabled={!formIsValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlaces;
 */