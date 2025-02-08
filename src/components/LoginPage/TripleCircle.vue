<template>
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
      <span class="title">LAI YIH <span class="esg">ESG</span> Dashboard</span>
      <div class="image-container">
        <!-- 左側黑白小圓圖 -->
        <div class="small-circle grayscale close-to-right">
          <img
            src="https://img.freepik.com/premium-photo/environmental-pollution-hazardous-harmful-waste-toxic-fumes-soil-air-pollution-global-problem-crisis_771426-36383.jpg?w=360"
            alt="Left Image" />
        </div>
  
        <!-- 中間大圓圖 -->
        <div class="big-circle">
          <img
            src="https://forbesasiacustom.com/wp-content/uploads/2023/05/AdobeStock_512358628_ESG-scaled-e1684460712704.jpeg"
            alt="Center Image" />
        </div>
  
        <!-- 右側小圓圖 -->
        <div class="small-circle grayscale close-to-left">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWptvNgAfusF7f_ze5Q_ghZ7r321NbO3hybg&s"
            alt="Right Image" />
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* 主要佈局 */
  .esg {
    color: rgb(36, 241, 36);
  }
  
  .title {
    font-weight: 700;
    font-size: 2.5rem;
    text-transform: uppercase;
    text-align: center;
    color: white; /* 文字顏色 */
    text-shadow:
      -1px -1px 0 gray,
      1px -1px 0 gray,
      -1px 1px 0 gray,
      1px 1px 0 gray;
    position: absolute;
    top: 10%;
  }
  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  /* 圓形圖片樣式 */
  .big-circle,
  .small-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    border: 4px solid rgba(255, 255, 255, 0.5); /* 添加白色邊框 */
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2),
      rgba(0, 0, 0, 0.2)
    ); /* 添加漸變背景 */
  }
  
  /* 中間大圓 */
  .big-circle {
    width: 400px; /* 原本 300px → 變大到 400px */
    height: 400px;
    z-index: 10;
    box-shadow:
      0px 10px 20px rgba(0, 0, 0, 0.3),
      /* 外陰影 */ inset 0px -5px 10px rgba(255, 255, 255, 0.3); /* 內陰影 */
  }
  
  /* 左右小圓 */
  .small-circle {
    width: 220px; /* 原本 150px → 變大到 220px */
    height: 220px;
    box-shadow:
      0px 5px 15px rgba(0, 0, 0, 0.3),
      /* 外陰影 */ inset 0px -3px 8px rgba(255, 255, 255, 0.3); /* 內陰影 */
  }
  
  /* 左右圓靠近中間 */
  .close-to-left {
    margin-left: -60px; /* 原本 -40px → 變 -60px */
  }
  .close-to-right {
    margin-right: -60px; /* 原本 -40px → 變 -60px */
  }
  
  /* 黑白濾鏡 */
  .grayscale img {
    filter: grayscale(100%);
  }
  
  /* 讓圖片填滿圓形 */
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease; /* 添加過渡效果 */
  }
  
  /* 鼠標懸停時放大圖片 */
  .big-circle:hover img,
  .small-circle:hover img {
    transform: scale(1.3); /* 放大圖片 */
  }
  </style>
  