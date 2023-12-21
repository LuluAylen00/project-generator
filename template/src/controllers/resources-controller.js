const resourceService = require('../services/resource');
const path = require('path');
// Enviroment variables config
var config = require('dotenv').config;
config();

const controller = {
    // Create
    resourceCreate: async (req, res) => {
        try {            
            await resourceService.resourceCreate(req.body);
            res.send({
                code: 200,
                msg: "Creacion exitosa",
                result: 'http://localhost:'+process.env.PORT || 3418
            });
        } catch (error) {
            res.send({
                code: 400,
                msg: "Creacion fallida",
                result: error
            });
        }
    },
    // Read -> List
    resourcesList: async (req, res) => { 
        try {
            let resourcesList = await resourceService.resourceFindAll();
            res.send({
                meta: {
                    status: 200,
                    count: resourcesList.length
                },
                data: resourcesList
            });
        } catch (error) {
            res.send({
                meta: {
                    status: 400,
                    error: error
                },
                data: []
            });
        }
    },
    // Read -> Detail
    resourceDetail: async (req, res) => { 
        const id = req.params.id;
        try {
            let resourceDetail = await resourceService.resourceFindById(id);
            res.send({
                meta: {
                    status: 200
                },
                data: resourceDetail
            });
        } catch (error) {
            res.send({
                meta: {
                    status: 400,
                    error: error
                },
                data: {}
            });
        }
    },
    // Update
    resourceUpdate: async (req, res) => {
        const id = req.params.id;
        let resultado = await resourceService.resourceUpdate(id, req.body);
        if (resultado > 0) {
            res.send({
                code: 200,
                msg: "Edición exitosa",
                result: 'http://localhost:'+process.env.PORT || 3418+'/resources/'+id
            });
        } else {
            res.send({
                code: 400,
                msg: "Edición fallida",
                result: 'http://localhost:'+process.env.PORT || 3418+'/resources/'+id
            });
        };
    },
    // Delete
    resourceDelete: async (req, res) => {
        const id = req.params.id;
        let resultado = await resourceService.resourceDelete(id);
        if (resultado > 0) {
            res.send({
                code: 200,
                msg: "Eliminación exitosa",
                result: 'http://localhost:'+process.env.PORT || 3418+'/resources/'
            });
        } else {
            res.send({
                code: 400,
                msg: "Eliminación fallida",
                result: 'http://localhost:'+process.env.PORT || 3418+'/resources/'
            });
        };
    }
}

module.exports = controller;