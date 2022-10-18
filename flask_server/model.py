from datetime import date, datetime
from sqlalchemy import Column, String, Integer,LargeBinary,DateTime,Date,ForeignKey
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

consumable_date={
    "beef" : 3,
    "pork" : 2,
    "fish" : 1,
    "shell_fish" : 1,
    "vegetable" : 2,
    "fruit" : 5
}

class NengUser(Base):
    __tablename__ = "member_table"
    
    #id = Column(Integer, primary_key=True)
    userName = Column(String, nullable=False)
    userPassword = Column(String, nullable= False)
    userEmail = Column(String, nullable=False, primary_key=True)
    
    def __init__(self, userName, userPassword, userEmail):
        self.userName = userName
        self.userPassword = userPassword
        self.userEmail = userEmail
        
class foodList(Base):
    __tablename__ = "foodList"
    
    id = Column(Integer, primary_key=True)
    foodName = Column(String, nullable=False)
    foodQuantity = Column(Integer)
    added_at = Column(DateTime)
    expiry_date = Column(Date)
    foodImg = Column(LargeBinary(length=(2**32)-1))
    userEmail = Column(String, ForeignKey("member_table.userEmail"), nullable=False)
    
    def __init__(self, foodName, foodQuantity, userEmail, expiry_date,added_at=datetime.now()):
        self.foodName = foodName
        self.foodQuantity = foodQuantity
        self.userEmail = userEmail
        self.expiry_date = expiry_date
        self.added_at = added_at
        
    #to serialize from foodList obj to str(dict)
    def as_dict(self):
       return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}