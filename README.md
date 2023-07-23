# NengTimer

## Features
- User can store food-related data in the app
- Food-related data include
    - name of the food
    - expiry date
    - quantity  
    <img src="/assets/foodlist2.jpeg" width=" 200px"   title="foodlistPic" alt="foodlistPic"></img><br/>  
- This app provides notifications when the food's expiry date is imminent  
<img src="/assets/noti_pic.PNG" width=" 200px"   title="food notification" alt="food notification"></img><br/>  
- User can add food-related data by writing data manually or taking picture of the food.  
<img src="/assets/newFoodPage.jpeg" width=" 200px"   title="foodaddingpage" alt="foodaddingpage"></img><br/>  
- When the user add their foods by taking a picture of it, usually when there is no expiry date printed on their food, they can be provided an appropriate expiration date.
    - Trained image classification model will classify the type of the food and based on that data, this app provide an appropriate expiry date to user.  
    <img src="/assets/capturedPic.jpeg" width=" 200px"   title="capturedPic" alt="capturedPic"></img>
    <img src="/assets/predicted.jpeg" width=" 200px"   title="predicted" alt="predicted"></img><br/>
    - Food types that this app can classify includes
        - beef
        - fish
        - fruit
        - port
        - shell fish
        - vegetable
- User can add expiry date by scanning the expiry date printed on their food products  
    <img src="/assets/ocrTaken.jpeg" width=" 200px"  title="ocrTaken" alt="ocrTaken"></img>
    <img src="/assets/ocrPredicted.jpeg" width=" 200px"  title="ocrPredicted" alt="ocrPredicted"></img><br/>


- User's data such as a foods list will be stored in the database

## Contribution
- developed the app using React Native framework and testing with Expo go
- developed the server using flask
- trained image classification model based on CNN using pytorch
- crawled and refined food images  

## System Architecture
<img src="/assets/final_system_arch.png" width=" 200px"   title="final_system_arch" alt="final_system_arch"></img>

## frameworks & tools 
- React Native
- Flask
- Expo Go
- Google cloud vision API (OCR)
- MySQL
- Pytorch

## refs
- 하동군 보건소 식품 보관 및 저장"
https://www.hadong.go.kr/01868/01959/02051.web
- Youngmin Baek, Bado Lee, Dongyoon Han, Sangdoo Yun, Hwalsuk Lee,
"Character Region Awareness for Text Detection", Wed, 3 Apr 2019
- Yuning Du, Chenxia Li, Ruoyu Guo, Xiaoting Yin, Weiwei Liu, Jun Zhou, Yifan
Bai, Zilin Yu, Yehua Yang, Qingqing Dang, Haoshuang Wang, "PP-OCR: A
Practical Ultra Lightweight OCR System", Thu, 15 Oct 2020
- Minghui Liao, Baoguang Shi, Xiang Bai, Xinggang Wang, Wenyu Liu,
"TextBoxes: A Fast Text Detector with a Single Deep Neural Network", Mon, 21
Nov 2016
- Alex Krizhevsky, Ilya Sutskever, Geoffery E. Hinton, "ImageNet Classification 
with Deep Convolutional Neural Networks", June 2017
- F. Wang et al., "Residual Attention Network for Image Classification",
Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition
(CVPR), 2017, pp. 3156-3164.
- Arkabandhu Chowdhury, Mingchao Jiang, Swarat Chaudhuri, Chris Jermaine.
"Few-shot Image Classification: Just Use a Library of Pre-trained Feature
Extractors and a Simple Classifier" , Fri, 20 Aug 2021
