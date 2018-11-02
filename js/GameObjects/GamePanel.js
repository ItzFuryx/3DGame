class GamePanel {

    constructor() {
        //this.createHTMLElements();
        this.createGamePanel();
        this.AddLevel();
        this.AddHealth();
        this.AddXp();
    }



    createGamePanel() {
        var GamePanel = document.getElementById("gamePanel");
        // GamePanel.style.background = 'gray';
        GamePanel.style.fontSize = '20px';
        GamePanel.style.height = 400;
        GamePanel.style.width = 800;
        GamePanel.style.position = 'absolute';
    }

    AddHealth() {

        var healthDiv = document.getElementById("healthBar");
        healthDiv.style.marginLeft = "140px";

        var image = document.getElementById("imageHealthBar");
        image.style.position = "absolute";
        image.src = "assets/UI-things/Healthbar.png";
        image.style.height = 128;
        image.style.width = 272;
        //image.style.zIndex = 100;

        var showHealth = document.getElementById('healthPlayer');
        showHealth.innerText = player.health.currentHealth;
        showHealth.style.marginLeft = "125px";
        showHealth.style.marginTop = "57px";
        showHealth.style.position = "absolute";
        showHealth.style.fontSize = '40px';
        showHealth.style.color = "white";
        //showHealth.style.zIndex = 99;

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

    AddLevel() {
        var showLevel = document.getElementById("levelWorld");
        showLevel.innerText = "Level : " + level;
        showLevel.style.fontSize = "25px";
        showLevel.style.color = "green";
        // showLevel.style.zIndex = 100;
    }

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



    AddXp() {
        var xpImage = document.getElementById("xpImage");
        xpImage.src = "assets/UI-things/xpbar.png";
        xpImage.style.position = "absolute";

        var healthBar = document.getElementById("xp-progress-bar").style;
        healthBar.position = "absolute";
        healthBar.marginLeft = "60px";
        healthBar.marginTop = "110px";
        healthBar.height = "64%";
        healthBar.maxHeight= "64%";
        healthBar.backgroundColor = "black";

        var progress = document.getElementById("xp-progress").style;
        progress.position = "absolute";
        progress.marginRight = "-205px";
        progress.width = "30px";
        progress.height = "0%";
        progress.maxHeight= "100%";
        progress.backgroundColor = "yellow";


    }
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
            console.log(time);
        }
    }


}