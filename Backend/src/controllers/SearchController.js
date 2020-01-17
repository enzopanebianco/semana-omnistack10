const Dev = require('../models/Dev')
const parseStringasArray = require('../utils/parseStringasArray');
const express = require('express');
const router = express.Router();

    router.get('/',async(req,res)=>{
        const {latitude,longitude,techs}= req.query;
        // const calcKm = km*1000;
        
        const techsArray = parseStringasArray(techs);

        const devs = await Dev.find({
            techs:{
                $in:techsArray
            },
            location:{
                $near:{
                    $geometry:{
                        type:'Point',
                        coordinates:[longitude,latitude]
                    },
                    $maxDistance:100000
                },
            }
        })
        return res.json({devs})
    }
    )
module.exports = app=>app.use('/search',router)