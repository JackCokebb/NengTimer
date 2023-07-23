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
