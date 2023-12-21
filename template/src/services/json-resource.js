const fs = require('fs');
const path = require('path');
let resources = fs.readFileSync(path.resolve(__dirname, '../data/resources.json'), 'utf8');

const service = {
    resourceCreate: (data) => {
        let resourceNew = {
            name: data.name,
        };
        resources.push(resourceNew);
        fs.writeFileSync(path.resolve(__dirname, '../data/resources.json'), JSON.stringify(resources));
        return true;
    }, // C

    resourceFindAll: () => {
        let resourceList = resources;
        return resourceList;
    }, // R
    resourceFindById: (id) => {
        let resourceFound = resources.find((element) => element.id == id);
        return resourceFound;
    }, // R

    resourceUpdate: (id, data) => {
        let resultado = resources.filter((element) => element.id == id).length;

        resources = resources.map((element) => {
            if (element.id == id) {
                element.name = data.name;
            }
            return element;
        });
        
        fs.writeFileSync(path.resolve(__dirname, '../data/resources.json'), JSON.stringify(resources));

        return resultado;
    }, // U

    resourceDelete: (id) => {
        let resultado = resources.filter((element) => element.id == id).length;

        resources = resources.filter((element) => element.id != id);
        
        fs.writeFileSync(path.resolve(__dirname, '../data/resources.json'), JSON.stringify(resources));

        return resultado;
    } // D
};

module.exports = service;