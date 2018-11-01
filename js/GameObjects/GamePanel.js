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
        GamePanel.style.background = 'yellow';
        GamePanel.style.fontSize = '20px';
        GamePanel.style.height = 400;
        GamePanel.style.width = 400;
        GamePanel.style.position = 'absolute';
        //GamePanel.style.zIndex = 100;
        // var levelText = document.getElementById("levelWorld");
        // levelText.innerText = "Lol het werkt";
    }

    AddHealth() {

        // var createImage = document.createElement("img");
        // createImage.setAttribute("id", "imagehealthBar");
        var image = document.getElementById("imageHealthBar");
        image.src = "http://127.0.0.1:8887/assets/UI-things/Healthbar.png";
        //image.setAttribute("z-index", "100");
        image.style.height = 200;
        image.style.width = 200;

        //var progress = document.getElementById("Progress-bar")

        // image.style.maskImage = "http://127.0.0.1:8887/assets/UI-things/Healthbarmask.png"
        // image.style.im = "red";
        //     //image.style.zIndex = 100;
        //     //healthBar.style.



        var showHealth = document.getElementById('healthPlayer');
        showHealth.innerText = player.health.currentHealth;
        showHealth.style.fontSize = '50px';
    }

    AddLevel() {
        var showLevel = document.getElementById("levelWorld");
        showLevel.innerText = level;
        showLevel.style.fontSize = "25px";
        showLevel.style.color = "green";

    }

    // AddHealthBar() {


    // }

    AddProgress() {
        var healthBar = document.getElementById("progress-bar");
        healthBar.style.width = "100%";
        healthBar.style.backgroundColor = "black";

        var progress = document.getElementById("progress");
        progress.style.width = (player.health.currentHealth / player.health.maxHealth) * 100 + "%";
        progress.style.height = "30px";
        progress.style.backgroundColor = "red";

    }

    // AddMask() {
    //     var mask = document.getElementById("mask");
    //     mask.style.width = "200px";
    //     mask.style.height = "200px";
    //     //mask.style.backgroundColor = "red";
    //     mask.style.maskImage = "http://127.0.0.1:8887/assets/UI-things/Healthbarmask.png";
    //     mask.style.maskImage.setAttribute("size", "center");
    //     //mask.style.setAttribute("mask-image", "url:http://127.0.0.1:8887/assets/UI-things/Healthbarmask.png");
    //     //mask.style.maskImage = ("http://127.0.0.1:8887/assets/UI-things/Healthbarmask.png");
    //     //mask.style.setAttribute("-webkit-mask-image", "url:http://127.0.0.1:8887/assets/UI-things/Healthbarmask.png")

    // }

    MoveProgress() {
        var progressbar = document.getElementById("progress");
        var newWidth = (player.health.currentHealth / player.health.maxHealth) * 100;
        var id = setInterval(frame, 10);
        var time = 0;

        function frame() {
            time += 0.1;
            var start = progressbar.style.width - "%";
            progressbar.style.width = (start + time * (newWidth - start)) + "%";
            console.log(progressbar.style.width + "id " + id);


        }

    }

}

// function UpdatePanel() {

// }