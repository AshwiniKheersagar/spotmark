import React, { useEffect, useState } from 'react'
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner' 

import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPlaces = () => {
  const [loadedPlaces,setLoadedPlaces]=useState();
  const {isLoading,error,sendRequest,clearError} =useHttpClient();

  const userId= useParams().userId;
  
  useEffect(()=>{
    
    const fetchPlaces =async ()=>{
      try{
        const responseData =await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);

        setLoadedPlaces(responseData.places);
      }
      catch(err){

      }
    }
    fetchPlaces();
  },[sendRequest,userId]);

  const placeDeletedHandler=(deletedplaceId)=>{
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place =>place.id !== deletedplaceId));
  }
 
  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
       {isLoading && <div className='center_spinner'>
          <LoadingSpinner />
       </div> }
    {!isLoading && loadedPlaces &&<PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
       {/* The loadedPlaces is the array so the first index is used */}
       
        {/* npm install react-leaflet leaflet 
        npm install --save react-router-dom@5 --save-exact
        npm install --save react-transition-group
        */}
    </>
  )
}

export default UserPlaces