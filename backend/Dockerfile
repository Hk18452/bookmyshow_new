#install dependencies
FROM python:3.10-slim   
#set working directory
WORKDIR /app 
#copy requirements file
copy requirements.txt . 
#install dependencies requirements
RUN pip install --no-cache-dir -r requirements.txt 
#copy all project files to container
copy . . 
#seed database with initial data
RUN python seed.py 
#expose port for backend
Expose 8000 

#start backend server using uvicorn interface and port 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0","--port","8000"] 

