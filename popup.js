function matchYoutubeUrl(url) {
    if (!url) return false;

    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})(?:\S+)?$/;
    
    return regex.test(url);
}


async function getCurrentTab()
{
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function getSelectedOption()
{
    return document.getElementById("option-select").value;
}

async function baixar()
{
    const baixar = document.getElementById("baixar");
    const options = document.getElementById("option-select").value;

    let tab = await getCurrentTab();
    let url = tab ? tab.url : null;

    baixar.addEventListener("click", async () =>
    {
        const isValidYoutubeUrl = matchYoutubeUrl(url);

        try
        {
          const response = await fetch('http://localhost:3000/api/v1/download', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              // Dados que você deseja enviar no corpo da requisição
              url: url,
              mediaType: options
            })
          })

          if (!response.ok)
          {
            throw new Error("Falha ao baixar o vídeo");
          }

          // Como é retornado um readblestream é necessário ler
          //e armazenar em pedaços
          
          const reader = response.body.getReader();
          const chunks = []; 
          let receivedLength = 0;

        // Leitura do stream de dados
          while (true)
          {
            const { done, value } = await reader.read();
            
            if (done) break;  
            
            chunks.push(value);  
            
            receivedLength += value.length;
            
            console.log(`Recebido ${receivedLength} bytes`);
          }


          ///stackoverflow amigo
          const newBlob = new Blob(chunks);

          const blobUrl = window.URL.createObjectURL(newBlob);

          const link = document.createElement('a');
          link.href = blobUrl;

          //em relação a extensão há um problema como saber 
          //qual a extensão
          link.setAttribute('download', options === 'audio' ? 'audio.mp3' : 'video.mp4' );
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);

          window.URL.revokeObjectURL(blobUrl);
        } 
        catch(err)
        {
          console.error('Erro:', err)
        }        
        // isValidYoutubeUrl ?
        //      alert(url) : alert("Abra uma aba no Youtube, para realizar o download");
    });
}

baixar();
