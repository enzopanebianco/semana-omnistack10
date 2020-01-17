const express = require('express');
const router = express.Router();
const axios = require('axios');
const Dev = require('../models/Dev');
const {findConnections} = require('../websocket')
const parseStringasArray = require('../utils/parseStringasArray');

router.post('/', async (req, res) => {
    
    const { github_username, techs, latitude, longitude } = req.body;
   
    let dev = await Dev.findOne({ github_username });

    if (!dev) {
        try {


            const response = await axios.get(`https://api.github.com/users/${github_username}`)

            const { name = login, avatar_url, bio } = response.data;

            const techsArray = parseStringasArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                name,
                github_username,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
            const sendSocketMessage = findConnections(
                {latitude,longitude},
                techsArray,
            )
            console.log(sendSocketMessage);

        }
        catch (error) {
            return res.status(400).send({error:"Erro ao cadastrar dev :("})
        }
    }
    return res.json(dev)

})
router.get('/', async (req, res) => {
    try {
        const devs = await Dev.find();
        return res.json(devs);

    } catch (error) {
        return res.status(400).send({ erro: "Erro ao listar devs :(" })
    }

})
router.put('/:id', async (req, res) => {
    const dev = await Dev.findByIdAndUpdate(req.params.id, req.body, { new: true })

    return res.json(dev)
})
router.delete('/:id', async (req, res) => {
    await Dev.findByIdAndRemove(req.params.id)

    return res.send()

})

module.exports = app => app.use('/devs', router)

