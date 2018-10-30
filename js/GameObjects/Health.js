class Health {
    constructor(healthValue, object) {
        this.currentHealth = this.maxHealth = healthValue;
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
}