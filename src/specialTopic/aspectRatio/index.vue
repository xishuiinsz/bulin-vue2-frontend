<template>
  <div class="aspect-ratio-container">
    <h4>使用aspectRatio保持图片宽度比</h4>
    <div class="content-wrap">
      <div class="left-wrap item-wrap">
        <img src="@/assets/images/135458S3K.jpg" alt="" class="src" />
      </div>
      <div class="right-wrap item-wrap">
        <img src="@/assets/icons/商标.svg" alt="" class="src" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.aspect-ratio-container {
  width: 100%;
  height: 100%;
  min-height: inherit;
  padding: 24px !important;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .content-wrap {
    flex: 1;
    display: flex;

    .item-wrap {
      width: 50%;
    }

    .left-wrap {
      background-color: red;

      img {
        width: 100%;
        aspect-ratio: 1240/797;
      }
    }

    .right-wrap {
      background-color: green;
    }
  }
}
</style>
