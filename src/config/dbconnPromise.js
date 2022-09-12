const mysql = require("mysql2/promise");
const env=require('../config');
const db_config={
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  port: env.db.port,
};

let connection = mysql.createPool(db_config);

connection.getConnection(err=>{
    if(err){
        console.log("\n\t *** Cannot establish a connection with the database. ***");
        connection=reconnect(connection);
    }else{
        console.log("\n\t *** New connection established with the database. ***");
    }
})
reconnect=(connection)=>{
    console.log("\n New connection tentative...");
     //- Create a new one
    connection=mysql.createPool(db_config)
     //- Try to reconnect
     connection.getConnection(err=>{
         if(err){
       //- Try to connect every 2 seconds.
            setTimeout(reconnect(connection), 2000);
         }else{
            console.log("\n\t *** New connection established with the database. ***")
            return connection;
         }
     })
}

connection.on("error",err=>{
     //-
    //- The server close the connection.
    //-
    if(err.code === "PROTOCOL_CONNECTION_LOST"){    
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        return reconnect(connection);
    }

    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        return reconnect(connection);
    }

    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        return reconnect(connection);
    }

    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
    }

    else{
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        return reconnect(connection);
    }
})
module.exports = connection;