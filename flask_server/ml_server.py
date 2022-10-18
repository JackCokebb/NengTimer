from ast import Delete
import io
import json
from operator import and_
import os
from flask import Flask, request, redirect, jsonify, make_response
from flask_cors import CORS, cross_origin
import torchvision.models as models
import torchvision.transforms as transforms
import torch
from PIL import Image
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from model import NengUser, foodList, consumable_date
import config
from my_cnn import CNN, train_transforms,classes,test_transforms
from io import BytesIO
import base64



app = Flask(__name__)
CORS(app)
#model = models.densenet121()
device = "cuda" if torch.cuda.is_available() else "cpu"
model = torch.load("cnn_model.pt", map_location=device)
model.eval()          

def transform_image(infile):
    my_transforms = test_transforms
    image = Image.open(BytesIO(base64.b64decode(infile)))
    timg = my_transforms(image)
    timg = timg.to(device)
    timg.unsqueeze_(0)
    return timg

def get_prediction(input_tensor):
    outputs = model(input_tensor)
    _, predictions = torch.max(outputs, 1)
    return predictions


@app.route('/')
def index():
    return f'''
<!doctype html>
    <html>
        <body>
            <h1>Welcome</h1>
            <h2>Try POSTing to the /predict endpoint with an RGB image attachment</h2>
            <form action = "http://{config.SERVER_IP}/api/predict" method = "POST" enctype = "multipart/form-data">
                <input type = "file" name = "file" />
                <input type = "submit"/>
            </form>
            <p>
                {model.eval()}
            </p>
        </body>
    </html>
    '''


@app.route('/api/predict', methods=['POST'])
def predict_img():
    if request.method == 'POST':
        
        #file = request.form['file']
        params = request.get_json()
        
        if params is not None:
            #print(f"file: {params['file']}")
            input_tensor = transform_image(params['file']) #base64.b64decode(file)
            predict = get_prediction(input_tensor)
            predicted_class = classes[predict]
            extra_date = consumable_date[predicted_class]
            print(f"file: {predicted_class}")
            return jsonify({
                'className': classes[predict],
                'extraDate' : extra_date
                            })

@app.route('/api/user/register', methods=['POST'])
def user_register():
    
    engine = create_engine(config.DB_URL, echo=True)
    Session = sessionmaker(autocommit=False, autoflush=False,bind=engine)
    session = Session()
    
    Base = declarative_base()
    Base.metadata.create_all(bind=engine)
    
    if request.method == 'POST':
        print(request.is_json)
        params = request.get_json()
        
        new_user = NengUser(userName=params['userName'],userPassword=params['userPassword'],userEmail=params['userEmail'])
        error = ""
        try:
            session.add(new_user)
            session.commit()
            isSuccess = True
        except Exception as e:
            print(e)
            error = e
            isSuccess = False
        session.close()
        if isSuccess:
            return jsonify({
                "status": "success"
                })
        else:
            return jsonify({
                "status": "fail",
                "msg": error
                })

@app.route('/api/user/login', methods=['POST'])
def user_login():
    
    engine = create_engine(config.DB_URL, echo=True)
    Session = sessionmaker(autocommit=False, autoflush=False,bind=engine)
    session = Session()
    
    Base = declarative_base()
    Base.metadata.create_all(bind=engine)
    
    if request.method == 'POST':
        print(f'request.is_json = {request.is_json}')
        params = request.get_json()
        print(f'params = {params}')
        error = ""
        
        try:
            data = session.query(NengUser).filter(and_(NengUser.userEmail == params['userEmail'], NengUser.userPassword == params['userPassword'])).all()
            print(f'data = {data}')
            if len(data) > 0:
                isSuccess = True
            else:
                isSuccess = False
                error = "No such user"
        except Exception as e:
            print(e)
            error = e
            isSuccess = False
        session.close()    
        if isSuccess:
            return build_actual_response(jsonify({
                "status": "success",
                "data":{
                    "email":params['userEmail'],
                    "msg": "success",
                }
                }))
        else:
            return build_actual_response(jsonify({
                "status": "fail",
                "msg": error
                }))

@app.route('/api/user/list', methods=['POST'])
def user_list():
    
    engine = create_engine(config.DB_URL, echo=True)
    Session = sessionmaker(autocommit=False, autoflush=False,bind=engine)
    session = Session()
    
    Base = declarative_base()
    Base.metadata.create_all(bind=engine)
    
    if request.method == 'POST':
        print(request.is_json)
        params = request.get_json()
        error = ""
        
        try:
            data = session.query(foodList).filter(foodList.userEmail == params['userEmail']).all()
            if len(data) > 0:
                isSuccess = True
                data_list = [d.as_dict() for d in data]
                print(data_list)
            else:
                isSuccess = False
                error = "No data"
        except Exception as e:
            print(e)
            error = e
            isSuccess = False
        session.close()    
        if isSuccess:
            return build_actual_response(jsonify({
                "status": "success",
                "data": data_list
                }))
        else:
            return build_actual_response(jsonify({
                "status": "fail",
                "msg": error
                }))
            
@app.route('/api/user/list/delete', methods=['POST'])
def list_delete():
    
    engine = create_engine(config.DB_URL, echo=True)
    Session = sessionmaker(autocommit=False, autoflush=False,bind=engine)
    session = Session()
    
    
    Base = declarative_base()
    Base.metadata.create_all(bind=engine)
    
    if request.method == 'POST':
        print(request.is_json)
        params = request.get_json()
        error = ""
        
        try:
            session.query(foodList).filter_by(userEmail = params['userEmail'], id= params['id']).delete()
            session.commit()
            data = session.query(foodList).filter(foodList.userEmail == params['userEmail']).all()
            
            if len(data) > 0:
                isSuccess = True
                data_list = [d.as_dict() for d in data]
                print(data_list)
            else:
                isSuccess = False
                error = "No data"
        except Exception as e:
            print(e)
            error = e
            isSuccess = False
        session.close()    
        if isSuccess:
            return build_actual_response(jsonify({
                "status": "success",
                "data": data_list
                }))
        else:
            return build_actual_response(jsonify({
                "status": "fail",
                "msg": error
                }))
            
            
@app.route('/api/user/list/add', methods=['POST'])
def list_add():
    
    engine = create_engine(config.DB_URL, echo=True)
    Session = sessionmaker(autocommit=False, autoflush=False,bind=engine)
    session = Session()
    
    
    Base = declarative_base()
    Base.metadata.create_all(bind=engine)
    
    if request.method == 'POST':
        print(request.is_json)
        params = request.get_json()
        error = ""
        
        new_food = foodList(
            foodName=params['foodName'], 
            expiry_date=params['expiryDate'], 
            foodQuantity=params['foodQuantity'], 
            userEmail=params['userEmail']
            )
        
        try:
            session.add(new_food)
            session.commit()
            isSuccess = True
        except Exception as e:
            print(e)
            error = e
            isSuccess = False
        session.close()
        if isSuccess:
            return jsonify({
                "status": "success"
                })
        else:
            return jsonify({
                "status": "fail",
                "msg": error
                })
   

def build_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def build_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

app.run(port=5000,debug=True,host='0.0.0.0')
#211.195.63.186
# https://iambeginnerdeveloper.tistory.com/187