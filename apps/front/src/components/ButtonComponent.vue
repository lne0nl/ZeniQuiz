<template>
  <button>
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  font-size: 30px;
  font-weight: 700;
  background: linear-gradient(51.05deg, #ee2238 -57.1%, #bf1d67 156.72%);
  border: none;
  border-radius: 10px;

  &:active {
    background: linear-gradient(51.05deg, #941522 -57.1%, #6e113b 156.72%);
    transform: scale(0.99);
  }
}
</style>
