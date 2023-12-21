const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const pluralize = require("pluralize");
const camel = require("to-camel-case");
const kebab = require("kebab-case");

function crearEstructuraProyecto(options) {
    const { name: nombre, resources: recursos, storage: almacenamiento, view: vista } = options;
	const rutaProyecto = path.join(process.cwd(), nombre);
    // Ruta principal
	fs.mkdirSync(rutaProyecto, { recursive: true });

    {   // Public y su contenido
        fs.mkdirSync(path.join(rutaProyecto,"public"), { recursive: true });
        {
            // Carpeta img
            fs.mkdirSync(path.join(rutaProyecto,"public","img"), { recursive: true });

            // Carpeta css
            fs.mkdirSync(path.join(rutaProyecto,"public","css"), { recursive: true });
            
            // Archivo css básico
            fs.writeFileSync(path.join(rutaProyecto,"public/css", "styles.css"), `* {\n\tmargin: 0;\n\tpadding: 0;\n\tbox-sizing: border-box;\n}`)

            // Carpeta js
            fs.mkdirSync(path.join(rutaProyecto,"public","js"), { recursive: true });
            
            // Archivo js básico
            fs.writeFileSync(path.join(rutaProyecto,"public/js", "index.js"), `
                window.addEventListener("load", () => {
                    console.log("JS cargado correctamente");
                });
            `)
        }
    }

    { // src y su contenido
        fs.mkdirSync(path.join(rutaProyecto,"src"), { recursive: true });
        {
            // Carpeta controllers
            {
                fs.mkdirSync(path.join(rutaProyecto,"src","controllers"), { recursive: true });
                // Controlador main
                let mainController = fs.readFileSync(path.join(__dirname, "template/src/controllers/main-controller-"+ (vista != "ejs" ? "html" : vista) +".js"))
                fs.writeFileSync(path.join(rutaProyecto,"src/controllers", "main-controller.js"), mainController.toString())

                recursos.forEach((recurso) => {
                    // const rutaEntidad = path.join(rutaProyecto, recurso);
                    // fs.mkdirSync(rutaEntidad, { recursive: true });
            
                    // Lectura del template
                    let resourceController = fs.readFileSync(path.join(__dirname, "template/src/controllers/resources-controller.js"))
                    // Traducción a string
                    resourceController = resourceController.toString();
                    // Adaptación de los recursos al recurso real
                    resourceController = resourceController
                        .replaceAll("resources", pluralize.plural(recurso))
                        .replaceAll("resource", pluralize.singular(recurso));

                    // Verificando si es por DB o local
                    // if (almacenamiento == "json") {
                    //     resourceController = resourceController
                    //     .replaceAll("async ", "")
                    //     .replaceAll("await ", "");
                    // }
                    
                    fs.writeFileSync(path.join(rutaProyecto,"src/controllers", pluralize.plural(recurso)+"-controller.js"), resourceController);
                });

            }

            // Carpeta data/database (almacenamiento)
            if (almacenamiento == "json") {
                fs.mkdirSync(path.join(rutaProyecto,"src","data"), { recursive: true });
                recursos.forEach((recurso) => {
                    fs.writeFileSync(path.join(rutaProyecto,"src/data", pluralize.plural(recurso)+".json"), "[]");
                });
            } else {
                fs.mkdirSync(path.join(rutaProyecto,"src","database"), { recursive: true });
                
                // Carpeta config dentro de database
                fs.mkdirSync(path.join(rutaProyecto,"src","database","config"), { recursive: true });
                // Lectura del template
                let databaseConfig = fs.readFileSync(path.join(__dirname, "template/src/database/config/config.js"))
                // Traducción a string
                databaseConfig = databaseConfig.toString().replaceAll("databasename", "db_"+(nombre.replaceAll("-","_")));
                fs.writeFileSync(path.join(rutaProyecto,"src/database/config", "config.js"), databaseConfig);

                // Carpeta models dentro de database
                fs.mkdirSync(path.join(rutaProyecto,"src","database","models"), { recursive: true });
                // Lectura del template
                let indexModel = fs.readFileSync(path.join(__dirname, "template/src/database/models/index.js"))
                // Traducción a string
                indexModel = indexModel.toString()
                fs.writeFileSync(path.join(rutaProyecto,"src/database/models", "index.js"), indexModel);
                recursos.forEach((recurso) => {
                    // Lectura del template
                    let resourceModel = fs.readFileSync(path.join(__dirname, "template/src/database/models/resource.js"))
                    // Traducción a string
                    resourceModel = resourceModel.toString();
                    // Adaptación de los recursos al recurso real
                    resourceModel = resourceModel.replaceAll("Resources", pluralize.plural(recurso).charAt(0).toUpperCase() + pluralize.plural(recurso).slice(1)).replaceAll("resources", pluralize.plural(recurso));
                    
                    fs.writeFileSync(path.join(rutaProyecto,"src/database/models", pluralize.singular(recurso).charAt(0).toUpperCase() + pluralize.singular(recurso).slice(1)+".js"), resourceModel);
                });

                fs.mkdirSync(path.join(rutaProyecto,"src","database","migration"), { recursive: true });
                fs.mkdirSync(path.join(rutaProyecto,"src","database","seeders"), { recursive: true });

            }
        }

        // Carpeta routes y su contenido
        fs.mkdirSync(path.join(rutaProyecto,"src","routes"), { recursive: true });
        {
            // Lectura del template
            let mainRouterText = fs.readFileSync(path.join(__dirname, "template/src/routes/main-router.js"))
            // Traducción a string
            mainRouterText = mainRouterText.toString();
            fs.writeFileSync(path.join(rutaProyecto,"src/routes", "main-router.js"), mainRouterText);

            recursos.forEach((recurso) => {
                // Lectura del template
                let resourceRouter = fs.readFileSync(path.join(__dirname, "template/src/routes/resources-router.js"));
                // Traducción a string
                resourceRouter = resourceRouter.toString();
                // Adaptación de los recursos al recurso real
                resourceRouter = resourceRouter.replaceAll("resources", pluralize.plural(recurso)).replaceAll("resource", pluralize.singular(recurso));
                
                fs.writeFileSync(path.join(rutaProyecto,"src/routes", pluralize.plural(recurso)+"-router.js"), resourceRouter);
            });
        }

        // Carpeta services y su contenido
        fs.mkdirSync(path.join(rutaProyecto,"src","services"), { recursive: true });
        recursos.forEach((recurso) => {
            // Lectura del template
            let resourceService = fs.readFileSync(path.join(__dirname, "template/src/services/"+almacenamiento+"-resource.js"));
            // Traducción a string
            resourceService = resourceService.toString();
            // Adaptación de los recursos al recurso real
            resourceService = resourceService
                .replaceAll("Resources", pluralize.plural(recurso).charAt(0).toUpperCase() + pluralize.plural(recurso).slice(1))
                .replaceAll("resources", pluralize.plural(recurso))
                .replaceAll("resource", pluralize.singular(recurso));
            
            fs.writeFileSync(path.join(rutaProyecto,"src/services", pluralize.singular(recurso)+".js"), resourceService);
        });

        // Carpeta views y su contenido
        fs.mkdirSync(path.join(rutaProyecto,"src","views"), { recursive: true });
        // Lectura del template
        let homeView = fs.readFileSync(path.join(__dirname, "template/src/views/home.html"))
        // Traducción a string
        homeView = homeView.toString()
            .replace("<!-- BOOTSTRAP CSS -->", vista == "bootstrap" ? `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" integrity="sha512-b2QcS5SsA8tZodcDtGRELiGv5SaKSk1vDHDaQRda0htPYWZ6046lr3kJ5bAAQdpV2mmA/4v0wQF9MyU6/pDIAg==" crossorigin="anonymous" referrerpolicy="no-referrer" />` : "")
            .replace("<!-- BOOTSTRAP JS -->", vista == "bootstrap" ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.min.js" integrity="sha512-WW8/jxkELe2CAiE4LvQfwm1rajOS8PHasCCx+knHG0gBHt8EXxS6T6tJRTGuDQVnluuAvMxWF4j8SNFDKceLFg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>` : "")

        fs.writeFileSync(path.join(rutaProyecto,"src/views", "home.html"), homeView);

        // Entry point
        let entryPoint = fs.readFileSync(path.join(__dirname, "template/src/app.js"))
        // Traducción a string
        entryPoint = entryPoint
            .toString()
            .replace("// EJS\n", (vista == "ejs" ? `app.set("view engine", "ejs");\napp.set("views", path.join(__dirname,"./views"));\n` :""))
        recursos.forEach(recurso => {
            let templateString = `\nconst ${pluralize.plural(recurso)}Router = require('./routes/${pluralize.plural(recurso)}-router');\napp.use(${pluralize.plural(recurso)}Router);\n`;
            entryPoint += templateString;
        })
        fs.writeFileSync(path.join(rutaProyecto,"src", "app.js"), entryPoint);
    }

    // Package.json
    let packageJson = fs.readFileSync(path.join(__dirname, "template/package.json"));
    // Traducción a string
    packageJson = packageJson.toString().replace("project-name", nombre);
    fs.writeFileSync(path.join(rutaProyecto, "package.json"), packageJson);

    // .env
    let env = fs.readFileSync(path.join(__dirname, "template/.env"));
    // Traducción a string
    fs.writeFileSync(path.join(rutaProyecto, ".env"), env);

    // .gitignore
    let gitignore = fs.readFileSync(path.join(__dirname, "template/.gitignore"));
    // Traducción a string
    fs.writeFileSync(path.join(rutaProyecto, ".gitignore"), gitignore);
}

program
	.version("0.1.0")
	.option("-n, --name <name>", "Nombre del proyecto (Entre comillas)", (val) => kebab(camel(val)))
	.requiredOption('-s, --storage <type>', 'Especifica el tipo de almacenamiento (JSON o MySQL)', (val) => val.toLowerCase())
    .addOption(new program.Option('-s, --storage <type>', 'Especifica el tipo de almacenamiento (JSON o MySQL)')
    .choices(['mysql', 'json']))
	.requiredOption("-r, --resources <resource1,resource2,etc>","Recursos del proyecto separadas por coma (y en plural)", (val) => val.toLowerCase().split(","))
    .option("-v, --view <type>","Estilo de vistas (motor de plantillas o framework de front", (val) => val.toLowerCase())
    .addOption(new program.Option("-v, --view <type>","Estilo de vistas (motor de plantillas o framework de front")
    .choices(['bootstrap', 'ejs']))
	.action((options) => {
		crearEstructuraProyecto(options);
		console.log(`Proyecto ${options.name} generado con éxito.`);
	});

program.parse(process.argv);
