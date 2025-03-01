const HttpError=require('../models/http-error');
const {validationResult}=require('express-validator');
const getCoordinates = require('../util/location');
const Place=require('../models/place');
const User =require('../models/user');
const mongoose = require('mongoose');
const fs=require('fs');

const getPlaceById =async(req,res,next)=>{
    const placeId=req.params.pid;
    let place;
    try
    {
         place =await Place.findById(placeId);
    }
    catch(err)
    {
       const error=new HttpError('Something went wrong ,could not find a place ',500);
       return next(error);
    }

    if(!place)
    {
        const error= new HttpError('Could not find a place for the provided id.');  
        return next(error);  
    }
    res.json({place:place.toObject({getters:true})});//{place}=>{place:place} Since findById() returns a single document (object) or null, we convert it to a plain object:
};

const getPlacesByUserId =async(req,res,next)=>{
    const userId=req.params.uid;
    //let places;
    let userWithPlace
    try
    {
        // places=await Place.find({creator: userId});
        userWithPlace =await User.findById(userId).populate('places');

    }
    catch(err)
    {
        const error=new HttpError('Fetching places failed,please try again later ',500);
       return next(error);
    }

    if(!userWithPlace || userWithPlace.places.length === 0)
    {
       return next(new HttpError('Could not find  places for the provided user id.'));
    }
    res.json({places :userWithPlace.places.map(place =>place.toObject({getters:true}))}); //find() returns an array of objects, not a single object.  
}

const createPlace=async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { title, description, address } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordinates(address); // ✅ Await the async function
        if (!coordinates) {
            return next(new HttpError('Could not fetch coordinates for the provided address.', 500));
        }
    } 
    catch (error) {
        return next(new HttpError('Could not fetch coordinates for the provided address.', 500));
    }

    const createdPlace =new Place({
        title,
        description,
        address,
        location:coordinates,
        image:req.file.path,
        creator:req.userData.user
    });
   
    let user;

    try{
        user=await User.findById(req.userData.user);

    }
    catch(err)
    {
        const error =new HttpError('Creating place failed. please try again',500);
        return next(error);
    }

    if(!user)
    {
        const error =new HttpError('Could not find user for provided id',404);
        return next(error);
    }

    console.log(user);

    /* handling database transactions using Mongoose sessions to ensure atomicity—meaning either all operations succeed, or none are applied. */
    
    try {
        const sess = await mongoose.startSession(); // Start a session
        sess.startTransaction();  // Start a transaction
    
        await createdPlace.save({ session: sess });  // Save the new place in the session
        user.places.push(createdPlace);  // Add the place to the user's array
        await user.save({ session: sess });  // Save updated user object in the session
    
        await sess.commitTransaction();  // Commit the transaction to apply changes
        sess.endSession();  // End the session
    } 
    catch (err) {
        const error = new HttpError('Creating place failed. Please try again', 500);
        return next(error);
    }
    
    res.status(201).json(createdPlace);
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    
    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
        if (!place) {
            return next(new HttpError('Could not find a place for the provided ID.', 404));
        }
    } catch (err) {
        return next(new HttpError('Fetching place failed, please try again later.', 500));
    }

    if(place.creator.toString() !== req.userData.userId){
        const error=new HttpError(
            'You are not allowed to edit this place.',401);
        return next(error);
    }

    // ✅ Ensure updates are correctly applied
    place.title = title ; 
    place.description = description ;
    
    try {
        await place.save();
    } catch (err) {
        return next(new HttpError('Updating place failed, please try again later.', 500));
    }

    // ✅ Ensure the response format matches expected output
    res.status(200).json({ places: place.toObject({ getters: true }) });
};


const deletePlace=async(req,res,next)=>{
    const placeId=req.params.pid;
    
    let place;
    try{
        place=await Place.findById(placeId).populate("creator");
    }
    catch(err)
    {
        return next(new HttpError('Something went wrong , could not delete place.', 500));
    }

    if (!place)
    {
        return next(new HttpError('Could not find place for this id.', 404));
    }

    if(place.creator.id !== req.userData.userId){
        const error=new HttpError(
            'You are not allowed to delete this place.',401);
        return next(error);
    }
    const imagePath =place.image;

    try{
        const sess = await mongoose.startSession(); // Start a session
        sess.startTransaction();  // Start a transaction

        await place.deleteOne({session:sess}); 

        if (!place.creator) {
            return next(new HttpError('Could not find the creator for this place.', 500));
        }

        place.creator.places.pull(place._id); 

        await place.creator.save({session:sess});

        await sess.commitTransaction();  // Commit the transaction to apply changes
        sess.endSession();  // End the session
    }
    catch(err)
    {
        return next(new HttpError('Something went wrong , could not delete place.', 500));
    }

    fs.unlink(imagePath,err =>{
        console.log(err);
    });
    
    res.status(200).json({message:'Deleted place'});
};

module.exports={getPlaceById,getPlacesByUserId,createPlace,updatePlace,deletePlace}