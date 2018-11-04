class Experience {
    constructor(object) {        
        this.currentExperience = this.prevExperience = 0;        
        this.maxExperience = this.baseExp = 4;
        this.object = object;

        this.addedExp = 4;
    }

    DeltaExp(value) {
        this.prevExperience = this.currentExperience;
        this.currentExperience += value;
        console.log("current Experience = " + this.currentExperience);
        if (this.currentExperience >= this.maxExperience) {
            this.currentExperience = 0;
            this.maxExperience = (this.addedExp * this.maxExperience) * 2 + (this.baseExp * this.maxExperience);
            this.object.LevelUp();
        }
        gamePanel.MoveExpProgress();
    }
}