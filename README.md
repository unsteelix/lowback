# Lowback
## Simple Headless CMS with JSON Database

Lowback is a headless CMS with JSON database, file-storage and authorization method for integrations with other sites

## Features

- Import a JSON file and use this data as needed
- Upload files
- Upload images with auto-resizing, converting to WebP and optimization
- Authorization API method who return Token for accessing to data
- Set rights for each token: what branch of DB you have access
- Export DB JSON file with rights and datas for backup

## Tech

- [TypeScript] - Strongly typed programming language that builds on JavaScript
- [Node.js] - Evented I/O for the backend
- [Express] - Fast node.js network app framework
- [node-json-db] - A simple "database" that use JSON file for Node.JS.
- [imagemin] - Minify images seamlessly
- [pino] - Very low overhead Node.js logger.

## Installation

Lowback requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies

```sh
cd lowback
yarn install
```

Start dev watcher

```sh
yarn dev
```

Start the lowback

```sh
yarn start
```

## Development

Run dev watcher
Start the lowback and restart on every change the code

## API routes

|Token |Method|Endpoint                     |Description
|-------------|------------------------------------|----------------------------------------|--
|OPEN  |GET   |/                                   |Main page fith HelthCheck and Auth form
|ANY   |GET   |/get/*                              |Get data by path /site/pages/4
|ANY   |POST  |/push/*                             |Push data with override
|ANY   |POST  |/merge/*                            |Push data without override. New data will be merge to old data 
|ANY   |GET   |/delete/*                           |Delete data by path /site/users/10
|ANY   |GET   |/count/*                            |Return count elements of array
|ANY   |GET   |/index/*/:index                     |Return index element of array (by key "id") 
|ANY   |GET   |/index/custom/*/:index/:propName    |Return index element of array (by custom key)
|MASTER|GET   |/reload                             |Reload database. For example, if you change json file by hand
|MASTER|GET   |/backup/content                     |Return json file of content DB
|MASTER|GET   |/backup/service                     |Return json file of service DB 
|MASTER|GET   |/backup/files                       |Return json file of files DB
|MASTER|GET   |/page/upload                        |Page with files/images upload forms
|ANY   |POST  |/upload/files                       |Endpoint for files upload
|ANY   |POST  |/upload/images                      |Endpoint for images upload 
|OPEN  |GET   |/files/:id                          |Return file by id
|OPEN  |GET   |/images/:id                         |Return image by id 
|OPEN  |GET   |/images/:id/:version                |Return image by id and version. For ex: /images/fdglewr434wf/optimized. Types: 'optimized', 'w1920', 'w1280', 'w640'
|OPEN  |GET   |/auth/:site/:password               |Return token by site and pass (login and pass) 
|MASTER|POST  |/admin/:db/:method/*                |Get \| push \| merge \| delete operations with DBC, DBF, DBS


**OPEN**   - endpoint available without token

**ANY**    - endpoint available with any token

**MASTER** - endpoint available only with master token

## Autorization concept

    level 1:    Check access rights for API endpoint
    level 2:    Check accecc rights for DB branch
    
You can read/write data from DB only with token. 
You can add token in service DB.
You can change access to each DB branch for any token in service DB.

    -read: /get
        -show: show branch
        -hide: hide branch
        -secret: show branch only if path be inside secret path
    -write: /push /merge /delete

    -public: path availabe without token

Example:

    {
        "tokens": {
            "master": {
                "12345678": ["master_token"]
            },
            "site_one": {
                "password_1": ["toke_one", "token_two"],
                "password_2": ["toke_one"]
            },
            "site_two": {
                "password_3": ["token_two"],
                "password_4": ["toke_three"]
            }
        },

        "rights": {
            "master_token": {
                "read": {
                    "show": ["/"],
                    "hide": [],
                    "secret": []
                },
                "write": ["/"]
            },
            "another_token": {
                "read": {
                    "show": ["/site_2"],
                    "hide": ["/site_2/hidden", "/site_2/users"],
                    "secret": ["/site_2/pages"]
                },
                "write": ["/site_2"]
            }
        },
        
        "public": ["/site_3/"]
    }


## Change data examples

    GET     /site/users/2
    
    GET     /site/users[2]
    
    PUSH    /site/users/10
            {
                id: 10,
                name: "john"
            }

    MERGE   /site/users
            ["newUser"]

    MERGE   /site
            {
                users: ["newUser"]
            }

    DELETE  /site/users/10

    COUNT   /site/users

    INDEX   /site/users/10 

    CUSTOM INDEX   /site/users/john/name 






## License

MIT

**Free Software**
