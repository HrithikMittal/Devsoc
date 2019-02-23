import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.svm import SVC
from sklearn.preprocessing import OneHotEncoder
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error
import warnings
import csv


warnings.filterwarnings("ignore")
data = pd.read_csv("./Training.csv")
data = data.dropna(axis=0)
x = pd.DataFrame(data = data.iloc[:, :-1])
y = data.iloc[:, -1]
# map = {i:k for i, k in zip(y.unique(), range(len(y.unique())))}
le = LabelEncoder()
label = le.fit_transform(y)
encoder = OneHotEncoder(sparse=False)
integer = label.reshape(len(label), 1)
onehot = encoder.fit_transform(integer)
# inverted = le.inverse_transform([np.argmax(onehot[0, :])])
train_x, test_x, train_y, test_y = train_test_split(x, onehot)
model = DecisionTreeRegressor()
model.fit(train_x, train_y)
predicts = model.predict(test_x)
#print(classification_report(test_y, predicts))

test_data = pd.read_csv("./newtest.csv")
custom_y = test_data.iloc[:, -1]
custom_x = test_data.iloc[:, :-1]
le2 = LabelEncoder()
label2 = le.fit_transform(custom_y)
encoder2 = OneHotEncoder(sparse=False)
integer2 = label2.reshape(len(label2), 1)
onehot2 = encoder2.fit_transform(integer2)
custom_pre = model.predict(custom_x)
#print(custom_x)
#print(custom_pre)
#print(mean_absolute_error(onehot2, custom_pre))
#print(classification_report(onehot2, custom_pre))

#making symptom array
#sym = [i for i in input("Enter the symptoms separated by space: ").split()]
#a = np.zeros((1,132))
#for i in range(len(data.columns)):
#    for j in sym:
#        if(j==data.columns[i]):
#            np.put(a,i,1)
#end

#print(custom_y)
#print(label2)
#print(integer2)
#print(onehot2)
print(custom_pre)