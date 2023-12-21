const {Resources} = require('../database/models/index');

const service = {
    resourceCreate: async (data) => {
        let resourceNew = {
            name: data.name,
        };
        Resources.create(resourceNew);
    }, // C

    resourceFindAll: async () => {
        let resourceList = await Resources.findAll();
        return resourceList;
    }, // R
    resourceFindById: async (id) => {
        let resourceFound = Resources.findOne({
            where: {
                id: id
            }
        })
        return resourceFound;
    }, // R

    resourceUpdate: async (id, data) => {
        let newData = {
            name: data.name,
        };

        let resultado = Resources.update(newData, {
            where: {
                id: id
            }
        });

        return resultado;
    }, // U

    resourceDelete: async (id) => {
        let resultado = Resources.destroy({
            where: {
                id: id
            }
        });

        return resultado;
    } // D
};

module.exports = service;