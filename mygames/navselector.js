const mainContent = document.getElementById("mainContent");
const games = [["PONG", "/mygames/PONG.js"], ["SPACE INVADERS", "/mygames/SPACE_INVADERS.js"], ["PACMAN", "/mygames/PACMAN.js"], ["GAME 4"]];
mainContent.innerHTML = `
<my-header id="gameSelector" highlightedindex="${sessionStorage.getItem("loadedGameIndex") || 0}" title="false">
Portfolio My Games
${games.map(game => game[0] + " #" + game[1]).join("\n")}
</my-header>    
` + mainContent.innerHTML;    
function main() {
    const gameSelector = document.getElementById("gameSelector");
    const navButtons = gameSelector.navbuttons;
    navButtons.forEach((value, index) => {
        value.btn.onclick = function() {
            loadGameAndReloadPage(value.data.href?.substring(1), index);
        };
    });
}
document.addEventListener('load', main);