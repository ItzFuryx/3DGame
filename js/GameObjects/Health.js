class Health {
    constructor(healthValue) {
        this.currentHealth = this.maxHealth = healthValue;
    }

    DeltaHealth(value) {
        this.currentHealth -= value;
        console.log("current Health = " + this.currentHealth);
        if (this.currentHealth <= 0) {
            this.currentHealth = this.maxHealth;
            player.Respawn();
            return false;
        }
        return true;
    }
}
