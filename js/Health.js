THREE.Health = function (healthValue) {
    var _this = this;
    this.enabled = true;
    this.currentHealth = this.maxHealth = healthValue;

    this.DeltaHealth = function (value) {
        currentHealth -= value;
        console.log("health = " + currentHealth);
        if (currentHealth <= 0) {
            currentHealth = maxHealth;
            return false;
        }
        return true;
    }
}