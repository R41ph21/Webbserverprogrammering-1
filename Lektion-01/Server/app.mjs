import express from "express"
import cors from "cors" // Tillåter fröfrågningar från andra domäner (Cross-Origin Reccourse Sharing)
import fs from "fs" // Node.js filsystem-modul för att läsa och skriver filer
import { fileURLToPath } from "url" // Hjälper oss att få sökvågen till den aktuella filen
import { dirname } from "path" // Hjälper oss att få sökvågen till den aktuella mappen
import { METHODS } from "http"

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

const saveMessage = (messageData) =>{
  const filePath = `${__dirname}/messages.json` // Skapa fullständign sökväg till JSON-fil

  let messages = []
  if (fs.existsSync(filePath)) { //Kontrollera om filen faktiskt finns
    const data = fs.readFileSync(filePath, "utf-8") // Läs fil som text
    messages = JSON.parse(data) // Konvertera JSON-text till JavaScript array
  }

  messages.push(messageData) // Läg till det nya meddelande-objekt sist i arrayen

  // Spara tillbaka hela arrayen till filen 
  // JSON.stringify() konvertera JS till JSON-text
  // null 2 gör JSON-filen lattläst med indentering
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2))
}

app.post("/messages", (req, res) =>{
  const {name, message} = req.body
  console.log("hejsan", name, message);

  try{
  const messageData ={
    name,
    message,
    timestamp: new Date().toISOString()
  }

  saveMessage(messageData)

  res.status(201).json("Saved successfully")
  }catch(error){
    console.log("Error: ", error)
    res.status(500).json("Internal server error")
  }
  
})

export default app