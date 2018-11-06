/** Class representing the experience */
class Experience {
    /**
     * @param {*} object 
     */
    constructor(object) {        
        this.currentExperience = this.prevExperience = 0;        
        this.maxExperience = this.baseExp = 4;
        this.object = object;

        this.addedExp = 4;
    }
    /**
     * Give the player experience and change the gamepanel.
     * @param {number} value 
     */
    DeltaExp(value) {
        this.prevExperience = this.currentExperience;
        this.currentExperience += value;
        if (this.currentExperience >= this.maxExperience) {
            this.currentExperience = 0;
            this.maxExperience = (this.addedExp * this.maxExperience) * 2 + (this.baseExp * this.maxExperience);
            this.object.LevelUp();
        }
        gamePanel.MoveExpProgress();
    }
}