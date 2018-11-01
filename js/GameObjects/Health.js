class Health {
    constructor(healthValue, object) {
        this.currentHealth = this.maxHealth = this.prevHealth = healthValue;
        this.object = object;
    }

    DeltaHealth(value) {
        this.prevHealth = this.currentHealth;
        this.currentHealth -= value;
        this.object.OnHit();
        console.log("current Health = " + this.currentHealth);
        if (this.currentHealth <= 0) {
            this.currentHealth = this.maxHealth;
            this.object.OnDead();
        }
    }

    IsFullHealth(){
        if(this.currentHealth == this.maxHealth){
            return true;
        }
        else{
            return false;
        }
    }
}