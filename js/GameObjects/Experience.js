class Experience {
    constructor(object) {
        this.currentExperience = 0;
        this.maxExperience = 80;
        this.object = object;

        this.baseExp = 80;
        this.addedExp = 25;
    }

    DeltaExp(value) {
        this.currentExperience += value;
        console.log("current Experience = " + this.currentExperience);
        if (this.currentExperience >= this.maxExperience) {
            this.currentExperience = 0;
            this.maxExperience = (_addedExp * BaseValue) * 2 + (_baseExp * BaseValue);
            this.object.LevelUp();
        }
    }
}