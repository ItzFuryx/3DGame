/** Class representing the gamepanel */
class GamePanel {

    constructor() {
        this.CreateGamePanel();
        this.AddHealth();
        this.AddXp();
        this.AddLevelUp();
        this.AddLevels();
    }

    /**
     * @function CreateGamePanel
     * Gives the game panel a style and start the background song
     */
    CreateGamePanel() {
        var GamePanel = document.getElementById("gamePanel");
        document.getElementById("musicplayer").play();

        // GamePanel.style.background = 'gray';
        GamePanel.style.height = 400;
        GamePanel.style.width = 800;
        GamePanel.style.position = 'absolute';
    }

    /**
     * @function AddHealth
     * Gives all elements for the health bar a style and images.
     */
    AddHealth() {
        var healthDiv = document.getElementById("healthBar");
        healthDiv.style.marginLeft = "140px";

        var image = document.getElementById("imageHealthBar");
        image.style.position = "absolute";
        image.src = "assets/UI-things/Healthbar.png";
        image.style.height = 128;
        image.style.width = 272;

        var showHealth = document.getElementById('healthPlayer');
        showHealth.innerText = player.health.currentHealth;
        showHealth.style.marginLeft = "125px";
        showHealth.style.marginTop = "53px";
        showHealth.style.position = "absolute";
        showHealth.style.color = "white";

        var healthBar = document.getElementById("health-progress-bar").style;
        healthBar.position = "absolute";
        healthBar.marginLeft = "52px";
        healthBar.marginTop = "65px";
        healthBar.width = "22%";
        healthBar.maxWidth = "22%";
        healthBar.backgroundColor = "black";

        var progress = document.getElementById("health-progress").style;
        progress.position = "absolute";
        progress.marginRight = "-205px";
        progress.width = "100%";
        progress.maxWidth = "100%";
        progress.height = "30px";
        progress.backgroundColor = "red";
    }

    /**
     * @function MoveHealthProgress
     * When the player health amount is changed this smoothly lerps the health from the last position to the new value
     */
    MoveHealthProgress() {
        var progressbar = document.getElementById("health-progress");
        var newWidth = (player.health.currentHealth / player.health.maxHealth) * 100;
        var id = setInterval(frame, 5);
        var start = (player.health.prevHealth / player.health.maxHealth) * 100;
        var time = 0;
        document.getElementById('healthPlayer').innerText = player.health.currentHealth;

        function frame() {
            if (time >= 1) {
                time = 0;
                clearInterval(id);
            } else {
                time += id / 100;
                progressbar.style.width = (start + (time * (newWidth - start))) + "%";
            }
        }
    }

    /**
     * @function AddXp
     * Sets the style for all elements of exp
     */
    AddXp() {
        var xpImage = document.getElementById("xpImage");
        xpImage.src = "assets/UI-things/xpbar.png";
        xpImage.style.position = "absolute";

        var healthBar = document.getElementById("xp-progress-bar").style;
        healthBar.position = "absolute";
        healthBar.marginLeft = "60px";
        healthBar.marginTop = "110px";
        healthBar.height = "64%";
        healthBar.maxHeight = "64%";
        healthBar.backgroundColor = "black";

        var progress = document.getElementById("xp-progress").style;
        progress.position = "absolute";
        progress.marginRight = "-205px";
        progress.width = "30px";
        progress.height = "0%";
        progress.maxHeight = "100%";
        progress.backgroundColor = "yellow";
    }
    /**
     * @function MoveExpProgress
     * When the player experience amount is changed this smoothly lerps the experience from the last position to the new value
     */
    MoveExpProgress() {
        var progressbar = document.getElementById("xp-progress");
        var newWidth = (player.experience.currentExperience / player.experience.maxExperience) * 100;
        var id = setInterval(frame, 20);
        var start = (player.experience.prevExperience / player.experience.maxExperience) * 100;
        var time = 0;

        function frame() {
            if (time >= 1) {
                time = 0;
                clearInterval(id);
            } else {
                time += id / 1000;
                progressbar.style.height = (start + (time * (newWidth - start))) + "%";
            }
        }
    }

    /**
     * @function MoveHealthProgress
     * Sets the style of the displayed levels.
     */
    AddLevels() {
        // ImageLevels
        var imageLevels = document.getElementById("imageLevels");
        imageLevels.src = "assets/UI-things/levels.png";
        imageLevels.style.position = "absolute";
        imageLevels.style.marginLeft = "150px";
        imageLevels.style.marginTop = "105px";

        //Level van de maze
        var showLevelWorld = document.getElementById("levelWorld");
        showLevelWorld.innerText = level;
        showLevelWorld.style.fontStyle = "bold"
        showLevelWorld.style.color = "white";
        showLevelWorld.style.position = "absolute";
        showLevelWorld.style.marginLeft = "194px";
        showLevelWorld.style.marginTop = "169px";

        //Level van de player
        var showLevelPlayer = document.getElementById("levelPlayer");
        showLevelPlayer.innerText = player.level;
        showLevelPlayer.style.position = "absolute";
        showLevelPlayer.style.fontStyle = "bold"
        showLevelPlayer.style.color = "white";
        showLevelPlayer.style.marginLeft = "294px";
        showLevelPlayer.style.marginTop = "169px";
    }
    /**
     * @function AddLevelUp
     * Sets the style for the levelup window
     */
    AddLevelUp() {
        var div = document.getElementById("levelup").style;
        div.backgroundColor = "rgba(192,192,192,0.3)";
        div.border = "3px solid black";
        div.position = "absolute";
        div.width = "30%";
        div.height = "150px";
        div.marginLeft = "40%";
        div.marginTop = "-200px";
        div.color = "none";
        var text = document.getElementById("levelup-text").style;
        text.margin = "auto";
        text.width = "50%";
        text.padding = " 5px";
        text.color = "white";
    }

    /**
 * @function LevelUp
 * When you level up show the stats you've gained and smoothly lerp out of the screen.
 */
    LevelUp() {
        this.MoveHealthProgress();
        var div = document.getElementById("levelup").style;
        document.getElementById("levelPlayer").innerText = player.level;
        var text = document.getElementById("levelup-text");
        var newPos = -400;
        var id = setInterval(frame, 25);
        var start = 300;
        var time = 0;

        text.innerText = "Level Up! \n Level : " + player.level + "\n New Health : " + player.health.maxHealth;

        function frame() {
            if (time >= 1) {
                time = 0;
                clearInterval(id);
            } else {
                time += id / 500;
                div.marginTop = (start + (time * (newPos - start)));
            }
        }
    }
}