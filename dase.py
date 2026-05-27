'''from fastapi import FastAPI, HTTPException
app =FastAPI()
@app.get("/user/{user_id}")
def get_user(user_id:int):
    try:
        users={
            1:"Arun",
            2:"Bharath"
        }
        if user_id not in users:
            raise HTTPException(status_code=404,detail="user not found")
        return{
            "user_id": user_id,
            "name":users[user_id]
        }
    except Exception as e:
        return{
            "error":str(e)
        }   '''
# expmple of execpt handing in python
'''try:
    a=10
    b=0
    result=a/b
    print("Result:",result)
except:
    print("An error occurred during division.")   '''

import bcrypt 
password="mysecretpassword".encode('utf-8')
hashed=bcrypt.hashpw(password,bcrypt.gensalt())
print(hashed)        

#import hashlib
#print(hashlib.sha256(b"hello"),hexdigest())



num=input("enter the strings: ")
i=num
print(i)
print("value of i: ",{i})