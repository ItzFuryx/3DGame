class GamePanel {

    constructor() {
        //this.createHTMLElements();
        this.createGamePanel();
        this.AddLevel();
        this.AddHealth();
        this.AddProgress();
        //this.AddMask();

        //this.AddHealthBar();

    }

    // createHTMLElements() {

    //     //var creatediv = document.createElement("div");
    //     var Panel = document.getElementsByTag("body");
    //     Panel.createelement = '<div id="gamePanel"></div>';

    // }


    createGamePanel() {
        var GamePanel = document.getElementById("gamePanel");
        // GamePanel.style.background = 'gray';
        GamePanel.style.fontSize = '20px';
        GamePanel.style.height = 400;
        GamePanel.style.width = 400;
        GamePanel.style.position = 'absolute';
    }

    AddHealth() {
        var image = document.getElementById("imageHealthBar");
        image.style.position = "absolute";
        image.src = "assets/UI-things/Healthbar.png";
        image.style.height = 128;
        image.style.width = 272;

        var showHealth = document.getElementById('healthPlayer');
        showHealth.innerText = player.health.currentHealth;
        showHealth.style.marginLeft = "125px";
        showHealth.style.marginTop = "57px";
        showHealth.style.position = "absolute";
        showHealth.style.fontSize = '40px';
    }

    AddLevel() {
        var showLevel = document.getElementById("levelWorld");
        showLevel.innerText = "Level : " + level;
        showLevel.style.fontSize = "25px";
        showLevel.style.color = "green";
    }

    AddProgress() {
        var healthBar = document.getElementById("progress-bar").style;
        healthBar.position = "absolute";
        healthBar.marginLeft = "55px";
        healthBar.marginTop = "65px";
        healthBar.width = "40%";
        healthBar.backgroundColor = "black";

        var progress = document.getElementById("progress").style;
        progress.position = "absolute";
        progress.marginRight = "-205px";
        progress.width = "100%";
        progress.height = "30px";
        progress.backgroundColor = "red";
    }

    MoveProgress() {
        var progressbar = document.getElementById("progress");
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
}