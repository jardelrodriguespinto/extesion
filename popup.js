async function getCurrentTab()
{
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function baixar()
{
    const baixar = document.getElementById("baixar");

    let tab = await getCurrentTab();
    let url = tab ? tab.url : null;

    baixar.addEventListener("click", () => {
        alert(url);
    });
}



baixar();
