import axios from "axios";

const form = document.querySelector(".input-form") // Läs in formulär
const submitBtn = document.querySelector("button[type='submit']")// Läs in submit knapp

let inputName = form.elements.name.value // Läser in det som skrivs i namn input
let inputMessage = form.elements.message.value // Läser in det som skrivs i message

const backendUrl ="https://5500-firebase-webb-1git-1756112034739.cluster-yy7ncoxb5zd4ouvntrhoc3go3k.cloudworkstations.dev/Lektion-01/Klient/index.html"

const checkInputs = () => {
    inputName = form.elements.name.value
    inputMessage = form.elements.message.value

    if (!inputName || !inputMessage) submitBtn.disabled = true 
    else submitBtn.disabled = false
}

form.addEventListener("input", checkInputs)

form.addEventListener("submit", async (e) =>{ // e en förkortning för event
  e.preventDefault() //Hindrar formuläret från att ladda om 

    if (!inputName || !inputMessage) return alert("Fyll i båda fälten")
      const messageData = {
          name: inputName,
          message: inputMessage,
      };  

      try {
          const response = await axios.post(
            "http://localhost:3000/messages",
            messageData
          );

          if (response.status === 201){
            alert("Meddelandet sparades!")
            form.reset()
          }else{
            alert("Ett fel uppstod!")
          }
      } catch (error) {
        console.error("Fel:", error)
        alert("Kunde inte skicka meddelandet!")
      }

})

window.addEventListener("load", async (e) => {
  try {
    const response = await axios.get("http://localhost:3000/messages");
  } catch (error) {
    
  }
})