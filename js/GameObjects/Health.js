/** Class representing the Health */
class Health {
    constructor(healthValue, object) {
        this.currentHealth = this.maxHealth = this.prevHealth = healthValue;
        this.object = object;
    }

    /**
     * @function MoveHealthProgress
     * take the value from current health and call onhit
     * when current health is lower or equal to 0 call ondead
     */
    DeltaHealth(value) {
        this.prevHealth = this.currentHealth;
        this.currentHealth -= value;
        if (this.currentHealth <= 0) {
            this.currentHealth = this.maxHealth;
            this.object.OnDead();
        }
        this.object.OnHit();
    }
}