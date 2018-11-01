class Health {
    constructor(healthValue, object) {
        this.currentHealth = healthValue;
        this.maxHealth = healthValue;
        this.object = object;
    }

    DeltaHealth(value) {
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