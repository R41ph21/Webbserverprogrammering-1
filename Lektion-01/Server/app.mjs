import express from "express"
import cors from "cors" // Tillåter fröfrågningar från andra domäner (Cross-Origin Reccourse Sharing)
import fs from "fs" // Node.js filsystem-modul för att läsa och skriver filer
import { fileURLToPath } from "url" // Hjälper oss att få sökvågen till den aktuella filen
import { dirname } from "path" // Hjälper oss att få sökvågen till den aktuella mappen
import { METHODS } from "http"

import {v4 as uuidv4} from "uuid"; //används för att skapa unik id

const __filename= fileURLToPath(import.meta.url) // Hjälper oss att få sökvägen till den aktuella filen
const __dirname = dirname(__filename) // Hjälper oss att få sökvägen till den aktuella mappen

const corsOptions = {
  origin: [
    "https://5500-firebase-webb-1git-1756112034739.cluster-yy7ncoxb5zd4ouvntrhoc3go3k.cloudworkstations.dev",
    "http://localhost:5500"
  ],
  credentials: true,              
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
}

const app = express() // Skapa Express-applikationen

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const filePath = `${__dirname}/messages.json`; // Skapa fullständign sökväg till JSON-fil
const data = fs.readFileSync(filePath, "utf-8");


const saveMessage = (messageData) =>{
  let messages=[]
  if(fs.existsSync(filePath)) { //Kontrollera om filen faktiskt finns
    messages = JSON.parse(data) // Konvertera JSON-text till JavaScript array
  }

  messages.push(messageData) // Läg till det nya meddelande-objekt sist i arrayen

  // Spara tillbaka hela arrayen till filen 
  // JSON.stringify() konvertera JS till JSON-text
  // null 2 gör JSON-filen lattläst med indentering
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2))
}

const getMessages = () => {


  try {
    if(fs.existsSync(filePath)) {
      return JSON.parse(data)
    }

    return []
  } catch (error) {
    console.log("Fel vid läsning av meddelande:", error);
    return[]
  }
}
const deleteMessage= (messageId) =>{
  try {
    //Kontroller om filen finns 
    if (!fs.existsSync(filePath)){
      return false; // Retunera false om filen inte finns 
    }

    let messages = JSON.parse(data) //Konvertera till Javascript array

    // Filterera bort meddelandet med matchande ID 
    // Filter() skapar en NY array som INTE inåller meddelandet vi vill radera 
    const filteredMessages = messages.filter(msg => msg.id !== messageId)

    if (messages.lenght === filteredMessages.length){
      return false; // inget meddelande med det ID:t hittades
    }

    //SPARA DEN UPPDATERADE ARRAYEN (UTAN DET RADERADE MEDDELANDET)
    fs.writeFileSync(filePath, JSON.stringify(filteredMessages, null, 2))
    return true 
  } catch (error) {
    console.log("Fel vid radering", error);
    return false;
  }
}

app.post("/messages", (req, res) =>{
  const {name, message} = req.body
  console.log("hejsan", name, message);

  const id = uuidv4();

  try{
  const messageData ={
    name,
    message,
    timestamp: new Date().toISOString(),id,
  }

  saveMessage(messageData)

  res.status(201).json("Saved successfully")
  }catch(error){
    console.log("Error: ", error)
    res.status(500).json("Internal server error")
  }
  
})

app.get("/messages", (req, res) => {


  try {
    const messages= getMessages()

    res.status(200).json({success: true, data: messages});
  } catch (error) {
      console-log("Fel vid hämting av meddelanden:", error)

      res.status(500).json({success: false})
  }
});

app.delete("/messages/:id", (req, res) => {
  console.log("raderara meddelande")
  const messageId = req.params.id;

  console.log({ID: messageId});
  try {
    const deleted= deleteMessage(messageId)

    if(deleted){
      res.status(200).json({success: true});
    }
    else{
      res.status(404).json({success: false})
    }
  } catch (error) {
    console.log("Error:", error)

    res.status(500).json({success: false});
  }
})

export default app