const form = document.querySelector(".input-form") // Läs in formulär
const submitBtn = document.querySelector("button[type='submit']")// Läs in submit knapp

let inputName = form.elements.name.value // Läser in det som skrivs i namn input
let inputMessage = form.elements.message.value // Läser in det som skrivs i message

const backendUrl ="https://3000-firebase-webb-1git-1756112034739.cluster-yy7ncoxb5zd4ouvntrhoc3go3k.cloudworkstations.dev/Lektion-01/Klient/index.html"

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
        
      try {
          const response = await fetch(backendUrl,{
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: inputName,
              message: inputMessage
            })
          })

          if (response.ok){
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
