<template>
    <div class="usage-card-energy">
        <h3 class="title-energy">
          <img src="@i/energy.png" alt="water" class="icon" />Energy Usage
          <span class="percent red">2% ↑</span>
        </h3>
        <div class="usage-content">
          <div class="usage-year">
            <p>Jan - Dec 2020</p>
            <div class="circle blue">10,200</div>
          </div>
          <div class="usage-year">
            <p>Jan - Dec 2021</p>
            <div class="circle green">10,404</div>
          </div>
        </div>
      </div>
</template>

<style scoped>
.title-energy {
  margin-top: -0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.usage-card-energy {
  flex: 1;
  max-width: 600px;
  background: rgba(173, 216, 230, 0.6);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
.usage-card-energy {
  background: rgba(255, 204, 128, 0.6);
}

.usage-card-energy .circle {
  background: rgba(255, 183, 77, 0.8);
}
.usage-content {
  display: flex;
  justify-content: center;
  gap: 20px;
}.usage-year {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}.percent {
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
}.red {
  color: red;
}

.icon {
  width: 30px;
  margin-right: 10px;
}
</style>